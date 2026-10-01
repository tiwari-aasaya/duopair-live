import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { ArrowRight, ArrowLeft, BookOpen, Clock, Globe2, Sparkles, Check, Users } from 'lucide-react';
import { StudyField, StrangerFilters, MatchFilterCriteria, CommitmentTime } from '../../types';
import { sounds } from '../../utils/audio';

interface StrangerFilterStepProps {
  initialStudyField: StudyField;
  commitmentTime: CommitmentTime;
  onConfirm: (filters: StrangerFilters) => void;
  onBack: () => void;
}

const TIMEZONE_OPTIONS = [
  { id: 'same', label: 'Same Timezone (Local ±1 hr)', desc: 'Synchronized sleep and circadian rhythm' },
  { id: 'americas', label: 'Americas (UTC-8 to -4)', desc: 'North & South American working hours' },
  { id: 'europe', label: 'Europe & Africa (UTC+0 to +3)', desc: 'GMT, CET, and EAT working blocks' },
  { id: 'asia', label: 'Asia & Pacific (UTC+5:30 to +10)', desc: 'IST, JST, SGT, and AEST flow times' },
  { id: 'any', label: 'Worldwide (Any Timezone)', desc: 'Fastest match with peers across globe' },
];

const COUNTRY_OPTIONS = [
  { code: 'any', label: 'Worldwide / Anywhere 🌐' },
  { code: 'us', label: 'United States 🇺🇸' },
  { code: 'uk', label: 'United Kingdom 🇬🇧' },
  { code: 'de', label: 'Germany 🇩🇪' },
  { code: 'in', label: 'India 🇮🇳' },
  { code: 'ca', label: 'Canada 🇨🇦' },
  { code: 'jp', label: 'Japan 🇯🇵' },
  { code: 'au', label: 'Australia 🇦🇺' },
  { code: 'fr', label: 'France 🇫🇷' },
  { code: 'sg', label: 'Singapore 🇸🇬' },
];

const FIELD_OPTIONS: (StudyField | 'Any Field')[] = [
  'Computer Science',
  'Engineering',
  'Research',
  'Business',
  'High School',
  'General',
  'Writing & Arts',
  'Medicine & Bio',
  'Any Field',
];

