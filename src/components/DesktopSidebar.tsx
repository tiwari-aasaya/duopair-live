import React from 'react';
import {
  Users,
  Flame,
  ShieldCheck,
  Zap,
  Volume2,
  CheckCircle2,
  Globe2,
} from 'lucide-react';
import { User } from '../types';
import { sounds } from '../utils/audio';

interface DesktopSidebarProps {
  user: User | null;
}

const LIVE_PACTS_FEED = [
  { user: 'Liam W.', goal: 'Debug Auth Middleware', time: '30m', location: 'Tokyo' },
  { user: 'Maya S.', goal: 'Finish Thesis Intro', time: '1h', location: 'Berlin' },
  { user: 'Carlos R.', goal: 'Design Design System', time: '2h', location: 'Austin' },
  { user: 'Aisha K.', goal: 'Study Biochemistry', time: '15m', location: 'Toronto' },
];

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ user }) => {
  return (
    <aside className="hidden xl:flex flex-col gap-5 w-80 shrink-0">
      {/* Community Accountability Stats */}
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-5 neo-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="w-5 h-5 text-black" />
          <h3 className="text-base font-black text-black font-['Fredoka']">
            Global Live Pacts
          </h3>
        </div>

        <p className="text-xs font-bold text-slate-600 mb-4 leading-relaxed">
          Real strangers connecting right now across timezones to get things done.
        </p>

        <div className="space-y-2.5">
          {LIVE_PACTS_FEED.map((pact, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border-2 border-black rounded-2xl text-xs neo-shadow-sm flex items-start justify-between gap-2"
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-black">{pact.user}</span>
                  <span className="text-[10px] font-bold text-slate-400">· {pact.location}</span>
                </div>
                <div className="text-slate-700 font-semibold truncate max-w-[170px]">
                  "{pact.goal}"
                </div>
              </div>
              <span className="shrink-0 bg-[#FEF08A] px-2 py-0.5 rounded-md border border-black font-black text-[10px]">
                {pact.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* The 3 PACT Rules */}
      <div className="bg-[#BBF7D0]/60 border-4 border-black rounded-3xl p-5 neo-shadow">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-black" />
          <h3 className="text-base font-black text-black font-['Fredoka']">
            The PACT Code
          </h3>
        </div>

        <ul className="space-y-2.5 text-xs font-bold text-slate-800 leading-snug">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-lg bg-white border border-black flex items-center justify-center shrink-0 font-black text-[11px]">
              1
            </span>
            <span>No ghosting: Respect the shared timer to preserve your streak.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-lg bg-white border border-black flex items-center justify-center shrink-0 font-black text-[11px]">
              2
            </span>
            <span>Specific goals only: Measurable deliverables produce deep flow.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-lg bg-white border border-black flex items-center justify-center shrink-0 font-black text-[11px]">
              3
            </span>
            <span>Hype each other up: Send quick nudges to keep momentum high.</span>
          </li>
        </ul>
      </div>

      {/* Tactile Audio Soundboard Tester */}
      <div className="bg-white border-4 border-black rounded-3xl p-5 neo-shadow">
        <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
          Tactile Audio FX
        </span>
        <h4 className="text-sm font-black text-black font-['Fredoka'] mb-3">
          Neo-Brutalist Sound Engine
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => sounds.playClick()}
            className="py-2 px-3 bg-[#FEF08A] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Click FX
          </button>
          <button
            onClick={() => sounds.playPop()}
            className="py-2 px-3 bg-[#86EFAC] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Pop FX
          </button>
          <button
            onClick={() => sounds.playZap()}
            className="py-2 px-3 bg-[#FED7AA] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Zap FX
          </button>
          <button
            onClick={() => sounds.playCelebration()}
            className="py-2 px-3 bg-[#F472B6] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Fanfare FX
          </button>
        </div>
      </div>
    </aside>
  );
};
