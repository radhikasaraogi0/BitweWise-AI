import React, { useState, useEffect } from 'react';
import { X, Store, Edit2, Check, AlertCircle, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { fetchRestaurants, updateMenuItem } from '../services/api';

export default function RestaurantPartnerModal({ isOpen, onClose, onMenuUpdated }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRestaurants();
    }
  }, [isOpen]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await fetchRestaurants();
      setRestaurants(data);
      if (data.length > 0 && !selectedRestId) {
        setSelectedRestId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentRestaurant = restaurants.find(r => r.id === selectedRestId) || restaurants[0];

  const handlePriceUpdate = async (item) => {
    try {
      await updateMenuItem(currentRestaurant.id, item.id, {
        price: parseInt(editPrice, 10)
      });
      setSaveSuccess(true);
      setEditingItem(null);
      await loadRestaurants();
      if (onMenuUpdated) onMenuUpdated();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert('Failed to update price');
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuItem(currentRestaurant.id, item.id, {
        is_available: !item.is_available
      });
      await loadRestaurants();
      if (onMenuUpdated) onMenuUpdated();
    } catch (err) {
      alert('Failed to toggle availability');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Restaurant Partner Portal</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  Live Menu Manager
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Update dish prices & availability — updates reflect immediately in real-time search
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Restaurant Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Restaurant to Manage
            </label>
            <select
              value={selectedRestId}
              onChange={(e) => setSelectedRestId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-brand-500 transition"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location?.area || 'Bangalore'})
                </option>
              ))}
            </select>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Price updated successfully! Recommendations reflect this change instantly.</span>
            </div>
          )}

          {/* Menu Items List */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
              Live Menu Items for {currentRestaurant?.name}
            </h4>

            {currentRestaurant?.menu?.length > 0 ? (
              <div className="space-y-2.5">
                {currentRestaurant.menu.map((dish) => (
                  <div
                    key={dish.id}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      dish.is_available ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dish.dietary === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                        <span className="font-bold text-sm text-slate-900 truncate">{dish.name}</span>
                        {!dish.is_available && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{dish.category} • {dish.cuisine}</div>
                    </div>

                    {/* Price & Edit */}
                    <div className="flex items-center gap-3 shrink-0">
                      {editingItem === dish.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-18 px-2 py-1 bg-white border border-brand-500 rounded-lg text-xs font-bold text-slate-900 outline-none"
                            placeholder="Price"
                          />
                          <button
                            onClick={() => handlePriceUpdate(dish)}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition text-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">₹{dish.price}</span>
                          <button
                            onClick={() => {
                              setEditingItem(dish.id);
                              setEditPrice(dish.price.toString());
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-brand-600 transition"
                            title="Edit Base Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Availability Toggle */}
                      <button
                        onClick={() => handleToggleAvailability(dish)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                          dish.is_available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                        }`}
                        title="Toggle In-Stock / Out-of-Stock"
                      >
                        {dish.is_available ? 'Available' : 'Unavailable'}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No menu items found.
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
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
