import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Tag, Clock, ShieldCheck, Sparkles, CheckCircle2, BadgePercent } from 'lucide-react';

export default function PriceComparisonTable({ priceComparison, onSelectPlatform }) {
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);

  if (!priceComparison || !priceComparison.platforms) return null;

  const { platforms, best_price_platform, max_savings_rupees, best_value_platform } = priceComparison;

  return (
    <div className="mt-4 sm:mt-5 bg-slate-50/80 rounded-2xl p-3 sm:p-5 border border-slate-200">
      
      {/* Header & Savings Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-200">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <BadgePercent className="w-4 h-4 text-brand-600" />
            <span>Multi-Platform Price Comparison</span>
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Calculated true checkout price after discounts, delivery fees, packaging & taxes.
          </p>
        </div>

        {max_savings_rupees > 0 && (
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] sm:text-xs font-extrabold self-start sm:self-auto border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Save up to ₹{max_savings_rupees}</span>
          </div>
        )}
      </div>

      {/* Cards Grid for Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 my-3 sm:my-4">
        {platforms.map((p) => {
          const isBestPrice = p.platform === best_price_platform;
          const isBestValue = p.platform === best_value_platform && !isBestPrice;

          // Styling based on platform
          let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
          let borderHighlight = isBestPrice ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white';

          if (p.platform === 'swiggy') {
            badgeColor = 'bg-orange-50 text-[#FC8019] border-orange-200';
          } else if (p.platform === 'zomato') {
            badgeColor = 'bg-red-50 text-[#E23744] border-red-200';
          } else if (p.platform === 'direct') {
            badgeColor = 'bg-emerald-50 text-[#10B981] border-emerald-200';
          }

          return (
            <div
              key={p.platform}
              className={`relative rounded-xl p-3 sm:p-4 border transition-all shadow-xs flex flex-col justify-between ${borderHighlight}`}
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}>
                    {p.display_name}
                  </span>

                  {isBestPrice && (
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3" /> Best Price
                    </span>
                  )}
                  {isBestValue && (
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      Best Value
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="my-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      ₹{p.final_payable_price}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                      ₹{p.base_price + p.delivery_fee + p.packaging_fee + p.taxes_and_charges}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>Est. {p.estimated_time_mins} mins</span>
                  </div>
                </div>

                {/* Coupon applied pill */}
                {p.discount > 0 ? (
                  <div className="mt-2 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/80 truncate">
                    <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">-₹{p.discount} ({p.coupon_code})</span>
                  </div>
                ) : (
                  <div className="mt-2 text-[10px] sm:text-[11px] text-slate-400 py-1">
                    No active coupon
                  </div>
                )}
              </div>

              {/* Select Platform CTA */}
              <button
                onClick={() => onSelectPlatform && onSelectPlatform(p)}
                className={`mt-3 w-full py-1.5 text-xs font-bold rounded-lg transition border ${
                  isBestPrice
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                Select {p.display_name}
              </button>
            </div>
          );
        })}
      </div>

      {/* Accordion Toggle for Detailed Line Item Breakdown */}
      <button
        onClick={() => setShowFullBreakdown(!showFullBreakdown)}
        className="w-full pt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
      >
        <span>{showFullBreakdown ? 'Hide Fee Breakdown' : 'View Itemized Fee Breakdown'}</span>
        {showFullBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Detailed Side-by-Side Fee Matrix Table */}
      {showFullBreakdown && (
        <div className="mt-3 pt-3 border-t border-slate-200 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[340px]">
            <thead>
              <tr className="text-slate-400 border-b border-slate-200/80 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                <th className="pb-2">Line Item</th>
                {platforms.map(p => (
                  <th key={p.platform} className="pb-2 text-right">
                    {p.display_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-1.5 text-slate-500">Menu Base Price</td>
                {platforms.map(p => (
                  <td key={p.platform} className="py-1.5 text-right font-semibold">₹{p.base_price}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-emerald-600 font-bold">Coupon Discount</td>
                {platforms.map(p => (
                  <td key={p.platform} className="py-1.5 text-right text-emerald-600 font-bold">
                    {p.discount > 0 ? `-₹${p.discount}` : '₹0'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500">Delivery Charge</td>
                {platforms.map(p => (
                  <td key={p.platform} className="py-1.5 text-right">₹{p.delivery_fee}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500">Packaging Fee</td>
                {platforms.map(p => (
                  <td key={p.platform} className="py-1.5 text-right">₹{p.packaging_fee}</td>
                ))}
              </tr>
              <tr>
                <td className="py-1.5 text-slate-500">Platform Fee & Taxes</td>
                {platforms.map(p => (
                  <td key={p.platform} className="py-1.5 text-right">₹{p.platform_fee + p.taxes_and_charges}</td>
                ))}
              </tr>
              <tr className="border-t-2 border-slate-300 font-black text-slate-900 bg-slate-100/50">
                <td className="py-2 font-black">Final Total Payable</td>
                {platforms.map(p => (
                  <td key={p.platform} className={`py-2 text-right text-sm ${p.platform === best_price_platform ? 'text-emerald-700 font-black' : ''}`}>
                    ₹{p.final_payable_price}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
