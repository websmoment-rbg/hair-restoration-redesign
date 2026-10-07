import React, { useState, useRef, useEffect, useCallback } from 'react';

// Central Scalp Visuals for each timeline stage
import t0Img from '../assets/images/timeline_t0_scalp_1791102055036.jpg';
import t1Img from '../assets/images/timeline_t1_scalp_1791102070491.jpg';
import t2Img from '../assets/images/timeline_t2_scalp_1791102082819.jpg';
import t3Img from '../assets/images/timeline_t3_scalp_1791102096219.jpg';
import scalpMicroImg from '../assets/images/scalp_micro_view_1791102110543.jpg';

export type StageKey = 'T0' | 'T1' | 'T2' | 'T3';
export type LayerMode = 'timeline' | 'follicles' | 'emergence' | 'maturation';

interface StageData {
  key: StageKey;
  stepIndex: number;
  timeLabel: string;
  phaseLabel: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  details: {
    title: string;
    points: string[];
  };
}

const STAGES: StageData[] = [
  {
    key: 'T0',
    stepIndex: 0,
    timeLabel: 'DAY 0',
    phaseLabel: 'INCEPTION',
    title: 'Assessment & Blueprint',
    description:
      'Completion of the 20-question profile followed by detailed microscopic donor evaluation and graft calculation.',
    tag: 'ALL DETAILS CAPTURED',
    image: t0Img,
    details: {
      title: 'WHAT HAPPENS AT THIS STAGE?',
      points: [
        'Detailed trichoscopic assessment of donor and recipient scalp areas',
        'Algorithmic Norwood-Hamilton and Ludwig vector classification',
        'Safe donor zone follicular density and caliber baseline mapping'
      ]
    }
  },
  {
    key: 'T1',
    stepIndex: 1,
    timeLabel: 'WEEKS 2–8',
    phaseLabel: 'TELOGEN PHASE',
    title: 'Follicular Acclimation',
    description:
      'The transplanted follicles undergo normal shed cycles. Scalp tissue recovers full vascular integrity.',
    tag: 'TISSUE ACCLIMATION VERIFIED',
    image: t1Img,
    details: {
      title: 'WHAT HAPPENS AT THIS STAGE?',
      points: [
        'Transplanted hair shafts shed as follicles enter temporary telogen resting phase',
        'Micro-vascular revascularization securely locks follicular dermal papillae',
        'Topical and biological scalp therapy initiated to prepare follicular matrix'
      ]
    }
  },
  {
    key: 'T2',
    stepIndex: 2,
    timeLabel: 'MONTHS 4–6',
    phaseLabel: 'ANAGEN RE-ENTRY',
    title: 'Early Emergence',
    description:
      'Fine, new hair shafts begin visible emergence. Initial directional growth patterns establish along the hairline.',
    tag: 'ACTIVE ANAGEN ACTIVATED',
    image: t2Img,
    details: {
      title: 'WHAT HAPPENS AT THIS STAGE?',
      points: [
        'Re-entry into active anagen growth phase with fine, emergent hair shafts',
        'Aesthetic directional angles and natural whorl patterns take shape',
        'Initial visible coverage softens anterior recession zones'
      ]
    }
  },
  {
    key: 'T3',
    stepIndex: 3,
    timeLabel: 'MONTHS 12–15',
    phaseLabel: 'FINAL MATURITY',
    title: 'Full Density Realization',
    description:
      'Terminal hair diameter reached. Seamless integration with native hair creates permanent, natural aesthetic fullness.',
    tag: 'AESTHETIC FULLNESS ACHIEVED',
    image: t3Img,
    details: {
      title: 'WHAT HAPPENS AT THIS STAGE?',
      points: [
        'Terminal shaft diameter and natural texture maturation fully realized',
        'Seamless organic integration with surrounding native follicular units',
        'Long-term aesthetic density and permanent facial framing complete'
      ]
    }
  }
];

