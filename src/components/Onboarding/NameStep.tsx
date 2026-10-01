import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { UserCheck, ArrowRight, ArrowLeft, Smile } from 'lucide-react';

interface NameStepProps {
  initialName: string;
  onNext: (name: string) => void;
  onBack: () => void;
}

const QUICK_NAMES = ['Alex', 'Sam', 'Jordan', 'Devon', 'Taylor', 'Maya'];

export const NameStep: React.FC<NameStepProps> = ({
  initialName,
  onNext,
  onBack,
}) => {
  const [name, setName] = useState(initialName || 'Alex K.');
  const [error, setError] = useState('');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please tell your partner what to call you!');
      return;
    }
    onNext(name.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-8 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#86EFAC] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 2 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Identity</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          What should your partner call you?
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-6 leading-relaxed">
          Your partner will see this name on the dashboard and live chat during the pact.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-[#FECDD3] border-2 border-black rounded-xl text-xs font-black text-red-900 neo-shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Display Name or Nickname
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                maxLength={24}
                placeholder="e.g. Alex (Engineering)"
                autoFocus
                className="w-full bg-white border-3 border-black rounded-2xl py-3.5 px-4 pl-11 text-base font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#86EFAC] transition-all shadow-[2px_2px_0px_0px_#000]"
              />
              <Smile className="w-5 h-5 text-black absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick suggestion tags */}
          <div>
            <span className="text-xs font-extrabold text-slate-600 block mb-2">
              Quick suggestions:
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_NAMES.map((nick) => (
                <button
                  type="button"
                  key={nick}
                  onClick={() => setName(nick)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-bold transition-all cursor-pointer ${
                    name === nick
                      ? 'bg-[#86EFAC] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                      : 'bg-white hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {nick}
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
              variant="green"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Set Name & Continue
            </NeoButton>
          </div>
        </form>
      </div>
    </div>
  );
};
