const express = require('express');
const router = express.Router();
const { understandUserQuery } = require('../services/aiService');
const { retrieveCandidates } = require('../services/searchService');
const { rankCandidates } = require('../services/recommendationService');
const { attachPriceComparison } = require('../services/priceService');
const { getUserProfile } = require('../services/userService');

/**
 * POST /api/recommend
 * End-to-end AI recommendation & multi-platform price comparison pipeline
 */
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { query, location, user_id } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'A natural language "query" string is required.' });
    }

    // 1. Fetch user profile context
    const userProfile = await getUserProfile(user_id || 'user_aarav');

    // 2. Intelligence Layer 1: AI Query Understanding (via Gemini AI / Heuristic NLP)
    const queryIntent = await understandUserQuery(query, userProfile);

    // 3. Intelligence Layer 2: Spatial & Filtered Candidate Retrieval from MongoDB
    const { candidates, restaurantsMap, metrics } = await retrieveCandidates(queryIntent, location, userProfile);

    if (candidates.length === 0) {
      return res.json({
        query,
        query_intent: queryIntent,
        pipeline_telemetry: {
          execution_time_ms: Date.now() - startTime,
          candidates_examined: metrics.candidates_retrieved,
          nearby_restaurants: metrics.nearby_restaurants_found
        },
        hero_recommendation: null,
        other_recommendations: [],
        message: 'No matching dishes found within budget and dietary criteria. Try broadening your search or budget!'
      });
    }

    // 4. Intelligence Layer 3: Multi-Factor Recommendation & Ranking
    const rankedRecommendations = await rankCandidates(candidates, restaurantsMap, queryIntent, userProfile);

    // 5. Price & Value Comparison Layer: Attach multi-platform pricing
    const fullRecommendations = rankedRecommendations.map(rec => attachPriceComparison(rec));

    const heroRecommendation = fullRecommendations[0] || null;
    const otherRecommendations = fullRecommendations.slice(1, 6);

    return res.json({
      query,
      query_intent: queryIntent,
      pipeline_telemetry: {
        execution_time_ms: Date.now() - startTime,
        total_restaurants_in_db: metrics.total_restaurants_in_db,
        nearby_restaurants: metrics.nearby_restaurants_found,
        candidates_retrieved: metrics.candidates_retrieved,
        ranked_results_count: fullRecommendations.length,
        user_coords: metrics.user_coords
      },
      hero_recommendation: heroRecommendation,
      other_recommendations: otherRecommendations
    });
  } catch (err) {
    console.error('❌ Error in /api/recommend:', err);
    return res.status(500).json({ error: 'Internal server error processing recommendation', details: err.message });
  }
});

module.exports = router;
