const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service for Natural Language Query Understanding and Reasoning
 */

// Heuristic fallback NLP parser
function heuristicParseQuery(query) {
  const q = query.toLowerCase().trim();
  
  // 1. Budget extraction
  let maxBudget = null;
  let minBudget = null;
  const underMatch = q.match(/(?:under|below|less than|within|max|around|upto|up to|₹|approx|budget of)\s*₹?\s*(\d{2,4})/i);
  if (underMatch) {
    maxBudget = parseInt(underMatch[1], 10);
  }

  // 2. Flavors
  const flavors = [];
  if (q.includes('spicy') || q.includes('hot') || q.includes('chilli') || q.includes('chili') || q.includes('teekha') || q.includes('fiery') || q.includes('schezwan') || q.includes('peri peri')) flavors.push('spicy');
  if (q.includes('cheesy') || q.includes('cheese') || q.includes('mozzarella') || q.includes('cheddar')) flavors.push('cheesy');
  if (q.includes('sweet') || q.includes('dessert') || q.includes('meetha') || q.includes('mithai') || q.includes('cake') || q.includes('chocolate') || q.includes('pie') || q.includes('ice cream') || q.includes('waffle')) flavors.push('sweet');
  if (q.includes('tangy') || q.includes('sour') || q.includes('chatpata') || q.includes('lemon') || q.includes('vinaigrette')) flavors.push('tangy');
  if (q.includes('creamy') || q.includes('butter') || q.includes('malai') || q.includes('alfredo')) flavors.push('creamy');
  if (q.includes('crispy') || q.includes('crunchy') || q.includes('fried') || q.includes('roast') || q.includes('dosa')) flavors.push('crispy');
  if (q.includes('smoky') || q.includes('tandoori') || q.includes('grilled') || q.includes('bbq') || q.includes('charcoal')) flavors.push('smoky');

  // 3. Health preference / vibe
  let healthPreference = null;
  if (q.includes('light') || q.includes('halka') || q.includes('easy to digest') || q.includes('not heavy') || q.includes('nothing too heavy')) healthPreference = 'light';
  else if (q.includes('healthy') || q.includes('diet') || q.includes('clean') || q.includes('keto') || q.includes('low cal') || q.includes('superfood')) healthPreference = 'healthy';
  else if (q.includes('protein') || q.includes('gym') || q.includes('workout') || q.includes('muscle') || q.includes('high protein')) healthPreference = 'high_protein';
  else if (q.includes('comfort') || q.includes('craving') || q.includes('cheat meal') || q.includes('indulgent') || q.includes('heavy') || q.includes('rich')) healthPreference = 'comfort';

  // 4. Food preference / specific dishes / categories
  const foodPreferences = [];
  if (q.includes('juice') || q.includes('smoothie') || q.includes('shake') || q.includes('cooler') || q.includes('drink') || q.includes('detox') || q.includes('orange juice') || q.includes('watermelon')) foodPreferences.push('juice');
  if (q.includes('coffee') || q.includes('tea') || q.includes('chai') || q.includes('cold coffee') || q.includes('beverage')) foodPreferences.push('beverage');
  if (q.includes('noodle') || q.includes('noodles') || q.includes('hakka') || q.includes('chowmein')) foodPreferences.push('noodles');
  if (q.includes('dimsum') || q.includes('dimsums') || q.includes('momo') || q.includes('momos') || q.includes('dumpling') || q.includes('dumplings')) foodPreferences.push('dimsums');
  if (q.includes('sweet') || q.includes('dessert') || q.includes('cake') || q.includes('pie') || q.includes('jamun') || q.includes('kulfi') || q.includes('waffle') || q.includes('ice cream') || q.includes('pastry') || q.includes('mithai') || q.includes('rasmalai') || q.includes('jalebi')) foodPreferences.push('dessert');
  if (q.includes('chicken') || q.includes('murgh')) foodPreferences.push('chicken');
  if (q.includes('paneer')) foodPreferences.push('paneer');
  if (q.includes('biryani') || q.includes('pulao')) foodPreferences.push('biryani');
  if (q.includes('pizza')) foodPreferences.push('pizza');
  if (q.includes('burger')) foodPreferences.push('burger');
  if (q.includes('salad') || q.includes('superfood')) foodPreferences.push('salad');
  if (q.includes('pasta')) foodPreferences.push('pasta');
  if (q.includes('shawarma') || q.includes('wrap') || q.includes('roll')) foodPreferences.push('shawarma');
  if (q.includes('dosa') || q.includes('idli') || q.includes('vada')) foodPreferences.push('dosa');
  if (q.includes('chaat') || q.includes('pani puri') || q.includes('pav bhaji')) foodPreferences.push('chaat');

  // 5. Cuisine
  let cuisine = null;
  if (q.includes('juice') || q.includes('beverage') || q.includes('smoothie') || q.includes('shake') || q.includes('cooler')) cuisine = 'Beverages';
  else if (q.includes('asian') || q.includes('chinese') || q.includes('thai') || q.includes('pan-asian') || q.includes('pan asian') || q.includes('hakka') || q.includes('dimsum')) cuisine = 'Pan-Asian';
  else if (q.includes('dessert') || q.includes('sweet') || q.includes('bakery') || q.includes('pastry') || q.includes('mithai')) cuisine = 'Desserts';
  else if (q.includes('italian') || q.includes('pizza') || q.includes('pasta')) cuisine = 'Italian';
  else if (q.includes('andhra') || q.includes('south indian') || q.includes('dosa') || q.includes('idli')) cuisine = 'South Indian';
  else if (q.includes('north indian') || q.includes('punjabi') || q.includes('mughlai') || q.includes('tandoori') || q.includes('tikka') || q.includes('butter chicken')) cuisine = 'North Indian';
  else if (q.includes('mexican') || q.includes('burrito') || q.includes('taco') || q.includes('quesadilla')) cuisine = 'Mexican';
  else if (q.includes('lebanese') || q.includes('shawarma') || q.includes('falafel') || q.includes('hummus')) cuisine = 'Lebanese';
  else if (q.includes('american') || q.includes('burger') || q.includes('fries')) cuisine = 'American';
  else if (q.includes('healthy') || q.includes('salad')) cuisine = 'Healthy';

  // 6. Dietary
  let diet = null;
  if (q.includes('pure veg') || q.includes('vegetarian') || q.includes('veg only') || q.includes('shakahari')) diet = 'veg';
  else if (q.includes('non-veg') || q.includes('non veg') || q.includes('chicken') || q.includes('meat') || q.includes('fish')) diet = 'non_veg';
  else if (q.includes('vegan')) diet = 'vegan';

  // 7. Meal type
  let meal = null;
  if (q.includes('breakfast') || q.includes('morning')) meal = 'breakfast';
  else if (q.includes('lunch') || q.includes('afternoon')) meal = 'lunch';
  else if (q.includes('dinner') || q.includes('night') || q.includes('late night')) meal = 'dinner';
  else if (q.includes('snack') || q.includes('evening') || q.includes('tea time')) meal = 'snack';

  return {
    raw_query: query,
    flavors,
    food_preferences: foodPreferences,
    health_preference: healthPreference,
    budget: {
      min: minBudget,
      max: maxBudget || 400
    },
    cuisine,
    diet,
    meal,
    extracted_keywords: [...flavors, ...foodPreferences, healthPreference, cuisine].filter(Boolean),
    parsed_by: 'heuristic_nlp_engine'
  };
}

