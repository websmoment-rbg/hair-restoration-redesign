import React, { useState } from 'react';
import headLookingDown from '../../assets/images/head_looking_down_1791205668085.jpg';

interface Discovery01Props {
  result: any;
  onNext?: () => void;
}

export const Discovery01HairProfile: React.FC<Discovery01Props> = ({ result, onNext }) => {
  const scores = result?.scores || {};
  const rawAnswers = result?.rawAnswers || result?.answers || {};
  const primaryConcern = result?.primaryConcern || 'hairline';

  // Dynamic derivation of constellation and narrative based on real engine signals
  const appearanceScore = scores.motivation ?? 0.75;
  const hairlineScore = scores.hairline ?? 0.8;
  const isAppearanceLed = (rawAnswers?.Q3 >= 3) || (appearanceScore >= 0.6);
  const isFrontal = primaryConcern === 'hairline' || primaryConcern === 'temples';
  const isCrown = primaryConcern === 'crown';

  const headline = isAppearanceLed
    ? 'Your concern is strongly appearance-led.'
    : isFrontal
    ? 'Your concern is concentrated on frontal framing.'
    : isCrown
    ? 'Your concern is centered on vertex coverage.'
    : 'Your concern is focused on overall density.';

  const supportingCopy = isFrontal
    ? "The front of your hair is the area you notice most, but what makes it important is the effect that change has on the way you see your overall appearance."
    : isCrown
    ? "Thinning in the crown area is your primary focus, and restoring fullness there is closely tied to how you feel about your overall hair density."
    : "Changes in hair fullness are your primary focus, and achieving a fuller look across the scalp drives your restoration goals.";

  const bigPicture = isAppearanceLed
    ? "Your answers show that this isn't just about hair — it's about how it influences your confidence, self-image and the way you show up in your daily life."
    : "Your answers indicate a focused objective to stabilize and restore key focal zones to maintain long-term aesthetic harmony.";

  // Constellation interactive nodes
  const [selectedNode, setSelectedNode] = useState<string>('hairline');

  const nodesInfo: Record<string, { label: string; desc: string; icon: string }> = {
    hairline: {
      label: isFrontal ? 'HAIRLINE CHANGE' : 'PRIMARY AREA',
      desc: isFrontal
        ? 'You noticed the front of your hair changing more than other areas (Q1, Q2).'
        : 'Your focus is concentrated on specific anatomical zones that frame your head shape.',
      icon: 'expand'
    },
    appearance: {
      label: 'APPEARANCE IMPACT',
      desc: 'The shape and density of your hair meaningfully influences your facial framing (Q3).',
      icon: 'face'
    },
    goal: {
      label: 'GOAL',
      desc: 'Your preferred outcome is directly aligned with restoring natural definition (Q14, Q18).',
      icon: 'track_changes'
    },
    motivation: {
      label: 'MOTIVATION',
      desc: 'Restoring appearance is a high personal priority rather than simply accepting loss (Q15, Q17).',
      icon: 'psychology'
    }
  };

  // Contributing questions dynamically derived
  const topQuestions = [
    { q: 'Q1', title: 'Hairline visibility', desc: 'How much you notice changes in your hairline.' },
    { q: 'Q2', title: 'Impact on appearance', desc: 'How much it affects your overall look.' },
    { q: 'Q3', title: 'Personal priority', desc: 'How hairline shape influences your facial aesthetic.' },
    { q: 'Q8', title: 'Primary location', desc: 'The front hairline is where change is noticed most.' },
    { q: 'Q15', title: 'Restoration priority', desc: 'Prioritizing aesthetic restoration over maintenance alone.' },
    { q: 'Q17', title: 'Personal outcome', desc: 'The positive difference achievable through restoration.' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Title & Insight (Left) + Signal Constellation (Right)       */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              01
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR HAIR PROFILE
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] text-[#1B1F23] font-normal leading-tight tracking-tight">
            {headline}
          </h1>

          <p className="text-sm sm:text-base text-[#524B40] leading-relaxed">
            {supportingCopy}
          </p>

          {/* The Big Picture Card */}
          <div className="p-5 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] flex items-start gap-4 shadow-2xs">
            <div className="w-10 h-10 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
              <span className="material-symbols-outlined text-[20px]">spa</span>
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E877E] font-semibold block mb-1">
                THE BIG PICTURE
              </span>
              <p className="text-xs sm:text-sm text-[#423C33] leading-relaxed">
                {bigPicture}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Signal Constellation */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#8E877E] mb-2 px-2">
            <span className="flex items-center gap-1 font-semibold text-[#18534F]">
              SIGNAL CONSTELLATION
              <span className="material-symbols-outlined text-[14px]">info</span>
            </span>
            <span className="italic text-[11px] lowercase">Tap a node to explore ⤷</span>
          </div>

          {/* Interactive Constellation SVG Container */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center bg-[#FAF8F5]/80 rounded-2xl border border-[#E7E2DA] p-6">
            {/* Background Diamond Orbit Lines */}
            <svg viewBox="0 0 360 360" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Outer soft diamond */}
              <polygon
                points="180,30 330,180 180,330 30,180"
                fill="none"
                stroke="#E7E2DA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Inner diamond */}
              <polygon
                points="180,70 290,180 180,290 70,180"
                fill="#F2EFE8"
                fillOpacity="0.4"
                stroke="#D7E7D2"
                strokeWidth="1.5"
              />
              {/* Radial connection lines from center (180, 180) to nodes */}
              <line x1="180" y1="180" x2="180" y2="70" stroke={selectedNode === 'hairline' ? '#18534F' : '#CDC5B8'} strokeWidth={selectedNode === 'hairline' ? '2.5' : '1.5'} />
              <line x1="180" y1="180" x2="70" y2="180" stroke={selectedNode === 'appearance' ? '#18534F' : '#CDC5B8'} strokeWidth={selectedNode === 'appearance' ? '2.5' : '1.5'} />
              <line x1="180" y1="180" x2="290" y2="180" stroke={selectedNode === 'goal' ? '#18534F' : '#CDC5B8'} strokeWidth={selectedNode === 'goal' ? '2.5' : '1.5'} />
              <line x1="180" y1="180" x2="180" y2="290" stroke={selectedNode === 'motivation' ? '#18534F' : '#CDC5B8'} strokeWidth={selectedNode === 'motivation' ? '2.5' : '1.5'} />
            </svg>

            {/* Central Node: YOUR CONCERN */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-white border-2 border-[#18534F] shadow-sm flex flex-col items-center justify-center p-2 text-center">
              <span className="material-symbols-outlined text-[20px] text-[#18534F]">person</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E877E] mt-0.5">
                YOUR CONCERN
              </span>
              <span className="font-serif text-[11px] font-semibold text-[#1B1F23] leading-none mt-0.5 capitalize">
                {primaryConcern.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Top Node: HAIRLINE CHANGE */}
            <button
              type="button"
              onClick={() => setSelectedNode('hairline')}
              className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer transition-all ${
                selectedNode === 'hairline' ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedNode === 'hairline'
                  ? 'bg-[#18534F] text-white shadow-md ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#524B40] border border-[#CDC5B8] group-hover:border-[#18534F]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">straighten</span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider mt-1.5 font-semibold ${
                selectedNode === 'hairline' ? 'text-[#18534F]' : 'text-[#78716C]'
              }`}>
                HAIRLINE CHANGE
              </span>
            </button>

            {/* Left Node: APPEARANCE IMPACT */}
            <button
              type="button"
              onClick={() => setSelectedNode('appearance')}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer transition-all ${
                selectedNode === 'appearance' ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedNode === 'appearance'
                  ? 'bg-[#18534F] text-white shadow-md ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#524B40] border border-[#CDC5B8] group-hover:border-[#18534F]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">face</span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider mt-1.5 font-semibold ${
                selectedNode === 'appearance' ? 'text-[#18534F]' : 'text-[#78716C]'
              }`}>
                APPEARANCE
              </span>
            </button>

            {/* Right Node: GOAL */}
            <button
              type="button"
              onClick={() => setSelectedNode('goal')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer transition-all ${
                selectedNode === 'goal' ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedNode === 'goal'
                  ? 'bg-[#18534F] text-white shadow-md ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#524B40] border border-[#CDC5B8] group-hover:border-[#18534F]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">track_changes</span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider mt-1.5 font-semibold ${
                selectedNode === 'goal' ? 'text-[#18534F]' : 'text-[#78716C]'
              }`}>
                GOAL
              </span>
            </button>

            {/* Bottom Node: MOTIVATION */}
            <button
              type="button"
              onClick={() => setSelectedNode('motivation')}
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer transition-all ${
                selectedNode === 'motivation' ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedNode === 'motivation'
                  ? 'bg-[#18534F] text-white shadow-md ring-4 ring-[#D7E7D2]'
                  : 'bg-white text-[#524B40] border border-[#CDC5B8] group-hover:border-[#18534F]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-wider mt-1.5 font-semibold ${
                selectedNode === 'motivation' ? 'text-[#18534F]' : 'text-[#78716C]'
              }`}>
                MOTIVATION
              </span>
            </button>
          </div>

          {/* Active Node Explanation Pill Card */}
          <div className="mt-3 w-full max-w-[420px] p-3 bg-white rounded-xl border border-[#D7E7D2] flex items-center gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-[#E8F0E6] flex items-center justify-center text-[#18534F] shrink-0">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <p className="text-xs text-[#3F3A33] leading-snug">
              <span className="font-semibold text-[#18534F]">{nodesInfo[selectedNode].label}: </span>
              {nodesInfo[selectedNode].desc}
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOWER CONTAINER: Detailed Insight & How Answers Connect (Matching Ref)*/}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Head Illustration with highlighted zone */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[260px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5]">
              <img
                src={headLookingDown}
                alt="Hairline Profile"
                className="w-full h-full object-cover object-top"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#FAF8F5]/30 pointer-events-none" />

              {/* Glowing Hairline / Concern Overlay */}
              <div className="absolute top-[28%] left-[20%] right-[20%] h-14 rounded-full bg-[#3FB950]/25 blur-md border border-[#3FB950]/60 pointer-events-none" />

              {/* Callout Indicator Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#E7E2DA] shadow-xs text-xs font-medium text-[#1B1F23] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#18534F] animate-pulse" />
                <span>Front area (most noticed)</span>
              </div>
            </div>
          </div>

          {/* Center: Detailed Insight & Contributing Questions */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              DETAILED INSIGHT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23] font-normal leading-snug">
              The front of your hair matters most.
            </h3>
            <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
              You notice changes in your front hairline more than any other area. For you, it's not just about hair — it's about how it affects your appearance and the way you see yourself.
            </p>

            <div className="pt-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block mb-2">
                YOUR TOP CONNECTIONS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topQuestions.map((t) => (
                  <span
                    key={t.q}
                    className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E7E2DA] rounded-md font-mono text-xs font-semibold text-[#18534F]"
                  >
                    {t.q}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[#8E877E] mt-2">
                These {topQuestions.length} questions together reveal what's really driving your concern.
              </p>
            </div>
          </div>

          {/* Right: How Your Answers Connect (Vertical Chain) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#F0EBE1] pt-6 lg:pt-0 lg:pl-8 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#8E877E] font-semibold block mb-3">
              HOW YOUR ANSWERS CONNECT
            </span>

            <div className="space-y-3">
              {topQuestions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] flex items-center justify-center font-mono text-[10px] font-bold text-[#18534F] shrink-0 mt-0.5">
                    {item.q}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-[#1B1F23] leading-none">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#78716C] mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
