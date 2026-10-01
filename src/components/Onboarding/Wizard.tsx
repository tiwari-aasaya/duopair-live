import React, { useState } from 'react';
import { OnboardingStep, User, CommitmentTime, StudyField, ActiveSession, StrangerFilters } from '../../types';
import { AuthStep } from './AuthStep';
import { NameStep } from './NameStep';
import { GoalStep } from './GoalStep';
import { StudyFieldStep } from './StudyFieldStep';
import { CommitmentStep } from './CommitmentStep';
import { PartnerModeStep } from './PartnerModeStep';
import { StrangerFilterStep } from './StrangerFilterStep';
import { MatchmakerStep } from './MatchmakerStep';
import { api, INITIAL_ACHIEVEMENTS, INITIAL_HISTORY } from '../../services/api';
import { sounds } from '../../utils/audio';

interface WizardProps {
  onSessionStarted: (session: ActiveSession) => void;
  currentUser: User | null;
  onUserUpdate: (user: User) => void;
}

export const Wizard: React.FC<WizardProps> = ({
  onSessionStarted,
  currentUser,
  onUserUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(currentUser ? 3 : 1);
  const [partnerName, setPartnerName] = useState(currentUser?.name || 'Alex K.');
  const [sessionGoal, setSessionGoal] = useState('');
  const [studyField, setStudyField] = useState<StudyField>('Computer Science');
  const [chosenTime, setChosenTime] = useState<CommitmentTime>('30m');
  const [strangerFilters, setStrangerFilters] = useState<StrangerFilters>({
    primaryBasis: 'field',
    fieldOfStudy: 'Computer Science',
    timezone: 'Same Timezone (Local ±1 hr)',
    country: 'Worldwide / Anywhere 🌐',
  });

  // Step 1: Auth complete
  const handleAuthSuccess = (user: User) => {
    onUserUpdate(user);
    setPartnerName(user.name);
    api.saveUser(user);
    sounds.playPop();
    setCurrentStep(2);
  };

  // Step 2: Name set
  const handleNameNext = (name: string) => {
    setPartnerName(name);
    if (currentUser) {
      const updated = { ...currentUser, name };
      onUserUpdate(updated);
      api.saveUser(updated);
    }
    sounds.playPop();
    setCurrentStep(3);
  };

  // Step 3: Goal set
  const handleGoalNext = (goal: string) => {
    setSessionGoal(goal);
    sounds.playPop();
    setCurrentStep(4);
  };

  // Step 4: Study Field set
  const handleFieldNext = (field: StudyField) => {
    setStudyField(field);
    setStrangerFilters((prev) => ({ ...prev, fieldOfStudy: field }));
    sounds.playPop();
    setCurrentStep(5);
  };

  // Step 5: Time chosen -> advance to Partner Mode selection
  const handleTimeSelect = (time: CommitmentTime) => {
    setChosenTime(time);
    sounds.playPop();
    setCurrentStep(6);
  };

  // Step 6 Option A: Play with Stranger -> advance to Stranger Filters (Step 7)
  const handleSelectStranger = () => {
    setCurrentStep(7);
  };

  // Step 6 Option B: Play with Companion -> launch immediately without waiting
  const handleSelectCompanion = () => {
    sounds.playMatchFound();
    const session = api.createCompanionMatch(activeUser, sessionGoal, studyField, chosenTime);
    onSessionStarted(session);
  };

  // Step 7: Stranger Filters confirmed -> advance to Matchmaker Queue (Step 8)
  const handleConfirmStrangerFilters = (filters: StrangerFilters) => {
    setStrangerFilters(filters);
    setCurrentStep(8);
  };

  // Step 8: Matched with live stranger!
  const handleMatched = (session: ActiveSession) => {
    onSessionStarted(session);
  };

  // Step 8 Cancel -> back to stranger filters
  const handleCancelMatch = () => {
    sounds.playClick();
    setCurrentStep(7);
  };

  // Active user object to pass forward
  const activeUser: User = currentUser || {
    id: 'usr_guest',
    email: 'guest@duopair.live',
    name: partnerName || 'Crusher',
    avatarSeed: 'seed_crusher',
    streak: 3,
    totalPactsCompleted: 8,
    totalFocusMinutes: 240,
    completedSessions: INITIAL_HISTORY,
    achievements: INITIAL_ACHIEVEMENTS,
  };

  return (
    <div className="w-full py-2 sm:py-4">
      {/* Wizard Progress Stepper */}
      <div className="max-w-md mx-auto mb-6 px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-black -translate-y-1/2 z-0" />
          {[1, 2, 3, 4, 5, 6].map((stepNum) => {
            const isDone = currentStep > stepNum;
            const isCurrent =
              currentStep === stepNum ||
              (stepNum === 6 && (currentStep === 6 || currentStep === 7 || currentStep === 8));
            return (
              <div
                key={stepNum}
                className={`relative z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-3 border-black flex items-center justify-center font-black text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#FDE047] text-black scale-110 shadow-[2px_2px_0px_0px_#000]'
                    : isDone
                    ? 'bg-[#86EFAC] text-black shadow-[1px_1px_0px_0px_#000]'
                    : 'bg-white text-slate-400'
                }`}
              >
                {stepNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Current Step */}
      <div className="px-2 sm:px-4">
        {currentStep === 1 && <AuthStep onSuccess={handleAuthSuccess} />}

        {currentStep === 2 && (
          <NameStep
            initialName={partnerName}
            onNext={handleNameNext}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <GoalStep
            initialGoal={sessionGoal}
            onNext={handleGoalNext}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <StudyFieldStep
            initialField={studyField}
            onNext={handleFieldNext}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 5 && (
          <CommitmentStep
            onSelect={handleTimeSelect}
            onBack={() => setCurrentStep(4)}
          />
        )}

        {currentStep === 6 && (
          <PartnerModeStep
            studyField={studyField}
            commitmentTime={chosenTime}
            onSelectStranger={handleSelectStranger}
            onSelectCompanion={handleSelectCompanion}
            onBack={() => setCurrentStep(5)}
          />
        )}

        {currentStep === 7 && (
          <StrangerFilterStep
            initialStudyField={studyField}
            commitmentTime={chosenTime}
            onConfirm={handleConfirmStrangerFilters}
            onBack={() => setCurrentStep(6)}
          />
        )}

        {currentStep === 8 && (
          <MatchmakerStep
            user={activeUser}
            goal={sessionGoal}
            studyField={studyField}
            commitmentTime={chosenTime}
            strangerFilters={strangerFilters}
            onMatched={handleMatched}
            onCancel={handleCancelMatch}
          />
        )}
      </div>
    </div>
  );
};
