import React, { useEffect, useRef, useState } from 'react';

// Real clinical thumbnail assets
import step1Img from '../assets/images/journey_step_01_profile_1791038035905.jpg';
import step2Img from '../assets/images/journey_step_02_assessment_1791038056750.jpg';
import step3Img from '../assets/images/journey_step_03_structuring_1791038069509.jpg';
import step4Img from '../assets/images/journey_step_04_report_1791038096988.jpg';
import step5Img from '../assets/images/journey_step_05_pathways_1791038116040.jpg';
import step6Img from '../assets/images/journey_step_06_consult_1791038131434.jpg';

interface MilestoneStep {
  id: string;
  stepNumber: string;
  side: 'right' | 'left';
  heading: string;
  description: string;
  tag: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
}

const MILESTONE_STEPS: MilestoneStep[] = [
  {
    id: 'milestone-01',
    stepNumber: '01',
    side: 'right',
    heading: 'Tell Us About You',
    description:
      'Provide baseline context including your age bracket, family history, and primary hair goals in a discreet environment.',
    tag: 'ALL DETAILS CAPTURED',
    image: step1Img,
    imageAlt: 'Patient clinical baseline consultation profile',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    id: 'milestone-02',
    stepNumber: '02',
    side: 'left',
    heading: 'Complete Your Assessment',
    description:
      'Navigate through intuitive visual diagrams mapping your temporal hairline, crown density, shedding rate, and scalp characteristics.',
    tag: '20 GUIDED QUESTIONS',
    image: step2Img,
    imageAlt: 'Clinical trichology scalp and hairline examination',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 17l4-5 3 3 5-7" />
        <path d="M8 12h.01" />
      </svg>
    )
  },
  {
    id: 'milestone-03',
    stepNumber: '03',
    side: 'right',
    heading: 'Profile Structuring',
    description:
      'Our clinical logic computes your individual attributes against anatomical norms to outline plausible restoration possibilities.',
    tag: 'INDIVIDUAL BLUEPRINT CREATED',
    image: step3Img,
    imageAlt: 'Follicular unit structure and algorithmic profile blueprint',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <circle cx="12" cy="9" r="2" />
        <path d="M8 14a4 4 0 0 1 8 0" />
      </svg>
    )
  },
  {
    id: 'milestone-04',
    stepNumber: '04',
    side: 'left',
    heading: 'Receive Digital Report',
    description:
      'Inspect a structured digital breakdown covering 8 clinical vectors, complete with graft approximations and risk considerations.',
    tag: 'PERSONALIZED DOSSIER | CLINICAL PLAN REVIEWED',
    image: step4Img,
    imageAlt: 'Digital clinical restoration report dossier with charts and graft metrics',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )
  },
  {
    id: 'milestone-05',
    stepNumber: '05',
    side: 'right',
    heading: 'Explore Restoration Pathways',
    description:
      'Examine verified case studies and treatment modalities (FUE, FUT, regenerative medicine) calibrated for your specific pattern.',
    tag: 'PROOF & SCIENCE | PATHWAYS EXPLORED',
    image: step5Img,
    imageAlt: 'Microsurgical follicular graft preservation and treatment modalities',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  },
  {
    id: 'milestone-06',
    stepNumber: '06',
    side: 'left',
    heading: 'Specialist Consultation',
    description:
      'Arrive prepared for your 1-on-1 trichologist evaluation with your report in hand, ensuring an unhurried, evidence-based discussion.',
    tag: 'PHYSICIAN EVALUATION | CONSULTATION PREPARED',
    image: step6Img,
    imageAlt: 'One-on-one consultation with trichology restoration physician',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <circle cx="9" cy="11.5" r="0.8" fill="currentColor" />
        <circle cx="12" cy="11.5" r="0.8" fill="currentColor" />
        <circle cx="15" cy="11.5" r="0.8" fill="currentColor" />
      </svg>
    )
  }
];

