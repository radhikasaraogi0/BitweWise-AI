const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');
const { restaurantsData, foodItemsData, presetUsersData } = require('./kaggle_dataset');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    console.log('🌱 Seeding Kaggle Restaurant & Food Menu Data into MongoDB...');

   //clear exisiting
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    await User.deleteMany({});

    // Insert
    await Restaurant.insertMany(restaurantsData);
    await FoodItem.insertMany(foodItemsData);
    await User.insertMany(presetUsersData);

    console.log(`✅ Successfully seeded:`);
    console.log(`   - ${restaurantsData.length} Restaurants`);
    console.log(`   - ${foodItemsData.length} Food Items`);
    console.log(`   - ${presetUsersData.length} Preset User Personas`);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    throw err;
  }
};

// if run directly
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}

module.exports = { seedData };