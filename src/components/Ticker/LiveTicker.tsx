import React from 'react';
import { Globe2, Flame, Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  { name: 'Maya S.', field: 'CS', time: '30m', location: 'Berlin', goal: 'Algorithm test suite' },
  { name: 'Carlos R.', field: 'Engineering', time: '1h', location: 'Austin', goal: 'FEA stress load' },
  { name: 'Aisha K.', field: 'Research', time: '2h', location: 'Oxford', goal: 'Thesis literature review' },
  { name: 'Liam W.', field: 'Business', time: '15m', location: 'Tokyo', goal: 'Series A pitch metrics' },
  { name: 'Elena R.', field: 'Medicine', time: '30m', location: 'Stockholm', goal: 'Pathology case study' },
  { name: 'Devon K.', field: 'High School', time: '1h', location: 'Chicago', goal: 'AP Calculus prep' },
  { name: 'Sam T.', field: 'Design', time: '30m', location: 'London', goal: 'Figma component tokens' },
];

export const LiveTicker: React.FC = () => {
  return (
    <div className="w-full bg-[#FEF08A] border-y-3 border-black py-2.5 overflow-hidden select-none">
      <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
        {/* Repeating array twice for smooth infinite loop visual */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-xl border-2 border-black neo-shadow-sm shrink-0 text-xs font-bold text-black"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-black">{item.name}</span>
            <span className="text-[10px] font-black uppercase bg-[#86EFAC] px-1.5 py-0.2 rounded border border-black">
              {item.field}
            </span>
            <span className="font-extrabold text-slate-700">· {item.time}</span>
            <span className="text-slate-500 text-[11px]">({item.location})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