/**
 * Main AI query understander
 */
async function understandUserQuery(query, userProfile = null) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return heuristicParseQuery(query);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert AI Food Recommendation Query Understanding engine for an Indian food ordering system.
Analyze the following natural language user query and return ONLY a valid, raw JSON object with NO markdown formatting or backticks.

User Query: "${query}"
${userProfile ? `User Profile Context: Dietary: ${userProfile.preferences?.dietary_restriction}, Favorite Cuisines: ${userProfile.preferences?.favorite_cuisines?.join(', ')}` : ''}

JSON Schema:
{
  "flavors": string[], // e.g. ["spicy", "cheesy", "tangy", "sweet", "creamy", "crispy", "smoky"]
  "food_preferences": string[], // e.g. ["noodles", "dimsums", "dessert", "chicken", "paneer", "salad", "biryani", "pizza", "burger", "shawarma", "dosa"]
  "health_preference": string | null, // "light", "healthy", "high_protein", "comfort"
  "budget": {
    "min": number | null,
    "max": number | null // e.g. 300 if user mentions "under 300"
  },
  "cuisine": string | null, // e.g. "Pan-Asian", "Chinese", "Desserts", "Italian", "North Indian", "South Indian", "Mexican", "Lebanese", "Healthy", "American"
  "diet": string | null, // "veg", "non_veg", "vegan", or null
  "meal": string | null, // "breakfast", "lunch", "dinner", "snack"
  "extracted_keywords": string[]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    parsed.raw_query = query;
    parsed.parsed_by = 'gemini_ai_api';

    // Ensure budget fallback
    if (!parsed.budget) parsed.budget = { min: null, max: 400 };
    else if (!parsed.budget.max) parsed.budget.max = 400;

    return parsed;
  } catch (err) {
    console.warn('⚠️ Gemini API call failed or timed out, falling back to heuristic parser:', err.message);
    return heuristicParseQuery(query);
  }
}

