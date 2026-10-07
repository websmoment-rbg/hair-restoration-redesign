import React, { useState, useRef, useCallback } from 'react';
import headLookingDown from '../../assets/images/head_looking_down_1791205668085.jpg';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';
import hairlineStage1 from '../../assets/images/hairline_stage_1_full_1791204641403.jpg';
import hairlineStage3 from '../../assets/images/hairline_stage_3_mod_1791204673978.jpg';
import hairlineStage4 from '../../assets/images/hairline_stage_4_sig_1791204693426.jpg';
import scalpDens1 from '../../assets/images/scalp_dens_1_full_1791204738531.jpg';
import scalpDens4 from '../../assets/images/scalp_dens_4_thin_1791204817349.jpg';
import timelineT0 from '../../assets/images/timeline_t0_scalp_1791102055036.jpg';
import timelineT3 from '../../assets/images/timeline_t3_scalp_1791102096219.jpg';

interface CaseFrame {
  id: string;
  number: string;
  title: string;
  category: string;
  grafts: string;
  timeline: string;
  notes: string;
  beforeImg: string;
  afterImg: string;
}

const CASES: CaseFrame[] = [
  {
    id: 'case-01',
    number: '01',
    title: 'Frontal Hairline Framing',
    category: 'Norwood Class III Recession',
    grafts: '2,150 Grafts',
    timeline: '14 Months Post-Op',
    notes: 'Single-hair graft feathering along the frontal margin with reinforced temporal transition angles.',
    beforeImg: hairlineStage4,
    afterImg: hairlineStage1
  },
  {
    id: 'case-02',
    number: '02',
    title: 'Crown Vertex Spiral Densification',
    category: 'Norwood Class IV Vertex Thinning',
    grafts: '2,400 Grafts',
    timeline: '15 Months Post-Op',
    notes: 'Rotational placement following the natural whorl trajectory to close visible scalp reflection.',
    beforeImg: scalpDens4,
    afterImg: scalpDens1
  },
  {
    id: 'case-03',
    number: '03',
    title: 'Temporal Angle Advancement',
    category: 'Norwood Class II Early Maturation',
    grafts: '1,650 Grafts',
    timeline: '12 Months Post-Op',
    notes: 'Conservative restoration of lateral peaks to balance upper facial proportions without lowering natural height.',
    beforeImg: hairlineStage3,
    afterImg: hairlineStage1
  },
  {
    id: 'case-04',
    number: '04',
    title: 'Mid-Scalp & Superior Field Fullness',
    category: 'Diffuse Central Thinning',
    grafts: '1,950 Grafts',
    timeline: '13 Months Post-Op',
    notes: 'Micro-slit dense-packing interspersed between native terminal hairs to restore light-blocking opacity.',
    beforeImg: timelineT0,
    afterImg: timelineT3
  },
  {
    id: 'case-05',
    number: '05',
    title: 'Comprehensive Frontal Rebuilding',
    category: 'Norwood Class III-A Significant Recession',
    grafts: '2,350 Grafts',
    timeline: '16 Months Post-Op',
    notes: 'Full anterior reconstruction creating a soft, age-appropriate transition zone with high-density core.',
    beforeImg: hairlineStage4,
    afterImg: heroManProfile
  },
  {
    id: 'case-06',
    number: '06',
    title: 'Combined Hairline & Crown Harmony',
    category: 'Norwood Class IV Multizone',
    grafts: '2,800 Grafts',
    timeline: '18 Months Post-Op',
    notes: 'Balanced dual-zone restoration with strategic density weighting toward the frontal third for maximum presence.',
    beforeImg: headLookingDown,
    afterImg: hairlineStage1
  }
];

export const BeforeAfterSection: React.FC = () => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const activeCase = CASES[activeCaseIndex];

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPos);
  }, []);

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F0EBE1] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18534F]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
              VERIFIED CLINICAL OUTCOMES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
            See What Restoration Can Look Like
          </h2>
          <p className="text-xs sm:text-sm text-[#524B40] max-w-xl leading-relaxed">
            Every result is individual. These photographic comparisons demonstrate how precision follicular placement rebuilds natural framing and fullness.
          </p>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs text-[#8E877E] uppercase block">CASE STUDY</span>
          <span className="font-serif text-xl text-[#18534F] font-bold">
            {activeCase.number} / 06 · {activeCase.category}
          </span>
        </div>
      </div>

      {/* Main Interactive Comparison Stage (Draggable Divider) */}
      <div className="space-y-4">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerUp}
          className="relative aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-[#E7E2DA] select-none touch-none shadow-md cursor-ew-resize bg-[#182823]"
        >
          {/* AFTER Image (Full background) */}
          <img
            src={activeCase.afterImg}
            alt={`${activeCase.title} - After Restoration`}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />

          {/* AFTER Label Badge */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full font-mono text-xs text-white uppercase tracking-wider font-semibold pointer-events-none">
            After ({activeCase.timeline})
          </div>

          {/* BEFORE Image (Clipped overlay) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={activeCase.beforeImg}
              alt={`${activeCase.title} - Before Restoration`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            />
            {/* BEFORE Label Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full font-mono text-xs text-white uppercase tracking-wider font-semibold">
              Before Restoration
            </div>
          </div>

          {/* Vertical Draggable Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#18534F] text-white flex items-center justify-center shadow-lg border-2 border-white">
              <span className="material-symbols-outlined text-[18px]">drag_handle</span>
            </div>
          </div>
        </div>

        {/* Case Info Strip */}
        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-sm text-[#1B1F23] block">{activeCase.title}</span>
            <p className="text-[#635C52] mt-0.5">{activeCase.notes}</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] shrink-0 text-[#18534F]">
            <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E7E2DA]">{activeCase.grafts}</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E7E2DA]">{activeCase.timeline}</span>
          </div>
        </div>
      </div>

      {/* 6 Thumbnail Cases Strip */}
      <div className="space-y-2">
        <span className="font-mono text-xs text-[#8E877E] uppercase tracking-wider font-semibold block">
          SELECT PATIENT CASE:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {CASES.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCaseIndex(idx);
                setSliderPosition(50);
              }}
              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                activeCaseIndex === idx
                  ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                  : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
              }`}
            >
              <span className={`font-mono text-[10px] font-bold block ${activeCaseIndex === idx ? 'text-[#94C3AE]' : 'text-[#18534F]'}`}>
                CASE 0{idx + 1}
              </span>
              <span className="font-serif text-xs font-medium leading-tight mt-1 line-clamp-1">
                {c.title}
              </span>
              <span className={`text-[10px] mt-1 block ${activeCaseIndex === idx ? 'text-white/70' : 'text-[#8E877E]'}`}>
                {c.grafts}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trust Notice */}
      <div className="text-center pt-2">
        <p className="text-[11px] text-[#8E877E] italic">
          Results vary between patients based on hair caliber, scalp laxity, and donor reserve. Exact candidacy and graft requirements are verified during your clinical consultation.
        </p>
      </div>
    </section>
  );
};
