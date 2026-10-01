import React, { useState } from 'react';
import { NeoButton } from '../NeoButton';
import { ArrowRight, ArrowLeft, BookOpen, Check } from 'lucide-react';
import { StudyField } from '../../types';
import { sounds } from '../../utils/audio';

interface StudyFieldStepProps {
  initialField?: StudyField;
  onNext: (field: StudyField) => void;
  onBack: () => void;
}

interface FieldOption {
  field: StudyField;
  label: string;
  icon: string;
  desc: string;
  colorClass: string;
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    field: 'Computer Science',
    label: 'Computer Science',
    icon: '💻',
    desc: 'Algorithms, full-stack, DevOps, LeetCode',
    colorClass: 'bg-[#FEF08A] hover:bg-[#FDE047]',
  },
  {
    field: 'Engineering',
    label: 'Engineering',
    icon: '⚙️',
    desc: 'Mechanical, electrical, CAD, physics',
    colorClass: 'bg-[#86EFAC] hover:bg-[#4ADE80]',
  },
  {
    field: 'Research',
    label: 'Research',
    icon: '🔬',
    desc: 'Academic papers, thesis, literature review',
    colorClass: 'bg-[#7DD3FC] hover:bg-[#38BDF8]',
  },
  {
    field: 'Business',
    label: 'Business & Finance',
    icon: '📊',
    desc: 'Pitch decks, spreadsheets, strategy, ops',
    colorClass: 'bg-[#FED7AA] hover:bg-[#FDBA74]',
  },
  {
    field: 'Writing & Arts',
    label: 'Writing & Arts',
    icon: '🎨',
    desc: 'Design, drafting, essays, creative flow',
    colorClass: 'bg-[#F472B6] hover:bg-[#F9A8D4]',
  },
  {
    field: 'Medicine & Bio',
    label: 'Medicine & Bio',
    icon: '🧬',
    desc: 'Pre-med, anatomy, biochemistry, clinical',
    colorClass: 'bg-[#C084FC] hover:bg-[#A855F7]',
  },
  {
    field: 'High School',
    label: 'High School',
    icon: '🎒',
    desc: 'AP exams, SAT prep, assignments',
    colorClass: 'bg-[#BAE6FD] hover:bg-[#7DD3FC]',
  },
  {
    field: 'General',
    label: 'General Focus',
    icon: '🎯',
    desc: 'Inbox zero, personal habits, life admin',
    colorClass: 'bg-white hover:bg-slate-100',
  },
];

export const StudyFieldStep: React.FC<StudyFieldStepProps> = ({
  initialField = 'Computer Science',
  onNext,
  onBack,
}) => {
  const [selectedField, setSelectedField] = useState<StudyField>(initialField);

  const handleSelect = (field: StudyField) => {
    setSelectedField(field);
    sounds.playPop();
  };

  const handleContinue = () => {
    sounds.playClick();
    onNext(selectedField);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#FFFDF5] border-4 border-black rounded-3xl p-6 sm:p-8 neo-shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-wider bg-[#7DD3FC] border-2 border-black px-2.5 py-1 rounded-lg neo-shadow-sm">
            Step 4 of 6
          </span>
          <span className="text-xs font-extrabold text-slate-600">Focus Area</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight font-['Fredoka'] mb-2">
          What is your focus area?
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-6 leading-relaxed">
          DuoPair Live matches you with a partner in the exact same field, keeping your mindsets aligned.
        </p>

        {/* Grid of selectable Neo-Brutalist tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-7">
          {FIELD_OPTIONS.map((opt) => {
            const isSelected = selectedField === opt.field;
            return (
              <button
                key={opt.field}
                type="button"
                onClick={() => handleSelect(opt.field)}
                className={`
                  p-3.5 sm:p-4 rounded-2xl border-3 border-black text-left transition-all duration-100 select-none cursor-pointer
                  flex items-start gap-3
                  active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#000]
                  hover:-translate-y-0.5
                  ${opt.colorClass}
                  ${
                    isSelected
                      ? 'ring-3 ring-black shadow-[4px_4px_0px_0px_#000] translate-x-[1px] translate-y-[1px]'
                      : 'shadow-[3px_3px_0px_0px_#000]'
                  }
                `}
              >
                <span className="text-2xl sm:text-3xl shrink-0 p-1.5 bg-white rounded-xl border-2 border-black neo-shadow-sm">
                  {opt.icon}
                </span>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-black truncate">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 line-clamp-1 mt-0.5">
                    {opt.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-black">
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
            onClick={handleContinue}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Confirm Field & Next
          </NeoButton>
        </div>
      </div>
    </div>
  );
};
