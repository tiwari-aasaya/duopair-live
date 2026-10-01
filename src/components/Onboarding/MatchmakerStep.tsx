import React, { useEffect, useState } from 'react';
import { NeoButton } from '../NeoButton';
import { User, CommitmentTime, StudyField, ActiveSession, StrangerFilters } from '../../types';
import { api } from '../../services/api';
import { sounds } from '../../utils/audio';
import {
  Clock,
  XCircle,
  Users,
  BookOpen,
  Globe2,
} from 'lucide-react';

interface MatchmakerStepProps {
  user: User;
  goal: string;
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  strangerFilters?: StrangerFilters;
  onMatched: (session: ActiveSession) => void;
  onCancel: () => void;
}

const FUN_TIPS = [
  'Did you know? Accountability partners boost task completion from 35% to 95%.',
  'Keep your partner hyped: Send a quick Zap when they check off a milestone!',
  'No ghosting allowed! The DuoPair Live code holds both members to the full countdown.',
  'Turn off notifications on your phone right now before the session starts!',
  'Prepare a glass of water nearby to power through your flow block.',
];

export const MatchmakerStep: React.FC<MatchmakerStepProps> = ({
  user,
  goal,
  studyField,
  commitmentTime,
  strangerFilters,
  onMatched,
  onCancel,
}) => {
  const [secondsWaited, setSecondsWaited] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isMatching, setIsMatching] = useState(false);

  // Tip rotation
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % FUN_TIPS.length);
    }, 4500);
    return () => clearInterval(tipInterval);
  }, []);

  // Format seconds to mm:ss format
  const formatWaitTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Poll matching algorithm with strangerFilters & 15s/30s fallbacks
  useEffect(() => {
    let isCancelled = false;

    // Register in queue with strangerFilters
    api.joinQueue(user, goal, studyField, commitmentTime, strangerFilters);

    const timer = setInterval(async () => {
      if (isCancelled || isMatching) return;

      setSecondsWaited((prev) => {
        const next = prev + 1;
        const allowFallbackSameTime = next >= 15;
        const allowClosestTime = next >= 30;

        api
          .pollMatch(
            user.id,
            commitmentTime,
            studyField,
            strangerFilters,
            allowFallbackSameTime,
            allowClosestTime
          )
          .then((session) => {
            if (session && !isCancelled) {
              sounds.playMatchFound();
              setIsMatching(true);
              setTimeout(() => {
                onMatched(session);
              }, 600);
            }
          });

        return next;
      });
    }, 1000);

    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [user, goal, studyField, commitmentTime, strangerFilters, onMatched, isMatching]);

  const timeLabel = {
    '15m': '15 Min',
    '30m': '30 Min',
    '1h': '1 Hour',
    '2h': '2 Hours',
  }[commitmentTime];

  const filterLabel = () => {
    if (!strangerFilters) return `📚 ${studyField}`;
    if (strangerFilters.primaryBasis === 'timezone') return `🕒 ${strangerFilters.timezone}`;
    if (strangerFilters.primaryBasis === 'country') return `🌍 ${strangerFilters.country}`;
    return `📚 ${strangerFilters.fieldOfStudy}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 neo-shadow-lg text-center relative overflow-hidden">
        {/* Top pulse radar badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BBF7D0] border-2 border-black neo-shadow-sm mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-xs font-black text-black uppercase tracking-wide">
            Live Stranger Queue
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black font-['Fredoka'] mb-2">
          Matching You with a Stranger...
        </h1>

        {/* Selected Criteria Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="text-xs font-black bg-[#FEF08A] px-2.5 py-1 rounded-xl border-2 border-black neo-shadow-sm">
            ⏱️ {timeLabel}
          </span>
          <span className="text-xs font-black bg-[#7DD3FC] px-2.5 py-1 rounded-xl border-2 border-black neo-shadow-sm truncate max-w-[200px]">
            {filterLabel()}
          </span>
        </div>

        {/* Pulsing Radar Ring Visual */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto my-4 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-4 border-dashed border-black animate-spin"
            style={{ animationDuration: '16s' }}
          />
          <div className="absolute inset-3 rounded-full border-3 border-black bg-[#FEF08A]/40 animate-pulse" />
          <div className="absolute inset-8 rounded-full border-3 border-black bg-[#86EFAC]/40" />

          {/* Center Mascot Card */}
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border-4 border-black flex flex-col items-center justify-center neo-shadow">
            <Users className="w-8 h-8 text-black animate-bounce" />
            <span className="text-[10px] font-black text-black uppercase">
              {timeLabel}
            </span>
          </div>
        </div>

        {/* PROMINENT QUEUE WAIT TIME SECTION */}
        <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 neo-shadow mb-5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-black" />
              Queue Wait Time
            </span>
            <span className="font-mono text-xs font-extrabold text-slate-500">
              Est. ~15s - 30s
            </span>
          </div>

          {/* Digital Timer Display for Wait Time */}
          <div className="bg-[#FEF08A] border-2 border-black rounded-xl p-3 flex items-center justify-between mb-3 neo-shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-700 block">
                Elapsed In Queue
              </span>
              <span className="text-xs font-bold text-slate-600">
                Scanning peers by {strangerFilters?.primaryBasis || 'field'}
              </span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-black tabular-nums tracking-tight">
              {formatWaitTime(secondsWaited)}
            </div>
          </div>

          {/* Queue Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 border-2 border-black overflow-hidden mb-2.5">
            <div
              className={`h-full transition-all duration-1000 ease-linear border-r-2 border-black ${
                secondsWaited >= 15 ? 'bg-[#FED7AA]' : 'bg-[#86EFAC]'
              }`}
              style={{ width: `${Math.min(100, (secondsWaited / 30) * 100)}%` }}
            />
          </div>

          <div className="text-[11px] font-bold text-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span>Matching Filter:</span>
              <span className="font-black text-black truncate max-w-[200px]">
                {secondsWaited < 15 ? filterLabel() : 'Expanded (Any partner with ' + timeLabel + ')'}
              </span>
            </div>
            {secondsWaited >= 15 && (
              <div className="p-1.5 bg-orange-50 border border-orange-300 rounded-lg text-orange-900 text-[10px] font-bold">
                ⚡ 15s elapsed: Filter expanded to any partner with {timeLabel} commitment!
              </div>
            )}
          </div>
        </div>

        {/* Rotating Tip */}
        <div className="bg-[#FED7AA]/50 border-2 border-dashed border-black rounded-2xl p-3 mb-5 text-xs font-bold text-slate-900 leading-relaxed min-h-[52px] flex items-center justify-center">
          "{FUN_TIPS[currentTipIndex]}"
        </div>

        {/* Cancel Button */}
        <div>
          <NeoButton
            type="button"
            variant="white"
            size="md"
            fullWidth
            onClick={onCancel}
            leftIcon={<XCircle className="w-4 h-4 text-slate-600" />}
          >
            Cancel Search
          </NeoButton>
        </div>
      </div>
    </div>
  );
};
