import React, { useState } from 'react';

export const DonorResourceSection: React.FC = () => {
  const [activeZone, setActiveZone] = useState<'donor' | 'recipient' | 'longterm'>('donor');
  const [selectedDestination, setSelectedDestination] = useState<'current' | 'future' | 'longterm'>('current');

  const zoneExplanations = {
    donor: {
      title: 'Occipital Safe Donor Area',
      tag: 'DONOR ZONE',
      desc: 'The donor area is located around the back and sides of the scalp where hair follicles are genetically programmed with lifetime DHT-resistance. Its follicular unit density and available supply are foundational parameters evaluated during clinical planning.'
    },
    recipient: {
      title: 'Recipient Restoration Field',
      tag: 'RECIPIENT ZONE',
      desc: 'This is the anterior hairline, mid-scalp, or crown area where restoration is strategically planned. Grafts implanted here retain their genetic DHT-resistance and grow permanently.'
    },
    longterm: {
      title: 'Long-Term Strategic Reserve',
      tag: 'PRESERVATION PLANNING',
      desc: 'Restoration planning considers not only what you wish to improve today, but how remaining donor follicles are protected to maintain natural proportions across 10, 20, or 30 years.'
    }
  };

  const allocationInfo = {
    current: {
      title: 'Current Restoration Phase',
      tag: 'TODAY\'S PRIORITIES',
      copy: 'Some donor hair may be deployed to reconstruct your current primary goals, such as restoring the frontal hairline framing or thickening a thinning vertex whorl.',
      focus: 'High visual impact with calibrated graft density'
    },
    future: {
      title: 'Future Aging Anticipation',
      tag: 'PROGRESSIVE STABILITY',
      copy: 'Hair thinning can progress naturally over decades. Reserving a calibrated portion of your donor follicles ensures you have supply available should additional density be desired later in life.',
      focus: 'Safeguarding donor units for mature facial contouring'
    },
    longterm: {
      title: 'Lifetime Donor Integrity',
      tag: 'CONSERVATIVE ARCHITECTURE',
      copy: 'A specialist ensures the donor area itself never looks visibly thinned or moth-eaten. Safe-distance harvesting preserves the natural cosmetic appearance of the back of the head.',
      focus: 'Preserving occipital scalp aesthetics permanently'
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            LONG-TERM FOLLICULAR CONSERVATION
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
          Donor Hair Is a Limited Resource
        </h2>
        <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
          Restoration planning isn't only about what you want to improve today. Your specialist also considers how available donor hair must be responsibly managed over your entire lifetime.
        </p>
      </div>

      {/* Two-Part Interactive Stage: Scalp Zone Visual (Left) + Interactive Allocation Metaphor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Anatomical Scalp Diagram (Donor vs Recipient) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] p-6 flex flex-col items-center justify-between shadow-xs">
          <div className="flex items-center justify-between w-full border-b border-[#E7E2DA] pb-2 text-xs font-mono text-[#8E877E]">
            <span className="font-bold text-[#18534F]">ANATOMICAL ZONES</span>
            <span className="italic text-[11px]">Tap zone to inspect ⤷</span>
          </div>

          {/* Scalp SVG Graphic */}
          <div className="my-6 relative w-48 h-56 select-none">
            <svg viewBox="0 0 200 240" className="w-full h-full">
              {/* Head Silhouette */}
              <ellipse cx="100" cy="120" rx="80" ry="100" fill="#FFFFFF" stroke="#CDC5B8" strokeWidth="2" />

              {/* Recipient Area (Top & Front) */}
              <path
                d="M45,70 Q100,40 155,70 Q150,120 100,130 Q50,120 45,70 Z"
                onClick={() => setActiveZone('recipient')}
                className={`cursor-pointer transition-all ${
                  activeZone === 'recipient'
                    ? 'fill-[#3FB950]/50 stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(63,185,80,0.5))'
                    : 'fill-[#18534F]/20 hover:fill-[#3FB950]/30 stroke-[#CDC5B8]'
                }`}
              />
              <text x="100" y="85" textAnchor="middle" className="text-[9px] font-mono fill-[#18534F] font-bold uppercase pointer-events-none">
                RECIPIENT ZONE
              </text>
              <text x="100" y="98" textAnchor="middle" className="text-[7.5px] font-mono fill-[#524B40] pointer-events-none">
                (Frontal, Mid & Crown)
              </text>

              {/* Donor Area (Back & Sides Occipital Safe Zone) */}
              <path
                d="M38,135 Q100,125 162,135 Q158,190 100,205 Q42,190 38,135 Z"
                onClick={() => setActiveZone('donor')}
                className={`cursor-pointer transition-all ${
                  activeZone === 'donor'
                    ? 'fill-[#18534F] stroke-[#18534F] stroke-2 filter drop-shadow(0 0 8px rgba(24,83,79,0.5))'
                    : 'fill-[#18534F]/30 hover:fill-[#18534F]/50 stroke-[#CDC5B8]'
                }`}
              />
              <text x="100" y="160" textAnchor="middle" className="text-[9px] font-mono fill-white font-bold uppercase pointer-events-none">
                SAFE DONOR ZONE
              </text>
              <text x="100" y="172" textAnchor="middle" className="text-[7.5px] font-mono fill-white/80 pointer-events-none">
                (Occipital Permanent Hair)
              </text>
            </svg>
          </div>

          {/* Active Zone Explanation Box */}
          <div className="w-full p-3.5 bg-white rounded-xl border border-[#D7E7D2] shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#18534F]">
                {zoneExplanations[activeZone].tag}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#18534F]" />
            </div>
            <h5 className="font-serif text-sm font-medium text-[#1B1F23]">
              {zoneExplanations[activeZone].title}
            </h5>
            <p className="text-[11px] text-[#524B40] leading-relaxed">
              {zoneExplanations[activeZone].desc}
            </p>
          </div>
        </div>

        {/* Right Column: Donor Allocation Concept Metaphor */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-wider font-semibold block">
              DONOR SUPPLY ALLOCATION METAPHOR
            </span>
            <h3 className="font-serif text-2xl text-[#1B1F23]">
              How Specialists Distribute Available Supply
            </h3>
            <p className="text-xs text-[#524B40] leading-relaxed">
              Because human donor follicles cannot be regenerated once extracted, ethical surgeons view your donor supply as a finite biological fund to be invested strategically.
            </p>
          </div>

          {/* 3 Interactive Destination Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['current', 'future', 'longterm'] as const).map((dest) => {
              const item = allocationInfo[dest];
              const isSelected = selectedDestination === dest;
              return (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                      : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className={`font-mono text-[9px] uppercase tracking-wider block font-semibold ${
                    isSelected ? 'text-[#94C3AE]' : 'text-[#8E877E]'
                  }`}>
                    {item.tag}
                  </span>
                  <span className="font-serif text-sm font-medium mt-1 leading-snug">
                    {item.title}
                  </span>
                  <span className={`text-[10px] mt-2 block ${isSelected ? 'text-white/80' : 'text-[#78716C]'}`}>
                    Explore Focus →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Allocation Detail Card */}
          <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#18534F]">balance</span>
              <h4 className="font-serif text-lg text-[#1B1F23] font-medium">
                {allocationInfo[selectedDestination].title}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-[#423C33] leading-relaxed">
              {allocationInfo[selectedDestination].copy}
            </p>

            <div className="p-2.5 bg-white rounded-lg border border-[#E7E2DA] flex items-center gap-2 text-xs">
              <span className="font-mono text-[10px] uppercase text-[#18534F] font-bold">CLINICAL FOCUS:</span>
              <span className="text-[#524B40]">{allocationInfo[selectedDestination].focus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Takeaway Bar (Calm Reassurance without Fake Urgency) */}
      <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
            <span className="material-symbols-outlined text-[18px]">spa</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              BALANCED CLINICAL PHILOSOPHY
            </span>
            <p className="font-serif text-base text-[#1B1F23]">
              Donor hair is a limited resource. Understanding your situation earlier can help you have a more informed conversation about long-term planning.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#18534F] font-semibold shrink-0">
          <span>TODAY</span>
          <span>→</span>
          <span>PLANNING</span>
          <span>→</span>
          <span>LONG-TERM</span>
        </div>
      </div>
    </section>
  );
};
