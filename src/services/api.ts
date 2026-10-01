import {
  ActiveSession,
  ChatMessage,
  CommitmentTime,
  CompletedSession,
  Achievement,
  Nudge,
  StudyField,
  StrangerFilters,
  User,
} from '../types';

const USERS_KEY = 'duopair_current_user';
const SESSIONS_KEY = 'duopair_active_session';
const QUEUE_KEY = 'duopair_match_queue';

interface QueueItem {
  userId: string;
  name: string;
  goal: string;
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  strangerFilters?: StrangerFilters;
  country?: string;
  timezone?: string;
  timestamp: number;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_spark',
    title: 'First Spark',
    description: 'Complete your 1st live focus session with a partner.',
    badgeEmoji: '⚡',
    unlocked: true,
    unlockedAt: Date.now() - 86400000 * 2,
    progress: 100,
    targetLabel: '1/1 Session',
  },
  {
    id: 'five_sessions',
    title: '5 Sessions Master',
    description: 'Crush 5 total sessions on DuoPair Live.',
    badgeEmoji: '🏆',
    unlocked: false,
    progress: 60,
    targetLabel: '3/5 Sessions',
  },
  {
    id: 'streak_igniter',
    title: 'Streak Igniter',
    description: 'Maintain a 3-day continuous accountability streak.',
    badgeEmoji: '🔥',
    unlocked: true,
    unlockedAt: Date.now() - 86400000,
    progress: 100,
    targetLabel: '3/3 Days',
  },
  {
    id: 'perfect_focus',
    title: 'Perfect Focus',
    description: 'Finish a full focus block with no pause and all subtasks completed.',
    badgeEmoji: '🎯',
    unlocked: false,
    progress: 0,
    targetLabel: '1 Perfect Session',
  },
  {
    id: 'field_specialist',
    title: 'Field Specialist',
    description: 'Complete 3 sessions in your focused field of study.',
    badgeEmoji: '🧠',
    unlocked: false,
    progress: 66,
    targetLabel: '2/3 Field Sessions',
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Log 100+ minutes of deep partner focus time.',
    badgeEmoji: '⏱️',
    unlocked: true,
    unlockedAt: Date.now() - 86400000,
    progress: 100,
    targetLabel: '120/100 Mins',
  },
];

export const INITIAL_HISTORY: CompletedSession[] = [
  {
    id: 'hist_1',
    date: Date.now() - 86400000 * 1.5,
    goal: 'Ship authentication refactor & clean lint',
    studyField: 'Computer Science',
    commitmentTime: '30m',
    durationMinutes: 30,
    partnerName: 'Maya Thorne',
    status: 'completed',
    wasPerfectFocus: true,
  },
  {
    id: 'hist_2',
    date: Date.now() - 86400000 * 2.8,
    goal: 'Draft 5 slides of pitch deck financials',
    studyField: 'Business',
    commitmentTime: '15m',
    durationMinutes: 15,
    partnerName: 'Liam Zhao',
    status: 'completed',
    wasPerfectFocus: false,
  },
  {
    id: 'hist_3',
    date: Date.now() - 86400000 * 4,
    goal: 'Calculus derivatives problem set 4',
    studyField: 'Engineering',
    commitmentTime: '1h',
    durationMinutes: 60,
    partnerName: 'Sarah Jenkins',
    status: 'completed',
    wasPerfectFocus: true,
  },
];

// Convert commitment string to total seconds
export const getTimeInSeconds = (time: CommitmentTime): number => {
  switch (time) {
    case '15m':
      return 15 * 60;
    case '30m':
      return 30 * 60;
    case '1h':
      return 60 * 60;
    case '2h':
      return 120 * 60;
    default:
      return 30 * 60;
  }
};

const COMPANION_BOTS = [
  { name: 'Alex Rivera', goal: 'Build DuoPair Live matching service', seed: 'alex', field: 'Computer Science' as StudyField },
  { name: 'Chloe Chen', goal: 'Review Organic Chemistry Chapter 8', seed: 'chloe', field: 'Medicine & Bio' as StudyField },
  { name: 'Marcus Brody', goal: 'Calculate FEA load stress analysis', seed: 'marcus', field: 'Engineering' as StudyField },
  { name: 'Priya Sharma', goal: 'Write market research executive summary', seed: 'priya', field: 'Business' as StudyField },
  { name: 'Sam Thorne', goal: 'Prepare AP Calculus integration notes', seed: 'sam', field: 'High School' as StudyField },
  { name: 'Elena Rostova', goal: 'Draft peer-reviewed journal abstract', seed: 'elena', field: 'Research' as StudyField },
];