/**
 * Generate AI reasoning explanations for why a food item was recommended
 */
async function generateFoodExplanations(item, queryIntent, userProfile) {
  const reasons = [];

  // Exact keyword / food preference match reason
  if (queryIntent.food_preferences?.length > 0) {
    for (const fp of queryIntent.food_preferences) {
      if (
        item.name.toLowerCase().includes(fp) ||
        item.description.toLowerCase().includes(fp) ||
        item.category.toLowerCase().includes(fp) ||
        (fp === 'dessert' && (item.category.toLowerCase().includes('dessert') || item.flavor_tags?.includes('sweet')))
      ) {
        reasons.push(`Direct match for your "${fp}" request`);
        break;
      }
    }
  }

  // Flavor match reason
  if (queryIntent.flavors?.length > 0) {
    const matchingFlavors = item.flavor_tags?.filter(f => queryIntent.flavors.includes(f)) || [];
    if (matchingFlavors.length > 0) {
      reasons.push(`Matches your ${matchingFlavors.join(' & ')} craving`);
    }
  }

  // Health / vibe match reason
  if (queryIntent.health_preference && item.health_tags?.includes(queryIntent.health_preference)) {
    if (queryIntent.health_preference === 'light') reasons.push('Light on the stomach & easy to digest');
    else if (queryIntent.health_preference === 'high_protein') reasons.push('High-protein meal (~' + (item.calories > 300 ? '25g+' : '18g+') + ' protein)');
    else if (queryIntent.health_preference === 'healthy') reasons.push('Nutrient-dense with fresh ingredients');
    else if (queryIntent.health_preference === 'comfort') reasons.push('Rich, satisfying comfort food');
  } else if (item.health_tags?.includes('light') && queryIntent.health_preference === 'light') {
    reasons.push('Light meal option');
  }

  // Budget reason
  if (queryIntent.budget?.max && item.price <= queryIntent.budget.max) {
    reasons.push(`Within your ₹${queryIntent.budget.max} budget (only ₹${item.price})`);
  }

  // Rating reason
  if (item.rating >= 4.5) {
    reasons.push(`Top-rated (${item.rating}★ from ${item.votes}+ foodies)`);
  }

  // Personalization reason
  if (userProfile && userProfile.preferences?.favorite_cuisines?.includes(item.cuisine)) {
    reasons.push(`Fits your preference for ${item.cuisine} food`);
  }

  // Fallback reasons if needed
  if (reasons.length === 0) {
    reasons.push('Popular chef signature recommendation');
    reasons.push('Prepared fresh on order');
  }

  return reasons.slice(0, 4);
}

module.exports = {
  understandUserQuery,
  heuristicParseQuery,
  generateFoodExplanations
};
