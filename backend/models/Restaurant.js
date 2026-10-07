const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  cuisines: [{ type: String }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    area: { type: String, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: 'Bangalore' }
  },
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  votes: { type: Number, default: 100 },
  approx_cost_for_two: { type: Number, default: 500 },
  delivery_time_min: { type: Number, default: 30 },
  is_open: { type: Boolean, default: true },
  opening_hours: { type: String, default: '10:00 AM - 11:00 PM' },
  image_url: { type: String, default: '' },
  featured_dish: { type: String, default: '' },
  platforms: {
    swiggy: {
      available: { type: Boolean, default: true },
      rating: { type: Number, default: 4.1 },
      discount_percentage: { type: Number, default: 15 },
      discount_coupon: { type: String, default: 'SWIGGYIT' },
      discount_max_amount: { type: Number, default: 50 },
      discount_min_order: { type: Number, default: 149 }
    },
    zomato: {
      available: { type: Boolean, default: true },
      rating: { type: Number, default: 4.2 },
      discount_percentage: { type: Number, default: 20 },
      discount_coupon: { type: String, default: 'ZOMATO50' },
      discount_max_amount: { type: Number, default: 60 },
      discount_min_order: { type: Number, default: 199 }
    },
    direct: {
      available: { type: Boolean, default: true },
      rating: { type: Number, default: 4.3 },
      discount_percentage: { type: Number, default: 5 },
      discount_coupon: { type: String, default: 'DIRECT5' },
      discount_max_amount: { type: Number, default: 30 },
      discount_min_order: { type: Number, default: 99 }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
