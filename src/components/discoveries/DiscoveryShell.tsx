import React, { useState, useEffect, useRef } from 'react';
import { Discovery01HairProfile } from './Discovery01HairProfile';
import { Discovery02ConcernMap } from './Discovery02ConcernMap';
import { Discovery03HairStory } from './Discovery03HairStory';
import { Discovery04GoalExplorer } from './Discovery04GoalExplorer';
import { Discovery05RestorationPriorities } from './Discovery05RestorationPriorities';
import { Discovery06RestorationJourney } from './Discovery06RestorationJourney';
import { Discovery07SpecialistDiscussion } from './Discovery07SpecialistDiscussion';
import { Discovery08PersonalProfile } from './Discovery08PersonalProfile';
import { PostReportExperience } from '../postReport/PostReportExperience';
import { trackEvent } from '../../analytics/events';

interface DiscoveryShellProps {
  result: any;
  patient: any;
  onBookConsultation: () => void;
  onRetake: () => void;
  onToggleViewMode?: () => void;
  viewMode?: 'discoveries' | 'dossier';
}

const DISCOVERY_TITLES = [
  'Your Hair Profile',
  'Your Concern Map',
  'Your Hair Story',
  'What You Want to Improve',
  'Your Restoration Priorities',
  'Your Restoration Journey',
  'Build Your Specialist Discussion',
  'Your Personal Restoration Profile'
];