interface HotspotInfo {
  id: 'hairline' | 'crown' | 'donor';
  label: string;
  title: string;
  description: string;
  // Percentage coordinates relative to central circle
  dotX: number;
  dotY: number;
  lineEndX: number;
  lineEndY: number;
  labelX: number;
  labelY: number;
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: 'hairline',
    label: 'Hairline',
    title: 'Hairline Design',
    description:
      'Hairline design influences facial framing, temporal point angles, and youthful proportions. Evaluated for natural micro-irregularities.',
    dotX: 43,
    dotY: 30,
    lineEndX: 30,
    lineEndY: 18,
    labelX: 18,
    labelY: 14
  },
  {
    id: 'crown',
    label: 'Crown Density',
    title: 'Vertex Crown Architecture',
    description:
      'Crown density perception develops progressively as restoration develops. Multi-directional follicular whorl patterns are preserved.',
    dotX: 62,
    dotY: 34,
    lineEndX: 74,
    lineEndY: 22,
    labelX: 84,
    labelY: 18
  },
  {
    id: 'donor',
    label: 'Donor Area',
    title: 'Safe Donor Zone',
    description:
      'The permanent donor region is evaluated for follicular unit extraction density, hair shaft caliber, and long-term viability.',
    dotX: 38,
    dotY: 58,
    lineEndX: 28,
    lineEndY: 60,
    labelX: 18,
    labelY: 60
  }
];

