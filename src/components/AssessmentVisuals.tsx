import React from 'react';

// Real high-fidelity clinical assets generated for the assessment
import hairlineImg1 from '../assets/images/hairline_stage_1_full_1791204641403.jpg';
import hairlineImg2 from '../assets/images/hairline_stage_2_mild_1791204657353.jpg';
import hairlineImg3 from '../assets/images/hairline_stage_3_mod_1791204673978.jpg';
import hairlineImg4 from '../assets/images/hairline_stage_4_sig_1791204693426.jpg';
import hairlineImg5 from '../assets/images/hairline_stage_5_adv_1791204719597.jpg';

import scalpImg1 from '../assets/images/scalp_dens_1_full_1791204738531.jpg';
import scalpImg2 from '../assets/images/scalp_dens_2_norm_1791204764358.jpg';
import scalpImg3 from '../assets/images/scalp_dens_3_mod_1791204782732.jpg';
import scalpImg4 from '../assets/images/scalp_dens_4_thin_1791204817349.jpg';
import scalpImg5 from '../assets/images/scalp_dens_5_vthin_1791204837713.jpg';

const HAIRLINE_IMAGES = [hairlineImg1, hairlineImg2, hairlineImg3, hairlineImg4, hairlineImg5];
const SCALP_IMAGES = [scalpImg1, scalpImg2, scalpImg3, scalpImg4, scalpImg5];

// ============================================================================
// Q1, Q2, Q3: High-Resolution Hairline Portrait Avatars (Matching Reference)
// ============================================================================
export const HairlinePortraitVisual: React.FC<{
  level: number;
  isSelected?: boolean;
}> = ({ level, isSelected = false }) => {
  const imgSrc = HAIRLINE_IMAGES[level - 1] || hairlineImg1;

  return (
    <div
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-200 border-2 select-none ${
        isSelected
          ? 'border-[#18534F] ring-4 ring-[#18534F]/20 shadow-md scale-105'
          : 'border-[#E7E2DA] hover:border-[#CDC5B8] opacity-90 hover:opacity-100'
      }`}
    >
      <img
        src={imgSrc}
        alt={`Hairline stage ${level}`}
        className="w-full h-full object-cover rounded-full"
        loading="eager"
      />
      {isSelected && (
        <div className="absolute inset-0 bg-[#18534F]/10 rounded-full border border-white/40 pointer-events-none" />
      )}
    </div>
  );
};

// ============================================================================
// Q4, Q5: Photorealistic Clinical Scalp Trichoscopy Images (Cards 04 & 05)
// ============================================================================
export const ScalpDensityVisual: React.FC<{
  level: number;
  isSelected?: boolean;
}> = ({ level, isSelected = false }) => {
  const imgSrc = SCALP_IMAGES[level - 1] || scalpImg1;

  return (
    <div
      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-200 border-2 select-none ${
        isSelected
          ? 'border-[#18534F] ring-4 ring-[#18534F]/20 shadow-md scale-105'
          : 'border-[#E7E2DA] hover:border-[#CDC5B8] opacity-90 hover:opacity-100'
      }`}
    >
      <img
        src={imgSrc}
        alt={`Scalp density stage ${level}`}
        className="w-full h-full object-cover rounded-full"
        loading="eager"
      />
      {isSelected && (
        <div className="absolute inset-0 bg-[#18534F]/10 rounded-full border border-white/40 pointer-events-none" />
      )}
    </div>
  );
};

