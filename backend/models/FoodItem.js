const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  restaurant_id: { type: String, required: true, index: true },
  restaurant_name: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Main Course' }, // Starter, Main Course, Biryani, Salad, Wrap, Dessert, Beverage
  cuisine: { type: String, required: true }, // Indian, Mughlai, Chinese, Italian, Continental, Healthy, Mexican
  price: { type: Number, required: true }, // Base restaurant price
  dietary: { type: String, enum: ['veg', 'non_veg', 'egg', 'vegan'], default: 'veg' },
  spice_level: { type: String, enum: ['mild', 'medium', 'spicy', 'extra_spicy', 'none'], default: 'medium' },
  health_tags: [{ type: String }], // 'light', 'healthy', 'high_protein', 'comfort', 'low_calorie', 'keto', 'indulgent'
  flavor_tags: [{ type: String }], // 'spicy', 'cheesy', 'tangy', 'sweet', 'savory', 'smoky', 'creamy', 'crispy'
  rating: { type: Number, default: 4.2, min: 1, max: 5 },
  votes: { type: Number, default: 50 },
  image_url: { type: String, default: '' },
  is_available: { type: Boolean, default: true },
  customizable: { type: Boolean, default: false },
  calories: { type: Number, default: 350 },
  platform_base_prices: {
    swiggy: { type: Number, default: null }, // Often slight markup e.g. +₹10
    zomato: { type: Number, default: null },
    direct: { type: Number, default: null }
  }
}, { timestamps: true });

// Create text index for search
foodItemSchema.index({ name: 'text', description: 'text', cuisine: 'text', flavor_tags: 'text', health_tags: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
