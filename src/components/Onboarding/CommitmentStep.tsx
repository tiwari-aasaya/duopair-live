import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { ArrowLeft, Clock, Zap, Target, Flame, Trophy, Sparkles } from 'lucide-react';
import { CommitmentTime } from '../../types';
import { sounds } from '../../utils/audio';

interface CommitmentStepProps {
  onSelect: (time: CommitmentTime) => void;
  onBack: () => void;
}

interface CommitmentOption {
  time: CommitmentTime;
  title: string;
  badge: string;
  subtitle: string;
  icon: React.ReactNode;
  bgClass: string;
  hoverClass: string;
  borderClass: string;
}

const COMMITMENT_OPTIONS: CommitmentOption[] = [
  {
    time: '15m',
    title: '15 Min',
    badge: 'Quick Sprint',
    subtitle: 'Fast rapid-fire burst for high urgency tasks',
    icon: <Zap className="w-7 h-7 text-black fill-black" />,
    bgClass: 'bg-[#FEF08A]',
    hoverClass: 'hover:bg-[#FDE047]',
    borderClass: 'border-black',
  },
  {
    time: '30m',
    title: '30 Min',
    badge: 'Most Popular ⭐',
    subtitle: 'The golden Pomodoro standard for maximum flow',
    icon: <Target className="w-7 h-7 text-black" />,
    bgClass: 'bg-[#86EFAC]',
    hoverClass: 'hover:bg-[#4ADE80]',
    borderClass: 'border-black',
  },
  {
    time: '1h',
    title: '1 Hour',
    badge: 'Deep Work',
    subtitle: 'Unbroken concentration for complex code & writing',
    icon: <Flame className="w-7 h-7 text-black fill-orange-500" />,
    bgClass: 'bg-[#F472B6]',
    hoverClass: 'hover:bg-[#F9A8D4]',
    borderClass: 'border-black',
  },
  {
    time: '2h',
    title: '2 Hours',
    badge: 'Marathon Beast',
    subtitle: 'Relentless deep focus session for ambitious deliverables',
    icon: <Trophy className="w-7 h-7 text-black fill-yellow-400" />,
    bgClass: 'bg-[#FED7AA]',
    hoverClass: 'hover:bg-[#FDBA74]',
    borderClass: 'border-black',
  },
];

export const CommitmentStep: React.FC<CommitmentStepProps> = ({
  onSelect,
  onBack,
}) => {
  const [selected, setSelected] = useState<CommitmentTime | null>(null);

  const handleChoose = (time: CommitmentTime) => {
    setSelected(time);
    sounds.playPop();
    // Brief instant delay for visual press satisfaction
    setTimeout(() => {
      onSelect(time);
    }, 150);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#FED7AA] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 5 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Time Commitment</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          Choose Your Commitment
        </h1>
        <p className="text-sm sm:text-base font-semibold text-slate-700 mb-6 leading-relaxed">
          DuoPair Live pairs you only with a partner pledging the exact same time frame. Choose your focus block:
        </p>

        {/* The 4 Massive Neo-Brutalist Clickable Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {COMMITMENT_OPTIONS.map((opt) => {
            const isChosen = selected === opt.time;
            return (
              <button
                key={opt.time}
                type="button"
                onClick={() => handleChoose(opt.time)}
                className={`
                  relative w-full text-left p-5 sm:p-6 rounded-2xl border-4 ${opt.borderClass} ${opt.bgClass} ${opt.hoverClass}
                  transition-all duration-100 ease-out select-none cursor-pointer
                  flex flex-col justify-between min-h-[148px] sm:min-h-[168px]
                  active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_#000]
                  hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black
                  ${
                    isChosen
                      ? 'translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000] ring-4 ring-black'
                      : 'shadow-[5px_5px_0px_0px_#000]'
                  }
                `}
              >
                {/* Badge top right */}
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm shrink-0">
                    {opt.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wide bg-white px-2.5 py-1 rounded-md border-2 border-black neo-shadow-sm">
                    {opt.badge}
                  </span>
                </div>

                {/* Duration & Description */}
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-black font-['Fredoka'] tracking-tight mb-1">
                    {opt.title}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {opt.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
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
            Back to Goal
          </NeoButton>

          <span className="text-xs font-extrabold text-slate-600 hidden sm:inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-black" />
            Instant matchmaking starts on selection
          </span>
        </div>
      </div>
    </div>
  );
};
