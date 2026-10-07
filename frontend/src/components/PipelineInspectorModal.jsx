import React from 'react';
import { X, Sparkles, Database, Sliders, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PipelineInspectorModal({ isOpen, onClose, queryIntent, pipelineTelemetry, topRecommendation }) {
  if (!isOpen) return null;

  const scoreBreakdown = topRecommendation?.score_breakdown || {
    preference_match: 92,
    price_suitability: 88,
    rating_quality: 90,
    distance_proximity: 85,
    personalization_fit: 80,
    delivery_speed: 78
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>AI Pipeline & Reasoning Inspector</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Live Telemetry
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual breakdown of the 3 Intelligence Layers for this recommendation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* LAYER 1: Query Understanding */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Layer 1: AI Query Understanding
                </h4>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {queryIntent?.parsed_by === 'gemini_ai_api' ? 'Gemini 1.5 Flash API' : 'NLP Heuristic Engine'}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Natural language user prompt converted into structured search entities:
            </p>

            <div className="bg-slate-900 rounded-xl p-3.5 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(queryIntent, null, 2)}</pre>
            </div>
          </div>

          {/* LAYER 2: Candidate Retrieval & Spatial Search */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Layer 2: MongoDB Candidate Retrieval & Spatial Radius
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                MongoDB (Kaggle Dataset)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-slate-900">
                  {pipelineTelemetry?.candidates_retrieved || 0}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Candidate Foods</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-slate-900">
                  {pipelineTelemetry?.nearby_restaurants || 0}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Nearby Kitchens</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-indigo-600">
                  {pipelineTelemetry?.execution_time_ms || 0} ms
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Pipeline Latency</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-xl font-black text-emerald-600">
                  {topRecommendation?.restaurant?.distance_km || 0} km
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Haversine Distance</div>
              </div>
            </div>
          </div>

          {/* LAYER 3: Multi-Factor Scoring */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Layer 3: Multi-Factor Scoring Breakdown (Top Pick)
                </h4>
              </div>
              <span className="text-[11px] font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                Total: {topRecommendation?.match_score || 90}%
              </span>
            </div>

            <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200">
              
              {/* Preference Match */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Flavor & Concept Preference Match (30%)</span>
                  <span>{scoreBreakdown.preference_match}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${scoreBreakdown.preference_match}%` }} />
                </div>
              </div>

              {/* Price Suitability */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Price Suitability & Budget Margin (20%)</span>
                  <span>{scoreBreakdown.price_suitability}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${scoreBreakdown.price_suitability}%` }} />
                </div>
              </div>

              {/* Rating Quality */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Rating & Popularity Quality (18%)</span>
                  <span>{scoreBreakdown.rating_quality}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${scoreBreakdown.rating_quality}%` }} />
                </div>
              </div>

              {/* Distance Proximity */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Distance Proximity (12%)</span>
                  <span>{scoreBreakdown.distance_proximity}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${scoreBreakdown.distance_proximity}%` }} />
                </div>
              </div>

              {/* Personalization Fit */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Personalization Affinity Fit (12%)</span>
                  <span>{scoreBreakdown.personalization_fit}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${scoreBreakdown.personalization_fit}%` }} />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
          >
            Close Telemetry Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
