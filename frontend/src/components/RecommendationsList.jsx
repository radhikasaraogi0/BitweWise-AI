import React from 'react';
import { Star, MapPin, Heart, Bookmark, ArrowUpRight, Flame, Sparkles, Utensils } from 'lucide-react';

export default function RecommendationsList({
  recommendations,
  onSelectHero,
  onLike,
  onSave,
  likedItemIds = [],
  savedItemIds = []
}) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-6 sm:my-8">
      <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
        <div>
          <h3 className="text-base sm:text-xl font-black text-slate-900 flex items-center gap-1.5 sm:gap-2">
            <Utensils className="w-5 h-5 text-brand-600" />
            <span>Other Great Matches For You</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Ranked alternative dishes matching your taste and budget profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {recommendations.map((rec) => {
          const { food_item, restaurant, match_score, why_recommended, price_comparison } = rec;
          const isLiked = likedItemIds.includes(food_item.id);
          const isSaved = savedItemIds.includes(food_item.id);

          const bestPlatform = price_comparison?.platforms?.find(
            p => p.platform === price_comparison.best_price_platform
          ) || price_comparison?.platforms?.[0];

          return (
            <div
              key={food_item.id}
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                
                {/* Top image & badges */}
                <div className="flex gap-3 sm:gap-4 items-start">
                  
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={food_item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'}
                      alt={food_item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${food_item.dietary === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                        {match_score}% Match
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{food_item.rating}</span>
                      </div>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate leading-tight">
                      {food_item.name}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {restaurant.name} • {restaurant.area}
                    </p>

                    {/* Price & Best Platform Teaser */}
                    <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹{bestPlatform?.final_payable_price}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Best on {bestPlatform?.display_name}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Top Reason */}
                {why_recommended?.[0] && (
                  <div className="mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span className="truncate">{why_recommended[0]}</span>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onLike && onLike(food_item, restaurant)}
                    className={`p-1.5 rounded-lg border transition ${
                      isLiked ? 'bg-red-50 text-red-600 border-red-200' : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Like"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSave && onSave(food_item, restaurant)}
                    className={`p-1.5 rounded-lg border transition ${
                      isSaved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Save"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={() => onSelectHero && onSelectHero(rec)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition flex items-center gap-1"
                >
                  <span>Compare</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
