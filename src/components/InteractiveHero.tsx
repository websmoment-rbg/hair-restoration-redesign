import React, { useState, useEffect, useRef } from 'react';

// Real clinical assets
import heroManImg from '../assets/images/hero_man_profile_1791103781102.jpg';
import hairlineThumbImg from '../assets/images/hairline_thumb_1791103798047.jpg';
import scalpMicroImg from '../assets/images/scalp_micro_view_1791102110543.jpg';
import t2Img from '../assets/images/timeline_t2_scalp_1791102082819.jpg';

interface InteractiveHeroProps {
  onStartAssessment: () => void;
  onNavigate?: (page: string) => void;
}

type HotspotKey = 'hairline' | 'crown' | 'donor';

interface HotspotDetails {
  key: HotspotKey;
  label: string;
  title: string;
  description: string;
  image: string;
  index: number;
}

const HOTSPOTS_DATA: Record<HotspotKey, HotspotDetails> = {
  hairline: {
    key: 'hairline',
    label: 'Hairline',
    title: 'Hairline Analysis',
    description: 'Hairline design influences the overall visual framing of the face.',
    image: hairlineThumbImg,
    index: 0
  },
  crown: {
    key: 'crown',
    label: 'Crown Density',
    title: 'Crown Density Analysis',
    description: 'Explore how perceived density and change over time are represented in your profile.',
    image: t2Img,
    index: 1
  },
  donor: {
    key: 'donor',
    label: 'Donor Area',
    title: 'Donor Area Evaluation',
    description: 'Donor characteristics can be discussed and evaluated with a specialist.',
    image: scalpMicroImg,
    index: 2
  }
};

