import React, { useState } from 'react';
import headLookingDown from '../../assets/images/head_looking_down_1791205668085.jpg';

interface Discovery02Props {
  result: any;
  onNext?: () => void;
}

export const Discovery02ConcernMap: React.FC<Discovery02Props> = ({ result }) => {
  const scores = result?.scores || {};
  const primaryConcern = result?.primaryConcern || 'hairline';

  // Sector qualitative dimensions derived from engine scores
  const getSectorStats = (sectorKey: string) => {
    switch (sectorKey) {
      case 'hairline': {
        const val = scores.hairline ?? 0.8;
        return {
          label: 'HAIRLINE',
          title: 'Hairline',
          concern: val >= 0.6 ? 'Strong' : val >= 0.4 ? 'Moderate' : 'Low',
          noticed: val >= 0.5 ? 'Yes' : 'Sometimes',
          goalConn: primaryConcern === 'hairline' ? 'Strong' : 'Moderate',
          headline: 'Your front is where your concern and your goal meet.',
          desc: 'You notice changes in your hairline more than any other area, and it\'s also the area that matters most to your overall goal.'
        };
      }
      case 'temples': {
        const val = scores.temples ?? 0.45;
        return {
          label: 'TEMPLES',
          title: 'Temples',
          concern: val >= 0.6 ? 'Strong' : val >= 0.35 ? 'Moderate' : 'Low',
          noticed: val >= 0.5 ? 'Yes' : 'Sometimes',
          goalConn: primaryConcern === 'temples' ? 'Strong' : 'Moderate',
          headline: 'Temporal recession adds to the perception of forehead height.',
          desc: 'Recession along the lateral temporal points changes the horizontal balance of the upper face and hairline transition.'
        };
      }
      case 'top': {
        const val = scores.topMidScalp ?? 0.3;
        return {
          label: 'TOP / MID-SCALP',
          title: 'Top',
          concern: val >= 0.6 ? 'Strong' : val >= 0.4 ? 'Moderate' : 'Low',
          noticed: val >= 0.5 ? 'Frequently' : 'Rarely',
          goalConn: primaryConcern === 'top_mid_scalp' ? 'Strong' : 'Low',
          headline: 'Mid-scalp density supports visual volume behind the hairline.',
          desc: 'Thinning in this zone can create visible light reflection under overhead lighting, even when the hairline remains in place.'
        };
      }
      case 'crown': {
        const val = scores.crown ?? 0.3;
        return {
          label: 'CROWN',
          title: 'Crown',
          concern: val >= 0.6 ? 'Strong' : val >= 0.4 ? 'Moderate' : 'Low',
          noticed: val >= 0.5 ? 'Frequently' : 'Rarely',
          goalConn: primaryConcern === 'crown' ? 'Strong' : 'Low',
          headline: 'Crown whorl stability determines long-term rotational coverage.',
          desc: 'The vertex whorl naturally exposes more scalp; your answers indicate this is a secondary rather than immediate focal area.'
        };
      }
      case 'overall': {
        const val = scores.coverage ?? 0.5;
        return {
          label: 'OVERALL',
          title: 'Overall',
          concern: val >= 0.6 ? 'Strong' : val >= 0.4 ? 'Moderate' : 'Low',
          noticed: val >= 0.5 ? 'Frequently' : 'Sometimes',
          goalConn: primaryConcern === 'overall_thinning' ? 'Strong' : 'Moderate',
          headline: 'Generalized fullness across all cranial zones.',
          desc: 'A diffuse pattern requires prioritizing strategic aesthetic focal zones to produce maximum visual impact.'
        };
      }
      default:
        return {
          label: 'HAIRLINE',
          title: 'Hairline',
          concern: 'Strong',
          noticed: 'Yes',
          goalConn: 'Strong',
          headline: 'Your front is where your concern and your goal meet.',
          desc: 'You notice changes in your hairline more than any other area.'
        };
    }
  };

  const initialSector = primaryConcern === 'crown' ? 'crown' : primaryConcern === 'top_mid_scalp' ? 'top' : 'hairline';
  const [activeSector, setActiveSector] = useState<string>(initialSector);

  const currentStats = getSectorStats(activeSector);
  const sectorsList = ['hairline', 'temples', 'top', 'crown', 'overall'];

  // Takeaway statement
  const takeawayText = (primaryConcern === 'hairline' || primaryConcern === 'temples')
    ? 'Your concern is concentrated at the front, with some presence at the temples.'
    : primaryConcern === 'crown'
    ? 'Your concern is concentrated at the crown vertex with relatively preserved frontal margins.'
    : 'Your concern involves multiple scalp fields with a primary desire for cohesive density.';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Map Visualization, & Selected Detail Panel          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Concept Safety Copy */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              02
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR CONCERN MAP
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight tracking-tight">
            Where you notice change most.
          </h1>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            This map shows where your concern is concentrated — <strong className="text-[#1B1F23] font-semibold">not the actual density</strong>, but the areas you notice and think about the most.
          </p>
        </div>

        {/* Center Column: Overhead Head Map with Interactive Sectors */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E877E] mb-1.5 flex items-center gap-1">
            FRONT ↓
          </span>

          <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] shadow-xs">
            <img
              src={headLookingDown}
              alt="Anatomical Scalp Map"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle soft dark vignette */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#FAF8F5]/40 pointer-events-none" />

            {/* Interactive SVG Sector Overlays matching "Personalized Hair Concern Map Dashboard.png" */}
            <svg viewBox="0 0 200 250" className="absolute inset-0 w-full h-full select-none">
              {/* TOP Sector */}
              <ellipse
                cx="100"
                cy="90"
                rx="38"
                ry="22"
                onClick={() => setActiveSector('top')}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSector === 'top'
                    ? 'fill-[#3FB950]/50 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(63,185,80,0.5))'
                    : 'fill-[#18534F]/20 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="88" textAnchor="middle" className="text-[8px] font-mono uppercase fill-white font-bold pointer-events-none tracking-widest">
                TOP
              </text>
              <circle cx="100" cy="98" r="2" fill="white" className="pointer-events-none" />

              {/* LEFT TEMPLE Sector */}
              <circle
                cx="50"
                cy="115"
                r="18"
                onClick={() => setActiveSector('temples')}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSector === 'temples'
                    ? 'fill-[#3FB950]/50 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(63,185,80,0.5))'
                    : 'fill-[#18534F]/20 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <text x="50" y="117" textAnchor="middle" className="text-[7px] font-mono uppercase fill-white font-bold pointer-events-none tracking-wider">
                TEMPLE
              </text>

              {/* RIGHT TEMPLE Sector */}
              <circle
                cx="150"
                cy="115"
                r="18"
                onClick={() => setActiveSector('temples')}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSector === 'temples'
                    ? 'fill-[#3FB950]/50 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(63,185,80,0.5))'
                    : 'fill-[#18534F]/20 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <text x="150" y="117" textAnchor="middle" className="text-[7px] font-mono uppercase fill-white font-bold pointer-events-none tracking-wider">
                TEMPLE
              </text>

              {/* HAIRLINE Sector (Center Front) */}
              <path
                d="M58,135 Q100,118 142,135 Q130,165 70,165 Z"
                onClick={() => setActiveSector('hairline')}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSector === 'hairline'
                    ? 'fill-[#3FB950]/55 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 10px rgba(63,185,80,0.6))'
                    : 'fill-[#18534F]/25 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <circle cx="90" cy="144" r="2" fill="white" className="pointer-events-none" />
              <text x="104" y="147" textAnchor="middle" className="text-[8px] font-mono uppercase fill-white font-bold pointer-events-none tracking-widest">
                HAIRLINE
              </text>

              {/* CROWN Sector (Back/Top) */}
              <circle
                cx="100"
                cy="48"
                r="22"
                onClick={() => setActiveSector('crown')}
                className={`cursor-pointer transition-all duration-300 ${
                  activeSector === 'crown'
                    ? 'fill-[#3FB950]/50 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(63,185,80,0.5))'
                    : 'fill-[#18534F]/15 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="50" textAnchor="middle" className="text-[7px] font-mono uppercase fill-white font-bold pointer-events-none tracking-wider">
                CROWN
              </text>
            </svg>
          </div>
          <span className="text-[10px] text-[#8E877E] italic mt-2">Tap any sector on map to inspect</span>
        </div>

        {/* Right Column: Selected-Area Detail Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#18534F]">spa</span>
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#1B1F23]">
                {currentStats.label}
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[11px] text-[#18534F] bg-[#E8F0E6] px-2.5 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18534F]" />
              Selected
            </span>
          </div>

          {/* Qualitative Metrics Rows */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
              <div className="flex items-center gap-2 text-[#635C52]">
                <span className="material-symbols-outlined text-[16px] text-[#18534F]">bar_chart</span>
                <span>Concern</span>
              </div>
              <span className="font-semibold text-[#1B1F23]">{currentStats.concern}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
              <div className="flex items-center gap-2 text-[#635C52]">
                <span className="material-symbols-outlined text-[16px] text-[#18534F]">visibility</span>
                <span>Frequently noticed</span>
              </div>
              <span className="font-semibold text-[#1B1F23]">{currentStats.noticed}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
              <div className="flex items-center gap-2 text-[#635C52]">
                <span className="material-symbols-outlined text-[16px] text-[#18534F]">track_changes</span>
                <span>Goal connection</span>
              </div>
              <span className="font-semibold text-[#1B1F23]">{currentStats.goalConn}</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-serif text-lg text-[#1B1F23] font-normal leading-snug">
              {currentStats.headline}
            </h4>
            <p className="text-xs text-[#524B40] mt-1.5 leading-relaxed">
              {currentStats.desc}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM AREA: Sector Tabs + 5 Synchronized Cards                      */}
      {/* ==================================================================== */}
      <div className="space-y-4 pt-4">
        {/* Horizontal Sector Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {sectorsList.map((sec) => {
            const stats = getSectorStats(sec);
            const isSelected = activeSector === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSector(sec)}
                className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#18534F] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#524B40] border border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {sec === 'hairline' ? 'straighten' : sec === 'temples' ? 'contrast' : sec === 'top' ? 'filter_vintage' : sec === 'crown' ? 'adjust' : 'apps'}
                </span>
                <span>{stats.title}</span>
              </button>
            );
          })}
        </div>

        {/* 5 Area Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sectorsList.map((sec) => {
            const stats = getSectorStats(sec);
            const isSelected = activeSector === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSector(sec)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'bg-white border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase font-bold text-[#1B1F23]">
                      {stats.title}
                    </span>
                    <span className="material-symbols-outlined text-xs text-[#8E877E] group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#635C52]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E877E]">Concern</span>
                      <span className="font-medium text-[#1B1F23]">{stats.concern}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E877E]">Frequently noticed</span>
                      <span className="font-medium text-[#1B1F23]">{stats.noticed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E877E]">Goal connection</span>
                      <span className="font-medium text-[#1B1F23]">{stats.goalConn}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
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
              {takeawayText}
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
