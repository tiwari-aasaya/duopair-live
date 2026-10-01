export type CommitmentTime = '15m' | '30m' | '1h' | '2h';

export type StudyField =
  | 'Computer Science'
  | 'Engineering'
  | 'Research'
  | 'Business'
  | 'High School'
  | 'General'
  | 'Writing & Arts'
  | 'Medicine & Bio';

export type MatchFilterCriteria = 'field' | 'timezone' | 'country' | 'all';

export interface StrangerFilters {
  primaryBasis: MatchFilterCriteria; // User can prioritize field, timezone, or country
  fieldOfStudy: StudyField | 'Any Field';
  timezone: string;
  country: string;
}

export interface CompletedSession {
  id: string;
  date: number;
  goal: string;
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  durationMinutes: number;
  partnerName: string;
  status: 'completed' | 'in_progress';
  wasPerfectFocus: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeEmoji: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number; // 0 - 100
  targetLabel: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarSeed: string;
  avatarUrl?: string;
  streak: number;
  totalPactsCompleted: number;
  totalFocusMinutes: number;
  completedSessions: CompletedSession[];
  achievements: Achievement[];
}

export interface MatchRequest {
  userId: string;
  name: string;
  goal: string;
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  strangerFilters?: StrangerFilters;
  timestamp: number;
}

export type NudgeType = 'zap' | 'flame' | 'coffee';

export interface Nudge {
  id: string;
  senderId: string;
  senderName: string;
  type: NudgeType;
  message: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActiveSession {
  id: string;
  studyField: StudyField;
  commitmentTime: CommitmentTime;
  totalDurationSeconds: number;
  remainingSeconds: number;
  startedAt: number;
  isRunning: boolean;
  strangerFilters?: StrangerFilters;
  userA: {
    id: string;
    name: string;
    goal: string;
    avatarSeed: string;
    avatarUrl?: string;
    country?: string;
    timezone?: string;
    completed: boolean;
    subTasks: SubTask[];
  };
  userB: {
    id: string;
    name: string;
    goal: string;
    avatarSeed: string;
    avatarUrl?: string;
    country?: string;
    timezone?: string;
    completed: boolean;
    subTasks: SubTask[];
  };
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
