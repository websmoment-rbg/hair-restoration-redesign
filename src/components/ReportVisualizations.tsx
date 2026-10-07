import React, { useState } from 'react';

// ============================================================================
// RESULT 01: INTERACTIVE HAIR CONCERN MAP (§08)
// ============================================================================
export const ScalpMap: React.FC<{
  primary?: string | null;
  secondary?: string | null;
  scores?: Record<string, number | null>;
  onSelectArea?: (areaId: string) => void;
}> = ({
  primary = 'hairline',
  secondary = 'crown',
  scores = {},
  onSelectArea
}) => {
  const [activeArea, setActiveArea] = useState<string>(primary || 'hairline');

  const handleSelect = (id: string) => {
    setActiveArea(id);
    if (onSelectArea) onSelectArea(id);
  };

  const getRegionScore = (id: string): string => {
    let score = 0.5;
    if (id === 'hairline') score = scores?.hairline ?? 0.7;
    else if (id === 'temples') score = scores?.temples ?? 0.5;
    else if (id === 'top') score = scores?.topMidScalp ?? 0.4;
    else if (id === 'crown') score = scores?.crown ?? 0.3;
    else if (id === 'overall') score = scores?.coverage ?? 0.45;

    if (score >= 0.7) return 'High Perceived Concern';
    if (score >= 0.5) return 'Moderate–High Concern';
    if (score >= 0.25) return 'Mild–Moderate Concern';
    return 'Low Concern';
  };

  const regions = [
    {
      id: 'hairline',
      label: 'Frontal Hairline',
      shortDesc: 'Anterior transition framing & temporal margin',
      isPrimary: primary === 'hairline',
      isSecondary: secondary === 'hairline'
    },
    {
      id: 'temples',
      label: 'Temporal Angles',
      shortDesc: 'Bilateral temple peaks and recession angles',
      isPrimary: primary === 'temples',
      isSecondary: secondary === 'temples'
    },
    {
      id: 'top',
      label: 'Top / Mid-Scalp',
      shortDesc: 'Superior mid-scalp density & visual volume',
      isPrimary: primary === 'top_mid_scalp' || primary === 'top',
      isSecondary: secondary === 'top_mid_scalp' || secondary === 'top'
    },
    {
      id: 'crown',
      label: 'Crown / Vertex',
      shortDesc: 'Radial vertex spiral whorl coverage',
      isPrimary: primary === 'crown',
      isSecondary: secondary === 'crown'
    },
    {
      id: 'overall',
      label: 'Overall Fullness',
      shortDesc: 'Diffuse density distribution across scalp',
      isPrimary: primary === 'overall_thinning',
      isSecondary: secondary === 'overall_coverage' || secondary === 'overall'
    }
  ];

  const currentRegion = regions.find((r) => r.id === activeArea) || regions[0];

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Anatomical Head Illustration */}
        <div className="relative w-64 h-64 shrink-0 bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs flex flex-col items-center justify-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877E] mb-1">
            ANTERIOR (FRONT)
          </span>
          <svg viewBox="0 0 200 200" className="w-52 h-52 select-none">
            {/* Base head silhouette */}
            <path
              d="M100 20 C60 20 40 55 40 100 C40 145 65 180 100 180 C135 180 160 145 160 100 C160 55 140 20 100 20 Z"
              fill="#F5F2EB"
              stroke="#D8D2C6"
              strokeWidth="2"
            />
            {/* Frontal Hairline Zone */}
            <path
              d="M60 45 Q100 35 140 45 Q125 72 75 72 Z"
              onClick={() => handleSelect('hairline')}
              className={`cursor-pointer transition-all duration-200 ${
                activeArea === 'hairline'
                  ? 'fill-[#18534F] stroke-[#123E3B] stroke-2 filter drop-shadow-sm'
                  : primary === 'hairline'
                  ? 'fill-[#246A64]/80'
                  : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
              }`}
            />
            {/* Left Temple */}
            <circle
              cx="54" cy="72" r="14"
              onClick={() => handleSelect('temples')}
              className={`cursor-pointer transition-all duration-200 ${
                activeArea === 'temples'
                  ? 'fill-[#18534F] stroke-[#123E3B] stroke-2 filter drop-shadow-sm'
                  : primary === 'temples'
                  ? 'fill-[#246A64]/80'
                  : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
              }`}
            />
            {/* Right Temple */}
            <circle
              cx="146" cy="72" r="14"
              onClick={() => handleSelect('temples')}
              className={`cursor-pointer transition-all duration-200 ${
                activeArea === 'temples'
                  ? 'fill-[#18534F] stroke-[#123E3B] stroke-2 filter drop-shadow-sm'
                  : primary === 'temples'
                  ? 'fill-[#246A64]/80'
                  : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
              }`}
            />
            {/* Mid-Scalp */}
            <ellipse
              cx="100" cy="100" rx="36" ry="24"
              onClick={() => handleSelect('top')}
              className={`cursor-pointer transition-all duration-200 ${
                activeArea === 'top'
                  ? 'fill-[#18534F] stroke-[#123E3B] stroke-2 filter drop-shadow-sm'
                  : primary === 'top_mid_scalp' || primary === 'top'
                  ? 'fill-[#246A64]/80'
                  : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
              }`}
            />
            {/* Crown / Vertex */}
            <circle
              cx="100" cy="144" r="26"
              onClick={() => handleSelect('crown')}
              className={`cursor-pointer transition-all duration-200 ${
                activeArea === 'crown'
                  ? 'fill-[#18534F] stroke-[#123E3B] stroke-2 filter drop-shadow-sm'
                  : primary === 'crown'
                  ? 'fill-[#246A64]/80'
                  : secondary === 'crown'
                  ? 'fill-[#C5A880]/90'
                  : 'fill-[#E0DAD0] hover:fill-[#CFE4DC]'
              }`}
            />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E877E] mt-1">
            POSTERIOR (VERTEX)
          </span>
        </div>

        {/* Region Selector and Perceived Level */}
        <div className="w-full space-y-2.5">
          <div className="text-xs text-[#635C52] font-mono uppercase tracking-wider mb-2 flex justify-between items-center">
            <span>Interactive Scalp Regions</span>
            <span className="text-[11px] text-[#18534F]">Click to inspect</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {regions.map((reg) => {
              const isSelected = activeArea === reg.id;
              const intensity = getRegionScore(reg.id);
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleSelect(reg.id)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#18534F] text-white border-[#18534F] shadow-sm'
                      : 'bg-white text-[#1B1F23] border-[#E7E2DA] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{reg.label}</span>
                      {reg.isPrimary && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#18534F]/10 text-[#18534F] font-bold'
                        }`}>
                          Primary Concern
                        </span>
                      )}
                      {reg.isSecondary && !reg.isPrimary && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#C5A880]/20 text-[#8C6D42] font-bold'
                        }`}>
                          Secondary
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-[#635C52]'}`}>
                      {reg.shortDesc}
                    </p>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <span className={`font-mono text-[11px] block font-medium ${
                      isSelected ? 'text-white' : 'text-[#18534F]'
                    }`}>
                      {intensity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Area Interpretation Drawer */}
      <div className="pt-3 border-t border-[#E7E2DA] text-xs text-[#524B40] flex items-center justify-between">
        <div>
          <span className="text-[#8E877E] font-mono uppercase text-[10px] block">Inspected Region</span>
          <span className="font-semibold text-[#1B1F23]">{currentRegion.label}</span> — {getRegionScore(currentRegion.id)}
        </div>
        <span className="text-[11px] text-[#8E877E] italic">
          Self-reported perception · Not an objective clinical measurement
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 02: COVERAGE & DENSITY PROFILE (§09)
// ============================================================================
export const CoverageProfileBars: React.FC<{
  scores?: Record<string, number | null>;
  bands?: Record<string, string | null>;
}> = ({ scores = {}, bands = {} }) => {
  const coverageScore = scores?.coverage ?? 0.65;
  const crownScore = scores?.crown ?? 0.45;
  const hairlineScore = scores?.hairline ?? 0.75;
  const perceivedFullness = Math.max(0.2, (scores?.coverage ?? 0.6) * 0.95);

  const getLabel = (val: number) => {
    if (val >= 0.75) return 'Very High';
    if (val >= 0.6) return 'High';
    if (val >= 0.45) return 'Moderate–High';
    if (val >= 0.3) return 'Moderate';
    return 'Mild';
  };

  const dimensions = [
    { label: 'Overall Density', val: coverageScore, note: 'General visual density across hair-bearing scalp' },
    { label: 'Scalp Visibility', val: Math.min(1, coverageScore * 1.1), note: 'Light transmission under direct or normal lighting' },
    { label: 'Crown Coverage', val: crownScore, note: 'Follicular presence around vertex whorl' },
    { label: 'Overall Fullness Loss', val: perceivedFullness, note: 'Perceived fullness difference compared to earlier years' }
  ];

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-3">
        <span className="text-xs font-mono uppercase text-[#8E877E] tracking-wider">
          Coverage & Density Signals
        </span>
        <span className="text-xs text-[#18534F] font-semibold font-mono">
          Composite Index: {Math.round(coverageScore * 100)}%
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {dimensions.map((dim, idx) => {
          const pct = Math.round(dim.val * 100);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#1B1F23]">{dim.label}</span>
                  <span className="text-[11px] text-[#8E877E] ml-2 hidden sm:inline">({dim.note})</span>
                </div>
                <span className="font-mono text-[#18534F] font-semibold">{getLabel(dim.val)}</span>
              </div>

              {/* Segmented bar visual */}
              <div className="w-full bg-[#E7E2DA] h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-[#18534F] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 03: PERCEIVED CHANGE OVER TIME (§10)
// ============================================================================
export const ConcernTimeline: React.FC<{
  duration?: string;
  perceivedChange?: number;
  trajectory?: number;
}> = ({
  duration = '1_2y',
  perceivedChange = 0.6,
  trajectory = 0.5
}) => {
  const durationMap: Record<string, string> = {
    lt_6m: 'Less than 6 months',
    '6_12m': '6–12 months',
    '1_2y': '1–2 years',
    '2_5y': '2–5 years',
    gt_5y: 'More than 5 years'
  };

  const durationText = durationMap[duration] || '1–2 years';
  const changeLevel = perceivedChange >= 0.7 ? 'Significant' : perceivedChange >= 0.4 ? 'Moderate' : 'Mild';
  const trajectoryLevel = trajectory >= 0.7 ? 'Rapidly Increasing' : trajectory >= 0.4 ? 'Gradually Increasing' : 'Stable';

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-6">
      {/* Timeline Track with Patient Position */}
      <div>
        <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-[#8E877E] mb-2">
          <span>Initial Observation</span>
          <span>Duration: {durationText}</span>
          <span>Today</span>
        </div>

        <div className="relative w-full h-10 flex items-center">
          {/* Connecting line */}
          <div className="w-full h-1 bg-[#D8D2C6] rounded-full relative">
            <div className="absolute left-0 top-0 h-full bg-[#18534F] rounded-full" style={{ width: '85%' }} />
          </div>

          {/* Start node */}
          <div className="absolute left-0 w-4 h-4 rounded-full bg-white border-2 border-[#8E877E] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8E877E]" />
          </div>

          {/* Mid node */}
          <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#18534F] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#18534F]" />
          </div>

          {/* Current node with pulsing marker */}
          <div className="absolute left-[85%] -translate-x-1/2 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-[#18534F] border-2 border-white shadow-sm flex items-center justify-center text-white text-[9px] font-bold">
              ●
            </div>
            <span className="text-[10px] font-mono text-[#18534F] font-bold mt-1">YOU</span>
          </div>
        </div>
      </div>

      {/* Supporting Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Perceived Progression</span>
          <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{changeLevel}</span>
        </div>
        <div className="p-3 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Concern Duration</span>
          <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{durationText}</span>
        </div>
        <div className="p-3 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Concern Trajectory</span>
          <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">{trajectoryLevel}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 04: RESTORATION GOAL CARD (§11)
// ============================================================================
export const GoalCard: React.FC<{
  primaryGoal?: string;
  desiredOutcome?: string;
}> = ({
  primaryGoal = 'restore_hairline',
  desiredOutcome = 'natural_hairline'
}) => {
  const goalMap: Record<string, { title: string; desc: string }> = {
    restore_hairline: {
      title: 'RESTORE THE HAIRLINE',
      desc: 'Re-establishing frontotemporal framing and balanced facial proportions with age-appropriate transition.'
    },
    density_top: {
      title: 'IMPROVE DENSITY ON TOP',
      desc: 'Creating visual fullness and reducing scalp contrast across the mid-scalp field.'
    },
    crown_coverage: {
      title: 'IMPROVE CROWN COVERAGE',
      desc: 'Restoring vertex whorl density and circular coverage under direct and overhead lighting.'
    },
    reduce_visible_scalp: {
      title: 'REDUCE VISIBLE SCALP',
      desc: 'Targeting light-blocking density to eliminate transparent scalp reflection.'
    },
    fuller_overall: {
      title: 'CREATE A FULLER OVERALL APPEARANCE',
      desc: 'Balancing multi-zone density for natural cosmetic weight and volume.'
    },
    realistic_expectations: {
      title: 'UNDERSTAND REALISTIC POSSIBILITIES',
      desc: 'Prioritizing an objective clinical consultation to clarify what can realistically be achieved.'
    },
    not_sure: {
      title: 'EXPLORING RESTORATION OPTIONS',
      desc: 'Forming individual goals in dialogue with a specialist.'
    }
  };

  const primary = goalMap[primaryGoal] || goalMap.restore_hairline;

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-4">
      {/* Primary Goal Banner */}
      <div className="p-5 bg-[#18534F] text-white rounded-xl shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
            YOUR #1 RESTORATION GOAL
          </span>
          <span className="material-symbols-outlined text-white text-[18px]">flag</span>
        </div>
        <h4 className="font-serif text-2xl font-normal text-white">{primary.title}</h4>
        <p className="text-xs text-white/85 leading-relaxed">{primary.desc}</p>
      </div>

      {/* Secondary Priorities */}
      <div className="p-4 bg-white border border-[#E7E2DA] rounded-xl space-y-2">
        <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
          Secondary Restoration Priorities Identified
        </span>
        <div className="space-y-1.5 text-xs text-[#3E454D]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#18534F] font-bold">02</span>
            <span>Improve overall density and preserve native surrounding follicles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#18534F] font-bold">03</span>
            <span>Establish realistic long-term expectations during specialist consultation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 05: RESTORATION MOTIVATION GAUGE (§12)
// ============================================================================
export const MotivationGauge: React.FC<{
  score?: number;
  appearanceImpact?: number;
}> = ({ score = 0.75, appearanceImpact = 0.7 }) => {
  const pct = Math.round(Math.min(100, Math.max(0, score * 100)));
  const level = pct >= 75 ? 'HIGH' : pct >= 50 ? 'MODERATE' : 'LOWER';

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Semi-circular gauge */}
        <div className="relative w-44 h-24 flex items-end justify-center shrink-0">
          <svg viewBox="0 0 160 85" className="w-full h-full">
            <path
              d="M 15 80 A 65 65 0 0 1 145 80"
              stroke="#E0DAD0"
              strokeWidth="12"
              fill="transparent"
              strokeLinecap="round"
            />
            <path
              d="M 15 80 A 65 65 0 0 1 145 80"
              stroke="#18534F"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={204}
              strokeDashoffset={204 - (204 * (pct / 100))}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="font-serif text-3xl font-semibold text-[#1B1F23]">{pct}%</span>
            <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold">
              {level} MOTIVATION
            </span>
          </div>
        </div>

        {/* Motivation dimensions */}
        <div className="w-full space-y-2 text-xs">
          <div className="p-3 bg-white border border-[#E7E2DA] rounded-lg flex items-center justify-between">
            <span className="text-[#524B40]">Personal Appearance Impact</span>
            <span className="font-mono text-[#18534F] font-semibold">
              {appearanceImpact >= 0.7 ? 'Significant' : 'Moderate'}
            </span>
          </div>
          <div className="p-3 bg-white border border-[#E7E2DA] rounded-lg flex items-center justify-between">
            <span className="text-[#524B40]">Outcome Priority Level</span>
            <span className="font-mono text-[#18534F] font-semibold">{level}</span>
          </div>
          <div className="p-2.5 bg-[#FAF8F5] rounded border border-[#E7E2DA] text-[11px] text-[#635C52] italic">
            Physical concern and personal motivation are measured independently.
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 06: HAIR RESTORATION JOURNEY & MATRIX (§13)
// ============================================================================
export const JourneyTimelineVisual: React.FC<{
  duration?: string;
  approaches?: string[];
  familyContext?: string;
}> = ({
  duration = '1_2y',
  approaches = ['medication', 'supplements'],
  familyContext = 'yes'
}) => {
  const allApproaches = [
    { key: 'medication', label: 'Medication (Minoxidil / Finasteride)' },
    { key: 'prp', label: 'PRP (Platelet-Rich Plasma)' },
    { key: 'supplements', label: 'Nutraceuticals & Supplements' },
    { key: 'hair_products', label: 'Topical Hair Serums & Products' },
    { key: 'special_shampoos', label: 'Specialized DHT-blocking Shampoos' },
    { key: 'home_remedies', label: 'Home Remedies & Scalp Massage' },
    { key: 'other', label: 'Other Explored Approaches' }
  ];

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-5">
      {/* Journey Steps */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-[#E7E2DA] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono uppercase text-[#8E877E] text-[10px]">Concern Began:</span>
          <span className="font-semibold text-[#1B1F23]">
            {duration === 'gt_5y' ? '5+ Years Ago' : duration === '2_5y' ? '2–5 Years Ago' : '1–2 Years Ago'}
          </span>
        </div>
        <span className="text-[#8E877E]">→</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
          <span className="font-mono uppercase text-[#8E877E] text-[10px]">Previous Approaches:</span>
          <span className="font-semibold text-[#18534F]">{approaches.length} Tried</span>
        </div>
        <span className="text-[#8E877E]">→</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono uppercase text-[#8E877E] text-[10px]">Current Status:</span>
          <span className="font-semibold text-[#1B1F23]">Clinical Assessment Today</span>
        </div>
      </div>

      {/* Treatment Matrix Table */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
          Previous Hair Management Modalities Matrix
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {allApproaches.map((app) => {
            const hasTried = approaches.includes(app.key);
            return (
              <div
                key={app.key}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  hasTried
                    ? 'bg-[#EBF3F0] border-[#B5D7CB] text-[#18534F]'
                    : 'bg-white border-[#E7E2DA] text-[#635C52]'
                }`}
              >
                <span>{app.label}</span>
                <span className="font-mono font-bold text-sm">
                  {hasTried ? '✓ Reported' : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Family Context */}
      <div className="p-3 bg-white rounded-lg border border-[#E7E2DA] text-xs flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase text-[#8E877E] block">Family Context</span>
          <span className="font-medium text-[#1B1F23]">
            {familyContext === 'yes'
              ? 'You reported significant hair thinning or loss in your family history.'
              : familyContext === 'no'
              ? 'No significant family history of early hair thinning reported.'
              : 'Family history of hair loss was reported as uncertain.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#8E877E] shrink-0 ml-4 hidden sm:inline">
          Contextual Only
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 07: RESTORATION READINESS LADDER (§14)
// ============================================================================
export const ReadinessLadder: React.FC<{
  stage?: string;
  timeline?: string;
  consultationIntent?: string;
}> = ({
  stage = 'exploring',
  timeline = '1_3m',
  consultationIntent = 'high'
}) => {
  const stages = [
    { id: 'curious', num: '01', label: 'Curious' },
    { id: 'researching', num: '02', label: 'Researching' },
    { id: 'exploring', num: '03', label: 'Exploring' },
    { id: 'seriously_considering', num: '04', label: 'Seriously Considering' },
    { id: 'ready_to_discuss', num: '05', label: 'Ready to Discuss' }
  ];

  const currentIdx = stages.findIndex((s) => s.id === stage);
  const activeIdx = currentIdx >= 0 ? currentIdx : 2;

  const timelineMap: Record<string, string> = {
    researching: 'Just researching for now',
    '6_12m': 'Within 6–12 months',
    '3_6m': 'Within 3–6 months',
    '1_3m': 'Within 1–3 months',
    asap_right_option: 'As soon as right option is found'
  };

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-6">
      {/* 5-Step Readiness Ladder */}
      <div>
        <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block mb-3">
          Restoration Readiness Journey
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {stages.map((st, idx) => {
            const isCurrent = idx === activeIdx;
            const isPassed = idx < activeIdx;
            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border text-center relative transition-all ${
                  isCurrent
                    ? 'bg-[#18534F] text-white border-[#18534F] shadow-sm'
                    : isPassed
                    ? 'bg-[#EBF3F0] text-[#18534F] border-[#B5D7CB]'
                    : 'bg-white text-[#78716C] border-[#E7E2DA]'
                }`}
              >
                <span className={`font-mono text-[10px] block ${isCurrent ? 'text-white/80' : 'text-[#8E877E]'}`}>
                  STAGE {st.num}
                </span>
                <span className="font-semibold text-xs block mt-0.5 leading-tight">{st.label}</span>
                {isCurrent && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-white text-[#18534F] text-[9px] font-mono font-bold rounded-full uppercase">
                    You Are Here
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Supporting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Current Stage</span>
          <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block capitalize">
            {stage.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="p-3.5 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Ideal Timeline</span>
          <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">
            {timelineMap[timeline] || 'Within 1–3 months'}
          </span>
        </div>
        <div className="p-3.5 bg-white border border-[#E7E2DA] rounded-lg">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Consultation Openness</span>
          <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block capitalize">
            {consultationIntent.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// RESULT 08: CIRCULAR / RADAR RESTORATION PROFILE (§16)
// ============================================================================
export const RadarProfileVisual: React.FC<{
  scores?: Record<string, number | null>;
}> = ({ scores = {} }) => {
  const hairline = scores?.hairline ?? 0.75;
  const density = scores?.coverage ?? 0.65;
  const crown = scores?.crown ?? 0.45;
  const change = scores?.perceivedChange ?? 0.6;
  const motivation = scores?.motivation ?? 0.8;
  const intent = scores?.readiness ?? 0.7;
  const goal = scores?.goalStrength ?? 0.9;

  const data = [
    { label: 'Hairline', value: hairline },
    { label: 'Density', value: density },
    { label: 'Crown', value: crown },
    { label: 'Change', value: change },
    { label: 'Motivation', value: motivation },
    { label: 'Intent', value: intent },
    { label: 'Goal Strength', value: goal }
  ];

  const size = 220;
  const center = size / 2;
  const radius = 75;
  const total = data.length;

  // Calculate polygon points
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
    const r = radius * Math.max(0.2, Math.min(1, d.value));
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.33, 0.66, 1];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-5 rounded-xl border border-[#E7E2DA]">
      <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full select-none">
          {/* Background web polygons */}
          {gridLevels.map((lvl, idx) => {
            const gridPts = data.map((_, i) => {
              const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
              const r = radius * lvl;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={gridPts}
                fill="none"
                stroke="#E7E2DA"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial axis spokes */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center} y1={center}
                x2={x} y2={y}
                stroke="#E7E2DA"
                strokeWidth="1"
              />
            );
          })}

          {/* User profile polygon */}
          <polygon
            points={points}
            fill="#18534F"
            fillOpacity="0.3"
            stroke="#18534F"
            strokeWidth="2"
          />

          {/* Data point dots */}
          {data.map((d, i) => {
            const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
            const r = radius * Math.max(0.2, Math.min(1, d.value));
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x} cy={y} r="3.5"
                fill="#18534F"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>

      {/* Legend and vectors */}
      <div className="w-full space-y-2 text-xs">
        <span className="font-mono text-[10px] uppercase text-[#8E877E] tracking-wider block">
          Synthesized Vector Dimensions
        </span>
        <div className="grid grid-cols-2 gap-2">
          {data.map((d, i) => (
            <div key={i} className="p-2 bg-[#FAF8F5] rounded border border-[#E7E2DA] flex justify-between items-center">
              <span className="font-medium text-[#1B1F23]">{d.label}</span>
              <span className="font-mono text-[#18534F] font-semibold">{Math.round(d.value * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SURGICAL CLINICAL DOSSIER VISUALIZATIONS
// ============================================================================
export const CandidacyScoreGauge: React.FC<{ score: number; tier: string }> = ({ score, tier }) => {
  const normalized = Math.min(100, Math.max(0, score || 84));
  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="80" cy="80" r="64" stroke="#E7E2DA" strokeWidth="10" fill="transparent" />
        <circle
          cx="80" cy="80" r="64"
          stroke="#18534F"
          strokeWidth="10"
          strokeDasharray={402}
          strokeDashoffset={402 - (402 * normalized) / 100}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-serif text-3xl font-medium text-[#1B1F23]">{normalized}</span>
        <span className="text-[10px] uppercase tracking-wider text-[#18534F] font-mono font-semibold">
          {tier.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

export const GraftBreakdownCard: React.FC<{
  totalGrafts: string;
  hairlineCount?: string;
  midscalpCount?: string;
  crownCount?: string;
}> = ({
  totalGrafts,
  hairlineCount = '1,100',
  midscalpCount = '800',
  crownCount = '500'
}) => {
  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded p-5 space-y-4">
      <div className="border-b border-[#E7E2DA] pb-3">
        <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
          Target Follicular Units
        </span>
        <div className="font-serif text-3xl text-[#18534F] mt-0.5">{totalGrafts} Grafts</div>
        <div className="text-[11px] text-[#635C52] mt-0.5">Approx. 4,800 – 5,600 viable hairs</div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center p-2 bg-white rounded border border-[#E7E2DA]">
          <span className="text-[#1B1F23] font-medium">Hairline Reconstruction</span>
          <span className="font-mono text-[#18534F] font-semibold">{hairlineCount} FU</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded border border-[#E7E2DA]">
          <span className="text-[#1B1F23] font-medium">Mid-Scalp Density Blend</span>
          <span className="font-mono text-[#18534F] font-semibold">{midscalpCount} FU</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white rounded border border-[#E7E2DA]">
          <span className="text-[#1B1F23] font-medium">Crown Transition Support</span>
          <span className="font-mono text-[#18534F] font-semibold">{crownCount} FU</span>
        </div>
      </div>
    </div>
  );
};

export const TimelineInteractive: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);

  const milestones = [
    {
      label: 'Days 1–10',
      title: 'Follicular Anchoring & Revascularization',
      badge: 'Acute Healing',
      description: 'Grafts form microscopic vascular attachments in their recipient channels. Redness subsides and epidermal scabs naturally exfoliate by Day 7–9 during clinical shampooing.',
      recommendation: 'Use gentle spray saline wash; sleep elevated at 30 degrees; strictly avoid direct friction.'
    },
    {
      label: 'Month 1–3',
      title: 'Telogen Shedding ("Shock Loss" Phase)',
      badge: 'Expected Biology',
      description: 'Transplanted hair shafts shed as follicles enter an resting (telogen) cycle while dermal papillae remain permanently anchored underneath the scalp.',
      recommendation: 'Continue topical and oral bio-stabilization protocols; zero cause for concern as dormant root beds prepare for robust anagen resurgence.'
    },
    {
      label: 'Month 4–6',
      title: 'Early Sprouting & Texture Emergence',
      badge: 'Active Growth',
      description: 'Fine, natural hair shafts begin breaking through the scalp surface. Initial coverage is approximately 30–40% of final expected aesthetic density.',
      recommendation: 'First dermoscopy review with clinical team to inspect early follicular emergence angles.'
    },
    {
      label: 'Month 7–10',
      title: 'Significant Thickening & Maturation',
      badge: 'Cosmetic Impact',
      description: 'Hairs thicken substantially in caliber, developing natural luster and wave. Around 70–80% of final cosmetic density is achieved.',
      recommendation: 'Full styling flexibility; regular haircuts with your barber or stylist.'
    },
    {
      label: 'Month 12–15',
      title: 'Full Terminal Density & Maturation',
      badge: 'Final Result',
      description: 'Complete maturation of all transplanted follicles with full cuticle thickness and seamless visual blend with surrounding native hair.',
      recommendation: 'Final photographic documentation and trichological density certification.'
    }
  ];

  const current = milestones[selectedMilestone];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl text-[#1B1F23]">Clinical Recovery & Maturation Timeline</h3>
          <p className="text-xs text-[#635C52] mt-0.5">Click any milestone phase to inspect clinical progression</p>
        </div>
        <span className="font-mono text-xs px-2.5 py-1 bg-[#F5F2EB] text-[#18534F] rounded font-medium">
          Phase {selectedMilestone + 1} of 5
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {milestones.map((m, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedMilestone(idx)}
            className={`p-3 rounded border text-left transition ${
              selectedMilestone === idx
                ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                : 'bg-[#FAF8F5] text-[#524B40] border-[#E7E2DA] hover:bg-[#F5F2EB]'
            }`}
          >
            <span className={`font-mono text-[10px] block ${selectedMilestone === idx ? 'text-white/80' : 'text-[#8E877E]'}`}>
              {m.label}
            </span>
            <span className="font-semibold text-xs block truncate mt-0.5">
              {m.badge}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E2DA] pb-3">
          <h4 className="font-serif text-lg text-[#1B1F23]">{current.title}</h4>
          <span className="inline-flex self-start sm:self-auto px-2.5 py-0.5 bg-[#E8F3EE] text-[#18534F] border border-[#C6E4D4] rounded text-xs font-mono font-medium">
            {current.label}
          </span>
        </div>

        <p className="text-xs text-[#524B40] leading-relaxed">
          {current.description}
        </p>

        <div className="pt-2 text-xs flex items-start gap-2 text-[#18534F]">
          <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">lightbulb</span>
          <span className="font-medium">Surgeon Recommendation: {current.recommendation}</span>
        </div>
      </div>
    </div>
  );
};
