const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  event_type: {
    type: String,
    enum: [
      'recommendation_viewed',
      'food_clicked',
      'restaurant_clicked',
      'food_saved',
      'food_unsaved',
      'food_liked',
      'food_disliked',
      'order_clicked',
      'rating_given'
    ],
    required: true
  },
  food_item_id: { type: String, required: true },
  restaurant_id: { type: String, required: true },
  platform: { type: String, default: null },
  query_context: { type: String, default: '' },
  score: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Interaction', interactionSchema);