export const HairRestorationJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which milestones have been revealed via scroll IntersectionObserver
  // Default to true so elements are fully accessible and never stay hidden on mobile or tablets
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    MILESTONE_STEPS.forEach((s) => (initial[s.id] = true));
    return initial;
  });
  const [activeStepId, setActiveStepId] = useState<string>('milestone-01');

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // High precision IntersectionObserver to highlight current active step during scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute('data-step-id');
            if (stepId) {
              setVisibleItems((prev) => ({ ...prev, [stepId]: true }));
              setActiveStepId(stepId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      }
    );

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hair-restoration-journey"
      className="relative py-24 sm:py-32 lg:py-36 px-4 sm:px-8 lg:px-12 bg-[#F9F8F6] overflow-hidden select-none border-t border-[#EBE6DC]"
    >
      {/* Delicate background decorative gold concentric arc halos (from reference image) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-45 overflow-hidden">
        <svg viewBox="0 0 500 500" className="w-full h-full text-[#DFD6C7]" fill="none">
          <circle cx="450" cy="50" r="280" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="450" cy="50" r="380" stroke="#CBB99F" strokeWidth="0.8" opacity="0.4" />
          <circle cx="450" cy="50" r="480" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-40 overflow-hidden">
        <svg viewBox="0 0 600 600" className="w-full h-full text-[#E5DDCF]" fill="none">
          <circle cx="550" cy="550" r="320" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="550" cy="550" r="450" stroke="#CBB99F" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
        </svg>
      </div>

      {/* Soft blurred palm/leaf foliage shadow at bottom-left corner (from reference image) */}
      <div className="absolute -bottom-10 -left-10 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none opacity-25 filter blur-xl">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#384635]" fill="currentColor">
          <path d="M30 180 C 50 140, 40 80, 10 30 C 60 70, 90 120, 100 170 C 120 110, 150 70, 190 40 C 160 90, 140 140, 120 185 Z" />
          <path d="M50 190 C 80 150, 100 100, 90 20 C 115 65, 125 115, 110 180 Z" opacity="0.8" />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto relative z-10">
        
        {/* ========================================================== */}
        {/* 1. HEADER SECTION (Exact Text, Proportions & Typography)   */}
        {/* ========================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          {/* Subtitle with decorative thin lines on both sides */}
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            <span className="w-10 sm:w-16 h-[1px] bg-[#BFA885]/80" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-[#6B7567] font-medium">
              YOUR HAIR RESTORATION JOURNEY
            </span>
            <span className="w-10 sm:w-16 h-[1px] bg-[#BFA885]/80" />
          </div>

          {/* Main Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] text-[#1B201A] font-normal tracking-tight leading-[1.18] mt-1">
            Hair Restoration &<br />
            Transplant Journey
          </h2>

          {/* Intro Paragraph */}
          <p className="text-sm sm:text-base text-[#576054] mt-4 leading-relaxed font-normal max-w-2xl mx-auto px-2">
            Hair restoration is a structured, progressive biological process. Follow each milestone along this interactive roadmap to understand your journey and make realistic decisions.
          </p>
        </div>

        {/* ========================================================== */}
        {/* 2. DESKTOP MEANDERING / SERPENTINE TIMELINE (>= 1024px)    */}
        {/* ========================================================== */}
        <div className="hidden lg:block relative">
          
          {/* Continuous Meandering Serpentine Curve SVG Path */}
          <div className="absolute inset-0 pointer-events-none flex justify-center">
            <svg
              viewBox="0 0 140 1860"
              className="w-[140px] h-full overflow-visible"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="goldSerpentineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CBB99F" stopOpacity="0.4" />
                  <stop offset="15%" stopColor="#BBA075" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#A88B58" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#BBA075" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#CBB99F" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Serpentine wave connecting through the 6 nodes */}
              {/* Node centers: Y = 110, 420, 730, 1040, 1350, 1660 */}
              <path
                d="M 70,20
                   C 70,60 70,80 70,110
                   C 70,210 105,260 70,420
                   C 35,570 100,620 70,730
                   C 40,840 100,920 70,1040
                   C 40,1160 100,1230 70,1350
                   C 40,1470 100,1540 70,1660
                   C 70,1720 70,1770 70,1820"
                stroke="url(#goldSerpentineGrad)"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Six Alternating Rows */}
          <div className="relative z-10 space-y-24 xl:space-y-28">
            {MILESTONE_STEPS.map((step, index) => {
              const isVisible = visibleItems[step.id];
              const isActive = activeStepId === step.id;

              return (
                <div
                  key={step.id}
                  data-step-id={step.id}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="grid grid-cols-12 items-center"
                >
                  {/* LEFT COLUMN: Contains Card for 02, 04, 06 OR Empty Space for 01, 03, 05 */}
                  <div className="col-span-5 flex justify-end">
                    {step.side === 'left' ? (
                      <div
                        className={`w-full max-w-[530px] transition-all duration-700 ease-out transform ${
                          isVisible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-10 scale-[0.97]'
                        }`}
                        style={{ transitionDelay: '120ms' }}
                      >
                        {/* Luxury Floating Card (Thumbnail on LEFT, Text on RIGHT) */}
                        <div
                          className={`bg-white/95 backdrop-blur-md rounded-2xl p-5 xl:p-6 shadow-sm border transition-all duration-300 hover:shadow-md flex items-center gap-5 xl:gap-6 ${
                            isActive
                              ? 'border-[#BBA075]/70 ring-1 ring-[#BBA075]/30 shadow-md'
                              : 'border-[#EDE7DC] hover:border-[#D5CABB]'
                          }`}
                        >
                          {/* Thumbnail Image on the Left */}
                          <div className="shrink-0 w-28 h-28 xl:w-32 xl:h-32 rounded-xl xl:rounded-2xl overflow-hidden bg-[#F0ECE1] shadow-xs border border-stone-200/50">
                            <img
                              src={step.image}
                              alt={step.imageAlt}
                              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          {/* Content Text on the Right */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#F4F1EA] border border-[#E5E0D5] flex items-center justify-center text-[#4A5546] mb-2.5">
                              {step.icon}
                            </div>
                            <h3 className="font-serif text-xl xl:text-2xl text-[#1B201A] font-normal tracking-tight leading-snug">
                              {step.heading}
                            </h3>
                            <p className="text-xs xl:text-[13.5px] text-[#555C52] leading-relaxed mt-2 font-normal">
                              {step.description}
                            </p>
                            <span className="inline-block text-[10px] xl:text-[11px] font-mono tracking-widest text-[#7C8478] uppercase mt-3 font-medium">
                              {step.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>

                  {/* CENTER COLUMN: Central Serpentine Node & Connecting Lines */}
                  <div className="col-span-2 flex justify-center items-center relative">
                    {/* Horizontal Connector Line to the Card */}
                    {step.side === 'left' && (
                      <div
                        className={`absolute right-1/2 top-1/2 -translate-y-1/2 w-16 xl:w-20 h-[1.5px] bg-[#BFA885]/80 pointer-events-none transition-all duration-500 origin-right ${
                          isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '250ms' }}
                      >
                        {/* Dot at the card connection point */}
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#A88B58]" />
                      </div>
                    )}

                    {step.side === 'right' && (
                      <div
                        className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-16 xl:w-20 h-[1.5px] bg-[#BFA885]/80 pointer-events-none transition-all duration-500 origin-left ${
                          isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`}
                        style={{ transitionDelay: '250ms' }}
                      >
                        {/* Dot at the card connection point */}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#A88B58]" />
                      </div>
                    )}

                    {/* Circular Numbered Node (01 - 06) */}
                    <div
                      className={`relative z-20 rounded-full p-1.5 transition-all duration-500 transform ${
                        isVisible
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-75'
                      }`}
                      style={{
                        background: 'radial-gradient(circle, #FAF7F0 0%, #E9E2D4 100%)',
                        boxShadow: isActive
                          ? '0 0 20px rgba(187, 160, 117, 0.45), 0 4px 12px rgba(0, 0, 0, 0.08)'
                          : '0 2px 8px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <div
                        className={`w-11 h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center text-white font-serif text-sm xl:text-base font-semibold border transition-all duration-300 ${
                          isActive
                            ? 'bg-[#43503E] border-[#BBA075] shadow-inner scale-105'
                            : 'bg-[#52604D] border-[#DDD5C5]'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      {/* Small pulse aura when active */}
                      {isActive && (
                        <div className="absolute -inset-1 rounded-full border border-[#BBA075]/60 animate-ping pointer-events-none" />
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Contains Card for 01, 03, 05 OR Empty Space for 02, 04, 06 */}
                  <div className="col-span-5 flex justify-start">
                    {step.side === 'right' ? (
                      <div
                        className={`w-full max-w-[530px] transition-all duration-700 ease-out transform ${
                          isVisible
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-10 scale-[0.97]'
                        }`}
                        style={{ transitionDelay: '120ms' }}
                      >
                        {/* Luxury Floating Card (Text on LEFT, Thumbnail on RIGHT) */}
                        <div
                          className={`bg-white/95 backdrop-blur-md rounded-2xl p-5 xl:p-6 shadow-sm border transition-all duration-300 hover:shadow-md flex items-center gap-5 xl:gap-6 ${
                            isActive
                              ? 'border-[#BBA075]/70 ring-1 ring-[#BBA075]/30 shadow-md'
                              : 'border-[#EDE7DC] hover:border-[#D5CABB]'
                          }`}
                        >
                          {/* Content Text on the Left */}
                          <div className="flex-1 min-w-0 text-left">
                            <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#F4F1EA] border border-[#E5E0D5] flex items-center justify-center text-[#4A5546] mb-2.5">
                              {step.icon}
                            </div>
                            <h3 className="font-serif text-xl xl:text-2xl text-[#1B201A] font-normal tracking-tight leading-snug">
                              {step.heading}
                            </h3>
                            <p className="text-xs xl:text-[13.5px] text-[#555C52] leading-relaxed mt-2 font-normal">
                              {step.description}
                            </p>
                            <span className="inline-block text-[10px] xl:text-[11px] font-mono tracking-widest text-[#7C8478] uppercase mt-3 font-medium">
                              {step.tag}
                            </span>
                          </div>

                          {/* Thumbnail Image on the Right */}
                          <div className="shrink-0 w-28 h-28 xl:w-32 xl:h-32 rounded-xl xl:rounded-2xl overflow-hidden bg-[#F0ECE1] shadow-xs border border-stone-200/50">
                            <img
                              src={step.image}
                              alt={step.imageAlt}
                              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================== */}
        {/* 3. MOBILE & TABLET LAYOUT (< 1024px, Single Vertical Rail) */}
        {/* ========================================================== */}
        <div className="lg:hidden relative">
          
          {/* Straight Vertical Golden Timeline Rail on the Left */}
          <div className="absolute left-[23px] sm:left-[27px] top-4 bottom-8 w-[2px] bg-gradient-to-b from-[#CBB99F] via-[#A88B58] to-[#CBB99F]/30" />

          <div className="space-y-8 sm:space-y-12">
            {MILESTONE_STEPS.map((step, index) => {
              const isVisible = visibleItems[step.id];
              const isActive = activeStepId === step.id;

              return (
                <div
                  key={step.id}
                  data-step-id={step.id}
                  className="relative flex items-start gap-3.5 sm:gap-6 transition-all duration-500 opacity-100 translate-y-0 scale-100"
                >
                  {/* Numbered Node on the Timeline Rail */}
                  <div
                    className={`relative z-10 shrink-0 rounded-full p-1.5 transition-all duration-300 mt-1 ${
                      isActive ? 'scale-110 shadow-md ring-2 ring-[#BBA075]/40' : ''
                    }`}
                    style={{
                      background: 'radial-gradient(circle, #FAF7F0 0%, #E9E2D4 100%)',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-serif text-xs sm:text-sm font-semibold border ${
                        isActive
                          ? 'bg-[#43503E] border-[#BBA075]'
                          : 'bg-[#52604D] border-[#DDD5C5]'
                      }`}
                    >
                      {step.stepNumber}
                    </div>
                  </div>

                  {/* Luxury Floating Card */}
                  <div
                    className={`flex-1 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border transition-all duration-300 ${
                      isActive
                        ? 'border-[#BBA075]/70 shadow-md'
                        : 'border-[#EDE7DC]'
                    }`}
                  >
                    {/* Top Row: Thumbnail + Header Details */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Thumbnail Image */}
                      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F0ECE1] shadow-xs border border-stone-200/50">
                        <img
                          src={step.image}
                          alt={step.imageAlt}
                          className="w-full h-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>

                      {/* Header + Icon */}
                      <div className="flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#F4F1EA] border border-[#E5E0D5] flex items-center justify-center text-[#4A5546] mb-1.5">
                          {step.icon}
                        </div>
                        <h3 className="font-serif text-lg sm:text-xl text-[#1B201A] font-normal leading-tight">
                          {step.heading}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-[13px] text-[#555C52] leading-relaxed mt-3 font-normal">
                      {step.description}
                    </p>

                    {/* Bottom Tag */}
                    <div className="mt-3 pt-2.5 border-t border-[#F2ECE1]">
                      <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#7C8478] uppercase font-medium">
                        {step.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HairRestorationJourney;
