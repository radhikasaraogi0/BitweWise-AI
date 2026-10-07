const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

/**
 * Calculates Haversine distance between two coordinates in kilometers
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Spatial & Filtered Candidate Retrieval
 */
async function retrieveCandidates(queryIntent, userLocation, userProfile = null) {
  const userLat = userLocation?.lat || 12.9716; // default Bangalore center
  const userLng = userLocation?.lng || 77.5946;
  const maxDistanceKm = userProfile?.preferences?.max_distance_km || 15;

  // 1. Fetch all active restaurants and calculate real distance
  const allRestaurants = await Restaurant.find({ is_open: true }).lean();
  
  const restaurantDistanceMap = new Map();
  const nearbyRestaurantIds = [];

  for (const rest of allRestaurants) {
    const dist = calculateHaversineDistance(userLat, userLng, rest.location.lat, rest.location.lng);
    restaurantDistanceMap.set(rest.id, {
      ...rest,
      distance_km: dist
    });
    if (dist <= maxDistanceKm) {
      nearbyRestaurantIds.push(rest.id);
    }
  }

  // If strict radius yielded few, broaden to all available restaurants in city
  const targetRestaurantIds = nearbyRestaurantIds.length >= 3 
    ? nearbyRestaurantIds 
    : allRestaurants.map(r => r.id);

  // 2. Build Mongo filter query for Food Items
  const foodFilter = {
    restaurant_id: { $in: targetRestaurantIds },
    is_available: true
  };

  // Hard filter: Dietary restrictions
  const effectiveDiet = queryIntent.diet || (userProfile?.preferences?.dietary_restriction !== 'all' ? userProfile?.preferences?.dietary_restriction : null);
  if (effectiveDiet === 'veg') {
    foodFilter.dietary = { $in: ['veg', 'vegan'] };
  } else if (effectiveDiet === 'vegan') {
    foodFilter.dietary = 'vegan';
  } else if (effectiveDiet === 'non_veg' && queryIntent.diet === 'non_veg') {
    foodFilter.dietary = 'non_veg';
  }

  // Hard filter: Budget ceiling with tolerance
  if (queryIntent.budget?.max) {
    foodFilter.price = { $lte: Math.round(queryIntent.budget.max * 1.25) };
  }

  // Fetch candidate food items
  let candidateFoodItems = await FoodItem.find(foodFilter).lean();

  // If filter was too restrictive (e.g. no items within tight budget), fallback to all items matching dietary
  if (candidateFoodItems.length === 0) {
    const relaxedFilter = { is_available: true };
    if (effectiveDiet === 'veg') relaxedFilter.dietary = { $in: ['veg', 'vegan'] };
    candidateFoodItems = await FoodItem.find(relaxedFilter).lean();
  }

  return {
    candidates: candidateFoodItems,
    restaurantsMap: restaurantDistanceMap,
    metrics: {
      total_restaurants_in_db: allRestaurants.length,
      nearby_restaurants_found: targetRestaurantIds.length,
      candidates_retrieved: candidateFoodItems.length,
      user_coords: { lat: userLat, lng: userLng },
      search_radius_km: maxDistanceKm
    }
  };
}

module.exports = {
  calculateHaversineDistance,
  retrieveCandidates
};