export const StrangerFilterStep: React.FC<StrangerFilterStepProps> = ({
  initialStudyField,
  commitmentTime,
  onConfirm,
  onBack,
}) => {
  const [primaryBasis, setPrimaryBasis] = useState<MatchFilterCriteria>('field');
  const [selectedField, setSelectedField] = useState<StudyField | 'Any Field'>(initialStudyField);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Same Timezone (Local ±1 hr)');
  const [selectedCountry, setSelectedCountry] = useState<string>('Worldwide / Anywhere 🌐');

  const handleSelectBasis = (basis: MatchFilterCriteria) => {
    setPrimaryBasis(basis);
    sounds.playPop();
  };

  const handleConfirm = () => {
    sounds.playClick();
    onConfirm({
      primaryBasis,
      fieldOfStudy: selectedField,
      timezone: selectedTimezone,
      country: selectedCountry,
    });
  };

  const timeLabel = {
    '15m': '15 Min',
    '30m': '30 Min',
    '1h': '1 Hour',
    '2h': '2 Hours',
  }[commitmentTime];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#7DD3FC] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Live Stranger Matchmaker
          </span>
          <span className="text-xs font-extrabold text-slate-600">Preferences</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          Select Stranger Matching Criteria
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-6 leading-relaxed">
          Filter your accountability partner based on your field of study, timezone, or country:
        </p>

        {/* 3 Primary Matching Tabs */}
        <div className="mb-6">
          <label className="block text-xs font-black uppercase text-black mb-2">
            Prioritize Matching By:
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleSelectBasis('field')}
              className={`p-3 rounded-2xl border-3 border-black text-center transition-all cursor-pointer select-none ${
                primaryBasis === 'field'
                  ? 'bg-[#FEF08A] shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                  : 'bg-white hover:bg-slate-100 shadow-[1.5px_1.5px_0px_0px_#000]'
              }`}
            >
              <BookOpen className="w-5 h-5 mx-auto mb-1 text-black" />
              <span className="text-xs font-black block text-black truncate">
                Field of Study
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBasis('timezone')}
              className={`p-3 rounded-2xl border-3 border-black text-center transition-all cursor-pointer select-none ${
                primaryBasis === 'timezone'
                  ? 'bg-[#86EFAC] shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                  : 'bg-white hover:bg-slate-100 shadow-[1.5px_1.5px_0px_0px_#000]'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-black" />
              <span className="text-xs font-black block text-black truncate">
                Timezone
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectBasis('country')}
              className={`p-3 rounded-2xl border-3 border-black text-center transition-all cursor-pointer select-none ${
                primaryBasis === 'country'
                  ? 'bg-[#F472B6] shadow-[3px_3px_0px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                  : 'bg-white hover:bg-slate-100 shadow-[1.5px_1.5px_0px_0px_#000]'
              }`}
            >
              <Globe2 className="w-5 h-5 mx-auto mb-1 text-black" />
              <span className="text-xs font-black block text-black truncate">
                Country
              </span>
            </button>
          </div>
        </div>

        {/* Section A: Field of Study Picker */}
        {primaryBasis === 'field' && (
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 neo-shadow-sm mb-6 animate-in fade-in duration-150">
            <span className="text-xs font-black uppercase text-slate-800 block mb-2">
              Select Desired Field of Study:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FIELD_OPTIONS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => {
                    setSelectedField(f);
                    sounds.playPop();
                  }}
                  className={`p-2.5 rounded-xl border-2 border-black text-xs font-extrabold text-left transition-all cursor-pointer ${
                    selectedField === f
                      ? 'bg-[#FEF08A] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  <span className="block truncate">{f}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-2">
              Pairs you with peers focusing in {selectedField}.
            </p>
          </div>
        )}

        {/* Section B: Timezone Picker */}
        {primaryBasis === 'timezone' && (
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 neo-shadow-sm mb-6 animate-in fade-in duration-150 space-y-2">
            <span className="text-xs font-black uppercase text-slate-800 block mb-2">
              Select Desired Timezone Window:
            </span>
            {TIMEZONE_OPTIONS.map((tz) => (
              <div
                key={tz.id}
                onClick={() => {
                  setSelectedTimezone(tz.label);
                  sounds.playPop();
                }}
                className={`p-3 rounded-xl border-2 border-black transition-all cursor-pointer flex items-center justify-between ${
                  selectedTimezone === tz.label
                    ? 'bg-[#86EFAC] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                    : 'bg-slate-50 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-black block text-black">
                    {tz.label}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 block">
                    {tz.desc}
                  </span>
                </div>
                {selectedTimezone === tz.label && (
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Section C: Country Picker */}
        {primaryBasis === 'country' && (
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 neo-shadow-sm mb-6 animate-in fade-in duration-150">
            <span className="text-xs font-black uppercase text-slate-800 block mb-2">
              Select Desired Country / Region:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {COUNTRY_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => {
                    setSelectedCountry(c.label);
                    sounds.playPop();
                  }}
                  className={`p-2.5 rounded-xl border-2 border-black text-xs font-extrabold text-left transition-all cursor-pointer truncate ${
                    selectedCountry === c.label
                      ? 'bg-[#F472B6] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5 ring-2 ring-black'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-2">
              Matches with verified members in {selectedCountry}.
            </p>
          </div>
        )}

        {/* Selected Summary Pill Card */}
        <div className="bg-[#FFFDF5] border-3 border-black rounded-2xl p-3.5 mb-6 neo-shadow-sm flex items-center justify-between text-xs font-black">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 block">
              Configured Match Parameters:
            </span>
            <span className="text-black">
              {timeLabel} · {selectedField} · {primaryBasis === 'timezone' ? selectedTimezone : selectedCountry}
            </span>
          </div>
          <span className="bg-[#86EFAC] px-2.5 py-1 rounded-lg border border-black text-[11px]">
            Ready
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-black">
          <NeoButton
            type="button"
            variant="white"
            size="md"
            onClick={onBack}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            Back
          </NeoButton>

          <NeoButton
            type="button"
            variant="yellow"
            size="md"
            onClick={handleConfirm}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Enter Stranger Queue
          </NeoButton>
        </div>
      </div>
    </div>
  );
};