const HOTSPOT_KEYS: HotspotKey[] = ['hairline', 'crown', 'donor'];

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({ onStartAssessment }) => {
  const [activeHotspot, setActiveHotspot] = useState<HotspotKey>('hairline');
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [progressBarWidth, setProgressBarWidth] = useState<number>(0);
  const [isHoveringVisual, setIsHoveringVisual] = useState<boolean>(false);

  const visualContainerRef = useRef<HTMLDivElement>(null);

  // Animate progress bar once upon initial entrance (0 -> 75%)
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressBarWidth(75);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Subtle mouse movement parallax on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!visualContainerRef.current) return;
    const rect = visualContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    setParallaxOffset({
      x: Math.max(-1, Math.min(1, normalizedX)),
      y: Math.max(-1, Math.min(1, normalizedY))
    });
  };

  const handleMouseLeave = () => {
    setIsHoveringVisual(false);
    setParallaxOffset({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHoveringVisual(true);
  };

  // Cycle next hotspot for the top card
  const handleNextHotspot = () => {
    const currentIndex = HOTSPOT_KEYS.indexOf(activeHotspot);
    const nextKey = HOTSPOT_KEYS[(currentIndex + 1) % HOTSPOT_KEYS.length];
    setActiveHotspot(nextKey);
  };

  const currentHotspotData = HOTSPOTS_DATA[activeHotspot];

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-8 lg:px-14 max-w-[1440px] mx-auto overflow-hidden select-none bg-[#F9F8F5]">
      
      {/* ========================================================== */}
      {/* MAIN TWO-COLUMN LAYERED HERO GRID                          */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center min-h-[640px] xl:min-h-[700px]">
        
        {/* -------------------------------------------------------- */}
        {/* LEFT COLUMN: Editorial Typography, CTAs & Value Props     */}
        {/* -------------------------------------------------------- */}
        <div className="lg:col-span-5 xl:col-span-5 z-20 flex flex-col justify-center space-y-6 sm:space-y-7">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E8E6DF] border border-[#DDD9CE] w-fit shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#52604D]"></span>
            <span className="text-[11px] font-mono font-medium uppercase tracking-[0.16em] text-[#474B43]">
              DETERMINISTIC CLINICAL ANALYSIS PROTOCOL
            </span>
          </div>

          {/* Main Editorial Heading */}
          <div className="space-y-1">
            <h1 className="font-serif text-4xl sm:text-5xl xl:text-[56px] text-[#1B201A] font-medium tracking-tight leading-[1.12]">
              Understand Your Hair.
            </h1>
            <div className="relative inline-block">
              <span className="font-serif italic font-normal text-3xl sm:text-4xl xl:text-[52px] text-[#2C3229] leading-[1.15]">
                Explore What Could Be Possible.
              </span>
              {/* Subtle organic sage green watercolor curve line beneath (from reference image) */}
              <svg
                viewBox="0 0 380 14"
                className="w-full h-3 sm:h-3.5 text-[#546252]/60 mt-1 pointer-events-none overflow-visible"
                fill="none"
              >
                <path
                  d="M 4 8 C 80 2, 220 12, 376 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base text-[#575E54] font-normal leading-relaxed max-w-lg">
            Answer 20 simple questions about your hair, what you&apos;ve noticed, and what you&apos;d like to change. We&apos;ll turn your responses into a personalized restoration profile to help you prepare for a conversation with a specialist.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
            {/* Primary CTA */}
            <button
              onClick={onStartAssessment}
              className="bg-[#1C1E1A] hover:bg-[#2A2E26] text-white px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all text-center flex items-center justify-center gap-3 group shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Start My Hair Assessment</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            {/* Secondary CTA */}
            <a
              href="#hair-restoration-journey"
              className="bg-[#FAF8F3] hover:bg-[#F0ECE1] text-[#1B201A] border border-[#DDD5C5] px-6 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#546252]" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>How It Works</span>
            </a>
          </div>

        </div>

        {/* -------------------------------------------------------- */}
        {/* RIGHT COLUMN: Layered Interactive Visual Showcase        */}
        {/* -------------------------------------------------------- */}
        <div
          ref={visualContainerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-7 xl:col-span-7 relative w-full h-[540px] sm:h-[600px] xl:h-[660px] flex items-center justify-center"
        >
          {/* Layer 0: Subtle Golden Concentric Analysis Rings in Background */}
          <div
            className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out flex items-center justify-center"
            style={{
              transform: `translate3d(${parallaxOffset.x * 4}px, ${parallaxOffset.y * 4}px, 0)`
            }}
          >
            <svg viewBox="0 0 700 700" className="w-[110%] h-[110%] text-[#D9CDBC] overflow-visible" fill="none">
              <circle cx="370" cy="320" r="260" stroke="#CBB99F" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
              <circle cx="370" cy="320" r="320" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
              {/* Radial subtle crosshairs */}
              <line x1="110" y1="320" x2="630" y2="320" stroke="#CBB99F" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 4" />
              <line x1="370" y1="60" x2="370" y2="580" stroke="#CBB99F" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 4" />
            </svg>
          </div>

          {/* Layer 1: Main Hero Photograph with Organic Feathering */}
          <div
            className="relative w-[340px] sm:w-[440px] xl:w-[500px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#EDE7DC] bg-[#FAF8F5] transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${parallaxOffset.x * 6}px, ${parallaxOffset.y * 6}px, 0)`
            }}
          >
            <img
              src={heroManImg}
              alt="Male patient profile with visible hairline and hair density"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle soft gradient vignette blending into bottom and left */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F5]/50 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Layer 2: Interactive Hotspots pinned to anatomy */}
          {/* HOTSPOT 1: CROWN DENSITY (Top Crown) */}
          <div
            className="absolute transition-transform duration-500 ease-out z-30"
            style={{
              top: '18%',
              left: '42%',
              transform: `translate3d(${parallaxOffset.x * 8}px, ${parallaxOffset.y * 8}px, 0)`
            }}
          >
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setActiveHotspot('crown')}
                className={`px-3 py-1 rounded-full text-xs font-serif font-medium transition-all shadow-xs cursor-pointer ${
                  activeHotspot === 'crown'
                    ? 'bg-[#1C1E1A] text-white ring-2 ring-[#BBA075]'
                    : 'bg-white/95 text-[#1B201A] border border-[#DDD5C5] hover:bg-[#FAF8F5]'
                }`}
              >
                Crown Density
              </button>

              {/* Glowing Target Node on the Crown */}
              <button
                onClick={() => setActiveHotspot('crown')}
                className="relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer group"
              >
                <span className="w-4 h-4 rounded-full bg-white border-2 border-[#BBA075] shadow-xs flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeHotspot === 'crown' ? 'bg-[#52604D]' : 'bg-[#BBA075]'}`} />
                </span>
                <span className="absolute -inset-1 rounded-full border border-[#BBA075]/60 animate-ping pointer-events-none" />
              </button>
            </div>
          </div>

          {/* HOTSPOT 2: HAIRLINE (Front Temple) */}
          <div
            className="absolute transition-transform duration-500 ease-out z-30"
            style={{
              top: '28%',
              right: '22%',
              transform: `translate3d(${parallaxOffset.x * 9}px, ${parallaxOffset.y * 9}px, 0)`
            }}
          >
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setActiveHotspot('hairline')}
                className="relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer group"
              >
                <span className="w-4 h-4 rounded-full bg-white border-2 border-[#BBA075] shadow-xs flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeHotspot === 'hairline' ? 'bg-[#52604D]' : 'bg-[#BBA075]'}`} />
                </span>
                <span className="absolute -inset-1 rounded-full border border-[#BBA075]/60 animate-ping pointer-events-none" />
              </button>

              <button
                onClick={() => setActiveHotspot('hairline')}
                className={`px-3 py-1 rounded-full text-xs font-serif font-medium transition-all shadow-xs cursor-pointer ${
                  activeHotspot === 'hairline'
                    ? 'bg-[#1C1E1A] text-white ring-2 ring-[#BBA075]'
                    : 'bg-white/95 text-[#1B201A] border border-[#DDD5C5] hover:bg-[#FAF8F5]'
                }`}
              >
                Hairline
              </button>
            </div>
          </div>

          {/* HOTSPOT 3: DONOR AREA (Back of Head) */}
          <div
            className="absolute transition-transform duration-500 ease-out z-30"
            style={{
              bottom: '42%',
              left: '30%',
              transform: `translate3d(${parallaxOffset.x * 7}px, ${parallaxOffset.y * 7}px, 0)`
            }}
          >
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => setActiveHotspot('donor')}
                className={`px-3 py-1 rounded-full text-xs font-serif font-medium transition-all shadow-xs cursor-pointer ${
                  activeHotspot === 'donor'
                    ? 'bg-[#1C1E1A] text-white ring-2 ring-[#BBA075]'
                    : 'bg-white/95 text-[#1B201A] border border-[#DDD5C5] hover:bg-[#FAF8F5]'
                }`}
              >
                Donor Area
              </button>

              <button
                onClick={() => setActiveHotspot('donor')}
                className="relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer group"
              >
                <span className="w-4 h-4 rounded-full bg-white border-2 border-[#BBA075] shadow-xs flex items-center justify-center">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeHotspot === 'donor' ? 'bg-[#52604D]' : 'bg-[#BBA075]'}`} />
                </span>
                <span className="absolute -inset-1 rounded-full border border-[#BBA075]/60 animate-ping pointer-events-none" />
              </button>
            </div>
          </div>

          {/* Layer 3: Top-Right Floating Inspection Card */}
          <div
            className="absolute top-4 right-0 sm:right-2 xl:-right-2 z-40 max-w-[280px] sm:max-w-[310px] transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallaxOffset.x * 12}px, ${parallaxOffset.y * 12}px, 0)`
            }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-[#EDE7DC]">
              <div className="flex items-start gap-3">
                {/* Thumbnail Image */}
                <div className="shrink-0 w-13 h-13 rounded-xl overflow-hidden bg-[#F0ECE1] border border-stone-200/50">
                  <img
                    src={currentHotspotData.image}
                    alt={currentHotspotData.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-medium text-[#1B201A]">
                      {currentHotspotData.title}
                    </h4>
                    <button
                      onClick={handleNextHotspot}
                      className="text-[#8C9588] hover:text-[#1B201A] cursor-pointer text-sm"
                      title="Next Vector"
                    >
                      ›
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5A6357] leading-tight mt-1 line-clamp-2 font-normal">
                    {currentHotspotData.description}
                  </p>
                </div>
              </div>

              {/* Carousel Pagination Dots */}
              <div className="flex justify-center items-center gap-1.5 mt-3 pt-2 border-t border-[#F2EDE4]">
                {HOTSPOT_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setActiveHotspot(k)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      activeHotspot === k ? 'bg-[#546252] w-3' : 'bg-[#D6CFC3]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Layer 4: Bottom-Right Floating "Follicular Density Mapping" Card */}
          <div
            className="absolute bottom-2 sm:bottom-4 right-0 sm:right-2 xl:-right-4 z-40 w-full max-w-[320px] sm:max-w-[420px] transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${parallaxOffset.x * 10}px, ${parallaxOffset.y * 10}px, 0)`
            }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-[#EDE7DC]">
              {/* Header: Title + Diagnostic Vectors */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-[#546252]">
                  FOLLICULAR DENSITY MAPPING
                </span>
                <span className="text-[11px] text-[#7C8478] font-mono">
                  8 Diagnostic Vectors
                </span>
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-full bg-[#EAE8E2] h-1.5 rounded-full overflow-hidden mb-3.5">
                <div
                  className="bg-[#546252] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressBarWidth}%` }}
                />
              </div>

              {/* Card Body: Thumbnail + 2 Columns Checklist */}
              <div className="flex items-center gap-4">
                {/* Microscopic Follicle Image Thumbnail */}
                <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F0ECE1] border border-stone-200/50 shadow-2xs">
                  <img
                    src={scalpMicroImg}
                    alt="Microscopic follicular units root structure"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* 8 Diagnostic Vectors Checked Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-left flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Hairline</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Goals</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Crown</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Donor Area</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Density</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Scalp Health</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Change</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#2C332A] font-medium">
                    <span className="text-[#546252] text-xs">✓</span>
                    <span>Lifestyle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 5: Mouse / Parallax Instruction Prompt */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-300 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-wider text-[#8A9287] uppercase ${
              isHoveringVisual ? 'opacity-90' : 'opacity-60'
            }`}
          >
            <span>←</span>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#546252]" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="3" width="12" height="18" rx="6" />
              <line x1="12" y1="7" x2="12" y2="10" />
            </svg>
            <span>Move across the image to explore</span>
            <span>→</span>
          </div>

        </div>

      </div>

      {/* ========================================================== */}
      {/* FULL-WIDTH BOTTOM 4 PILLARS BAR (From Reference Image)     */}
      {/* ========================================================== */}
      <div className="mt-14 sm:mt-16 pt-8 border-t border-[#EAE4D8]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* 1. Personalized Approach */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#1B201A] font-medium text-left">
              Personalized Approach
            </span>
          </div>

          {/* 2. Evidence-Based Methods */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#1B201A] font-medium text-left">
              Evidence-Based Methods
            </span>
          </div>

          {/* 3. Natural Looking Results */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C12 7 9 11 9 15a3 3 0 0 0 6 0c0-4-3-8-3-13z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#1B201A] font-medium text-left">
              Natural Looking Results
            </span>
          </div>

          {/* 4. Long-Term Confidence */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#1B201A] font-medium text-left">
              Long-Term Confidence
            </span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default InteractiveHero;
