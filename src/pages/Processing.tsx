import React, { useEffect, useState } from 'react';

interface ProcessingProps {
  onComplete: () => void;
}

const SEQUENCE_STEPS = [
  { id: 'step_1', label: '20 RESPONSES RECEIVED', desc: 'Validating data integrity across all reported vectors' },
  { id: 'step_2', label: 'MAPPING YOUR CONCERN', desc: 'Synthesizing hairline, crown, and coverage distribution' },
  { id: 'step_3', label: 'STRUCTURING YOUR GOALS', desc: 'Aligning primary desired outcome and facial proportions' },
  { id: 'step_4', label: 'EVALUATING YOUR PRIORITIES', desc: 'Balancing personal motivation against progression rate' },
  { id: 'step_5', label: 'ANALYZING YOUR RESTORATION JOURNEY', desc: 'Reviewing past modalities and stated decision timeline' },
  { id: 'step_6', label: 'YOUR PERSONALIZED PROFILE READY', desc: 'Compiling deterministic trichological dossier' }
];

export const Processing: React.FC<ProcessingProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SEQUENCE_STEPS.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        setTimeout(onComplete, 600);
        return prev;
      });
    }, 700);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 sm:px-6 text-center py-16">
      <div className="w-full max-w-lg p-8 sm:p-12 bg-white rounded-3xl border border-[#E7E2DA] shadow-xs space-y-8">
        {/* Animated Sketch Icon */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <svg className="w-full h-full text-[#18534F]" viewBox="0 0 100 100" fill="none">
            {/* Pulsing outer ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#E7E2DA"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="animate-spin"
              style={{ animationDuration: '14s' }}
            />
            {/* Anatomical head silhouette */}
            <path
              d="M50 18 C32 18 24 38 24 58 C24 76 36 86 50 86 C64 86 76 76 76 58 C76 38 68 18 50 18 Z"
              stroke="#18534F"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Calibrated connecting points */}
            <circle cx="50" cy="34" r="3.5" fill="#18534F" />
            <circle cx="38" cy="46" r="3" fill="#18534F" />
            <circle cx="62" cy="46" r="3" fill="#18534F" />
            <circle cx="50" cy="58" r="3.5" fill="#C5A880" />
            <line x1="50" y1="34" x2="38" y2="46" stroke="#18534F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="50" y1="34" x2="62" y2="46" stroke="#18534F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="38" y1="46" x2="50" y2="58" stroke="#18534F" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="62" y1="46" x2="50" y2="58" stroke="#18534F" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#18534F] font-bold block">
            DETERMINISTIC PROFILE SYNTHESIS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23] font-normal">
            Your answers are being brought together
          </h2>
          <p className="text-xs text-[#635C52] max-w-sm mx-auto leading-relaxed">
            We're connecting the patterns across your answers to create your personal hair profile.
          </p>
        </div>

        {/* Structured Sequence Flow (§37) */}
        <div className="space-y-2 pt-2 text-left">
          {SEQUENCE_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                  isCurrent
                    ? 'bg-[#F7FAF9] border-[#18534F] shadow-xs'
                    : isDone
                    ? 'bg-white border-[#E7E2DA] opacity-80'
                    : 'bg-white/40 border-transparent opacity-40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono text-[10px] font-bold ${
                      isDone
                        ? 'bg-[#18534F] text-white'
                        : isCurrent
                        ? 'border-2 border-[#18534F] text-[#18534F] bg-white animate-pulse'
                        : 'border border-[#CDC5B8] text-[#8E877E]'
                    }`}
                  >
                    {isDone ? '✓' : `0${idx + 1}`}
                  </div>
                  <div>
                    <span className={`font-mono text-[11px] block ${isCurrent ? 'text-[#18534F] font-bold' : 'text-[#1B1F23]'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-[#8E877E] leading-tight block">
                      {step.desc}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold px-2 py-0.5 bg-[#E8F3EE] rounded">
                    Processing
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