// ============================================================================
// Q6: Arched Oval Lenses with Tapered Hair Strand Caliber (Card 06)
// ============================================================================
export const StrandCaliberVisual: React.FC<{
  level: number;
  isSelected?: boolean;
}> = ({ level, isSelected = false }) => {
  // Strand widths from Very Thick to Very Fine
  const widths = [6, 4.2, 3, 1.8, 1];
  const w = widths[level - 1] ?? 3;

  return (
    <div
      className={`w-14 h-20 sm:w-16 sm:h-24 rounded-full border-2 flex items-center justify-center p-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#F4F8F6] ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#CDC5B8]'
      }`}
    >
      <svg viewBox="0 0 60 100" className="w-full h-full">
        {/* Soft background oval halo */}
        <ellipse cx="30" cy="50" rx="22" ry="40" fill={isSelected ? '#E8F3EE' : '#F5F2EB'} />

        {/* Tapered curved hair fiber */}
        <path
          d="M24 88 C26 60 38 42 36 12"
          fill="none"
          stroke={isSelected ? '#18534F' : '#2A251F'}
          strokeWidth={w}
          strokeLinecap="round"
        />

        {/* Highlight sheen for thicker strands */}
        {level <= 3 && (
          <path
            d="M25 84 C27 60 37 45 35 22"
            fill="none"
            stroke={isSelected ? '#358780' : '#8A8275'}
            strokeWidth={w * 0.4}
            strokeLinecap="round"
            opacity="0.7"
          />
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// Q7: Circular Magnifying Lenses with Shedding Follicles (Card 07)
// ============================================================================
export const SheddingMagnifierVisual: React.FC<{
  level: number;
  isSelected?: boolean;
}> = ({ level, isSelected = false }) => {
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center p-1 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#F4F8F6] ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#CDC5B8]'
      }`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Magnifying lens rim */}
        <circle cx="50" cy="50" r="42" fill="#FAF8F5" stroke={isSelected ? '#18534F' : '#CDC5B8'} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="38" fill={isSelected ? '#E8F3EE' : '#F5F2EB'} opacity="0.6" />

        {/* Follicular unit at center */}
        <circle cx="50" cy="50" r="3.5" fill={isSelected ? '#18534F' : '#332E27'} />

        {/* Shedding hairs based on level */}
        {level >= 2 && (
          // 1 shedding hair
          <path d="M48 48 C42 36 34 26 26 24" fill="none" stroke={isSelected ? '#18534F' : '#454038'} strokeWidth="1.5" strokeLinecap="round" />
        )}
        {level >= 3 && (
          // 2 more hairs
          <path d="M52 48 C60 38 68 32 76 28" fill="none" stroke={isSelected ? '#18534F' : '#454038'} strokeWidth="1.4" strokeLinecap="round" />
        )}
        {level >= 4 && (
          <path d="M50 52 C50 64 54 74 62 80" fill="none" stroke={isSelected ? '#18534F' : '#454038'} strokeWidth="1.3" strokeLinecap="round" />
        )}
        {level >= 5 && (
          <>
            <path d="M47 52 C40 62 30 70 24 74" fill="none" stroke={isSelected ? '#18534F' : '#454038'} strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="26" cy="24" r="1.5" fill={isSelected ? '#18534F' : '#8A8275'} />
            <circle cx="76" cy="28" r="1.5" fill={isSelected ? '#18534F' : '#8A8275'} />
            <circle cx="62" cy="80" r="1.5" fill={isSelected ? '#18534F' : '#8A8275'} />
          </>
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// Q9: Editorial Fine-Line Context Icons (Card 09 in Reference)
// ============================================================================
export const ContextIconVisual: React.FC<{
  optionKey: string;
  isSelected?: boolean;
}> = ({ optionKey, isSelected = false }) => {
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center p-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#F4F8F6] ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#CDC5B8]'
      }`}
    >
      <svg viewBox="0 0 80 80" className="w-9 h-9">
        {optionKey === 'mostly_mirror' && (
          // Oval mirror with stand and reflection rays
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <ellipse cx="40" cy="34" rx="20" ry="24" fill={isSelected ? '#E8F3EE' : 'none'} />
            <line x1="32" y1="28" x2="38" y2="20" opacity="0.6" />
            <line x1="36" y1="40" x2="48" y2="26" opacity="0.6" />
            <path d="M40 58 L40 68" />
            <path d="M30 68 L50 68" />
          </g>
        )}
        {optionKey === 'mostly_photos' && (
          // Camera with aperture lens
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <rect x="18" y="24" width="44" height="34" rx="5" fill={isSelected ? '#E8F3EE' : 'none'} />
            <circle cx="40" cy="41" r="11" />
            <circle cx="54" cy="30" r="2" fill={isSelected ? '#18534F' : '#332E27'} />
            <path d="M32 24 L35 19 L45 19 L48 24" />
          </g>
        )}
        {optionKey === 'both_equally' && (
          // Combined mirror & photo frames
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <ellipse cx="30" cy="38" rx="14" ry="18" />
            <rect x="36" y="28" width="28" height="24" rx="4" fill={isSelected ? '#E8F3EE' : 'none'} />
            <circle cx="50" cy="40" r="6" />
          </g>
        )}
        {optionKey === 'bright_lighting' && (
          // Downlight ceiling lamp with delicate light rays
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M28 28 C28 20 52 20 52 28 L58 40 L22 40 Z" fill={isSelected ? '#E8F3EE' : 'none'} />
            <line x1="40" y1="14" x2="40" y2="20" />
            <line x1="28" y1="50" x2="24" y2="58" strokeDasharray="2 2" />
            <line x1="40" y1="48" x2="40" y2="60" strokeDasharray="2 2" />
            <line x1="52" y1="50" x2="56" y2="58" strokeDasharray="2 2" />
          </g>
        )}
        {optionKey === 'everywhere' && (
          // Globe / Everywhere perspective
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none">
            <circle cx="40" cy="40" r="22" fill={isSelected ? '#E8F3EE' : 'none'} />
            <ellipse cx="40" cy="40" rx="9" ry="22" />
            <line x1="18" y1="40" x2="62" y2="40" />
          </g>
        )}
        {optionKey === 'not_sure' && (
          // Editorial question glyph
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="2.2" fill="none" strokeLinecap="round">
            <path d="M30 30 C30 22 50 22 50 30 C50 38 40 38 40 48" />
            <circle cx="40" cy="56" r="1.5" fill={isSelected ? '#18534F' : '#332E27'} stroke="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// Q10: Duration Milestone Icons (Card 10 & 13)
// ============================================================================
export const DurationMilestoneVisual: React.FC<{
  index: number;
  isSelected?: boolean;
}> = ({ index, isSelected = false }) => {
  // Calendar sheets with rotating indicator
  const timeLabels = ['<6m', '6-12m', '1-2y', '2-5y', '>5y'];

  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center p-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#18534F] text-white ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] text-[#332E27] hover:border-[#CDC5B8]'
      }`}
    >
      <span className="font-mono text-sm font-bold tracking-tight">{timeLabels[index]}</span>
      <span className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#8E877E]'}`}>
        HISTORY
      </span>
    </div>
  );
};

// ============================================================================
// Q11: Family Lineage Pedigree Visual (Card 11 & 17)
// ============================================================================
export const FamilyPedigreeVisual: React.FC<{
  type: 'yes' | 'no' | 'not_sure';
  isSelected?: boolean;
}> = ({ type, isSelected = false }) => {
  return (
    <div
      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center p-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#F4F8F6] ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#CDC5B8]'
      }`}
    >
      <svg viewBox="0 0 80 80" className="w-12 h-12">
        {type === 'yes' && (
          // Connected lineage tree nodes
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none">
            <circle cx="40" cy="22" r="7" fill={isSelected ? '#18534F' : '#332E27'} />
            <line x1="40" y1="29" x2="40" y2="42" />
            <line x1="24" y1="42" x2="56" y2="42" />
            <line x1="24" y1="42" x2="24" y2="52" />
            <line x1="56" y1="42" x2="56" y2="52" />
            <circle cx="24" cy="58" r="6" />
            <circle cx="56" cy="58" r="6" fill={isSelected ? '#18534F' : '#6A655C'} />
          </g>
        )}
        {type === 'no' && (
          // Single standalone calm profile node
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <circle cx="40" cy="34" r="13" />
            <path d="M26 60 C26 51 32 48 40 48 C48 48 54 51 54 60" />
          </g>
        )}
        {type === 'not_sure' && (
          // Question node with subtle orbit
          <g stroke={isSelected ? '#18534F' : '#332E27'} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <circle cx="40" cy="40" r="22" strokeDasharray="3 3" />
            <path d="M35 34 C35 28 45 28 45 34 C45 40 38 40 38 46" />
            <circle cx="38" cy="52" r="1.4" fill={isSelected ? '#18534F' : '#332E27'} stroke="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

// ============================================================================
// Q12: Trajectory Curves (Card 12 in Reference)
// ============================================================================
export const TrajectoryGraphVisual: React.FC<{
  level: number;
  isSelected?: boolean;
}> = ({ level, isSelected = false }) => {
  const curveY = [56, 48, 40, 30, 20][level - 1] ?? 40;

  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center p-2 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#F4F8F6] ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] hover:border-[#CDC5B8]'
      }`}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Subtle circular boundary */}
        <circle cx="40" cy="40" r="34" fill={isSelected ? '#E8F3EE' : 'none'} stroke="#E7E2DA" strokeWidth="1" />
        {/* Baseline */}
        <line x1="18" y1="58" x2="62" y2="58" stroke="#D1CAC0" strokeWidth="1.2" strokeDasharray="2 2" />
        {/* Ascending trajectory curve */}
        <path
          d={`M20 56 C34 56 46 ${curveY + 10} 60 ${curveY}`}
          fill="none"
          stroke={isSelected ? '#18534F' : '#332E27'}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* End dot */}
        <circle cx="60" cy={curveY} r="3" fill={isSelected ? '#18534F' : '#332E27'} />
      </svg>
    </div>
  );
};

// ============================================================================
// Q16, Q19, Q20: Decision Stage & Journey Badges (Card 16, 19, 20)
// ============================================================================
export const DecisionStageVisual: React.FC<{
  step: number;
  label?: string;
  isSelected?: boolean;
}> = ({ step, label, isSelected = false }) => {
  return (
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex flex-col items-center justify-center p-1 transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#18534F] bg-[#18534F] text-white ring-4 ring-[#18534F]/20 shadow-sm scale-105'
          : 'border-[#E7E2DA] bg-[#FAF8F5] text-[#332E27] hover:border-[#CDC5B8]'
      }`}
    >
      <span className="font-mono text-xs font-bold">0{step}</span>
      <span className={`text-[9px] uppercase tracking-wider block mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#8E877E]'}`}>
        STAGE
      </span>
    </div>
  );
};
