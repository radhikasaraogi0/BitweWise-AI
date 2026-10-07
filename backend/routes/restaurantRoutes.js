const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

/**
 * GET /api/restaurants
 * Get list of all restaurants and their menus
 */
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();
    const foodItems = await FoodItem.find().lean();

    const result = restaurants.map(r => ({
      ...r,
      menu: foodItems.filter(f => f.restaurant_id === r.id)
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/restaurants/:id/items/:itemId
 * Restaurant Partner Portal: update item price, availability, or discount
 */
router.put('/:id/items/:itemId', async (req, res) => {
  try {
    const { id, itemId } = req.params;
    const { price, is_available, name, description } = req.body;

    const item = await FoodItem.findOne({ id: itemId, restaurant_id: id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (price !== undefined) item.price = price;
    if (is_available !== undefined) item.is_available = is_available;
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;

    await item.save();

    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
