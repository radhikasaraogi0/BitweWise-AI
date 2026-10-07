const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  persona: { type: String, default: 'General Foodie' },
  avatar: { type: String, default: '🥑' },
  preferences: {
    favorite_cuisines: [{ type: String }],
    disliked_cuisines: [{ type: String }],
    flavor_affinities: {
      spicy: { type: Number, default: 0.5 },
      cheesy: { type: Number, default: 0.5 },
      sweet: { type: Number, default: 0.5 },
      tangy: { type: Number, default: 0.5 },
      savory: { type: Number, default: 0.5 },
      creamy: { type: Number, default: 0.5 },
      crispy: { type: Number, default: 0.5 }
    },
    health_focus: { type: String, default: 'balanced' }, // 'light', 'high_protein', 'comfort', 'balanced'
    dietary_restriction: { type: String, default: 'all' }, // 'all', 'veg', 'non_veg', 'vegan'
    typical_budget: {
      min: { type: Number, default: 150 },
      max: { type: Number, default: 350 }
    },
    rating_sensitivity: { type: Number, default: 4.0 },
    max_distance_km: { type: Number, default: 7 }
  },
  history: {
    liked_items: [{ type: String }], // food_item IDs
    disliked_items: [{ type: String }],
    saved_items: [{ type: String }],
    ordered_items: [{
      item_id: { type: String },
      item_name: { type: String },
      restaurant_name: { type: String },
      platform: { type: String },
      price_paid: { type: Number },
      timestamp: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
