const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const { recordInteraction } = require('../services/userService');

/**
 * GET /api/users/personas
 * List available user personas
 */
router.get('/personas', async (req, res) => {
  try {
    const users = await User.find({}, 'id name persona avatar preferences.typical_budget preferences.health_focus preferences.dietary_restriction').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/:id/profile
 * Get detailed profile, learned affinities, and history
 */
router.get('/:id/profile', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Populate saved and liked food details
    const likedFoods = await FoodItem.find({ id: { $in: user.history?.liked_items || [] } }).lean();
    const savedFoods = await FoodItem.find({ id: { $in: user.history?.saved_items || [] } }).lean();

    res.json({
      ...user,
      populated_history: {
        liked_items: likedFoods,
        saved_items: savedFoods,
        ordered_items: user.history?.ordered_items || []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/users/:id/events
 * Record interaction event (like, dislike, save, unsave, order)
 */
router.post('/:id/events', async (req, res) => {
  try {
    const result = await recordInteraction(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
