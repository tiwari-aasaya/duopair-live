import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { Target, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface GoalStepProps {
  initialGoal: string;
  onNext: (goal: string) => void;
  onBack: () => void;
}

const PRESET_GOALS = [
  '💻 Code feature branch & submit PR',
  '📚 Read 25 pages of textbook',
  '✍️ Write 500 words for draft',
  '🧮 Finish 4 Calculus problem sets',
  '📊 Prepare Q3 financial metrics',
  '🎨 Wireframe 3 dashboard screens',
  '📬 Clear inbox to zero unread',
];

export const GoalStep: React.FC<GoalStepProps> = ({
  initialGoal,
  onNext,
  onBack,
}) => {
  const [goal, setGoal] = useState(initialGoal || '💻 Ship React UI & clean up bugs');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError('A pact requires a specific, actionable goal!');
      return;
    }
    onNext(goal.trim());
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-8 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#F472B6] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 3 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Session Mission</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          What is your goal for this session?
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-6 leading-relaxed">
          Be concise and specific. Clear goals increase accountability completion rates by 87%.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FECDD3] border-2 border-black rounded-xl text-xs font-black text-red-900 neo-shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Specific Deliverable
            </label>
            <div className="relative">
              <textarea
                rows={2}
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  setError('');
                }}
                maxLength={90}
                placeholder="e.g. Finish Section 3.2 physics assignment..."
                autoFocus
                className="w-full bg-white border-3 border-black rounded-2xl py-3 px-4 pl-11 text-base font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#F472B6] transition-all shadow-[2px_2px_0px_0px_#000] resize-none"
              />
              <Target className="w-5 h-5 text-black absolute left-3.5 top-4 pointer-events-none" />
            </div>
            <div className="text-right text-[11px] font-bold text-slate-500 mt-1">
              {goal.length}/90 characters
            </div>
          </div>

          {/* Quick preset chips */}
          <div>
            <span className="text-xs font-black uppercase text-slate-700 block mb-2">
              Popular Quick Targets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_GOALS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setGoal(preset)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-extrabold transition-all text-left cursor-pointer ${
                    goal === preset
                      ? 'bg-[#F472B6] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                      : 'bg-white hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <NeoButton
              type="button"
              variant="white"
              size="lg"
              onClick={onBack}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              className="w-24 shrink-0"
            >
              Back
            </NeoButton>
            <NeoButton
              type="submit"
              variant="pink"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Lock In Goal
            </NeoButton>
          </div>
        </form>
      </div>
    </div>
  );
};
