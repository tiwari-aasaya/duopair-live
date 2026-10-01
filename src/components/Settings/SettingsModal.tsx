import React from 'react';
import { X, Volume2, VolumeX, Settings, Zap, Music, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { NeoButton } from '../NeoButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl w-full max-w-md neo-shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b-4 border-black bg-[#BBF7D0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm">
              <Settings className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-lg font-black text-black font-['Fredoka']">
              Settings & Audio Engine
            </h3>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm hover:bg-slate-100 active:translate-y-0.5 cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Audio Master Toggle */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 neo-shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF08A] border-2 border-black flex items-center justify-center neo-shadow-sm">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-black" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-sm font-black text-black block">
                  Sound Effects
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Tactile clicks, pop, timer & nudges
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onToggleSound();
                sounds.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-[#86EFAC] text-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {soundEnabled ? 'ON' : 'MUTED'}
            </button>
          </div>

          {/* Soundboard Tester */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 neo-shadow-sm">
            <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
              Audio Synthesis Test
            </span>
            <p className="text-xs font-bold text-slate-700 mb-3">
              Hermetic Web Audio API synthesizer for instant retro haptic feedback:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => sounds.playClick()}
                className="py-2.5 px-3 bg-[#FEF08A] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                🔊 Tap Click
              </button>
              <button
                type="button"
                onClick={() => sounds.playPop()}
                className="py-2.5 px-3 bg-[#86EFAC] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                🎈 Pop Sound
              </button>
              <button
                type="button"
                onClick={() => sounds.playZap()}
                className="py-2.5 px-3 bg-[#FED7AA] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                ⚡ Nudge Zap
              </button>
              <button
                type="button"
                onClick={() => sounds.playCelebration()}
                className="py-2.5 px-3 bg-[#F472B6] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:shadow-none hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                🎉 Fanfare
              </button>
            </div>
          </div>

          {/* About duo pair live */}
          <div className="p-3 bg-slate-50 border-2 border-dashed border-black rounded-2xl text-[11px] font-bold text-slate-600 leading-snug">
            DuoPair Live connects strangers based on shared commitment times and study fields with zero telemetry and instant accountability.
          </div>

          <NeoButton
            type="button"
            variant="black"
            size="md"
            fullWidth
            onClick={onClose}
          >
            Close Settings
          </NeoButton>
        </div>
      </div>
    </div>
  );
};
