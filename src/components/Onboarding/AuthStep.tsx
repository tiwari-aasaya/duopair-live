import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { User } from '../../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_HISTORY } from '../../services/api';

interface AuthStepProps {
  onSuccess: (user: User) => void;
}

export const AuthStep: React.FC<AuthStepProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('focuscrusher@example.com');
  const [password, setPassword] = useState('duopair123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const defaultName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
      avatarSeed: 'seed_' + email,
      bio: 'Crushing deep focus sessions on DuoPair Live.',
      streak: 3,
      totalPactsCompleted: 14,
      totalFocusMinutes: 420,
      completedSessions: INITIAL_HISTORY,
      achievements: INITIAL_ACHIEVEMENTS,
    };

    onSuccess(user);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#FDE047] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 1 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Quick Account</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          {isLogin ? 'Welcome Back!' : 'Join DuoPair Live'}
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-6 leading-relaxed">
          {isLogin
            ? 'Sign in to jump straight into an accountability session.'
            : 'Pair with focused peers by study field & exact time commitment. Zero distractions.'}
        </p>

        {error && (
          <div className="mb-5 p-3 bg-[#FECDD3] border-2 border-black rounded-xl text-xs font-black text-red-900 neo-shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full bg-white border-3 border-black rounded-2xl py-3 px-4 pl-11 text-sm font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#FDE047] transition-all shadow-[2px_2px_0px_0px_#000]"
              />
              <Mail className="w-5 h-5 text-black absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border-3 border-black rounded-2xl py-3 px-4 pl-11 text-sm font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#FDE047] transition-all shadow-[2px_2px_0px_0px_#000]"
              />
              <Lock className="w-5 h-5 text-black absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <NeoButton
              type="submit"
              variant="yellow"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {isLogin ? 'Sign In & Lock In' : 'Create Account & Continue'}
            </NeoButton>
          </div>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-extrabold text-black underline underline-offset-4 hover:text-slate-800 cursor-pointer"
          >
            {isLogin
              ? "Don't have an account? Sign up in 5 seconds"
              : 'Already have an account? Log in'}
          </button>
        </div>

        {/* Gamified perk callout */}
        <div className="mt-6 pt-5 border-t-2 border-dashed border-black flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#BBF7D0] border-2 border-black flex items-center justify-center shrink-0 neo-shadow-sm">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <p className="text-xs font-bold text-slate-700 leading-tight">
            Matching pairs you in real time with another focused partner in your field.
          </p>
        </div>
      </div>
    </div>
  );
};
