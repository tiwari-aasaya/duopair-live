import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveSession as IActiveSession,
  ChatMessage,
  Nudge,
  User,
  SubTask,
} from '../../types';
import { api } from '../../services/api';
import { sounds } from '../../utils/audio';
import { NeoButton } from '../NeoButton';
import {
  Clock,
  Zap,
  Flame,
  Coffee,
  CheckCircle,
  Send,
  Sparkles,
  Trophy,
  ShieldAlert,
  ArrowRight,
  Plus,
  CheckSquare,
  Square,
  Play,
  Pause,
  Award,
} from 'lucide-react';

interface ActiveSessionProps {
  session: IActiveSession;
  currentUser: User;
  onExit: () => void;
  onUserUpdate?: (updated: User) => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  session: initialSession,
  currentUser,
  onExit,
  onUserUpdate,
}) => {
  const [session, setSession] = useState<IActiveSession>(initialSession);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialSession.remainingSeconds
  );
  const [isRunning, setIsRunning] = useState(initialSession.isRunning);
  const [hasBeenPaused, setHasBeenPaused] = useState(false);

  // Live Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys_1',
      senderId: 'system',
      senderName: 'DuoPair Live Engine',
      text: `⚡ DuoPair Live established in [${initialSession.studyField}]! Lock in until the timer reaches zero.`,
      timestamp: Date.now(),
      isSystem: true,
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Active Nudge Toast alert
  const [activeNudge, setActiveNudge] = useState<Nudge | null>(null);

  // Celebration state
  const [isCompleted, setIsCompleted] = useState(false);
  const [partnerCompleted, setPartnerCompleted] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  // Subtasks
  const [subTasks, setSubTasks] = useState<SubTask[]>([
    { id: 't1', text: 'Break down primary deliverable', completed: false },
    { id: 't2', text: 'Deep focus block without switching tabs', completed: false },
    { id: 't3', text: 'Review & mark goal complete', completed: false },
  ]);
  const [newSubTask, setNewSubTask] = useState('');

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Determine who is partner and who is current user
  const isUserA = session.userA.id === currentUser.id;
  const partner = isUserA ? session.userB : session.userA;
  const myData = isUserA ? session.userA : session.userB;

  // Real-time Countdown Timer effect
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          sounds.playCelebration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  // Real-time Listeners (Chat, Nudges, Partner status)
  useEffect(() => {
    const unsubChat = api.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
      sounds.playPop();
    });

    const unsubNudge = api.onNudge((nudge) => {
      if (nudge.senderId !== currentUser.id) {
        setActiveNudge(nudge);
        sounds.playZap();
        setTimeout(() => {
          setActiveNudge(null);
        }, 3500);
      }
    });

    const unsubPartnerDone = api.onPartnerCompleted((goal) => {
      setPartnerCompleted(true);
      sounds.playCelebration();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setMessages((prev) => [
        ...prev,
        {
          id: 'sys_' + Date.now(),
          senderId: 'system',
          senderName: 'DuoPair Live',
          text: `🎉 ${partner.name} just crushed their goal: "${goal}"!`,
          timestamp: Date.now(),
          isSystem: true,
        },
      ]);
    });

    return () => {
      unsubChat();
      unsubNudge();
      unsubPartnerDone();
    };
  }, [currentUser.id, partner.name]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const totalSeconds = session.totalDurationSeconds || 1800;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)
  );

  // Send Chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = api.sendMessage(session, currentUser, inputText);
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  // Send Motivation Nudge
  const handleSendNudge = (type: 'zap' | 'flame' | 'coffee') => {
    const nudge = api.sendNudge(currentUser, type);
    sounds.playZap();

    setMessages((prev) => [
      ...prev,
      {
        id: 'nudge_msg_' + Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: nudge.message,
        timestamp: Date.now(),
      },
    ]);
  };

  // Toggle pause
  const handleToggleTimer = () => {
    if (isRunning) {
      setHasBeenPaused(true);
    }
    setIsRunning(!isRunning);
  };

  // Task Complete Trigger
  const handleTaskComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    sounds.playCelebration();

    // Check if was perfect focus: no pauses, all subtasks checked
    const allTasksDone = subTasks.every((t) => t.completed);
    const wasPerfect = !hasBeenPaused && allTasksDone;

    // Explode Confetti!
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FDE047', '#86EFAC', '#F472B6', '#7DD3FC', '#000000'],
    });

    // Notify partner
    api.notifyPartnerCompleted(myData.goal);

    // Save session in user history and update achievements
    const oldAchievements = currentUser.achievements || [];
    const updatedUser = api.recordCompletedSession(currentUser, session, wasPerfect);

    // Detect newly unlocked badges
    const newlyUnlocked = (updatedUser.achievements || [])
      .filter((a) => a.unlocked && !oldAchievements.find((oa) => oa.id === a.id)?.unlocked)
      .map((a) => a.title);
    setUnlockedBadges(newlyUnlocked);

    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }

    setShowCelebrationModal(true);
  };

  // Toggle Subtask
  const toggleSubTask = (id: string) => {
    sounds.playClick();
    setSubTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add Subtask
  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTask.trim()) return;
    setSubTasks((prev) => [
      ...prev,
      { id: 'task_' + Date.now(), text: newSubTask.trim(), completed: false },
    ]);
    setNewSubTask('');
    sounds.playPop();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-6">
      {/* Toast Alert for incoming Nudges */}
      {activeNudge && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-[#FDE047] border-4 border-black px-6 py-3 rounded-2xl neo-shadow-lg flex items-center gap-3">
            <span className="text-2xl">
              {activeNudge.type === 'zap'
                ? '⚡'
                : activeNudge.type === 'flame'
                ? '🔥'
                : '☕'}
            </span>
            <div>
              <span className="text-xs font-black uppercase text-black block">
                {activeNudge.senderName} nudged you!
              </span>
              <span className="text-sm font-black text-black">
                {activeNudge.message}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Partner Header & Status */}
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-4 sm:p-6 neo-shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Partner & User Lockup */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex -space-x-3 items-center">
              <div className="w-12 h-12 rounded-2xl bg-[#86EFAC] border-3 border-black flex items-center justify-center font-black text-base neo-shadow-sm z-10 overflow-hidden">
                {currentUser.avatarUrl ? (
                  currentUser.avatarUrl.startsWith('data:') ? (
                    <img src={currentUser.avatarUrl} alt="Me" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.avatarUrl}</span>
                  )
                ) : (
                  <span>{currentUser.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F472B6] border-3 border-black flex items-center justify-center font-black text-base neo-shadow-sm">
                {partner.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase bg-[#7DD3FC] px-2 py-0.5 rounded-md border-2 border-black">
                  {session.studyField}
                </span>
                <span className="text-xs font-extrabold text-slate-700">
                  {session.commitmentTime} Block
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-black font-['Fredoka']">
                {currentUser.name} <span className="text-slate-400">×</span> {partner.name}
              </h2>
            </div>
          </div>

          {/* Partner Goal Preview Badge */}
          <div className="bg-white border-3 border-black rounded-2xl p-3 sm:px-4 neo-shadow-sm flex items-center gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-[#FED7AA] border-2 border-black flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                {partner.name}'s Goal
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-black truncate block">
                "{partner.goal}"
              </span>
            </div>
            {partnerCompleted && (
              <span className="shrink-0 bg-[#86EFAC] text-black text-[10px] font-black uppercase px-2 py-1 rounded-md border border-black">
                Crushed! 🎉
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Desktop 2-Column: Main Focus & Live Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: The Timer & Goal Tracker */}
        <div className="lg:col-span-7 space-y-6">
          {/* THE TIMER CARD */}
          <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-8 neo-shadow-lg text-center relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-white border-2 border-black px-3 py-1 rounded-xl neo-shadow-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black" />
                DuoPair Live Sync Timer
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleTimer}
                  className="px-3 py-1 bg-white border-2 border-black rounded-xl text-xs font-black flex items-center gap-1 hover:bg-slate-100 cursor-pointer neo-shadow-sm active:translate-y-0.5 active:shadow-none"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-black" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-black" /> Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Massive Digital Timer Display */}
            <div className="py-4 sm:py-6">
              <div
                className="font-mono text-6xl sm:text-8xl lg:text-9xl font-black text-black tracking-tight select-none tabular-nums drop-shadow-[4px_4px_0px_#86EFAC]"
                style={{ letterSpacing: '-0.04em' }}
              >
                {formatTime(remainingSeconds)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white border-3 border-black rounded-2xl h-5 p-0.5 neo-shadow-sm overflow-hidden mb-6">
              <div
                className="bg-[#86EFAC] h-full rounded-xl transition-all duration-1000 ease-linear border-r-2 border-black"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* My Current Goal Display */}
            <div className="bg-[#FEF08A] border-3 border-black rounded-2xl p-4 neo-shadow mb-6 text-left">
              <span className="text-[11px] font-black uppercase text-slate-700 block mb-0.5">
                Your Pledged Deliverable:
              </span>
              <p className="text-base sm:text-lg font-black text-black leading-snug">
                "{myData.goal}"
              </p>
            </div>

            {/* MOTIVATION NUDGES */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black uppercase text-black">
                  Instant Motivation Nudges
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Sends live vibration to {partner.name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
                <NeoButton
                  type="button"
                  variant="yellow"
                  size="md"
                  soundType="zap"
                  onClick={() => handleSendNudge('zap')}
                  leftIcon={<Zap className="w-5 h-5 text-black fill-black" />}
                  className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-black"
                >
                  Keep going!
                </NeoButton>

                <NeoButton
                  type="button"
                  variant="orange"
                  size="md"
                  soundType="zap"
                  onClick={() => handleSendNudge('flame')}
                  leftIcon={<Flame className="w-5 h-5 text-black fill-orange-500" />}
                  className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-black"
                >
                  On fire!
                </NeoButton>

                <NeoButton
                  type="button"
                  variant="sky"
                  size="md"
                  soundType="zap"
                  onClick={() => handleSendNudge('coffee')}
                  leftIcon={<Coffee className="w-5 h-5 text-black" />}
                  className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-black"
                >
                  Locked in!
                </NeoButton>
              </div>
            </div>

            {/* THE TASK COMPLETE BUTTON */}
            <div className="pt-2">
              <NeoButton
                type="button"
                variant={isCompleted ? 'white' : 'green'}
                size="massive"
                fullWidth
                disabled={isCompleted}
                soundType="none"
                onClick={handleTaskComplete}
                leftIcon={
                  isCompleted ? (
                    <CheckCircle className="w-7 h-7 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Trophy className="w-7 h-7 text-black fill-yellow-400" />
                  )
                }
                className="text-lg sm:text-2xl font-black py-5 sm:py-6 tracking-wide uppercase"
              >
                {isCompleted ? 'GOAL COMPLETED! 🎉' : 'I FINISHED MY GOAL! 🎯'}
              </NeoButton>
            </div>
          </div>

          {/* Subtasks Milestone Checklist */}
          <div className="bg-white border-4 border-black rounded-3xl p-5 sm:p-6 neo-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-black font-['Fredoka']">
                  Session Action Checklist
                </h3>
                <span className="text-[11px] font-bold text-slate-500">
                  Complete all items to qualify for the "Perfect Focus" achievement badge
                </span>
              </div>
              <span className="text-xs font-black bg-slate-100 px-2.5 py-1 rounded-lg border-2 border-black">
                {subTasks.filter((t) => t.completed).length}/{subTasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              {subTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleSubTask(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 border-black transition-all cursor-pointer ${
                    t.completed
                      ? 'bg-[#BBF7D0]/50 text-slate-500 line-through shadow-none translate-y-0.5'
                      : 'bg-white hover:bg-slate-50 shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  {t.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-black shrink-0" />
                  )}
                  <span className="text-sm font-bold text-black select-none truncate">
                    {t.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubTask} className="flex gap-2">
              <input
                type="text"
                value={newSubTask}
                onChange={(e) => setNewSubTask(e.target.value)}
                placeholder="Add a milestone step..."
                className="flex-1 bg-white border-2 border-black rounded-xl py-2 px-3 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black"
              />
              <NeoButton
                type="submit"
                variant="yellow"
                size="sm"
                className="shrink-0 px-4"
                leftIcon={<Plus className="w-4 h-4 text-black" />}
              >
                Add
              </NeoButton>
            </form>
          </div>
        </div>

        {/* RIGHT: Live Chat Interface */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl neo-shadow-lg flex flex-col h-[520px] sm:h-[620px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b-3 border-black bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F472B6] border-2 border-black flex items-center justify-center font-black text-xs">
                  {partner.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-black">
                      {partner.name}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    Live Channel ({session.studyField})
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-black uppercase bg-[#FEF08A] px-2 py-0.5 rounded border border-black">
                DuoPair Room
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAF9]">
              {messages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                if (m.isSystem) {
                  return (
                    <div
                      key={m.id}
                      className="p-2.5 bg-yellow-100 border-2 border-dashed border-black rounded-xl text-xs font-bold text-black text-center my-2"
                    >
                      {m.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 mb-0.5 px-1">
                      {isMe ? 'You' : m.senderName}
                    </span>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl border-2 border-black text-xs sm:text-sm font-bold leading-relaxed ${
                        isMe
                          ? 'bg-[#86EFAC] text-black shadow-[2px_2px_0px_0px_#000] rounded-tr-none'
                          : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Chat Shortcut Chips */}
            <div className="px-3 py-2 bg-white border-t-2 border-black flex gap-1.5 overflow-x-auto">
              {['💪 Crushing it!', '⏱️ Halfway mark', '🎧 Head down', '🔥 So fast!'].map(
                (quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => {
                      const msg = api.sendMessage(session, currentUser, quick);
                      setMessages((prev) => [...prev, msg]);
                    }}
                    className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-[#FDE047] border border-black rounded-lg text-[11px] font-extrabold cursor-pointer transition-colors"
                  >
                    {quick}
                  </button>
                )
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t-3 border-black bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${partner.name}...`}
                className="flex-1 bg-slate-50 border-2 border-black rounded-2xl py-2.5 px-3.5 text-xs sm:text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
              <NeoButton
                type="submit"
                variant="yellow"
                size="sm"
                className="h-10 px-4 shrink-0"
                rightIcon={<Send className="w-4 h-4 text-black" />}
              >
                Send
              </NeoButton>
            </form>
          </div>

          {/* DuoPair Live Accountability Code Badge */}
          <div className="mt-4 p-4 bg-white border-3 border-black rounded-2xl neo-shadow-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-700 leading-snug">
              <strong className="text-black">The DuoPair Code:</strong> Respecting the full focus window preserves your streak and updates your official session history.
            </p>
          </div>
        </div>
      </div>

      {/* VICTORY CELEBRATION MODAL */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-9 max-w-md w-full neo-shadow-xl text-center animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 rounded-2xl bg-[#86EFAC] border-4 border-black mx-auto flex items-center justify-center neo-shadow mb-4">
              <Trophy className="w-10 h-10 text-black fill-yellow-400 animate-bounce" />
            </div>

            <span className="text-xs font-black uppercase bg-[#FDE047] px-3 py-1 rounded-md border-2 border-black neo-shadow-sm">
              Session Fulfilled!
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-black font-['Fredoka'] mt-3 mb-2">
              Deliverable Crushed!
            </h2>
            <p className="text-sm font-bold text-slate-700 mb-5">
              You pledged "{myData.goal}" in {session.studyField} and completed it with {partner.name}!
            </p>

            {/* If badge unlocked */}
            {unlockedBadges.length > 0 && (
              <div className="mb-5 p-3 bg-[#FEF08A] border-2 border-black rounded-2xl text-left flex items-center gap-3 neo-shadow-sm">
                <Award className="w-6 h-6 text-black fill-yellow-500 shrink-0 animate-spin" />
                <div>
                  <span className="text-[10px] font-black uppercase text-black block">
                    Achievement Unlocked!
                  </span>
                  <span className="text-xs font-black text-black">
                    🏆 {unlockedBadges.join(', ')}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 bg-white border-3 border-black rounded-2xl p-4 neo-shadow mb-6 text-left">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Streak Boost
                </span>
                <span className="text-xl font-black text-black flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  {currentUser.streak + 1} Days
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Focus Added
                </span>
                <span className="text-xl font-black text-black">
                  +{Math.round(session.totalDurationSeconds / 60)} Min
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <NeoButton
                type="button"
                variant="green"
                size="lg"
                fullWidth
                onClick={() => {
                  setShowCelebrationModal(false);
                  onExit();
                }}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Start Another Match
              </NeoButton>

              <NeoButton
                type="button"
                variant="white"
                size="md"
                fullWidth
                onClick={() => setShowCelebrationModal(false)}
              >
                Stay in Room with Partner
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