export const DiscoveryShell: React.FC<DiscoveryShellProps> = ({
  result,
  patient,
  onBookConsultation,
  onRetake,
  onToggleViewMode,
  viewMode = 'discoveries'
}) => {
  // Discovery 1-indexed (1 to 8)
  const [currentDiscovery, setCurrentDiscovery] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('atelier_active_discovery');
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= 8) return num;
      }
    } catch (e) {
      // ignore
    }
    return 1;
  });

  const [hasDismissedSwipeHint, setHasDismissedSwipeHint] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('atelier_active_discovery', String(currentDiscovery));
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('report_discovery_viewed', { discovery: currentDiscovery });
  }, [currentDiscovery]);

  // Keyboard navigation between discoveries (ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' && currentDiscovery < 8) {
        setCurrentDiscovery((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentDiscovery > 1) {
        setCurrentDiscovery((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDiscovery]);

  const handleNext = () => {
    if (currentDiscovery < 8) {
      setCurrentDiscovery((prev) => prev + 1);
    } else {
      onBookConsultation();
    }
  };

  const handlePrev = () => {
    if (currentDiscovery > 1) {
      setCurrentDiscovery((prev) => prev - 1);
    }
  };

  // Touch Swipe Handlers for smooth mobile / tablet navigation
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    // Detect horizontal swipe if deltaX is significant and predominantly horizontal
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0 && currentDiscovery < 8) {
        // Swiped leftwards -> advance next
        setHasDismissedSwipeHint(true);
        handleNext();
      } else if (diffX < 0 && currentDiscovery > 1) {
        // Swiped rightwards -> go previous
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const scrollToPostReport = () => {
    const el = document.getElementById('post-report-journey');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="min-h-screen bg-[#FAF8F5] text-[#1B1F23] flex flex-col justify-between selection:bg-[#18534F] selection:text-white"
    >
      {/* ==================================================================== */}
      {/* GLOBAL REPORT HEADER (Matching Reference Specification)              */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DA] px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Section Brand / Tag */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
              YOUR PERSONALIZED REPORT
            </span>
            <div className="w-12 h-[1px] bg-[#CDC5B8] hidden sm:block" />
            <span className="font-serif text-sm text-[#524B40] hidden md:inline truncate max-w-[220px]">
              {patient?.fullName ? `${patient.fullName}'s Profile` : 'Confidential Dossier'}
            </span>
          </div>

          {/* Right: X of 8 Discoveries + 8 Clickable Progress Dots */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#524B40] font-semibold whitespace-nowrap">
              {currentDiscovery} of 8 Discoveries
            </span>

            {/* 8 Clickable Progress Dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => {
                const isActive = step === currentDiscovery;
                const isPassed = step < currentDiscovery;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setCurrentDiscovery(step)}
                    title={`Jump to Discovery ${step}: ${DISCOVERY_TITLES[step - 1]}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-3 h-3 bg-[#18534F] ring-2 ring-[#D7E7D2]'
                        : isPassed
                        ? 'w-2 h-2 bg-[#18534F]/70 hover:scale-125'
                        : 'w-2 h-2 bg-[#D8D2C6] hover:bg-[#8E877E]'
                    }`}
                  />
                );
              })}
            </div>

            {/* View Mode Toggle / Full Dossier button */}
            {onToggleViewMode && (
              <button
                type="button"
                onClick={onToggleViewMode}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#E7E2DA] bg-white text-xs text-[#524B40] hover:text-[#18534F] hover:bg-[#F5F2EB] transition shadow-2xs font-mono"
              >
                <span className="material-symbols-outlined text-[15px]">clinical_notes</span>
                <span>{viewMode === 'discoveries' ? 'Clinic View' : '8 Discoveries'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* PROMINENT SWIPE-RIGHT PROMPT (Appears on Discovery 01)                */}
      {/* ==================================================================== */}
      {currentDiscovery === 1 && !hasDismissedSwipeHint && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-4 pb-1">
          <div className="bg-gradient-to-r from-[#E8F3EE] via-white to-[#F2EFE9] border border-[#18534F]/30 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#18534F] text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px] animate-swipe-right">swipe_left</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#18534F] font-bold block">
                  Interactive Report Mode
                </span>
                <p className="text-xs sm:text-sm text-[#1B1F23] font-medium">
                  Swipe right / click next to advance through all 8 personalized discoveries.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-[#18534F] hover:bg-[#123E3B] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MAIN DISCOVERY BODY CONTAINER                                        */}
      {/* ==================================================================== */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        {currentDiscovery === 1 && (
          <Discovery01HairProfile result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 2 && (
          <Discovery02ConcernMap result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 3 && (
          <Discovery03HairStory result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 4 && (
          <Discovery04GoalExplorer result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 5 && (
          <Discovery05RestorationPriorities result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 6 && (
          <Discovery06RestorationJourney result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 7 && (
          <Discovery07SpecialistDiscussion result={result} onNext={handleNext} />
        )}
        {currentDiscovery === 8 && (
          <div className="space-y-12 sm:space-y-16">
            <Discovery08PersonalProfile
              result={result}
              onBookConsultation={onBookConsultation}
              onReviewProfile={() => {
                setCurrentDiscovery(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* ================================================================ */}
            {/* SWIPE DOWN / SCROLL DOWN PROMPT (On last Discovery 8 page)        */}
            {/* ================================================================ */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <button
                type="button"
                onClick={scrollToPostReport}
                className="group p-4 bg-white hover:bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl shadow-sm transition-all flex flex-col items-center gap-2 cursor-pointer hover:border-[#18534F] max-w-sm w-full"
              >
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#18534F] font-bold">
                  SURGICAL GUIDANCE & VIDEOS
                </span>
                <span className="text-xs text-[#524B40]">
                  Scroll / Swipe down to explore surgeon profiles, before & afters, and clinical timelines
                </span>
                <div className="w-10 h-10 rounded-full bg-[#E8F3EE] text-[#18534F] flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px] animate-swipe-down">
                    keyboard_double_arrow_down
                  </span>
                </div>
              </button>
            </div>

            {/* Complete Post-Report Experience (§01 to §10) */}
            <PostReportExperience
              onBookConsultation={onBookConsultation}
              onReviewResults={() => {
                setCurrentDiscovery(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {currentDiscovery < 8 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label={`Continue to discovery ${currentDiscovery + 1}`}
          className="fixed right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-[#18534f]/15 bg-[#fbfaf6]/55 p-2 text-[#18534f]/45 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-[#18534f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18534f] md:grid"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span>
        </button>
      )}

      {/* ==================================================================== */}
      {/* GLOBAL FOOTER DISCOVERY TRAVERSAL NAVIGATOR                          */}
      {/* ==================================================================== */}
      <footer className="border-t border-[#E7E2DA] bg-white px-4 sm:px-8 py-4 sticky bottom-0 z-20 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentDiscovery === 1}
            className={`px-4 py-2.5 rounded-xl border border-[#E7E2DA] text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              currentDiscovery === 1
                ? 'opacity-30 cursor-not-allowed bg-[#FAF8F5] text-[#8E877E]'
                : 'bg-white text-[#524B40] hover:bg-[#FAF8F5] hover:border-[#18534F]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden sm:inline">Previous Discovery</span>
            <span className="sm:hidden">Back</span>
          </button>

          {/* Quick Discovery Selector pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#8E877E]">
            <span className="font-bold text-[#18534F]">0{currentDiscovery}</span>
            <span>/</span>
            <span className="truncate max-w-[140px] sm:max-w-none">{DISCOVERY_TITLES[currentDiscovery - 1]}</span>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#18534F] hover:bg-[#123E3B] text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <span>{currentDiscovery < 8 ? `Next: 0${currentDiscovery + 1}` : 'Discuss With Specialist'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

