import React, { useState } from 'react';
import headLookingDown from '../../assets/images/head_looking_down_1791205668085.jpg';

interface Discovery04Props {
  result: any;
  onNext?: () => void;
}

export const Discovery04GoalExplorer: React.FC<Discovery04Props> = ({ result, onNext }) => {
  const primaryGoal = result?.primaryGoal || 'restore_hairline';

  // Map primaryGoal to one of the 4 goal sectors
  const initialGoal = (primaryGoal === 'crown_coverage') ? 'crown'
    : (primaryGoal === 'density_top' || primaryGoal === 'reduce_visible_scalp') ? 'top'
    : (primaryGoal === 'fuller_overall') ? 'overall'
    : 'hairline';

  const [selectedGoal, setSelectedGoal] = useState<string>(initialGoal);

  const goalData: Record<string, {
    title: string;
    sub: string;
    icon: string;
    intro: string;
    design: string;
    coverage: string;
    longterm: string;
  }> = {
    hairline: {
      title: 'HAIRLINE',
      sub: 'Shape',
      icon: 'straighten',
      intro: 'The hairline frames your face — it sets the tone for your overall look. Here\'s what we\'ll discuss in your consultation:',
      design: 'We\'ll look at your facial structure, head shape and age to find the most natural-looking hairline design for you.',
      coverage: 'Whether you want subtle refinement or a more noticeable change, we\'ll discuss what feels right for your goals and lifestyle.',
      longterm: 'We\'ll talk about maintenance, progression and how to plan for lasting, natural-looking results that age gracefully.'
    },
    top: {
      title: 'TOP',
      sub: 'Density',
      icon: 'vertical_align_top',
      intro: 'Mid-scalp density creates the foundation of perceived volume and eliminates scalp glare under bright ambient light.',
      design: 'Strategic graft angle calibration to layer follicular units backwards, providing maximum visual density per square centimeter.',
      coverage: 'Integrating existing native hairs with newly placed grafts to achieve seamless, thick coverage without transection.',
      longterm: 'Balancing immediate cosmetic density with conservation of donor follicular reserves for potential future maintenance.'
    },
    crown: {
      title: 'CROWN',
      sub: 'Coverage',
      icon: 'adjust',
      intro: 'Crown restoration addresses the vertex whorl, which naturally radiates hair in a spiral pattern requiring precise artistic reconstruction.',
      design: 'Recreating your biological spiral whorl orientation so hair lies naturally and conceals the center scalp vertex.',
      coverage: 'Determining the optimal balance between vertex densification and anterior hairline framing based on donor availability.',
      longterm: 'Monitoring surrounding crown miniaturization and combining surgical placement with medical therapies for longevity.'
    },
    overall: {
      title: 'OVERALL',
      sub: 'Fullness',
      icon: 'auto_awesome',
      intro: 'Overall fullness focuses on elevating the total volume and thickness across all visible cranial fields.',
      design: 'Prioritizing high-impact aesthetic zones so light reflection is minimized across both frontal and superior fields.',
      coverage: 'Creating uniform density transitions from frontal hairline through the mid-scalp and vertex crown.',
      longterm: 'Developing a multi-stage roadmap that pairs restorative procedures with ongoing scalp health protocols.'
    }
  };

  const currentGoalData = goalData[selectedGoal] || goalData.hairline;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Overhead Goal Map & Right Detail Guide              */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Intro */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              04
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR GOAL
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight tracking-tight">
            What do you want to improve?
          </h1>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            This helps us understand your restoration goal. Tap the area(s) you want to focus on, and we'll show you what this means for your consultation.
          </p>
        </div>

        {/* Center Column: Overhead Head with 4 Goal Sectors */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E877E] mb-1.5 flex items-center gap-1">
            FRONT ↓
          </span>

          <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] shadow-xs">
            <img
              src={headLookingDown}
              alt="Goal Anatomy Map"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#FAF8F5]/35 pointer-events-none" />

            {/* Interactive SVG Goal Overlay */}
            <svg viewBox="0 0 200 250" className="absolute inset-0 w-full h-full select-none">
              {/* TOP (Density) */}
              <ellipse
                cx="100"
                cy="85"
                rx="35"
                ry="22"
                onClick={() => setSelectedGoal('top')}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedGoal === 'top'
                    ? 'fill-[#3FB950]/55 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 10px rgba(63,185,80,0.6))'
                    : 'fill-[#18534F]/25 hover:fill-[#3FB950]/35 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="80" textAnchor="middle" className="text-[8px] font-mono uppercase fill-white font-bold pointer-events-none tracking-widest">
                TOP
              </text>
              <text x="100" y="92" textAnchor="middle" className="text-[7px] font-mono fill-white/90 pointer-events-none">
                Density
              </text>

              {/* HAIRLINE (Shape) */}
              <path
                d="M55,138 Q100,118 145,138 Q130,165 70,165 Z"
                onClick={() => setSelectedGoal('hairline')}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedGoal === 'hairline'
                    ? 'fill-[#3FB950]/55 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 10px rgba(63,185,80,0.6))'
                    : 'fill-[#18534F]/25 hover:fill-[#3FB950]/35 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="145" textAnchor="middle" className="text-[8px] font-mono uppercase fill-white font-bold pointer-events-none tracking-widest">
                HAIRLINE
              </text>
              <text x="100" y="156" textAnchor="middle" className="text-[7px] font-mono fill-white/90 pointer-events-none">
                Shape
              </text>

              {/* CROWN (Coverage) */}
              <circle
                cx="100"
                cy="44"
                r="22"
                onClick={() => setSelectedGoal('crown')}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedGoal === 'crown'
                    ? 'fill-[#3FB950]/55 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 10px rgba(63,185,80,0.6))'
                    : 'fill-[#18534F]/25 hover:fill-[#3FB950]/35 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="42" textAnchor="middle" className="text-[7px] font-mono uppercase fill-white font-bold pointer-events-none tracking-wider">
                CROWN
              </text>
              <text x="100" y="52" textAnchor="middle" className="text-[6.5px] font-mono fill-white/90 pointer-events-none">
                Coverage
              </text>

              {/* OVERALL (Fullness) - Center Connector Accent */}
              <ellipse
                cx="100"
                cy="115"
                rx="48"
                ry="12"
                onClick={() => setSelectedGoal('overall')}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedGoal === 'overall'
                    ? 'fill-[#3FB950]/55 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 10px rgba(63,185,80,0.6))'
                    : 'fill-[#18534F]/20 hover:fill-[#3FB950]/30 stroke-white/40 stroke-1'
                }`}
              />
              <text x="100" y="115" textAnchor="middle" className="text-[7px] font-mono uppercase fill-white font-bold pointer-events-none tracking-widest">
                OVERALL Fullness
              </text>
            </svg>
          </div>
        </div>

        {/* Right Column: Goal Consultation Guide */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-[#F0EBE1] pb-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F0E6] flex items-center justify-center text-[#18534F] shrink-0">
              <span className="material-symbols-outlined text-[20px]">{currentGoalData.icon}</span>
            </div>
            <div>
              <h3 className="font-mono text-sm uppercase font-bold text-[#1B1F23]">
                {currentGoalData.title}
              </h3>
              <span className="text-[11px] text-[#8E877E]">Your selected goal</span>
            </div>
          </div>

          <p className="text-xs text-[#524B40] leading-relaxed">
            {currentGoalData.intro}
          </p>

          <div className="space-y-3 pt-1">
            {/* Design */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] flex items-center justify-center shrink-0 mt-0.5 text-[#18534F]">
                <span className="material-symbols-outlined text-[14px]">edit</span>
              </div>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Design</span>
                <p className="text-[#635C52] text-[11px] mt-0.5 leading-relaxed">{currentGoalData.design}</p>
              </div>
            </div>

            {/* Coverage */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] flex items-center justify-center shrink-0 mt-0.5 text-[#18534F]">
                <span className="material-symbols-outlined text-[14px]">track_changes</span>
              </div>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Coverage</span>
                <p className="text-[#635C52] text-[11px] mt-0.5 leading-relaxed">{currentGoalData.coverage}</p>
              </div>
            </div>

            {/* Long-term plan */}
            <div className="flex items-start gap-2.5 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] flex items-center justify-center shrink-0 mt-0.5 text-[#18534F]">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
              </div>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Long-term plan</span>
                <p className="text-[#635C52] text-[11px] mt-0.5 leading-relaxed">{currentGoalData.longterm}</p>
              </div>
            </div>
          </div>

          {/* Reassurance Callout */}
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-start gap-2.5 text-[11px] text-[#635C52] mt-3">
            <span className="material-symbols-outlined text-[16px] text-[#18534F] shrink-0 mt-0.5">spa</span>
            <span>You're not being told what to do. You're being guided on what to discuss — so you can make the best decision for your future.</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM AREA: Interactive Goal Explorer Cards + Goal at a Glance      */}
      {/* ==================================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8E877E] px-1">
          <span className="font-semibold text-[#18534F]">INTERACTIVE GOAL EXPLORER</span>
          <span className="italic text-[11px] lowercase">Tap a goal to learn more ⤷</span>
        </div>

        {/* 4 Cards: HAIRLINE, TOP, CROWN, OVERALL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['hairline', 'top', 'crown', 'overall'] as const).map((gKey) => {
            const item = goalData[gKey];
            const isSelected = selectedGoal === gKey;
            return (
              <button
                key={gKey}
                type="button"
                onClick={() => setSelectedGoal(gKey)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'bg-white border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="material-symbols-outlined text-[20px] text-[#18534F]">
                      {item.icon}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#18534F] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-mono text-xs uppercase font-bold text-[#1B1F23]">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-[#8E877E] block mt-0.5">
                    {item.sub}
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-[11px] font-mono text-[#18534F] group-hover:translate-x-1 inline-block transition-transform">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Your Goal at a Glance Strip */}
        <div className="p-4 bg-white rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
              <span className="material-symbols-outlined text-[18px]">track_changes</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-[#1B1F23]">
                You've selected <strong className="font-serif italic font-semibold text-[#18534F] text-base">{currentGoalData.title}</strong>
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Let's explore what this means for your consultation, so we can discuss the right approach for your goals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 bg-[#18534F] text-white hover:bg-[#123E3B] text-xs font-medium rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <span>Explore {currentGoalData.title} Goal</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
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
              Your goal isn't just a treatment — it's a plan for the way you want to look and feel, now and in the future.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right sm:border-l sm:border-[#F0EBE1] sm:pl-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] max-w-[200px] leading-tight">
            THE RIGHT CONVERSATION TODAY BUILDS A STRONGER TOMORROW.
          </p>
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-[#CDC5B8]">
            <path d="M0,10 Q10,2 20,10 T40,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};