class SessionService {
  private channel: BroadcastChannel | null = null;
  private messageListeners: ((msg: ChatMessage) => void)[] = [];
  private nudgeListeners: ((nudge: Nudge) => void)[] = [];
  private sessionListeners: ((session: ActiveSession) => void)[] = [];
  private partnerCompleteListeners: ((goal: string) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('duopair_realtime_network');
      this.channel.onmessage = (event) => {
        this.handleBroadcastMessage(event.data);
      };
    }
  }

  private handleBroadcastMessage(data: { type: string; payload: unknown }) {
    if (!data) return;

    if (data.type === 'CHAT_MESSAGE') {
      const msg = data.payload as ChatMessage;
      this.messageListeners.forEach((l) => l(msg));
    } else if (data.type === 'NUDGE') {
      const nudge = data.payload as Nudge;
      this.nudgeListeners.forEach((l) => l(nudge));
    } else if (data.type === 'SESSION_UPDATE') {
      const session = data.payload as ActiveSession;
      this.sessionListeners.forEach((l) => l(session));
    } else if (data.type === 'PARTNER_COMPLETED') {
      const { goal } = data.payload as { goal: string };
      this.partnerCompleteListeners.forEach((l) => l(goal));
    }
  }

  // --- Auth & User Profile ---
  public getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      if (!u.achievements) u.achievements = INITIAL_ACHIEVEMENTS;
      if (!u.completedSessions) u.completedSessions = INITIAL_HISTORY;
      return u;
    } catch {
      return null;
    }
  }

  public saveUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(user));
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl'>>
  ): User | null {
    const current = this.getCurrentUser();
    if (!current || current.id !== userId) return null;
    const updated = { ...current, ...updates };
    this.saveUser(updated);
    return updated;
  }

  public recordCompletedSession(
    user: User,
    session: ActiveSession,
    wasPerfectFocus: boolean
  ): User {
    const durationMins = Math.round(session.totalDurationSeconds / 60);
    const partner = session.userA.id === user.id ? session.userB : session.userA;

    const newRecord: CompletedSession = {
      id: 'session_' + Date.now(),
      date: Date.now(),
      goal: session.userA.id === user.id ? session.userA.goal : session.userB.goal,
      studyField: session.studyField,
      commitmentTime: session.commitmentTime,
      durationMinutes: durationMins,
      partnerName: partner.name,
      status: 'completed',
      wasPerfectFocus,
    };

    const newHistory = [newRecord, ...(user.completedSessions || [])];
    const newTotalPacts = (user.totalPactsCompleted || 0) + 1;
    const newTotalMins = (user.totalFocusMinutes || 0) + durationMins;
    const newStreak = user.streak + 1;

    // Evaluate Achievements
    const updatedAchievements = (user.achievements || INITIAL_ACHIEVEMENTS).map((ach) => {
      if (ach.id === 'first_spark') {
        return { ...ach, unlocked: true, progress: 100, targetLabel: '1/1 Session' };
      }
      if (ach.id === 'five_sessions') {
        const prog = Math.min(100, Math.round((newTotalPacts / 5) * 100));
        return {
          ...ach,
          progress: prog,
          unlocked: newTotalPacts >= 5,
          unlockedAt: newTotalPacts >= 5 && !ach.unlocked ? Date.now() : ach.unlockedAt,
          targetLabel: `${newTotalPacts}/5 Sessions`,
        };
      }
      if (ach.id === 'streak_igniter') {
        const prog = Math.min(100, Math.round((newStreak / 3) * 100));
        return {
          ...ach,
          progress: prog,
          unlocked: newStreak >= 3,
          unlockedAt: newStreak >= 3 && !ach.unlocked ? Date.now() : ach.unlockedAt,
          targetLabel: `${newStreak}/3 Days`,
        };
      }
      if (ach.id === 'perfect_focus') {
        if (wasPerfectFocus || ach.unlocked) {
          return {
            ...ach,
            unlocked: true,
            progress: 100,
            unlockedAt: ach.unlockedAt || Date.now(),
            targetLabel: 'Perfect Session Achieved!',
          };
        }
        return ach;
      }
      if (ach.id === 'century_club') {
        const prog = Math.min(100, Math.round((newTotalMins / 100) * 100));
        return {
          ...ach,
          progress: prog,
          unlocked: newTotalMins >= 100,
          unlockedAt: newTotalMins >= 100 && !ach.unlocked ? Date.now() : ach.unlockedAt,
          targetLabel: `${newTotalMins}/100 Mins`,
        };
      }
      return ach;
    });

    const updatedUser: User = {
      ...user,
      streak: newStreak,
      totalPactsCompleted: newTotalPacts,
      totalFocusMinutes: newTotalMins,
      completedSessions: newHistory,
      achievements: updatedAchievements,
    };

    this.saveUser(updatedUser);
    return updatedUser;
  }

  // --- Matchmaking with Field, Timezone, and Country Criteria ---
  public async joinQueue(
    user: User,
    goal: string,
    studyField: StudyField,
    time: CommitmentTime,
    strangerFilters?: StrangerFilters
  ): Promise<QueueItem> {
    const item: QueueItem = {
      userId: user.id,
      name: user.name,
      goal,
      studyField,
      commitmentTime: time,
      strangerFilters,
      country: strangerFilters?.country || 'Worldwide',
      timezone: strangerFilters?.timezone || 'Local',
      timestamp: Date.now(),
    };

    const currentQueue: QueueItem[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    const freshQueue = currentQueue.filter(
      (q) => q.userId !== user.id && Date.now() - q.timestamp < 120000
    );
    freshQueue.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(freshQueue));

    return item;
  }

  public async pollMatch(
    currentUserId: string,
    targetTime: CommitmentTime,
    targetField: StudyField,
    strangerFilters?: StrangerFilters,
    allowFallbackSameTime: boolean = false, // > 15s: same time, any field/country/timezone
    allowClosestTime: boolean = false       // > 30s: closest time
  ): Promise<ActiveSession | null> {
    const existing = this.getActiveSession();
    if (
      existing &&
      (existing.userA.id === currentUserId || existing.userB.id === currentUserId)
    ) {
      return existing;
    }

    const currentQueue: QueueItem[] = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    const myEntry = currentQueue.find((q) => q.userId === currentUserId);
    if (!myEntry) return null;

    // 1. Strict Match based on chosen primary filter
    let matchCandidate: QueueItem | null = null;
    const basis = strangerFilters?.primaryBasis || 'field';

    if (basis === 'country' && strangerFilters?.country && !strangerFilters.country.includes('Worldwide')) {
      matchCandidate =
        currentQueue.find(
          (q) =>
            q.userId !== currentUserId &&
            q.commitmentTime === targetTime &&
            (q.country === strangerFilters.country || q.strangerFilters?.country === strangerFilters.country)
        ) || null;
    } else if (basis === 'timezone' && strangerFilters?.timezone && !strangerFilters.timezone.includes('Worldwide')) {
      matchCandidate =
        currentQueue.find(
          (q) =>
            q.userId !== currentUserId &&
            q.commitmentTime === targetTime &&
            (q.timezone === strangerFilters.timezone || q.strangerFilters?.timezone === strangerFilters.timezone)
        ) || null;
    } else {
      // Default / Field Basis
      const fieldTarget = strangerFilters?.fieldOfStudy === 'Any Field' ? null : (strangerFilters?.fieldOfStudy || targetField);
      matchCandidate =
        currentQueue.find(
          (q) =>
            q.userId !== currentUserId &&
            q.commitmentTime === targetTime &&
            (!fieldTarget || q.studyField === fieldTarget)
        ) || null;
    }

    // 2. Fallback A (> 15s): Match SAME commitment_time regardless of study_field, country, or timezone
    if (!matchCandidate && allowFallbackSameTime) {
      matchCandidate =
        currentQueue.find(
          (q) => q.userId !== currentUserId && q.commitmentTime === targetTime
        ) || null;
    }

    // 3. Fallback B (> 30s): Match closest available commitment_time
    if (!matchCandidate && allowClosestTime) {
      matchCandidate = currentQueue.find((q) => q.userId !== currentUserId) || null;
    }

    if (matchCandidate) {
      const durationSeconds = getTimeInSeconds(myEntry.commitmentTime);
      const session: ActiveSession = {
        id: 'session_' + Math.random().toString(36).substring(2, 9),
        studyField: myEntry.studyField,
        commitmentTime: myEntry.commitmentTime,
        totalDurationSeconds: durationSeconds,
        remainingSeconds: durationSeconds,
        startedAt: Date.now(),
        isRunning: true,
        strangerFilters,
        userA: {
          id: myEntry.userId,
          name: myEntry.name,
          goal: myEntry.goal,
          avatarSeed: myEntry.name.toLowerCase().replace(/\s+/g, ''),
          avatarUrl: undefined,
          country: strangerFilters?.country,
          timezone: strangerFilters?.timezone,
          completed: false,
          subTasks: [],
        },
        userB: {
          id: matchCandidate.userId,
          name: matchCandidate.name,
          goal: matchCandidate.goal,
          avatarSeed: matchCandidate.name.toLowerCase().replace(/\s+/g, ''),
          avatarUrl: undefined,
          country: matchCandidate.country,
          timezone: matchCandidate.timezone,
          completed: false,
          subTasks: [],
        },
      };

      const updatedQueue = currentQueue.filter(
        (q) => q.userId !== myEntry.userId && q.userId !== matchCandidate!.userId
      );
      localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(session));

      if (this.channel) {
        this.channel.postMessage({ type: 'SESSION_UPDATE', payload: session });
      }

      return session;
    }

    return null;
  }

  // Create immediate companion match
  public createCompanionMatch(
    user: User,
    goal: string,
    studyField: StudyField,
    time: CommitmentTime
  ): ActiveSession {
    // Prefer matching a bot with the same study field
    const fieldBot =
      COMPANION_BOTS.find((b) => b.field === studyField) ||
      COMPANION_BOTS[Math.floor(Math.random() * COMPANION_BOTS.length)];
    const durationSeconds = getTimeInSeconds(time);

    const session: ActiveSession = {
      id: 'session_' + Math.random().toString(36).substring(2, 9),
      studyField,
      commitmentTime: time,
      totalDurationSeconds: durationSeconds,
      remainingSeconds: durationSeconds,
      startedAt: Date.now(),
      isRunning: true,
      userA: {
        id: user.id,
        name: user.name,
        goal: goal,
        avatarSeed: user.name.toLowerCase().replace(/\s+/g, ''),
        avatarUrl: user.avatarUrl,
        completed: false,
        subTasks: [
          { id: '1', text: 'Break down deliverable roadmap', completed: true },
          { id: '2', text: 'Lock in deep work flow without switching tabs', completed: false },
          { id: '3', text: 'Polish milestone and verify checklist', completed: false },
        ],
      },
      userB: {
        id: 'bot_' + Math.random().toString(36).substring(2, 6),
        name: fieldBot.name,
        goal: fieldBot.goal,
        avatarSeed: fieldBot.seed,
        completed: false,
        subTasks: [
          { id: 'b1', text: 'Set up working environment', completed: true },
          { id: 'b2', text: 'Active study and focus sprint', completed: false },
        ],
      },
    };

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(session));
    return session;
  }

  // --- Active Session Management ---
  public getActiveSession(): ActiveSession | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public updateActiveSession(session: ActiveSession): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(session));
    if (this.channel) {
      this.channel.postMessage({ type: 'SESSION_UPDATE', payload: session });
    }
  }

  public clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSIONS_KEY);
  }

  // --- Real-time Chat & Nudges ---
  public sendMessage(session: ActiveSession, sender: User, text: string): ChatMessage {
    const msg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      senderId: sender.id,
      senderName: sender.name,
      text: text.trim(),
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage({ type: 'CHAT_MESSAGE', payload: msg });
    }

    return msg;
  }

  public sendNudge(sender: User, type: 'zap' | 'flame' | 'coffee'): Nudge {
    const messages = {
      zap: '⚡ Keep going! You got this!',
      flame: "🔥 You're on fire! Keep the momentum!",
      coffee: '☕ Stay locked in! Deep focus mode!',
    };

    const nudge: Nudge = {
      id: 'nudge_' + Date.now(),
      senderId: sender.id,
      senderName: sender.name,
      type,
      message: messages[type],
      timestamp: Date.now(),
    };

    if (this.channel) {
      this.channel.postMessage({ type: 'NUDGE', payload: nudge });
    }

    return nudge;
  }

  public notifyPartnerCompleted(goal: string): void {
    if (this.channel) {
      this.channel.postMessage({ type: 'PARTNER_COMPLETED', payload: { goal } });
    }
  }

  // Listeners
  public onMessage(callback: (msg: ChatMessage) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter((l) => l !== callback);
    };
  }

  public onNudge(callback: (nudge: Nudge) => void) {
    this.nudgeListeners.push(callback);
    return () => {
      this.nudgeListeners = this.nudgeListeners.filter((l) => l !== callback);
    };
  }

  public onSessionUpdate(callback: (session: ActiveSession) => void) {
    this.sessionListeners.push(callback);
    return () => {
      this.sessionListeners = this.sessionListeners.filter((l) => l !== callback);
    };
  }

  public onPartnerCompleted(callback: (goal: string) => void) {
    this.partnerCompleteListeners.push(callback);
    return () => {
      this.partnerCompleteListeners = this.partnerCompleteListeners.filter((l) => l !== callback);
    };
  }
}

export const api = new SessionService();
