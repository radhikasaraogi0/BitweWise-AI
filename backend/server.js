require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { seedData } = require('./data/seed');
const Restaurant = require('./models/Restaurant');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recommend', require('./routes/recommendRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ai_engine: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Flash (Active)' : 'Heuristic NLP (Offline Mode)'
  });
});

// Startup sequence
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs seeding
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('ℹ️ Database is empty. Running initial dataset seeding...');
      await seedData();
    } else {
      console.log(`📊 Connected to DB with ${count} existing restaurants.`);
    }

    app.listen(PORT, () => {
      console.log(`
🚀 ==============================================================
   AI Food Recommendation & Price Comparison Backend (MERN)
   Listening on http://localhost:${PORT}
   AI Engine: ${process.env.GEMINI_API_KEY ? 'Google Gemini API' : 'NLP Heuristic Engine'}
==============================================================`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
};

startServer();