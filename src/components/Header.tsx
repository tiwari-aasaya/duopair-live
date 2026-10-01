import React from 'react';
import { Flame, Settings, Volume2, VolumeX, Zap, User as UserIcon } from 'lucide-react';
import { sounds } from '../utils/audio';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenProfile,
  onReset,
}) => {
  return (
    <header className="w-full bg-[#FFFDF5] border-b-4 border-black px-4 sm:px-8 py-3.5 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: DuoPair Live Brand Wordmark with Spark */}
        <button
          onClick={onReset}
          className="group flex items-center gap-2.5 text-left select-none cursor-pointer focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FDE047] border-[3px] border-black flex items-center justify-center neo-shadow-sm group-hover:-translate-y-0.5 group-active:translate-y-0 transition-transform">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-black font-['Fredoka']">
                DuoPair <span className="text-[#F43F5E]">Live</span>
              </span>
              <span className="text-[10px] font-black uppercase bg-[#86EFAC] px-1.5 py-0.5 rounded-md border-2 border-black neo-shadow-sm hidden sm:inline-block">
                Online
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Streak & Active Pacters (Centered/Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FED7AA] border-2 border-black rounded-xl neo-shadow-sm">
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500 animate-bounce" />
            <span className="text-xs font-black text-black">
              {user ? `${user.streak} Day Streak` : '3 Day Streak'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 border-2 border-black rounded-xl neo-shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>1,480+ Strangers Focused</span>
          </div>
        </div>

        {/* Zone 3: Controls (Settings Gear, Audio Toggle & User Profile Badge) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Settings Gear Button (Hides Tactile Audio FX panel behind it) */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            title="Audio FX & Settings"
            className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm hover:bg-[#FEF08A] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5 text-black" />
          </button>

          {/* Quick Sound Mute Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Toggle audio effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-black" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* User Profile Badge (Clickable to view Profile & Achievements) */}
          {user && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
              title="View Profile & Achievements"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#BBF7D0] border-2 border-black rounded-xl neo-shadow-sm hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-white border border-black flex items-center justify-center text-xs font-black overflow-hidden">
                {user.avatarUrl ? (
                  user.avatarUrl.startsWith('data:') ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.avatarUrl}</span>
                  )
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-black truncate max-w-[80px] sm:max-w-[110px]">
                {user.name}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
