import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface Discovery03Props {
  result: any;
  onNext?: () => void;
}

export const Discovery03HairStory: React.FC<Discovery03Props> = ({ result }) => {
  const scores = result?.scores || {};
  const rawAnswers = result?.rawAnswers || result?.answers || {};

  // Timeline stage state (1: First Noticed, 2: Concern Grew, 3: Now)
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(3);

  // Dynamic values from engine
  const duration = rawAnswers?.Q10 || '1_2y';
  const durationLabel = duration === 'lt_6m' ? 'less than 6 months ago'
    : duration === '6_12m' ? '6–12 months ago'
    : duration === '1_2y' ? 'approximately 1–2 years ago'
    : duration === '2_5y' ? '2–5 years ago'
    : 'over 5 years ago';

  const perceivedChange = scores.perceivedChange ?? 0.6;
  const motivation = scores.motivation ?? 0.75;

  // Determine 2x2 quadrant:
  // X: Change (High if >= 0.5, Low if < 0.5)
  // Y: Importance/Motivation (High if >= 0.5, Low if < 0.5)
  const isHighChange = perceivedChange >= 0.5;
  const isHighImportance = motivation >= 0.5;

  const currentQuadrant = isHighChange && isHighImportance
    ? 'big_change_high_priority'
    : isHighChange && !isHighImportance
    ? 'big_change_less_priority'
    : !isHighChange && isHighImportance
    ? 'small_change_high_priority'
    : 'small_change_lower_priority';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Story Narrative & Side Profile Graphic              */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              03
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR HAIR STORY
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#1B1F23] font-normal leading-tight tracking-tight">
            Your journey so far
          </h1>

          <p className="text-sm sm:text-base text-[#524B40] leading-relaxed max-w-xl">
            Your responses help us understand when your hair concern began, how it has evolved, and what matters most to you today.
          </p>

          {/* The Big Picture card */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E2DA] flex items-center gap-3 shadow-2xs max-w-lg">
            <div className="w-8 h-8 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
              <span className="material-symbols-outlined text-[18px]">history</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
                THE BIG PICTURE · Q6 + Q7 + Q10 + Q12
              </span>
              <p className="text-xs text-[#524B40] mt-0.5">
                These questions create a progressive timeline of your hair journey since you first noticed change {durationLabel}.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Side Profile with Delicate Orbits */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            {/* Delicate SVG Orbital Rings */}
            <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full pointer-events-none">
              <circle cx="150" cy="150" r="130" fill="none" stroke="#E7E2DA" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="150" cy="150" r="105" fill="none" stroke="#D7E7D2" strokeWidth="1.5" />
              {/* Callout markers */}
              <circle cx="255" cy="150" r="3" fill="#18534F" />
              <line x1="255" y1="150" x2="280" y2="150" stroke="#CDC5B8" strokeWidth="1" />
              <circle cx="240" cy="95" r="3" fill="#18534F" />
              <line x1="240" y1="95" x2="265" y2="80" stroke="#CDC5B8" strokeWidth="1" />
            </svg>

            {/* Profile Avatar Image */}
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#FAF8F5]">
              <img
                src={heroManProfile}
                alt="Hair Story Profile"
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Callout Labels matching Screenshot */}
            <div className="absolute top-6 right-2 text-right">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E877E] font-semibold block">
                CHANGE
              </span>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 text-right">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E877E] font-semibold block">
                IMPORTANCE
              </span>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#E7E2DA] shadow-xs">
              <span className="material-symbols-outlined text-[14px] text-[#18534F]">spa</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#18534F] font-semibold">
                YOUR STORY MATTERS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MIDDLE CONTAINER: Interactive Hair Journey Timeline                  */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
            <span className="material-symbols-outlined text-[18px]">timeline</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              YOUR HAIR JOURNEY TIMELINE
            </span>
            <p className="text-xs text-[#524B40]">
              Drag across the timeline to see how your concern has changed over time.
            </p>
          </div>
        </div>

        {/* Timeline Horizontal Track */}
        <div className="pt-4 pb-2 px-4 sm:px-12">
          <div className="relative w-full h-12 flex items-center justify-between">
            {/* Connected horizontal track line */}
            <div className="absolute left-0 right-0 h-1.5 bg-[#E7E2DA] rounded-full top-1/2 -translate-y-1/2">
              <div
                className="h-full bg-[#18534F] rounded-full transition-all duration-300"
                style={{ width: activeTimelineStep === 1 ? '0%' : activeTimelineStep === 2 ? '50%' : '100%' }}
              />
            </div>

            {/* Step 1: First Noticed */}
            <button
              type="button"
              onClick={() => setActiveTimelineStep(1)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                activeTimelineStep === 1
                  ? 'bg-[#18534F] text-white shadow-md font-bold scale-110 ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#78716C] border-2 border-[#18534F] group-hover:scale-105'
              }`}>
                1
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] mt-2 font-semibold">
                FIRST NOTICED
              </span>
            </button>

            {/* Step 2: Concern Grew */}
            <button
              type="button"
              onClick={() => setActiveTimelineStep(2)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                activeTimelineStep === 2
                  ? 'bg-[#18534F] text-white shadow-md font-bold scale-110 ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#78716C] border-2 border-[#18534F] group-hover:scale-105'
              }`}>
                2
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] mt-2 font-semibold">
                CONCERN GREW
              </span>
            </button>

            {/* Step 3: Now */}
            <button
              type="button"
              onClick={() => setActiveTimelineStep(3)}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                activeTimelineStep === 3
                  ? 'bg-[#18534F] text-white shadow-md font-bold scale-110 ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#78716C] border-2 border-[#18534F] group-hover:scale-105'
              }`}>
                3
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#18534F] mt-2 font-bold">
                NOW
              </span>
            </button>
          </div>
        </div>

        {/* 3 Milestone Explanatory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Milestone 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeTimelineStep === 1
              ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs'
              : 'bg-[#FAF8F5] border-[#E7E2DA] opacity-80'
          }`}>
            <span className="w-5 h-5 rounded-full bg-white border border-[#CDC5B8] font-mono text-[10px] font-bold text-[#18534F] flex items-center justify-center mb-2">
              1
            </span>
            <h5 className="font-semibold text-xs text-[#1B1F23]">When it first became noticeable</h5>
            <p className="text-[11px] text-[#635C52] mt-1 leading-relaxed">
              This is where your hair concern began ({durationLabel}).
            </p>
          </div>

          {/* Milestone 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeTimelineStep === 2
              ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs'
              : 'bg-[#FAF8F5] border-[#E7E2DA] opacity-80'
          }`}>
            <span className="w-5 h-5 rounded-full bg-white border border-[#CDC5B8] font-mono text-[10px] font-bold text-[#18534F] flex items-center justify-center mb-2">
              2
            </span>
            <h5 className="font-semibold text-xs text-[#1B1F23]">As time passed</h5>
            <p className="text-[11px] text-[#635C52] mt-1 leading-relaxed">
              Your concern became more important to you, leading to initial exploration and observation.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeTimelineStep === 3
              ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs'
              : 'bg-[#FAF8F5] border-[#E7E2DA] opacity-80'
          }`}>
            <span className="w-5 h-5 rounded-full bg-[#18534F] text-white font-mono text-[10px] font-bold flex items-center justify-center mb-2">
              3
            </span>
            <h5 className="font-semibold text-xs text-[#18534F]">Today</h5>
            <p className="text-[11px] text-[#635C52] mt-1 leading-relaxed">
              Your current responses show that you're now thinking more specifically about what you'd like to change.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOWER CONTAINER: Change × Importance Matrix (2x2 Grid)               */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#18534F]">explore</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold">
                CHANGE × IMPORTANCE
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23] font-normal leading-snug">
              Is this mainly about the amount of change, or about how much that change matters to you?
            </h3>
            <p className="text-xs text-[#524B40] leading-relaxed">
              This helps us understand what's driving your motivation and where restoration fits into your life priorities.
            </p>
          </div>

          {/* Right Column: 2x2 Matrix Graphic */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] mb-2 font-semibold">
              HOW MUCH IT MATTERS ↑
            </span>

            <div className="relative w-full max-w-[420px] aspect-[4/3] bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] p-4 flex flex-col justify-between">
              {/* Axes Crosshair lines */}
              <div className="absolute inset-x-4 top-1/2 h-[1px] bg-[#CDC5B8]" />
              <div className="absolute inset-y-4 left-1/2 w-[1px] bg-[#CDC5B8]" />

              {/* 4 Quadrants */}
              <div className="grid grid-cols-2 grid-rows-2 h-full gap-2 relative z-10">
                {/* Top-Left Quadrant */}
                <div className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                  currentQuadrant === 'big_change_less_priority'
                    ? 'bg-[#E8F0E6] border-[#18534F] shadow-xs'
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#524B40] font-semibold">
                    BIG CHANGE
                  </span>
                  <span className="text-[11px] text-[#78716C]">(LESS PRIORITY)</span>
                </div>

                {/* Top-Right Quadrant (Optimal Motivation Match in Screenshot) */}
                <div className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                  currentQuadrant === 'big_change_high_priority'
                    ? 'bg-[#D7E7D2]/80 border-[#18534F] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#18534F] font-bold">
                      BIG CHANGE
                    </span>
                    <span className="w-3 h-3 rounded-full bg-[#18534F] ring-4 ring-[#D7E7D2] animate-pulse" />
                  </div>
                  <span className="text-[11px] text-[#18534F] font-semibold">(HIGH PRIORITY)</span>
                </div>

                {/* Bottom-Left Quadrant */}
                <div className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                  currentQuadrant === 'small_change_lower_priority'
                    ? 'bg-[#E8F0E6] border-[#18534F] shadow-xs'
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#524B40] font-semibold">
                    SMALL CHANGE
                  </span>
                  <span className="text-[11px] text-[#78716C]">(LOWER PRIORITY)</span>
                </div>

                {/* Bottom-Right Quadrant */}
                <div className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition-all ${
                  currentQuadrant === 'small_change_high_priority'
                    ? 'bg-[#E8F0E6] border-[#18534F] shadow-xs'
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#524B40] font-semibold">
                    SMALL CHANGE
                  </span>
                  <span className="text-[11px] text-[#78716C]">(NOTICEABLE)</span>
                </div>
              </div>

              {/* Axis Edge Labels */}
              <div className="flex justify-between text-[10px] font-mono text-[#8E877E] pt-1 px-1">
                <span>← LESS CHANGE</span>
                <span>MORE CHANGE →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM KEY TAKEAWAY BAR                                              */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
            <span className="material-symbols-outlined text-[18px]">spa</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              KEY TAKEAWAY
            </span>
            <p className="font-serif text-base sm:text-lg text-[#1B1F23]">
              Your journey highlights a growing priority for decisive, natural-looking restoration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right sm:border-l sm:border-[#F0EBE1] sm:pl-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] max-w-[200px] leading-tight">
            THIS MAP HELPS US BUILD A PLAN THAT FOCUSES ON WHAT MATTERS MOST TO YOU.
          </p>
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-[#CDC5B8]">
            <path d="M0,10 Q10,2 20,10 T40,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
