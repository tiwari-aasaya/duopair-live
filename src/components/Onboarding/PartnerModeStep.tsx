import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { ArrowLeft, Users, Clock } from 'lucide-react';
import { CommitmentTime, StudyField } from '../../types';
import { sounds } from '../../utils/audio';

interface PartnerModeStepProps {
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  onSelectStranger: () => void;
  onSelectCompanion: () => void;
  onBack: () => void;
}

export const PartnerModeStep: React.FC<PartnerModeStepProps> = ({
  studyField,
  commitmentTime,
  onSelectStranger,
  onSelectCompanion,
  onBack,
}) => {
  const [selectedMode, setSelectedMode] = useState<'stranger' | 'companion' | null>(null);

  const timeLabel = {
    '15m': '15 Min',
    '30m': '30 Min',
    '1h': '1 Hour',
    '2h': '2 Hours',
  }[commitmentTime];

  const handleChooseStranger = () => {
    setSelectedMode('stranger');
    sounds.playPop();
    setTimeout(() => {
      onSelectStranger();
    }, 150);
  };

  const handleChooseCompanion = () => {
    setSelectedMode('companion');
    sounds.playPop();
    setTimeout(() => {
      onSelectCompanion();
    }, 150);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#FED7AA] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 6 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Partner Mode</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          Choose Your Partner Type
        </h1>
        <p className="text-sm sm:text-base font-semibold text-slate-700 mb-6 leading-relaxed">
          Select whether you want to queue with a live human stranger or start immediately with a companion:
        </p>

        {/* Selected parameters pill */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-black bg-[#FEF08A] px-3 py-1 rounded-xl border-2 border-black neo-shadow-sm">
            ⏱️ {timeLabel}
          </span>
          <span className="text-xs font-black bg-[#7DD3FC] px-3 py-1 rounded-xl border-2 border-black neo-shadow-sm">
            📚 {studyField}
          </span>
        </div>

        {/* 2 Massive Neo-Brutalist Mode Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {/* OPTION 1: Play with Stranger */}
          <button
            type="button"
            onClick={handleChooseStranger}
            className={`
              relative w-full text-left p-5 sm:p-6 rounded-2xl border-4 border-black bg-[#FEF08A] hover:bg-[#FDE047]
              transition-all duration-100 ease-out select-none cursor-pointer
              flex flex-col justify-between min-h-[160px] sm:min-h-[180px]
              active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_#000]
              hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black
              ${
                selectedMode === 'stranger'
                  ? 'translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000] ring-4 ring-black'
                  : 'shadow-[5px_5px_0px_0px_#000]'
              }
            `}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm shrink-0">
                <Users className="w-6 h-6 text-black" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wide bg-white px-2.5 py-1 rounded-md border-2 border-black neo-shadow-sm">
                Live Queue
              </span>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-black font-['Fredoka'] tracking-tight mb-1">
                Play with Stranger
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                Join the live real-time queue to pair with a focused peer studying in {studyField}.
              </div>
            </div>

            <div className="mt-3 pt-2 border-t-2 border-dashed border-black flex items-center justify-between text-[11px] font-black text-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black" /> Est. Queue Wait:
              </span>
              <span>~15s - 30s</span>
            </div>
          </button>

          {/* OPTION 2: Play with Companion (STRICTLY NO ICON as requested) */}
          <button
            type="button"
            onClick={handleChooseCompanion}
            className={`
              relative w-full text-left p-5 sm:p-6 rounded-2xl border-4 border-black bg-[#86EFAC] hover:bg-[#4ADE80]
              transition-all duration-100 ease-out select-none cursor-pointer
              flex flex-col justify-between min-h-[160px] sm:min-h-[180px]
              active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_#000]
              hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black
              ${
                selectedMode === 'companion'
                  ? 'translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000] ring-4 ring-black'
                  : 'shadow-[5px_5px_0px_0px_#000]'
              }
            `}
          >
            {/* Note: NO ICON rendered here as requested */}
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-black bg-white px-2.5 py-1 rounded-md border-2 border-black neo-shadow-sm">
                Instant Ready
              </span>
              <span className="text-[11px] font-black uppercase tracking-wide bg-black text-white px-2.5 py-1 rounded-md neo-shadow-sm">
                Zero Wait
              </span>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-black text-black font-['Fredoka'] tracking-tight mb-1">
                Play with Companion
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                Launch your session immediately with an accountability companion matched to {studyField}.
              </div>
            </div>

            <div className="mt-3 pt-2 border-t-2 border-dashed border-black flex items-center justify-between text-[11px] font-black text-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-black" /> Wait Time:
              </span>
              <span className="text-emerald-900 font-extrabold">Instant (0s)</span>
            </div>
          </button>
        </div>

        {/* Back navigation */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-black">
          <NeoButton
            type="button"
            variant="white"
            size="md"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Back to Time
          </NeoButton>

          <span className="text-xs font-extrabold text-slate-600 hidden sm:inline-block">
            Choose companion for immediate start or stranger for live peer matching
          </span>
        </div>
      </div>
    </div>
  );
};
