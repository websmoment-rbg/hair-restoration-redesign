import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS } from '../engine/engineCore';
import { trackEvent } from '../analytics/events';
import {
  HairlinePortraitVisual,
  ScalpDensityVisual,
  StrandCaliberVisual,
  SheddingMagnifierVisual,
  ContextIconVisual,
  DurationMilestoneVisual,
  FamilyPedigreeVisual,
  TrajectoryGraphVisual,
  DecisionStageVisual
} from '../components/AssessmentVisuals';

interface AssessmentProps {
  initialAnswers?: Record<string, any>;
  onComplete: (answers: Record<string, any>) => void;
  onBackToStart?: () => void;
  onCancel?: () => void;
}

const STORAGE_KEY = 'atelier_assessment_answers_v1';

export const Assessment: React.FC<AssessmentProps> = ({
  initialAnswers = {},
  onComplete,
  onBackToStart
}) => {
  // Session storage recovery so refresh never loses progress
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialAnswers, ...parsed };
      }
    } catch (e) {
      // ignore
    }
    return initialAnswers;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQ = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const currentAnswer = answers[currentQ.id];

  // Save to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      // ignore
    }
  }, [answers]);

  // Reset error on question change & scroll up & clear pending auto-advance
  useEffect(() => {
    setValidationError(null);
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation (1–5 keys, Enter, ArrowLeft)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'Enter') {
        handleContinue();
      } else if (['1', '2', '3', '4', '5'].includes(e.key) && currentQ.type === 'scale5') {
        handleSelectValue(Number(e.key));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentAnswer, answers]);

  const advanceNextQuestion = (nextAnswers: Record<string, any>) => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Final submission
      trackEvent('assessment_completed');
      try {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem('atelier_active_discovery', '1');
      } catch (e) {
        // ignore
      }
      onComplete(nextAnswers);
    }
  };

  const handleSelectValue = (val: any) => {
    setValidationError(null);
    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);

    trackEvent('assessment_question_answered', {
      metadata: { questionId: currentQ.id, index: currentIndex + 1 }
    });

    // Automatically transition to the next question upon selection
    // For Q13 (multi-step modalities), we allow the user to select approaches or click Continue
    if (currentQ.id !== 'Q13') {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        advanceNextQuestion(updated);
      }, 350);
    }
  };

  const handlePrevious = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (onBackToStart) {
      onBackToStart();
    }
  };

  const handleContinue = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    setValidationError(null);

    let val = answers[currentQ.id];
    // If not explicitly selected yet, resolve with sensible question default so user is never blocked
    if (val === undefined || val === null) {
      if (currentQ.id === 'Q20') val = 4;
      else if (currentQ.id === 'Q19') val = '3_6m';
      else if (currentQ.id === 'Q18') val = 'natural_hairline';
      else if (currentQ.id === 'Q17') val = 3;
      else if (currentQ.id === 'Q16') val = 3;
      else if (currentQ.id === 'Q15') val = 3;
      else if (currentQ.id === 'Q14') val = 'restore_hairline';
      else if (currentQ.id === 'Q13') val = { level: 2, approaches: ['supplements'] };
      else if (currentQ.id === 'Q9') val = 'front_hairline';
      else if (currentQ.options && currentQ.options[0]) {
        val = currentQ.options[0].value ?? currentQ.options[0].key;
      } else {
        val = 3;
      }
    }

    const updated = { ...answers, [currentQ.id]: val };
    setAnswers(updated);
    advanceNextQuestion(updated);
  };

  // --------------------------------------------------------------------------
  // QUESTION-SPECIFIC INTERACTIVE CONTENT RENDERERS
  // Matching "Hair Restoration Assessment UI Grid.png"
  // --------------------------------------------------------------------------
  const renderVisualAnswers = () => {
    // Q1, Q2, Q3: High-Resolution Hairline Portrait Avatars (Card 01, 02, 03)
    if (currentQ.id === 'Q1' || currentQ.id === 'Q2' || currentQ.id === 'Q3') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <HairlinePortraitVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#8E877E] hidden md:block max-w-[90px] leading-tight mt-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Connected horizontal track with numbers 1 - 5 */}
          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = currentAnswer === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q4, Q5: Photorealistic Clinical Scalp Trichoscopy Images (Card 04 & 05)
    if (currentQ.id === 'Q4' || currentQ.id === 'Q5') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <ScalpDensityVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#8E877E] hidden md:block max-w-[90px] leading-tight mt-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Connected horizontal track */}
          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = currentAnswer === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q6: Arched Oval Lenses with Tapered Hair Strand Caliber (Card 06)
    if (currentQ.id === 'Q6') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <StrandCaliberVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#8E877E] hidden md:block max-w-[90px] leading-tight mt-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = currentAnswer === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q7: Circular Magnifying Lenses with Shedding Follicles (Card 07)
    if (currentQ.id === 'Q7') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <SheddingMagnifierVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#8E877E] hidden md:block max-w-[90px] leading-tight mt-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = currentAnswer === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q8: WHERE YOU NOTICE IT — Interactive Scalp Map (Card 08)
    if (currentQ.id === 'Q8') {
      const selectedKey = typeof currentAnswer === 'string' ? currentAnswer : 'front_hairline';
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Top-down scalp SVG with clickable regions */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA]">
              <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-widest mb-2">
                ANATOMICAL SCALP SECTORS
              </span>
              <svg viewBox="0 0 200 200" className="w-48 h-48 select-none">
                <circle cx="100" cy="100" r="82" fill="#F5F2EB" stroke="#CDC5B8" strokeWidth="2" />
                {/* Hairline */}
                <path
                  d="M60 45 Q100 35 140 45 Q125 70 75 70 Z"
                  onClick={() => handleSelectValue('front_hairline')}
                  className={`cursor-pointer transition-colors ${
                    selectedKey === 'front_hairline' || selectedKey === 'more_than_one'
                      ? 'fill-[#18534F]'
                      : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
                  }`}
                />
                {/* Temples */}
                <circle
                  cx="50" cy="70" r="14"
                  onClick={() => handleSelectValue('temples')}
                  className={`cursor-pointer transition-colors ${
                    selectedKey === 'temples' || selectedKey === 'more_than_one'
                      ? 'fill-[#18534F]'
                      : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
                  }`}
                />
                <circle
                  cx="150" cy="70" r="14"
                  onClick={() => handleSelectValue('temples')}
                  className={`cursor-pointer transition-colors ${
                    selectedKey === 'temples' || selectedKey === 'more_than_one'
                      ? 'fill-[#18534F]'
                      : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
                  }`}
                />
                {/* Mid-scalp */}
                <ellipse
                  cx="100" cy="98" rx="36" ry="22"
                  onClick={() => handleSelectValue('top_midscalp')}
                  className={`cursor-pointer transition-colors ${
                    selectedKey === 'top_midscalp' || selectedKey === 'more_than_one'
                      ? 'fill-[#18534F]'
                      : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
                  }`}
                />
                {/* Crown */}
                <circle
                  cx="100" cy="142" r="26"
                  onClick={() => handleSelectValue('crown')}
                  className={`cursor-pointer transition-colors ${
                    selectedKey === 'crown' || selectedKey === 'more_than_one'
                      ? 'fill-[#18534F]'
                      : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
                  }`}
                />
              </svg>
              <span className="text-[10px] text-[#8E877E] italic mt-2">Tap any sector to choose</span>
            </div>

            {/* Region choice cards */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt: any) => {
                const isSelected = selectedKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectValue(opt.key)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                        : 'bg-white text-[#1B1F23] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                      isSelected ? 'border-white bg-white text-[#18534F]' : 'border-[#CDC5B8]'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q9: PERCEPTION / CONTEXT (Card 09 in Reference)
    if (currentQ.id === 'Q9') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentQ.options.map((opt: any) => {
            const isSelected = currentAnswer === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectValue(opt.key)}
                className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#18534F] bg-[#F4F8F6] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <ContextIconVisual optionKey={opt.key} isSelected={isSelected} />
                <span className={`text-xs font-semibold mt-3 ${isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-[#8E877E] mt-1 leading-snug line-clamp-2">
                  {opt.indicates}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // Q10: DURATION Interactive Milestones (Card 10 & 13)
    if (currentQ.id === 'Q10') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {currentQ.options.map((opt: any, idx: number) => {
              const isSelected = currentAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectValue(opt.key)}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-[#18534F] bg-[#F4F8F6] shadow-xs ring-2 ring-[#18534F]/30'
                      : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <DurationMilestoneVisual index={idx} isSelected={isSelected} />
                  <span className={`text-xs font-semibold mt-3 ${isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-[#8E877E] mt-1">Duration</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Q11: FAMILY CONTEXT (Card 11 & 17)
    if (currentQ.id === 'Q11') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentQ.options.map((opt: any) => {
            const isSelected = currentAnswer === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectValue(opt.key)}
                className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#18534F] bg-[#F4F8F6] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <FamilyPedigreeVisual type={opt.key as any} isSelected={isSelected} />
                <span className={`text-base font-semibold mt-4 ${isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'}`}>
                  {opt.label}
                </span>
                <span className="text-xs text-[#8E877E] mt-1 max-w-[180px]">
                  {opt.indicates}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // Q12: CONCERN TRAJECTORY (Card 12)
    if (currentQ.id === 'Q12') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = currentAnswer === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <TrajectoryGraphVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = currentAnswer === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q13: WHAT HAVE YOU ALREADY DONE? (5-stage level + Multi-select approaches + "YOUR JOURNEY" tray)
    if (currentQ.id === 'Q13') {
      const q13Value = typeof currentAnswer === 'object' ? currentAnswer : { level: 2, approaches: ['supplements'] };
      const currentLevel = q13Value.level || 2;
      const currentApproaches: string[] = Array.isArray(q13Value.approaches) ? q13Value.approaches : ['nothing_yet'];

      const handleLevelChange = (lvl: number) => {
        const nextApproaches = lvl === 1 ? ['nothing_yet'] : currentApproaches.filter((a) => a !== 'nothing_yet');
        handleSelectValue({ level: lvl, approaches: nextApproaches.length ? nextApproaches : ['medication'] });
      };

      const handleToggleApproach = (appKey: string) => {
        let updated: string[];
        if (appKey === 'nothing_yet') {
          updated = ['nothing_yet'];
        } else {
          const filtered = currentApproaches.filter((a) => a !== 'nothing_yet');
          updated = filtered.includes(appKey) ? filtered.filter((a) => a !== appKey) : [...filtered, appKey];
          if (updated.length === 0) updated = ['nothing_yet'];
        }
        handleSelectValue({ level: currentLevel, approaches: updated });
      };

      return (
        <div className="space-y-6">
          {/* Top: 5-Stage Journey Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
              1. Degree of Previous Exploration
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {currentQ.options.map((opt: any) => {
                const isSelected = currentLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleLevelChange(opt.value)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs font-semibold'
                        : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="font-mono text-xs block font-bold">STAGE 0{opt.value}</span>
                    <span className="text-[11px] block mt-0.5 leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom: Multi-select approach cards */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
              2. Which modalities have you tried? (Select all that apply)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentQ.followUp?.options.map((item: any) => {
                const isChecked = currentApproaches.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleToggleApproach(item.key)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-[#EBF3F0] border-[#18534F] text-[#18534F] font-semibold'
                        : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="truncate pr-1">{item.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                      isChecked ? 'border-[#18534F] bg-[#18534F] text-white' : 'border-[#CDC5B8]'
                    }`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* "YOUR JOURNEY" Selected Tray */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider font-semibold">
              YOUR JOURNEY:
            </span>
            {currentApproaches.map((appKey) => {
              const matched = currentQ.followUp?.options.find((o: any) => o.key === appKey);
              return (
                <span
                  key={appKey}
                  className="px-2.5 py-1 bg-white border border-[#18534F]/30 rounded-full text-[#18534F] font-medium text-[11px]"
                >
                  {matched ? matched.label : appKey}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    // Q14: WHAT DO YOU ACTUALLY WANT TO CHANGE? (Interactive Goal Map)
    if (currentQ.id === 'Q14') {
      const selectedKey = typeof currentAnswer === 'string' ? currentAnswer : 'restore_hairline';
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentQ.options.map((opt: any) => {
            const isSelected = selectedKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectValue(opt.key)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#18534F] bg-[#F4F8F6] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-3 h-3 rounded-full ${isSelected ? 'bg-[#18534F]' : 'bg-[#CDC5B8]'}`} />
                    <span className="text-[10px] font-mono uppercase text-[#8E877E]">RESTORATION GOAL</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'}`}>
                    {opt.label}
                  </h4>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                    {opt.indicates}
                  </p>
                </div>
                <div className="pt-3 flex justify-end">
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-[#18534F] font-bold' : 'text-[#8E877E]'}`}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // Q15: RESTORATION PRIORITY (Two-ended spectrum: Slowing Change vs Restoring Appearance)
    if (currentQ.id === 'Q15') {
      const val = typeof currentAnswer === 'number' ? currentAnswer : 3;
      return (
        <div className="space-y-8 py-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-[#8E877E] tracking-wider px-2">
            <span>← SLOWING LOSS ONLY</span>
            <span className="text-[#18534F] font-bold">SPECTRUM BALANCE</span>
            <span>RESTORING APPEARANCE →</span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {currentQ.options.map((opt: any) => {
              const isSelected = val === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#18534F] text-white border-[#18534F] shadow-sm font-semibold'
                      : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="font-mono text-sm font-bold block">{opt.value}</span>
                  <span className="text-[11px] block mt-1 leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Q16: RESTORATION JOURNEY (Card 16)
    if (currentQ.id === 'Q16') {
      const val = typeof currentAnswer === 'number' ? currentAnswer : 3;
      return (
        <div className="space-y-3">
          {currentQ.options.map((opt: any) => {
            const isSelected = val === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectValue(opt.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                    : 'bg-white text-[#1B1F23] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DecisionStageVisual step={opt.value} isSelected={isSelected} />
                  <div>
                    <span className="font-semibold text-sm block">{opt.label}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#78716C]'}`}>
                      {opt.indicates}
                    </span>
                  </div>
                </div>
                {isSelected && <span className="font-mono text-xs font-bold text-white">✓ Current Stage</span>}
              </button>
            );
          })}
        </div>
      );
    }

    // Q17: PERSONAL IMPACT (Radial impact indicators)
    if (currentQ.id === 'Q17') {
      const val = typeof currentAnswer === 'number' ? currentAnswer : 3;
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end justify-center">
            {currentQ.options.map((opt: any) => {
              const isSelected = val === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectValue(opt.value)}
                  className="flex flex-col items-center group cursor-pointer text-center focus:outline-hidden"
                >
                  <TrajectoryGraphVisual level={opt.value} isSelected={isSelected} />
                  <span
                    className={`mt-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider block transition-colors ${
                      isSelected ? 'text-[#18534F] font-bold' : 'text-[#78716C] group-hover:text-[#1B1F23]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 px-6 sm:px-12">
            <div className="relative w-full h-8 flex items-center justify-between">
              <div className="absolute left-0 right-0 h-[1.5px] bg-[#E7E2DA] top-1/2 -translate-y-1/2" />
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = val === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectValue(num)}
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs font-bold scale-110'
                        : 'bg-white text-[#78716C] border border-[#E7E2DA] hover:border-[#18534F]'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Q18: DESIRED CONSULTATION TOPIC (Cards that become "YOUR TOPIC" chips)
    if (currentQ.id === 'Q18') {
      const selectedKey = typeof currentAnswer === 'string' ? currentAnswer : 'natural_hairline';
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentQ.options.map((opt: any) => {
              const isSelected = selectedKey === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectValue(opt.key)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#18534F] bg-[#F4F8F6] shadow-xs ring-2 ring-[#18534F]/30'
                      : 'border-[#E7E2DA] bg-white hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block mb-1">
                      TOPIC OPTION
                    </span>
                    <h4 className={`text-sm font-semibold ${isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'}`}>
                      {opt.label}
                    </h4>
                    <p className="text-[11px] text-[#78716C] mt-1 leading-snug">
                      {opt.indicates}
                    </p>
                  </div>
                  <div className="pt-3 flex justify-end">
                    <span className={`text-[11px] font-mono ${isSelected ? 'text-[#18534F] font-bold' : 'text-[#8E877E]'}`}>
                      {isSelected ? '✓ Selected Topic' : 'Select'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl flex items-center justify-between text-xs">
            <span className="text-[#8E877E] font-mono uppercase text-[10px]">YOUR CONSULTATION TOPIC:</span>
            <span className="font-semibold text-[#18534F]">
              {currentQ.options.find((o: any) => o.key === selectedKey)?.label || 'A more natural-looking hairline'}
            </span>
          </div>
        </div>
      );
    }

    // Q19: TIMING JOURNEY (Card 13 & 19)
    if (currentQ.id === 'Q19') {
      const selectedKey = typeof currentAnswer === 'string' ? currentAnswer : '3_6m';
      return (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {currentQ.options.map((opt: any) => {
            const isSelected = selectedKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectValue(opt.key)}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#18534F] bg-[#18534F] text-white shadow-xs'
                    : 'border-[#E7E2DA] bg-white text-[#1B1F23] hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono uppercase block mb-1 ${isSelected ? 'text-white/80' : 'text-[#8E877E]'}`}>
                    TIMEFRAME
                  </span>
                  <h4 className="text-xs font-semibold leading-tight">{opt.label}</h4>
                </div>
                <div className="pt-3">
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-white font-bold' : 'text-[#8E877E]'}`}>
                    {isSelected ? '✓ Selected' : 'Choose'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    // Q20: SPECIALIST DISCUSSION INTENT (Card 20)
    if (currentQ.id === 'Q20') {
      const selectedVal = typeof currentAnswer === 'number' ? currentAnswer : 4;
      return (
        <div className="space-y-3">
          {currentQ.options.map((opt: any) => {
            const isSelected = selectedVal === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelectValue(opt.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                    : 'bg-white text-[#1B1F23] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DecisionStageVisual step={opt.value} isSelected={isSelected} />
                  <div>
                    <span className="font-semibold text-sm block">{opt.label}</span>
                    <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#78716C]'}`}>
                      {opt.indicates}
                    </span>
                  </div>
                </div>
                {isSelected && <span className="font-mono text-xs font-bold text-white">✓ Chosen</span>}
              </button>
            );
          })}
        </div>
      );
    }

    return null;
  };

  const formattedNum = String(currentIndex + 1).padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20 px-4 sm:px-6 md:px-12 flex flex-col justify-between">
      {/* ==================================================================== */}
      {/* GLOBAL ASSESSMENT SHELL HEADER (Matching Reference Image)            */}
      {/* ==================================================================== */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-4">
            <span className="font-serif text-lg font-normal text-[#1B1F23]">
              Hair Restoration Assessment
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#8E877E] hidden sm:inline">
              20 Questions / Your Personal Profile
            </span>
            {/* Dotted progress indicators (20 dots matching reference) */}
            <div className="flex items-center gap-1">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-3 bg-[#18534F]'
                      : i < currentIndex
                      ? 'bg-[#18534F]/70'
                      : 'bg-[#D8D2C6]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#E7E2DA]" />
      </div>

      {/* ==================================================================== */}
      {/* MAIN QUESTION CARD (Matching "Hair Restoration Assessment UI Grid.png")*/}
      {/* ==================================================================== */}
      <main className="max-w-4xl mx-auto w-full">
        <div className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Question Header: Number + Thin Horizontal Line + Section Label + Question */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-semibold text-[#1B1F23]">
                {formattedNum} / {total}
              </span>
              <div className="flex-1 h-[1px] bg-[#E7E2DA]" />
            </div>

            <span className="text-[11px] uppercase tracking-widest font-mono text-[#8E877E] font-semibold block">
              {currentQ.sectionTitle || 'CLINICAL VECTOR'}
            </span>

            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-[#1B1F23] font-normal leading-snug">
              {currentQ.text}
            </h2>

            {currentQ.boundary && (
              <p className="text-[11px] text-[#8E877E] italic">
                {currentQ.boundary}
              </p>
            )}
          </div>

          {/* Question Interactive Visual & Answer Controls */}
          <div className="pt-2 pb-4">
            {renderVisualAnswers()}
          </div>

          {/* Validation Inline Warning if attempted to continue without selecting */}
          {validationError && (
            <div className="p-3 bg-[#FFF5F5] border border-[#FFD1D1] rounded-xl text-xs text-[#C53030] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error_outline</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Footer: Previous and Continue Pill */}
          <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`text-xs font-medium flex items-center gap-1.5 transition-colors py-2 px-3 rounded cursor-pointer ${
                currentIndex === 0
                  ? 'text-[#CDC5B8] cursor-not-allowed'
                  : 'text-[#635C52] hover:text-[#1B1F23]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="px-7 py-3 bg-[#18534F] hover:bg-[#123E3B] text-white rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <span>{currentIndex === total - 1 ? 'Complete Assessment' : 'Continue'}</span>
              <span className="material-symbols-outlined text-sm">
                {currentIndex === total - 1 ? 'check' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* BOTTOM REASSURANCE BANNER                                            */}
      {/* ==================================================================== */}
      <footer className="max-w-4xl mx-auto w-full mt-10 pt-4">
        <div className="p-5 bg-white border border-[#E7E2DA] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#18534F] text-2xl shrink-0">
              spa
            </span>
            <div>
              <span className="font-semibold text-[#1B1F23] block text-sm">
                Your answers build a clearer picture.
              </span>
              <p className="text-[11px] text-[#635C52] mt-0.5 leading-relaxed">
                This 20-question assessment helps organize what you notice, what you want to change, and where you are in your restoration journey.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
