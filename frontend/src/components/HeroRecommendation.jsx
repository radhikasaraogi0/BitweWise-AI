import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Bookmark, ThumbsDown, Star, MapPin, 
  Flame, CheckCircle, ShoppingBag, ArrowRight, Award, CheckCircle2 
} from 'lucide-react';
import PriceComparisonTable from './PriceComparisonTable';

export default function HeroRecommendation({
  recommendation,
  onLike,
  onDislike,
  onSave,
  onOrder,
  isLiked,
  isDisliked,
  isSaved
}) {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!recommendation) return null;

  const { food_item, restaurant, match_score, why_recommended, price_comparison } = recommendation;

  const bestPlatform = price_comparison?.platforms?.find(
    p => p.platform === price_comparison.best_price_platform
  ) || price_comparison?.platforms?.[0];

  const activePlatform = selectedPlatform || bestPlatform;

  const handleOrderClick = () => {
    // Fire confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setOrderPlaced(true);
    if (onOrder) onOrder(food_item, restaurant, activePlatform);
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-4 sm:my-6">
      
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-amber-500 text-white text-[11px] sm:text-xs font-black tracking-wide shadow-md shadow-brand-500/20 uppercase">
          <Award className="w-3.5 h-3.5 text-white" />
          <span>Top Recommended Pick</span>
          <span className="bg-white/25 px-1.5 sm:px-2 py-0.2 rounded-full text-[10px] sm:text-[11px] font-extrabold">
            {match_score}% Match
          </span>
        </div>
      </div>

      {/* Flagship Card Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-brand-200/90 shadow-xl shadow-brand-900/5 overflow-hidden transition-all">
        
        {/* Main Card Content */}
        <div className="p-4 sm:p-6 md:p-7">
          
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
            
            {/* Dish Image */}
            <div className="relative w-full md:w-64 h-48 xs:h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-inner group">
              <img
                src={food_item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'}
                alt={food_item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Dietary dot & category */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs">
                <span className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${food_item.dietary === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 uppercase tracking-wider">{food_item.cuisine}</span>
              </div>

              {/* Calories */}
              {food_item.calories && (
                <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{food_item.calories} kcal</span>
                </div>
              )}

              {/* Spice Level */}
              {food_item.spice_level && food_item.spice_level !== 'none' && (
                <div className="absolute bottom-2.5 right-2.5 bg-red-950/70 backdrop-blur-md text-red-200 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span>{food_item.spice_level}</span>
                </div>
              )}
            </div>

            {/* Dish & Restaurant Details */}
            <div className="flex-1 min-w-0 w-full">
              
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {food_item.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-brand-700 mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <span>{restaurant.name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-normal">{restaurant.area}</span>
                  </p>
                </div>

                {/* Rating & Distance */}
                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{food_item.rating}</span>
                    <span className="text-[10px] text-amber-700 font-medium hidden xs:inline">({food_item.votes})</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{restaurant.distance_km} km</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3 line-clamp-2 leading-relaxed">
                {food_item.description}
              </p>

              {/* "Why We Recommend It" section */}
              {why_recommended?.length > 0 && (
                <div className="mt-3 sm:mt-4 bg-brand-50/60 rounded-2xl p-3 sm:p-3.5 border border-brand-100">
                  <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-brand-900 flex items-center gap-1 mb-1.5 sm:mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-600" />
                    <span>Why We Recommend It For You</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {why_recommended.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <span className="text-emerald-600 font-black">✓</span>
                        <span className="truncate">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Feedback Buttons */}
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => onLike && onLike(food_item, restaurant)}
                    className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      isLiked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                    title="Like this dish"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() => onDislike && onDislike(food_item, restaurant)}
                    className={`p-1.5 sm:p-2 rounded-xl text-xs font-bold transition border ${
                      isDisliked ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                    }`}
                    title="Dislike"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSave && onSave(food_item, restaurant)}
                    className={`p-1.5 sm:p-2 rounded-xl text-xs font-bold transition border ${
                      isSaved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                  </button>
                </div>

                {/* Direct Order CTA Button */}
                <button
                  onClick={handleOrderClick}
                  className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order on {activePlatform?.display_name || 'Best Platform'} (₹{activePlatform?.final_payable_price})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Order Placed Toast */}
              {orderPlaced && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Order confirmed on {activePlatform?.display_name}! Logged in your user history.</span>
                </div>
              )}

            </div>

          </div>

          {/* Embedded Multi-Platform Price Comparison Table */}
          <PriceComparisonTable
            priceComparison={price_comparison}
            onSelectPlatform={(platform) => setSelectedPlatform(platform)}
          />

        </div>

      </div>

    </div>
  );
}
