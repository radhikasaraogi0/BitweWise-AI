/**
 * Multi-Platform Price Normalization & Value Comparison Service
 * Compares final payable amounts across Swiggy, Zomato, and Direct Restaurant
 */

function calculatePlatformPrice(platformKey, foodItem, restaurant, distanceKm) {
  const baseItemPrice = foodItem.platform_base_prices?.[platformKey] || foodItem.price;
  const platformConfig = restaurant.platforms?.[platformKey] || {};

  let discountAmount = 0;
  let couponApplied = null;
  let deliveryFee = 0;
  let packagingFee = 10;
  let platformFee = 6;
  let gstRate = 0.05; // 5% GST on food

  if (platformKey === 'swiggy') {
    // Swiggy fee structure
    packagingFee = 10;
    platformFee = 8;
    // Delivery: ₹20 within 3km, +₹6/km beyond, free > ₹500
    if (baseItemPrice < 500) {
      deliveryFee = distanceKm <= 3 ? 20 : Math.round(20 + (distanceKm - 3) * 6);
    }
    // Discount: SWIGGYIT (e.g. 15% off up to ₹50 on min ₹149)
    if (platformConfig.available && baseItemPrice >= (platformConfig.discount_min_order || 149)) {
      const pct = platformConfig.discount_percentage || 15;
      const maxAmt = platformConfig.discount_max_amount || 50;
      discountAmount = Math.min(maxAmt, Math.round((baseItemPrice * pct) / 100));
      couponApplied = platformConfig.discount_coupon || 'SWIGGYIT';
    }
  } else if (platformKey === 'zomato') {
    // Zomato fee structure
    packagingFee = 10;
    platformFee = 7;
    // Delivery: ₹18 within 3km, +₹5/km beyond
    deliveryFee = distanceKm <= 3 ? 18 : Math.round(18 + (distanceKm - 3) * 5);
    // Discount: ZOMATO50 (e.g. 20% off up to ₹60 on min ₹199)
    if (platformConfig.available && baseItemPrice >= (platformConfig.discount_min_order || 199)) {
      const pct = platformConfig.discount_percentage || 20;
      const maxAmt = platformConfig.discount_max_amount || 60;
      discountAmount = Math.min(maxAmt, Math.round((baseItemPrice * pct) / 100));
      couponApplied = platformConfig.discount_coupon || 'ZOMATO50';
    }
  } else if (platformKey === 'direct') {
    // Direct Restaurant / ONDC structure
    packagingFee = 5;
    platformFee = 0; // No third-party platform fee
    deliveryFee = distanceKm <= 3 ? 25 : Math.round(25 + (distanceKm - 3) * 7);
    if (platformConfig.available && baseItemPrice >= (platformConfig.discount_min_order || 99)) {
      const pct = platformConfig.discount_percentage || 5;
      const maxAmt = platformConfig.discount_max_amount || 30;
      discountAmount = Math.min(maxAmt, Math.round((baseItemPrice * pct) / 100));
      couponApplied = platformConfig.discount_coupon || 'DIRECT5';
    }
  }

  // Subtotal after discount
  const subtotal = Math.max(0, baseItemPrice - discountAmount);
  const taxes = Math.round(subtotal * gstRate);
  const finalPrice = Math.round(subtotal + deliveryFee + packagingFee + platformFee + taxes);

  return {
    platform: platformKey,
    display_name: platformKey === 'swiggy' ? 'Swiggy' : platformKey === 'zomato' ? 'Zomato' : 'Restaurant Direct',
    available: platformConfig.available !== false,
    base_price: baseItemPrice,
    discount: discountAmount,
    coupon_code: couponApplied,
    delivery_fee: deliveryFee,
    packaging_fee: packagingFee,
    platform_fee: platformFee,
    taxes_and_charges: taxes,
    final_payable_price: finalPrice,
    estimated_time_mins: (restaurant.delivery_time_min || 25) + (platformKey === 'swiggy' ? 2 : platformKey === 'zomato' ? 0 : 5)
  };
}

/**
 * Attaches multi-platform pricing breakdown and highlights best options
 */
function attachPriceComparison(recommendation) {
  const { food_item, restaurant } = recommendation;
  const distanceKm = restaurant.distance_km || 2.5;

  const platforms = ['zomato', 'swiggy', 'direct'];
  const comparison = platforms.map(p => calculatePlatformPrice(p, food_item, restaurant, distanceKm));

  // Find lowest price
  const availablePlatforms = comparison.filter(c => c.available);
  availablePlatforms.sort((a, b) => a.final_payable_price - b.final_payable_price);

  const bestPricePlatform = availablePlatforms[0];
  const highestPricePlatform = availablePlatforms[availablePlatforms.length - 1];
  const maxSavings = highestPricePlatform ? Math.max(0, highestPricePlatform.final_payable_price - bestPricePlatform.final_payable_price) : 0;

  // Determine Best Value (combining price and delivery speed/rating)
  const bestValuePlatform = availablePlatforms.reduce((prev, curr) => {
    // Score based on price + delivery time speed
    const prevScore = (1000 - prev.final_payable_price) + (60 - prev.estimated_time_mins) * 5;
    const currScore = (1000 - curr.final_payable_price) + (60 - curr.estimated_time_mins) * 5;
    return currScore > prevScore ? curr : prev;
  }, availablePlatforms[0]);

  return {
    ...recommendation,
    price_comparison: {
      platforms: comparison,
      best_price_platform: bestPricePlatform.platform,
      best_price_amount: bestPricePlatform.final_payable_price,
      max_savings_rupees: maxSavings,
      best_value_platform: bestValuePlatform.platform,
      savings_summary: maxSavings > 0 
        ? `Save ₹${maxSavings} by ordering on ${bestPricePlatform.display_name}`
        : `Best price on ${bestPricePlatform.display_name}`
    }
  };
}

module.exports = {
  calculatePlatformPrice,
  attachPriceComparison
};
