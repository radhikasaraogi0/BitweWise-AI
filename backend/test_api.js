const { connectDB, disconnectDB } = require('./config/db');
const { seedData } = require('./data/seed');
const { understandUserQuery } = require('./services/aiService');
const { retrieveCandidates } = require('./services/searchService');
const { rankCandidates } = require('./services/recommendationService');
const { attachPriceComparison } = require('./services/priceService');
const { getUserProfile, recordInteraction } = require('./services/userService');

async function testPipeline() {
  console.log('🧪 Starting End-to-End Test for MERN AI Food Recommendation Pipeline...');

  await connectDB();
  await seedData();

  const testQuery = 'I want something spicy but light under ₹300';
  console.log(`\n1️⃣ Testing Natural Language Query Understanding: "${testQuery}"`);
  
  const userProfile = await getUserProfile('user_aarav');
  console.log(`   User Profile: ${userProfile.name} (${userProfile.persona})`);

  const queryIntent = await understandUserQuery(testQuery, userProfile);
  console.log('   Parsed Query Intent:', JSON.stringify(queryIntent, null, 2));

  console.log('\n2️⃣ Testing Spatial & Filtered Candidate Retrieval (User near MG Road, Bangalore)...');
  const userLocation = { lat: 12.9716, lng: 77.5946 };
  const { candidates, restaurantsMap, metrics } = await retrieveCandidates(queryIntent, userLocation, userProfile);
  console.log(`   Metrics: Retrieved ${candidates.length} candidate food items from ${metrics.nearby_restaurants_found} nearby restaurants.`);

  console.log('\n3️⃣ Testing Multi-Factor Recommendation & Scoring Engine...');
  const ranked = await rankCandidates(candidates, restaurantsMap, queryIntent, userProfile);
  console.log(`   Ranked ${ranked.length} recommendations. Top Pick: "${ranked[0].food_item.name}" (Score: ${ranked[0].match_score}/100)`);
  console.log('   Why we recommend it:', ranked[0].why_recommended);

  console.log('\n4️⃣ Testing Multi-Platform Price Comparison (Swiggy vs Zomato vs Direct)...');
  const topWithPrice = attachPriceComparison(ranked[0]);
  console.log('   Pricing Breakdown:');
  for (const p of topWithPrice.price_comparison.platforms) {
    console.log(`   - [${p.display_name}] Base: ₹${p.base_price} | Disc: -₹${p.discount} (${p.coupon_code || 'none'}) | Del: ₹${p.delivery_fee} | Pack: ₹${p.packaging_fee} | Tax: ₹${p.taxes_and_charges} => TOTAL: ₹${p.final_payable_price}`);
  }
  console.log(`   🎯 Best Price Platform: ${topWithPrice.price_comparison.best_price_platform} (₹${topWithPrice.price_comparison.best_price_amount})`);
  console.log(`   💰 Savings Summary: ${topWithPrice.price_comparison.savings_summary}`);

  console.log('\n5️⃣ Testing User Feedback Interaction Logging & Preference Learning...');
  const eventRes = await recordInteraction('user_aarav', {
    event_type: 'food_liked',
    food_item_id: ranked[0].food_item.id,
    restaurant_id: ranked[0].restaurant.id
  });
  console.log(`   Interaction logged successfully: ${eventRes.success}`);

  await disconnectDB();
  console.log('\n✅ ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
}

testPipeline().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
