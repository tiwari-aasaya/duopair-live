import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Wizard } from './components/Onboarding/Wizard';
import { ActiveSession } from './components/Session/ActiveSession';
import { LiveTicker } from './components/Ticker/LiveTicker';
import { SettingsModal } from './components/Settings/SettingsModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { User, ActiveSession as IActiveSession } from './types';
import { api, INITIAL_ACHIEVEMENTS, INITIAL_HISTORY } from './services/api';
import { sounds } from './utils/audio';
import { Flame, Sparkles } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSession, setActiveSession] = useState<IActiveSession | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load existing user & active session on mount
  useEffect(() => {
    const savedUser = api.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      // Seed default user for smooth prototype testing
      const defaultUser: User = {
        id: 'usr_duopair_' + Math.random().toString(36).substring(2, 7),
        email: 'focus@duopair.live',
        name: 'Jordan K.',
        bio: 'Building full-stack web applications and studying algorithms. Looking for locked-in partners!',
        avatarSeed: 'jordan',
        streak: 3,
        totalPactsCompleted: 12,
        totalFocusMinutes: 360,
        completedSessions: INITIAL_HISTORY,
        achievements: INITIAL_ACHIEVEMENTS,
      };
      api.saveUser(defaultUser);
      setCurrentUser(defaultUser);
    }

    const savedSession = api.getActiveSession();
    if (savedSession) {
      setActiveSession(savedSession);
    }
  }, []);

  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleSessionStarted = (session: IActiveSession) => {
    setActiveSession(session);
  };

  const handleExitSession = () => {
    api.clearSession();
    setActiveSession(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-black flex flex-col font-sans selection:bg-[#FDE047]">
      {/* Top Navigation Bar with DuoPair Live branding & modals triggers */}
      <Header
        user={currentUser}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onReset={handleExitSession}
      />

      {/* Main Focus Canvas: Maximum breathing room and zero clutter */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {activeSession && currentUser ? (
          /* Active Session View */
          <ActiveSession
            session={activeSession}
            currentUser={currentUser}
            onExit={handleExitSession}
            onUserUpdate={setCurrentUser}
          />
        ) : (
          /* Focus Mode Onboarding: Centered Wizard with generous whitespace */
          <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* Clean Hero Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF08A] border-2 border-black neo-shadow-sm">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                <span className="text-xs font-black uppercase tracking-wider">
                  DuoPair Live · Stranger Accountability
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black font-['Fredoka'] tracking-tight leading-[1.1]">
                Pair with a Partner. <br />
                <span className="bg-[#86EFAC] px-3 py-0.5 rounded-2xl border-3 border-black inline-block mt-2 neo-shadow">
                  Lock In & Deliver.
                </span>
              </h1>

              <p className="text-sm sm:text-base font-bold text-slate-700 max-w-lg mx-auto leading-relaxed pt-1">
                Matched instantly by study field and exact countdown duration.
                Zero excuses, real-time sync, and mutual momentum.
              </p>
            </div>

            {/* Central Uncluttered Onboarding Wizard */}
            <div className="w-full max-w-2xl mx-auto pt-2">
              <Wizard
                currentUser={currentUser}
                onUserUpdate={setCurrentUser}
                onSessionStarted={handleSessionStarted}
              />
            </div>
          </div>
        )}
      </main>

      {/* Sleek Horizontal Scrolling Live Ticker (De-cluttered from main view) */}
      <LiveTicker />

      {/* Clean Footer */}
      <footer className="w-full border-t-4 border-black bg-white py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="font-['Fredoka'] font-black text-base text-black">
              DuoPair <span className="text-[#F43F5E]">Live</span>
            </span>
            <span>· Gamified accountability by field of study</span>
          </div>

          <div className="flex items-center gap-3 text-black font-extrabold text-[11px] sm:text-xs">
            <span>FastAPI + MongoDB Engine</span>
            <span>·</span>
            <span>Live WebSockets</span>
            <span>·</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="underline underline-offset-2 hover:text-slate-800 cursor-pointer"
            >
              My Badges ({currentUser?.achievements?.filter((a) => a.unlocked).length || 0})
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal (Houses the Tactile Audio FX panel) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* User Profile Modal (Avatar Upload, Bio, History, Achievements) */}
      {currentUser && isProfileOpen && (
        <ProfileModal
          user={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onUpdateUser={setCurrentUser}
        />
      )}
    </div>
  );
}
