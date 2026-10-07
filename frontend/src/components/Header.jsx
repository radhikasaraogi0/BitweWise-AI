import React, { useState } from 'react';
import { MapPin, Store, Bookmark, ChevronDown, Check, UtensilsCrossed, User } from 'lucide-react';
import { LOCATIONS } from '../constants/locations';

export default function Header({
  activeLocation,
  setActiveLocation,
  personas,
  selectedUser,
  setSelectedUser,
  onOpenProfile,
  onOpenPartner,
  onOpenSaved,
  savedCount
}) {
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-600 bg-clip-text text-transparent">
                BiteWise
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden md:block">
              Food Discovery & Multi-Platform Price Comparison
            </p>
          </div>
        </div>

        {/* Center: Location Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLocDropdown(!showLocDropdown);
              setShowUserDropdown(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs sm:text-sm font-semibold transition border border-slate-200"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600 shrink-0" />
            <span className="truncate max-w-[95px] xs:max-w-[130px] sm:max-w-[180px] md:max-w-[220px]">
              {activeLocation?.name?.split('(')[0]?.trim() || 'Select Location'}
            </span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
          </button>

          {showLocDropdown && (
            <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-[88vw] xs:w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
              <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 sticky top-0 bg-white border-b border-slate-100">
                Select Delivery Area ({LOCATIONS.length} Hubs)
              </div>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setShowLocDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-brand-50 transition ${
                    activeLocation?.id === loc.id ? 'text-brand-600 font-bold bg-brand-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{loc.name}</span>
                  {activeLocation?.id === loc.id && <Check className="w-4 h-4 text-brand-600 shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Restaurant Partner Dashboard */}
          <button
            onClick={onOpenPartner}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
            title="Restaurant Partner Dashboard"
          >
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Partner Portal</span>
          </button>

          {/* Saved Items */}
          <button
            onClick={onOpenSaved}
            className="relative p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0"
            title="View Saved Dishes"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Persona Switcher & Profile Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowLocDropdown(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200/80 transition shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {selectedUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold leading-none">{selectedUser?.name?.split(' ')[0] || 'User'}</div>
                <div className="text-[10px] text-brand-700 truncate max-w-[90px] leading-tight">
                  {selectedUser?.persona?.split('&')[0] || 'Foodie'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-brand-700 hidden sm:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute top-full mt-2 right-0 w-[88vw] xs:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Switch Persona</div>
                    <div className="text-[10px] text-slate-500">Test personalized preferences</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenProfile();
                    }}
                    className="text-xs text-brand-600 font-bold hover:underline"
                  >
                    View Taste
                  </button>
                </div>

                <div className="py-1 max-h-64 overflow-y-auto">
                  {personas.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 flex items-start gap-2.5 hover:bg-slate-50 transition ${
                        selectedUser?.id === u.id ? 'bg-brand-50/70 border-l-4 border-brand-600' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-xl bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                          <span>{u.name}</span>
                          {selectedUser?.id === u.id && (
                            <span className="text-[9px] bg-brand-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-600 truncate">{u.persona}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mobile-only Restaurant Partner button inside menu */}
                <div className="px-3 pt-2 border-t border-slate-100 lg:hidden">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenPartner();
                    }}
                    className="w-full py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Restaurant Partner Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
