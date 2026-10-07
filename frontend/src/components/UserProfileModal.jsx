import React from 'react';
import { X, User, Heart, ShoppingBag, Flame, Sparkles, TrendingUp } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, userProfile }) {
  if (!isOpen || !userProfile) return null;

  const { name, persona, preferences, populated_history, history } = userProfile;
  const flavorAffinities = preferences?.flavor_affinities || {};
  const orderedItems = populated_history?.ordered_items || history?.ordered_items || [];
  const likedItems = populated_history?.liked_items || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-brand-600 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold shadow-inner">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>{name}</span>
              </h3>
              <p className="text-xs text-brand-100 font-medium">
                {persona} • Personalized Taste Profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Persona Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Dietary Focus</div>
              <div className="text-sm font-black text-slate-900 mt-1 capitalize">
                {preferences?.dietary_restriction || 'All'} ({preferences?.health_focus || 'Balanced'})
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Typical Budget</div>
              <div className="text-sm font-black text-slate-900 mt-1">
                ₹{preferences?.typical_budget?.min || 150} – ₹{preferences?.typical_budget?.max || 350}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Radius Tolerance</div>
              <div className="text-sm font-black text-slate-900 mt-1">
                &lt; {preferences?.max_distance_km || 6} km
              </div>
            </div>
          </div>

          {/* Learned Flavor Affinities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-600" />
                <span>Learned Flavor Affinities</span>
              </h4>
              <span className="text-[11px] text-slate-500">Auto-updates as you like/order</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {Object.entries(flavorAffinities).map(([flavor, val]) => (
                <div key={flavor} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700 capitalize">
                    <span>{flavor}</span>
                    <span>{Math.round(val * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        flavor === 'spicy' ? 'bg-red-500' :
                        flavor === 'cheesy' ? 'bg-amber-500' :
                        flavor === 'sweet' ? 'bg-pink-500' :
                        flavor === 'tangy' ? 'bg-orange-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${Math.round(val * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Cuisines */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
              Preferred Cuisines
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {preferences?.favorite_cuisines?.length > 0 ? (
                preferences.favorite_cuisines.map((c, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No favorite cuisines logged yet.</span>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Order History & Platform Activity</span>
            </h4>

            {orderedItems.length > 0 ? (
              <div className="space-y-2">
                {orderedItems.slice(-4).reverse().map((order, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{order.item_name}</div>
                      <div className="text-slate-500 text-[11px]">{order.restaurant_name} • via {order.platform}</div>
                    </div>
                    <div className="font-black text-slate-900 text-right">
                      ₹{order.price_paid}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                No orders logged yet. Place an order on the home page to start learning!
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
