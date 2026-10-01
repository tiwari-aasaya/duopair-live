import React, { useState, useRef } from 'react';
import { User, CompletedSession, Achievement } from '../../types';
import { api } from '../../services/api';
import { sounds } from '../../utils/audio';
import { NeoButton } from '../NeoButton';
import {
  X,
  Camera,
  Flame,
  Clock,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  Edit3,
  User as UserIcon,
} from 'lucide-react';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updated: User) => void;
}

const PRESET_AVATARS = [
  '⚡', '🦊', '🚀', '🦉', '🐱', '🧠', '☕', '🔥'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onClose,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'achievements'>('profile');
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || 'Crushing daily flow sessions on DuoPair Live. Focused on building and shipping!');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        sounds.playPop();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (emoji: string) => {
    setAvatarUrl(emoji);
    sounds.playPop();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const updated = api.updateUserProfile(user.id, {
      name: name.trim() || user.name,
      bio: bio.trim(),
      avatarUrl,
    });
    if (updated) {
      onUpdateUser(updated);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col neo-shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b-4 border-black bg-[#FEF08A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm">
              <UserIcon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black font-['Fredoka']">
                Account & Achievements
              </h2>
              <span className="text-[11px] font-bold text-slate-800">
                DuoPair Live ID: {user.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm hover:bg-slate-100 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Navigation Tabs (Neo-brutalist Segmented Tabs) */}
        <div className="p-3 bg-white border-b-3 border-black flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('profile');
            }}
            className={`flex-1 py-2 px-3 rounded-xl border-2 border-black text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#86EFAC] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            👤 Profile & Bio
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('achievements');
            }}
            className={`flex-1 py-2 px-3 rounded-xl border-2 border-black text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-[#F472B6] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🏆 Badges ({user.achievements?.filter((a) => a.unlocked).length || 0})
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('history');
            }}
            className={`flex-1 py-2 px-3 rounded-xl border-2 border-black text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#FED7AA] text-black shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            📜 History ({user.completedSessions?.length || 0})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Profile & Bio Editor */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Selector */}
              <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 neo-shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#BBF7D0] border-3 border-black flex items-center justify-center text-4xl neo-shadow overflow-hidden">
                    {avatarUrl ? (
                      avatarUrl.startsWith('data:') ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{avatarUrl}</span>
                      )
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border-2 border-black flex items-center justify-center neo-shadow-sm hover:bg-slate-100 active:translate-y-0.5 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-black" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-black uppercase text-slate-600 block mb-1.5">
                    Choose Avatar Emoji or Upload Image
                  </span>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mb-2">
                    {PRESET_AVATARS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => handleSelectPreset(emoji)}
                        className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center text-lg transition-all cursor-pointer ${
                          avatarUrl === emoji
                            ? 'bg-[#FEF08A] shadow-[2px_2px_0px_0px_#000] -translate-y-0.5'
                            : 'bg-white hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-black text-black underline underline-offset-2 hover:text-slate-700 cursor-pointer"
                  >
                    Upload Custom Picture
                  </button>
                </div>
              </div>

              {/* Name & Bio Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={28}
                    className="w-full bg-white border-3 border-black rounded-2xl py-3 px-4 text-sm font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#86EFAC] shadow-[2px_2px_0px_0px_#000]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1.5">
                    Short Bio (Visible to your accountability partner)
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={140}
                    placeholder="Tell your partners what you're working toward..."
                    className="w-full bg-white border-3 border-black rounded-2xl py-3 px-4 text-sm font-bold text-black focus:outline-none focus:ring-3 focus:ring-[#86EFAC] shadow-[2px_2px_0px_0px_#000] resize-none"
                  />
                  <div className="text-right text-[11px] font-bold text-slate-500 mt-1">
                    {bio.length}/140 characters
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FED7AA] border-3 border-black rounded-2xl p-3 text-center neo-shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">Streak</span>
                  <span className="text-xl font-black text-black flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-orange-600 fill-orange-500" />
                    {user.streak}d
                  </span>
                </div>

                <div className="bg-[#BBF7D0] border-3 border-black rounded-2xl p-3 text-center neo-shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">Pacts Done</span>
                  <span className="text-xl font-black text-black">
                    {user.totalPactsCompleted || 0}
                  </span>
                </div>

                <div className="bg-[#FEF08A] border-3 border-black rounded-2xl p-3 text-center neo-shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-800 block">Focus Mins</span>
                  <span className="text-xl font-black text-black">
                    {user.totalFocusMinutes || 0}m
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <NeoButton
                  type="submit"
                  variant="green"
                  size="md"
                  fullWidth
                  leftIcon={<Edit3 className="w-4 h-4 text-black" />}
                >
                  {isSaved ? 'Profile Updated! ✓' : 'Save Profile Changes'}
                </NeoButton>
              </div>
            </form>
          )}

          {/* TAB 2: Achievements & Badges System */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FDF2F8] border-2 border-dashed border-black rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-slate-900 block">
                    Accountability Trophies
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Earn badges by maintaining streaks, crushing field sessions, and achieving perfect focus.
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-black font-['Fredoka']">
                    {user.achievements?.filter((a) => a.unlocked).length || 0} / {user.achievements?.length || 6}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(user.achievements || []).map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-2xl border-3 border-black neo-shadow-sm transition-all ${
                      ach.unlocked
                        ? 'bg-white'
                        : 'bg-slate-100 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl shrink-0 neo-shadow-sm ${
                          ach.unlocked ? 'bg-[#FEF08A]' : 'bg-slate-200 grayscale'
                        }`}
                      >
                        {ach.badgeEmoji}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-black font-['Fredoka'] truncate">
                            {ach.title}
                          </h4>
                          {ach.unlocked && (
                            <span className="text-[10px] font-black uppercase bg-[#86EFAC] text-black px-1.5 py-0.5 rounded border border-black shrink-0">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 line-clamp-2 mt-0.5">
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-black text-slate-700 mb-1">
                        <span>Milestone Progress</span>
                        <span>{ach.targetLabel}</span>
                      </div>
                      <div className="w-full bg-slate-200 border border-black rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ach.unlocked ? 'bg-[#86EFAC]' : 'bg-[#F472B6]'
                          }`}
                          style={{ width: `${ach.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Completed Sessions History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-700">
                  Recent Completed Focus Blocks
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {user.completedSessions?.length || 0} Total Sessions Logged
                </span>
              </div>

              {(!user.completedSessions || user.completedSessions.length === 0) ? (
                <div className="p-8 text-center bg-white border-3 border-dashed border-black rounded-2xl">
                  <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-black text-black">No completed sessions yet.</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    Start your first DuoPair Live pact to build your history!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {user.completedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-white border-3 border-black rounded-2xl neo-shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase bg-[#86EFAC] px-2 py-0.5 rounded border border-black">
                            {session.studyField || 'General'}
                          </span>
                          <span className="text-xs font-black text-slate-600">
                            {session.commitmentTime} Block
                          </span>
                          {session.wasPerfectFocus && (
                            <span className="text-[10px] font-black uppercase bg-[#FDE047] px-1.5 py-0.5 rounded border border-black flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-black" />
                              Perfect Focus
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-black">
                          "{session.goal}"
                        </h4>
                        <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                          <span>Partner: {session.partnerName}</span>
                          <span>·</span>
                          <span>{formatDate(session.date)}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 inline-block">
                          +{session.durationMinutes} Mins Focus
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