export const RestorationJourneyTimeline: React.FC = () => {
  const [activeStageKey, setActiveStageKey] = useState<StageKey>('T0');
  const [layerMode, setLayerMode] = useState<LayerMode>('timeline');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo | null>(null);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrubberTrackRef = useRef<HTMLDivElement>(null);

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeStageKey);
  const currentStage = STAGES[currentStageIndex] || STAGES[0];

  // Drag scrubber handler (mouse & touch)
  const handleScrubberMove = useCallback((clientX: number) => {
    if (!scrubberTrackRef.current) return;
    const rect = scrubberTrackRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const fraction = relativeX / rect.width;

    // Map fraction 0..1 to 4 stages
    let targetIndex = Math.round(fraction * (STAGES.length - 1));
    targetIndex = Math.max(0, Math.min(STAGES.length - 1, targetIndex));
    setActiveStageKey(STAGES[targetIndex].key);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleScrubberMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleScrubberMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleScrubberMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleScrubberMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleScrubberMove]);

  // Gentle scroll reveal & progression through stages
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When section is centered in viewport, progress stages naturally if visitor is scrolling through
      const sectionProgress = (windowHeight * 0.6 - rect.top) / rect.height;
      if (sectionProgress >= 0 && sectionProgress <= 1) {
        const step = Math.min(3, Math.max(0, Math.floor(sectionProgress * 4)));
        // Only update if not currently dragging
        if (!isDragging) {
          // Keep synchronized
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging]);

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-[#F9F8F5] overflow-hidden select-none border-t border-[#EAE4D8]"
    >
      {/* Background delicate artistic leaf shadow in top-left (from reference image) */}
      <div className="absolute -top-12 -left-12 w-64 sm:w-80 h-64 sm:h-80 pointer-events-none opacity-30 filter blur-sm">
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#485643]" fill="currentColor">
          <path d="M10 20 C 50 40, 80 80, 110 140 C 90 90, 80 50, 40 10 Z" />
          <path d="M30 40 C 70 70, 110 110, 140 170 C 120 120, 100 80, 60 30 Z" opacity="0.8" />
          <path d="M60 60 C 100 90, 130 130, 160 190 C 140 140, 120 100, 80 50 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Decorative subtle hair follicle motif at bottom-right (from reference image) */}
      <div className="absolute -bottom-16 -right-12 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none opacity-30">
        <svg viewBox="0 0 260 260" className="w-full h-full text-[#BBA075]" fill="none">
          <circle cx="180" cy="180" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="180" cy="180" r="90" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <path d="M140 190 C 150 150, 180 120, 220 80" stroke="#8F7855" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M155 195 C 165 155, 195 125, 235 85" stroke="#8F7855" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="max-w-[1380px] mx-auto relative z-10">
        
        {/* ========================================================== */}
        {/* 1. SECTION HEADER (From Reference Image)                   */}
        {/* ========================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          {/* Subtitle with thin flanking lines */}
          <div className="inline-flex items-center justify-center gap-4 mb-3">
            <span className="w-10 sm:w-16 h-[1px] bg-[#CBB99F]/80" />
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.25em] text-[#6B7567] font-medium">
              TEMPORAL HORIZONS
            </span>
            <span className="w-10 sm:w-16 h-[1px] bg-[#CBB99F]/80" />
          </div>

          {/* Main Title */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1B201A] font-normal tracking-tight leading-[1.18]">
            The Restoration Journey Timeline
          </h2>

          {/* Subtitle / Supporting text */}
          <p className="text-sm sm:text-base text-[#576054] mt-3 font-normal max-w-xl mx-auto">
            From diagnostic initiation to definitive aesthetic density.
          </p>
        </div>

        {/* ========================================================== */}
        {/* 2. THREE-COLUMN DESKTOP COMPOSITION (Reference Image)      */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          
          {/* -------------------------------------------------------- */}
          {/* LEFT COLUMN: Exploration Controls & Scalp View Card       */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-6 order-3 lg:order-1">
            
            {/* Exploration Controls Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#EBE4D8] shadow-sm">
              <span className="text-[11px] font-mono tracking-widest text-[#7C8478] uppercase font-semibold block mb-4">
                EXPLORE THE JOURNEY
              </span>

              <div className="space-y-2">
                {/* 1. Timeline */}
                <button
                  onClick={() => setLayerMode('timeline')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left cursor-pointer ${
                    layerMode === 'timeline'
                      ? 'bg-[#5D6B57] text-white shadow-sm'
                      : 'text-[#474741] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Timeline</span>
                </button>

                {/* 2. Follicles */}
                <button
                  onClick={() => setLayerMode('follicles')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left cursor-pointer ${
                    layerMode === 'follicles'
                      ? 'bg-[#5D6B57] text-white shadow-sm'
                      : 'text-[#474741] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C12 7 9 11 9 15a3 3 0 0 0 6 0c0-4-3-8-3-13z" />
                  </svg>
                  <span>Follicles</span>
                </button>

                {/* 3. Hair Emergence */}
                <button
                  onClick={() => setLayerMode('emergence')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left cursor-pointer ${
                    layerMode === 'emergence'
                      ? 'bg-[#5D6B57] text-white shadow-sm'
                      : 'text-[#474741] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 22V6M12 22V2M16 22V10" strokeLinecap="round" />
                  </svg>
                  <span>Hair Emergence</span>
                </button>

                {/* 4. Maturation */}
                <button
                  onClick={() => setLayerMode('maturation')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left cursor-pointer ${
                    layerMode === 'maturation'
                      ? 'bg-[#5D6B57] text-white shadow-sm'
                      : 'text-[#474741] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" strokeLinejoin="round" />
                  </svg>
                  <span>Maturation</span>
                </button>
              </div>
            </div>

            {/* Interactive Scalp View Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#EBE4D8] shadow-sm">
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F0ECE1] mb-3.5 border border-stone-200/50 shadow-inner">
                <img
                  src={scalpMicroImg}
                  alt="Microscopic follicle scalp dermis examination"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-serif text-lg text-[#1B201A] font-medium leading-snug">
                Interactive Scalp View
              </h3>
              <p className="text-xs text-[#555C52] leading-relaxed mt-1.5 font-normal">
                Explore how your hair, follicles and scalp evolve through each stage of the restoration journey.
              </p>
            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* CENTER COLUMN: Central Scalp Visual & Time Scrubber      */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Circular Scalp Display with Target Rings & Hotspots */}
            <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
              
              {/* Outer Golden Concentric Target Grid (from reference image) */}
              <div className="absolute inset-0 pointer-events-none">
                <svg viewBox="0 0 420 420" className="w-full h-full text-[#D9CDBC]" fill="none">
                  <circle cx="210" cy="210" r="195" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <circle cx="210" cy="210" r="170" stroke="#CBB99F" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx="210" cy="210" r="150" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                  {/* Subtle radial degree marks */}
                  <line x1="210" y1="10" x2="210" y2="18" stroke="#CBB99F" strokeWidth="1" />
                  <line x1="210" y1="402" x2="210" y2="410" stroke="#CBB99F" strokeWidth="1" />
                  <line x1="10" y1="210" x2="18" y2="210" stroke="#CBB99F" strokeWidth="1" />
                  <line x1="402" y1="210" x2="410" y2="210" stroke="#CBB99F" strokeWidth="1" />
                </svg>
              </div>

              {/* Central Scalp Circular Mask */}
              <div className="relative w-[300px] sm:w-[330px] aspect-square rounded-full overflow-hidden shadow-2xl border-4 border-[#FDFBF7] ring-1 ring-[#D8CCBD]/80">
                {/* Cross-fade between 4 stage images */}
                {STAGES.map((stage) => {
                  const isActive = stage.key === activeStageKey;
                  return (
                    <img
                      key={stage.key}
                      src={stage.image}
                      alt={`Scalp visual state at ${stage.timeLabel}: ${stage.title}`}
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                      loading="lazy"
                    />
                  );
                })}

                {/* Layer Overlays (Follicles, Emergence, Maturation) */}
                {layerMode === 'follicles' && (
                  <div className="absolute inset-0 z-20 pointer-events-none bg-radial from-amber-500/15 via-transparent to-transparent flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-full h-full text-[#BBA075]/80" fill="none">
                      <circle cx="150" cy="110" r="4" fill="currentColor" />
                      <circle cx="165" cy="120" r="3.5" fill="currentColor" />
                      <circle cx="135" cy="120" r="3.5" fill="currentColor" />
                      <circle cx="150" cy="135" r="4" fill="currentColor" />
                      <circle cx="150" cy="110" r="28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                  </div>
                )}

                {layerMode === 'emergence' && (
                  <div className="absolute inset-0 z-20 pointer-events-none bg-radial from-emerald-500/10 via-transparent to-transparent" />
                )}

                {layerMode === 'maturation' && (
                  <div className="absolute inset-0 z-20 pointer-events-none bg-radial from-amber-700/10 via-transparent to-transparent" />
                )}
              </div>

              {/* Interactive Hotspots Overlaid on the Visual */}
              {HOTSPOTS.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;

                return (
                  <React.Fragment key={hotspot.id}>
                    {/* SVG Connector Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                      <line
                        x1={`${hotspot.dotX}%`}
                        y1={`${hotspot.dotY}%`}
                        x2={`${hotspot.lineEndX}%`}
                        y2={`${hotspot.lineEndY}%`}
                        stroke="#CBB99F"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                    </svg>

                    {/* Circular Target Dot on the Scalp */}
                    <button
                      onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
                      className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? 'scale-125 ring-4 ring-[#BBA075]/50 bg-[#43503E]'
                          : 'bg-white border-2 border-[#BBA075] hover:scale-115'
                      }`}
                      style={{
                        left: `${hotspot.dotX}%`,
                        top: `${hotspot.dotY}%`
                      }}
                      title={`Inspect ${hotspot.label}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#BBA075]'}`} />
                    </button>

                    {/* Hotspot Text Label Badge */}
                    <button
                      onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
                      className={`absolute z-30 text-[11px] font-mono tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'text-[#1B201A] underline decoration-[#BBA075] decoration-2'
                          : 'text-[#474741] hover:text-[#1B201A]'
                      }`}
                      style={{
                        left: `${hotspot.labelX}%`,
                        top: `${hotspot.labelY}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {hotspot.label}
                    </button>
                  </React.Fragment>
                );
              })}

              {/* Hotspot Floating Tooltip / Drawer */}
              {selectedHotspot && (
                <div className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#BBA075]/80 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#BBA075] uppercase font-bold">
                      ANATOMICAL VECTOR
                    </span>
                    <button
                      onClick={() => setSelectedHotspot(null)}
                      className="text-[#7C8478] hover:text-[#1B201A] text-sm cursor-pointer p-0.5"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="font-serif text-base text-[#1B201A] font-medium leading-tight">
                    {selectedHotspot.title}
                  </h4>
                  <p className="text-xs text-[#555C52] leading-relaxed mt-1.5 font-normal">
                    {selectedHotspot.description}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline Scrubber Component */}
            <div className="w-full max-w-[420px] mt-8 px-2 sm:px-4">
              
              {/* Scrubber Track Bar */}
              <div
                ref={scrubberTrackRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="relative h-12 flex items-center cursor-pointer select-none"
              >
                {/* Background Connecting Rail */}
                <div className="w-full h-[2px] bg-[#E0D7C9] rounded-full relative">
                  {/* Active Filled Progress Rail */}
                  <div
                    className="h-full bg-gradient-to-r from-[#BBA075] to-[#5D6B57] rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {/* 4 Stage Fixed Nodes along the track */}
                <div className="absolute inset-x-0 flex justify-between pointer-events-none">
                  {STAGES.map((s, idx) => {
                    const isPassed = idx <= currentStageIndex;
                    const isSelected = s.key === activeStageKey;

                    return (
                      <div
                        key={s.key}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-xs font-semibold transition-all duration-300 border ${
                          isSelected
                            ? 'bg-[#43503E] text-white border-[#BBA075] scale-110 shadow-md ring-4 ring-[#BBA075]/20'
                            : isPassed
                            ? 'bg-[#F4F1EA] text-[#43503E] border-[#CBB99F]'
                            : 'bg-white text-[#8A9287] border-[#E0D7C9]'
                        }`}
                      >
                        {s.key}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time Labels under the 4 nodes */}
              <div className="flex justify-between text-[11px] font-mono tracking-wider text-[#6B7567] mt-1 uppercase">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setActiveStageKey(s.key)}
                    className={`cursor-pointer transition-colors ${
                      s.key === activeStageKey ? 'text-[#1B201A] font-bold' : 'hover:text-[#1B201A]'
                    }`}
                  >
                    {s.timeLabel}
                  </button>
                ))}
              </div>

              {/* Underneath Instruction: DRAG TO EXPLORE */}
              <div className="text-center mt-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C9588] font-medium flex items-center justify-center gap-3">
                  <span className="w-8 h-[1px] bg-[#CBB99F]/70" />
                  DRAG TO EXPLORE
                  <span className="w-8 h-[1px] bg-[#CBB99F]/70" />
                </span>
              </div>

            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* RIGHT COLUMN: Active Stage Card & 4 Selectable Rows      */}
          {/* -------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Top Primary Active Stage Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-[#EBE4D8] shadow-sm transition-all duration-300">
              {/* Header row: Badge + Subtitle + Right Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#43503E] text-white flex items-center justify-center text-xs font-serif font-semibold">
                    {currentStage.key}
                  </div>
                  <span className="text-[11px] font-mono tracking-wider text-[#7C8478] uppercase font-semibold">
                    {currentStage.timeLabel} · {currentStage.phaseLabel}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#F4F1EA] border border-[#E5E0D5] flex items-center justify-center text-[#5D6B57]">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-2xl text-[#1B201A] font-normal tracking-tight leading-snug">
                {currentStage.title}
              </h3>
              <p className="text-xs sm:text-[13.5px] text-[#555C52] leading-relaxed mt-2.5 font-normal">
                {currentStage.description}
              </p>

              {/* Bottom Tag / Expand Details CTA */}
              <div className="mt-5 pt-3.5 border-t border-[#F2ECE1] flex items-center justify-between">
                <button
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                  className="w-full flex items-center justify-between text-[11px] font-mono tracking-wider text-[#7C8478] hover:text-[#1B201A] uppercase font-semibold transition-colors cursor-pointer"
                >
                  <span>{currentStage.tag}</span>
                  <span className={`text-base text-[#BBA075] transition-transform duration-300 ${isDetailsExpanded ? 'rotate-90' : ''}`}>
                    ›
                  </span>
                </button>
              </div>

              {/* Expandable Detail Drawer */}
              {isDetailsExpanded && (
                <div className="mt-3 pt-3 border-t border-dashed border-[#E5DFD3] space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <span className="text-[10px] font-mono tracking-widest text-[#BBA075] uppercase font-bold block mb-1">
                    {currentStage.details.title}
                  </span>
                  {currentStage.details.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#555C52]">
                      <span className="font-mono text-[10px] text-[#BBA075] mt-0.5">0{i + 1}</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Selectable Stage Rows (List from reference image) */}
            <div className="space-y-2.5">
              {STAGES.map((stage) => {
                const isSelected = stage.key === activeStageKey;

                return (
                  <button
                    key={stage.key}
                    onClick={() => setActiveStageKey(stage.key)}
                    className={`w-full flex items-center gap-3.5 p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F7F5EE] border-[#BBA075]/70 shadow-xs'
                        : 'bg-white/95 border-[#EBE4D8] hover:bg-[#FAF8F3] hover:border-[#D5CABB]'
                    }`}
                  >
                    {/* Stage Thumbnail */}
                    <div className="shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-[#F0ECE1] border border-stone-200/60 shadow-2xs">
                      <img
                        src={stage.image}
                        alt={stage.title}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>

                    {/* Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-semibold shrink-0 ${
                        isSelected
                          ? 'bg-[#43503E] text-white'
                          : 'bg-[#F0ECE1] text-[#556150]'
                      }`}
                    >
                      {stage.key}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="block text-[10px] font-mono tracking-wider text-[#7C8478] uppercase truncate">
                        {stage.timeLabel} · {stage.phaseLabel}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base text-[#1B201A] font-normal truncate">
                        {stage.title}
                      </h4>
                    </div>

                    {/* Right Chevron */}
                    <span className="text-[#8C9588] text-base shrink-0">
                      ›
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ========================================================== */}
        {/* 3. BOTTOM FEATURES BAR (From Reference Image)              */}
        {/* ========================================================== */}
        <div className="mt-20 pt-10 border-t border-[#EAE4D8]">
          {/* Centered Brand Tagline */}
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#6B7567] font-semibold flex items-center justify-center gap-3">
              <span className="w-10 sm:w-16 h-[1px] bg-[#CBB99F]/70" />
              REAL SCIENCE. NATURAL RESULTS.
              <span className="w-10 sm:w-16 h-[1px] bg-[#CBB99F]/70" />
            </span>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* 1. Personalized Approach */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#1B201A] font-medium">
                Personalized Approach
              </span>
            </div>

            {/* 2. Evidence-Based Methods */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#1B201A] font-medium">
                Evidence-Based Methods
              </span>
            </div>

            {/* 3. Natural Looking Results */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2C12 7 9 11 9 15a3 3 0 0 0 6 0c0-4-3-8-3-13z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#1B201A] font-medium">
                Natural Looking Results
              </span>
            </div>

            {/* 4. Long-Term Confidence */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center text-[#4A5546] shrink-0 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#1B201A] font-medium">
                Long-Term Confidence
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default RestorationJourneyTimeline;
