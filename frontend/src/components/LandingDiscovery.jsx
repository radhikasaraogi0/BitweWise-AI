import React from 'react';
import { ArrowRight, Star, MapPin, Sparkles, Compass } from 'lucide-react';

const CRAVING_CATEGORIES = [
  {
    id: 'juices',
    name: 'Fresh Juices & Smoothies',
    query: 'Fresh cold-pressed orange juice or healthy detox juice under ₹150',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200/80',
    badgeColor: 'bg-amber-500 text-white'
  },
  {
    id: 'desserts',
    name: 'Desserts & Belgian Waffles',
    query: 'Sweet dessert waffle or chocolate lava cake under ₹200',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-pink-50/60 hover:bg-pink-100/70 border-pink-200/80',
    badgeColor: 'bg-pink-500 text-white'
  },
  {
    id: 'asian',
    name: 'Asian Hakka Noodles & Dimsums',
    query: 'Spicy Asian Hakka noodles and dimsums under ₹300',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-orange-50/60 hover:bg-orange-100/70 border-orange-200/80',
    badgeColor: 'bg-orange-500 text-white'
  },
  {
    id: 'north_indian',
    name: 'North Indian & Butter Naan',
    query: 'Rich dal makhani and butter naan dinner under ₹300',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-amber-50/60 hover:bg-amber-100/70 border-amber-200/80',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'pizzas',
    name: 'Artisanal Sourdough Pizzas',
    query: 'Cheesy authentic Italian sourdough pizza under ₹350',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-yellow-50/60 hover:bg-yellow-100/70 border-yellow-200/80',
    badgeColor: 'bg-yellow-600 text-white'
  },
  {
    id: 'healthy',
    name: 'Healthy & High-Protein Bowls',
    query: 'Healthy high-protein salad bowl or wrap around ₹250',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-200/80',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'street_food',
    name: 'Street Food & Bombay Chaats',
    query: 'Street food chaat or pav bhaji under ₹150',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&auto=format&fit=crop&q=60',
    bgColor: 'bg-rose-50/60 hover:bg-rose-100/70 border-rose-200/80',
    badgeColor: 'bg-rose-500 text-white'
  }
];

const TOP_PICKS = [
  {
    id: 'top_1',
    name: 'Spicy Chicken Tikka (6 Pcs)',
    restaurant: 'Tandoori Tales & Royal Kitchen',
    rating: 4.6,
    area: 'MG Road',
    distance: '2.8 km',
    price: 240,
    platform: 'Zomato',
    query: 'Spicy Chicken Tikka from Tandoori Tales',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'top_2',
    name: 'Meghana Special Chicken Biryani',
    restaurant: 'Meghana Foods',
    rating: 4.8,
    area: 'Indiranagar',
    distance: '1.2 km',
    price: 279,
    platform: 'Zomato',
    query: 'Meghana Special Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'top_3',
    name: 'Warm Belgian Chocolate Lava Cake',
    restaurant: 'Sweet Tooth Dessert Parlour',
    rating: 4.9,
    area: 'Church Street',
    distance: '3.1 km',
    price: 199,
    platform: 'Zomato',
    query: 'Warm Belgian Chocolate Lava Cake with Vanilla Gelato',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'top_4',
    name: 'Veg Chilli Garlic Hakka Noodles',
    restaurant: 'Wok with Chung Pan-Asian',
    rating: 4.6,
    area: 'HSR Layout',
    distance: '4.2 km',
    price: 195,
    platform: 'Swiggy',
    query: 'Veg Chilli Garlic Hakka Noodles',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60'
  }
];

export default function LandingDiscovery({ onSelectCategory, onSelectDish, activeLocation }) {
  const locationName = activeLocation?.name?.split('(')[0]?.trim() || 'Indiranagar';

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12">
      
      {/* 1. BROWSE BY CRAVING SECTION */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-black text-xl sm:text-2xl tracking-tight">
            <Compass className="w-5 h-5 text-brand-600" />
            <span>Browse by craving</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Explore popular categories and find the best dishes near you
          </p>
        </div>

        {/* First Row of Cards (4 items) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CRAVING_CATEGORIES.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.query)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-98 ${cat.bgColor}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs border border-white/80"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {cat.name}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/80">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Second Row of Cards (3 items) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {CRAVING_CATEGORIES.slice(4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.query)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-98 ${cat.bgColor}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs border border-white/80"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {cat.name}
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-slate-700 flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/80">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. TOP PICKS AROUND LOCATION SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-900 font-black text-xl sm:text-2xl tracking-tight">
              <span>Top picks around</span>
              <span className="text-brand-600 flex items-center gap-1">
                <MapPin className="w-5 h-5 fill-brand-100 text-brand-600" />
                <span>{locationName}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Popular dishes loved by people in your area
            </p>
          </div>

          <button
            onClick={() => onSelectCategory(`Top dishes in ${locationName}`)}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-brand-600 border border-slate-200 hover:border-brand-300 px-3 py-1.5 rounded-full bg-white shadow-2xs transition"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top Picks 4-Card Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_PICKS.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Dish Image + Rating */}
              <div className="relative h-40 bg-slate-100 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{dish.rating}</span>
                </div>
              </div>

              {/* Dish Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                    {dish.restaurant}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{dish.area} • {dish.distance}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">₹{dish.price}</span>
                    <span className="text-[10px] text-slate-400 block -mt-1 font-medium">on {dish.platform}</span>
                  </div>

                  <button
                    onClick={() => onSelectDish(dish.query)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline transition"
                  >
                    <span>View Prices</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
