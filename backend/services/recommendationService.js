const { generateFoodExplanations } = require('./aiService');

/**
 * Multi-Factor Recommendation & Ranking Engine with Semantic Relevance Gating
 */
async function rankCandidates(candidates, restaurantsMap, queryIntent, userProfile) {
  const scoredItems = [];
  const rawQuery = (queryIntent.raw_query || '').toLowerCase();
  const queryFoodPrefs = (queryIntent.food_preferences || []).map(k => k.toLowerCase());
  const queryFlavors = (queryIntent.flavors || []).map(f => f.toLowerCase());
  
  const isSweetQuery = queryFlavors.includes('sweet') || queryFoodPrefs.includes('dessert') || rawQuery.includes('sweet') || rawQuery.includes('dessert') || rawQuery.includes('waffle') || rawQuery.includes('cake') || rawQuery.includes('mithai');
  const isJuiceQuery = queryFoodPrefs.includes('juice') || queryFoodPrefs.includes('beverage') || rawQuery.includes('juice') || rawQuery.includes('smoothie') || rawQuery.includes('shake') || rawQuery.includes('drink') || rawQuery.includes('cooler');
  const isNoodleQuery = queryFoodPrefs.includes('noodles') || queryFoodPrefs.includes('dimsums') || rawQuery.includes('noodle') || rawQuery.includes('hakka') || rawQuery.includes('dimsum') || rawQuery.includes('momo');

  for (const item of candidates) {
    const restaurant = restaurantsMap.get(item.restaurant_id) || {
      id: item.restaurant_id,
      name: item.restaurant_name,
      rating: 4.5,
      votes: 500,
      delivery_time_min: 25,
      location: { area: 'Bangalore', address: '' },
      platforms: {}
    };

    const distanceKm = restaurant.distance_km || 3.5;
    const nameDesc = `${item.name} ${item.description} ${item.category} ${item.cuisine}`.toLowerCase();

    // 1. Semantic & Keyword Preference Match Score (0 - 100)
    let preferenceScore = 30; // baseline

    // Specific food keyword match (e.g. "juice", "waffle", "lava cake", "biryani", "noodles", "dimsums", "chaat", "dosa")
    if (queryFoodPrefs.length > 0) {
      let matchedCount = 0;
      for (const pref of queryFoodPrefs) {
        if (pref === 'dessert') {
          if (item.category.toLowerCase().includes('dessert') || item.cuisine.toLowerCase().includes('dessert')) {
            matchedCount++;
            preferenceScore += 50;
          }
        } else if (pref === 'juice' || pref === 'beverage') {
          if (item.category.toLowerCase().includes('juice') || item.category.toLowerCase().includes('beverage') || item.cuisine.toLowerCase().includes('beverages') || item.category.toLowerCase().includes('shake') || nameDesc.includes('juice') || nameDesc.includes('shake') || nameDesc.includes('smoothie')) {
            matchedCount++;
            preferenceScore += 60;
          }
        } else if (nameDesc.includes(pref) || item.category.toLowerCase().includes(pref)) {
          matchedCount++;
          preferenceScore += 50;
        }
      }
      if (matchedCount === 0) {
        preferenceScore -= 35;
      }
    }

    // Exact word matches in dish name
    const words = rawQuery.split(/\s+/).filter(w => w.length > 3 && !['want', 'food', 'under', 'give', 'craving', 'some', 'with', 'delicious', 'fresh'].includes(w));
    for (const w of words) {
      if (item.name.toLowerCase().includes(w)) {
        preferenceScore += 30;
      } else if (item.category.toLowerCase().includes(w)) {
        preferenceScore += 20;
      }
    }

    // Strict sweet / dessert matching
    if (isSweetQuery) {
      const isActualDessert = item.category.toLowerCase().includes('dessert') || item.cuisine.toLowerCase().includes('dessert');
      if (isActualDessert) {
        preferenceScore += 40;
      } else {
        preferenceScore -= 60; // Heavily penalize non-dessert items
      }
    }

    // Strict fresh juice / beverage matching
    if (isJuiceQuery) {
      const isActualBeverage = item.category.toLowerCase().includes('juice') || item.category.toLowerCase().includes('beverage') || item.cuisine.toLowerCase().includes('beverages') || item.category.toLowerCase().includes('shake') || nameDesc.includes('juice') || nameDesc.includes('shake') || nameDesc.includes('cooler');
      if (isActualBeverage) {
        preferenceScore += 50;
      } else {
        preferenceScore -= 60; // Heavily penalize non-beverage items
      }
    }

    // Strict noodles / dimsums matching
    if (isNoodleQuery) {
      const isActualAsian = item.cuisine.toLowerCase().includes('asian') || item.category.toLowerCase().includes('noodle') || item.category.toLowerCase().includes('dimsum');
      if (isActualAsian) {
        preferenceScore += 40;
      } else {
        preferenceScore -= 50;
      }
    }

    // Flavor matches
    if (queryFlavors.length > 0) {
      const matchedFlavors = item.flavor_tags?.filter(f => queryFlavors.includes(f.toLowerCase())) || [];
      if (matchedFlavors.length > 0) {
        preferenceScore += (matchedFlavors.length / queryFlavors.length) * 15;
      }
    }

    // Health preference match
    if (queryIntent.health_preference && item.health_tags?.includes(queryIntent.health_preference)) {
      preferenceScore += 15;
    }

    // Cuisine match
    if (queryIntent.cuisine && (item.cuisine.toLowerCase() === queryIntent.cuisine.toLowerCase() || nameDesc.includes(queryIntent.cuisine.toLowerCase()))) {
      preferenceScore += 20;
    }

    preferenceScore = Math.min(100, Math.max(5, preferenceScore));

    // 2. Price Score (0 - 100)
    let priceScore = 70;
    const maxBudget = queryIntent.budget?.max || 400;
    if (item.price <= maxBudget) {
      const savingsRatio = (maxBudget - item.price) / maxBudget;
      priceScore = 75 + Math.min(25, savingsRatio * 35);
    } else {
      const overRatio = (item.price - maxBudget) / maxBudget;
      priceScore = Math.max(15, 65 - overRatio * 80);
    }

    // 3. Rating Score (0 - 100)
    const combinedRating = (item.rating * 0.6) + (restaurant.rating * 0.4);
    const ratingScore = Math.min(100, Math.max(10, (combinedRating / 5.0) * 100));

    // 4. Distance Score (0 - 100)
    const distanceScore = Math.max(30, Math.min(100, 100 - (distanceKm * 3.5)));

    // 5. Personalization Affinity Score (0 - 100)
    let personalizationScore = 50;
    if (userProfile) {
      if (userProfile.history?.liked_items?.includes(item.id)) {
        personalizationScore += 25;
      }
      if (userProfile.preferences?.favorite_cuisines?.includes(item.cuisine)) {
        personalizationScore += 15;
      }
      if (userProfile.preferences?.flavor_affinities) {
        for (const f of item.flavor_tags || []) {
          const affinity = userProfile.preferences.flavor_affinities[f] || 0.5;
          personalizationScore += (affinity - 0.5) * 15;
        }
      }
    }
    personalizationScore = Math.min(100, Math.max(10, personalizationScore));

    // 6. Delivery Time Score (0 - 100)
    const estDeliveryTime = restaurant.delivery_time_min + Math.round(distanceKm * 1.5);
    const deliveryScore = Math.max(20, Math.min(100, 100 - (estDeliveryTime * 1.1)));

    // Final Score: 45% Preference Match
    const finalScore = Math.round(
      (preferenceScore * 0.45) +
      (priceScore * 0.18) +
      (ratingScore * 0.15) +
      (distanceScore * 0.08) +
      (personalizationScore * 0.08) +
      (deliveryScore * 0.06)
    );

    const whyRecommended = await generateFoodExplanations(item, queryIntent, userProfile);

    scoredItems.push({
      food_item: item,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        area: restaurant.location?.area || 'Bangalore',
        address: restaurant.location?.address || '',
        rating: restaurant.rating,
        votes: restaurant.votes,
        image_url: restaurant.image_url,
        distance_km: distanceKm,
        delivery_time_min: estDeliveryTime,
        platforms: restaurant.platforms
      },
      match_score: finalScore,
      preference_score: preferenceScore,
      score_breakdown: {
        preference_match: Math.round(preferenceScore),
        price_suitability: Math.round(priceScore),
        rating_quality: Math.round(ratingScore),
        distance_proximity: Math.round(distanceScore),
        personalization_fit: Math.round(personalizationScore),
        delivery_speed: Math.round(deliveryScore)
      },
      why_recommended: whyRecommended
    });
  }

  // Sort descending by finalScore
  scoredItems.sort((a, b) => b.match_score - a.match_score);

  // Strict relevance gating: If specific food categories requested, filter out irrelevant items
  const isStrictQuery = queryFoodPrefs.length > 0 || isSweetQuery || isJuiceQuery || isNoodleQuery;
  if (isStrictQuery) {
    const relevantItems = scoredItems.filter(item => item.preference_score >= 50);
    // If matching items found, return them. If none found, return empty array (clean empty state instead of random Dosa)
    return relevantItems;
  }

  // Zero-hallucination guard: If user searched for a specific dish/keyword that has 0 matches in DB,
  // return empty array instead of displaying an unrelated dish.
  const highestPrefScore = scoredItems.length > 0 ? Math.max(...scoredItems.map(s => s.preference_score)) : 0;
  if (highestPrefScore < 45 && rawQuery.trim().length > 3) {
    const isGenericQuery = ['food', 'hungry', 'dinner', 'lunch', 'breakfast', 'snack', 'something to eat', 'good food'].some(g => rawQuery.includes(g));
    if (!isGenericQuery) {
      return [];
    }
  }

  return scoredItems;
}

/**
 * High-level orchestration for recommending food items
 */
async function generateRecommendations(candidates, restaurantsMap, queryIntent, userProfile) {
  const rankedItems = await rankCandidates(candidates, restaurantsMap, queryIntent, userProfile);

  if (rankedItems.length === 0) {
    return {
      hero_recommendation: null,
      other_recommendations: []
    };
  }

  const hero = rankedItems[0];
  const others = rankedItems.slice(1, 7);

  return {
    hero_recommendation: hero,
    other_recommendations: others
  };
}

module.exports = {
  rankCandidates,
  generateRecommendations
};
