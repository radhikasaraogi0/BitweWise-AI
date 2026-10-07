const User = require('../models/User');
const Interaction = require('../models/Interaction');
const FoodItem = require('../models/FoodItem');

/**
 * Fetch or initialize a user profile by ID
 */
async function getUserProfile(userId) {
  let user = await User.findOne({ id: userId });
  if (!user) {
    user = await User.findOne({ id: 'user_new' }) || await User.findOne();
  }
  return user;
}

/**
 * Record user feedback interaction and update user learned preferences in MongoDB
 */
async function recordInteraction(userId, eventData) {
  const { event_type, food_item_id, restaurant_id, platform, query_context } = eventData;

  // 1. Save interaction event log
  const interaction = new Interaction({
    user_id: userId,
    event_type,
    food_item_id,
    restaurant_id,
    platform: platform || null,
    query_context: query_context || ''
  });
  await interaction.save();

  // 2. Fetch food item details for learning
  const foodItem = await FoodItem.findOne({ id: food_item_id });
  const user = await User.findOne({ id: userId });

  if (user && foodItem) {
    // Learning feedback loop
    if (event_type === 'food_liked') {
      if (!user.history.liked_items.includes(food_item_id)) {
        user.history.liked_items.push(food_item_id);
      }
      user.history.disliked_items = user.history.disliked_items.filter(id => id !== food_item_id);

      // Boost cuisine affinity
      if (!user.preferences.favorite_cuisines.includes(foodItem.cuisine)) {
        user.preferences.favorite_cuisines.push(foodItem.cuisine);
      }

      // Boost flavor affinities
      for (const flavor of foodItem.flavor_tags || []) {
        if (user.preferences.flavor_affinities[flavor] !== undefined) {
          user.preferences.flavor_affinities[flavor] = Math.min(1.0, user.preferences.flavor_affinities[flavor] + 0.1);
        }
      }
    } else if (event_type === 'food_disliked') {
      if (!user.history.disliked_items.includes(food_item_id)) {
        user.history.disliked_items.push(food_item_id);
      }
      user.history.liked_items = user.history.liked_items.filter(id => id !== food_item_id);

      // Decrease flavor affinities
      for (const flavor of foodItem.flavor_tags || []) {
        if (user.preferences.flavor_affinities[flavor] !== undefined) {
          user.preferences.flavor_affinities[flavor] = Math.max(0.1, user.preferences.flavor_affinities[flavor] - 0.1);
        }
      }
    } else if (event_type === 'food_saved') {
      if (!user.history.saved_items.includes(food_item_id)) {
        user.history.saved_items.push(food_item_id);
      }
    } else if (event_type === 'food_unsaved') {
      user.history.saved_items = user.history.saved_items.filter(id => id !== food_item_id);
    } else if (event_type === 'order_clicked') {
      user.history.ordered_items.push({
        item_id: foodItem.id,
        item_name: foodItem.name,
        restaurant_name: foodItem.restaurant_name,
        platform: platform || 'Zomato',
        price_paid: foodItem.price,
        timestamp: new Date()
      });
      // Boost cuisine
      if (!user.preferences.favorite_cuisines.includes(foodItem.cuisine)) {
        user.preferences.favorite_cuisines.push(foodItem.cuisine);
      }
    }

    await user.save();
  }

  return { success: true, interaction_id: interaction._id, updated_profile: user };
}

module.exports = {
  getUserProfile,
  recordInteraction
};
