import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

export default function SavedItemsDrawer({ isOpen, onClose, savedItems, onUnsave, onSelectDish }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-brand-400 fill-brand-400" />
              <h3 className="text-base font-black">Saved Dishes ({savedItems.length})</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {savedItems.length > 0 ? (
              savedItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-brand-300 transition flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate">{item.name}</div>
                    <div className="text-xs text-slate-500 truncate">{item.restaurant_name || 'Top Kitchen'} • ₹{item.price}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onUnsave && onUnsave(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No saved dishes yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click the bookmark icon on any recommendation to save it here.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
