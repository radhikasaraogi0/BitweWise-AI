import React, { useState } from 'react';
import { Search, Sparkles, Mic, ArrowRight } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSearch(inputQuery);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      const demoVoicePrompt = 'I want a delicious sweet dessert waffle or chocolate lava cake under ₹200';
      setTimeout(() => {
        setInputQuery(demoVoicePrompt);
        setIsListening(false);
        onSearch(demoVoicePrompt);
      }, 1200);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-2 sm:pb-4">
      {/* Hero Title */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold mb-2.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask in plain English — We find the dish & lowest price</span>
        </div>
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          What are you craving today?
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-1.5 sm:mt-2 max-w-2xl mx-auto font-medium px-2">
          Find desserts, Asian noodles, biryanis, fresh juices, or healthy bowls. Compare real checkout prices across <span className="font-bold text-[#FC8019]">Swiggy</span>, <span className="font-bold text-[#E23744]">Zomato</span> & <span className="font-bold text-[#10B981]">Direct</span>.
        </p>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-200/60 border-2 border-slate-200 group-focus-within:border-brand-500 transition-all p-1.5 sm:p-2.5">
          
          <div className="pl-2 sm:pl-3 pr-1 text-slate-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-brand-500 transition-colors" />
          </div>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="e.g. 'fresh juice under ₹150' or 'Spicy Hakka noodles'"
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm md:text-base font-medium px-2 py-1 min-w-0"
          />

          {/* Voice input button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition relative shrink-0 ${
              isListening ? 'text-red-600 bg-red-50 animate-pulse' : ''
            }`}
            title="Voice Search (Simulated)"
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="ml-1 sm:ml-2 px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-md shadow-brand-500/25 transition shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <span className="hidden xs:inline">Recommend</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
