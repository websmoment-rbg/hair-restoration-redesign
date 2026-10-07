import React, { useState } from 'react';

interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  details: string[];
  visualType: 'evaluation' | 'planning' | 'donor' | 'extraction' | 'preparation' | 'placement' | 'recovery' | 'growth';
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Clinical Evaluation',
    tagline: 'Trichoscopic Scalp & Follicle Diagnostics',
    description: 'A comprehensive in-person magnified scalp examination evaluating hair caliber, follicular unit grouping, and scalp elasticity under digital dermatoscopy.',
    details: ['Digital microscopic densitometry', 'Evaluation of miniaturization ratios', 'Scalp vascularity assessment'],
    visualType: 'evaluation'
  },
  {
    number: '02',
    title: 'Aesthetic Planning',
    tagline: 'Facial Anatomy & Hairline Architecture',
    description: 'Custom hairline mapping tailored to facial structure, bone landmarks, and age-appropriate natural height to ensure harmonious aesthetics for decades ahead.',
    details: ['Golden ratio facial framing', 'Temporal peak angle design', 'Single-hair feathering perimeter outline'],
    visualType: 'planning'
  },
  {
    number: '03',
    title: 'Donor Safe-Zone Mapping',
    tagline: 'Occipital Reserve Conservation',
    description: 'Precision boundary delineation of the genetically permanent occipital safe donor area to calculate sustainable graft harvesting without visible thinning.',
    details: ['Permanent safe zone demarcation', 'Extraction density limit calibration', 'Reserve preservation calculations'],
    visualType: 'donor'
  },
  {
    number: '04',
    title: 'Precision Graft Harvesting',
    tagline: '0.8mm Trumpet-Punch Micro-FUE',
    description: 'Individual follicular units are harvested using custom hybrid trumpet punches that follow follicle exit angles, preventing transection and eliminating linear scars.',
    details: ['0.8mm micro-rotary punches', 'Sub-millimeter depth control', 'Zero linear scar formation'],
    visualType: 'extraction'
  },
  {
    number: '05',
    title: 'Stereomicroscopic Preparation',
    tagline: 'Chilled Bio-Hydration & Unit Sorting',
    description: 'Grafts are sorted under high-magnification stereomicroscopes into 1-hair, 2-hair, and 3-hair groupings and held in chilled physiological bio-enhancement baths.',
    details: ['Microscopic sorting by unit caliber', 'Hypothermosol preservation bath', 'Vascular survival rate protection'],
    visualType: 'preparation'
  },
  {
    number: '06',
    title: 'Angled Incision Placement',
    tagline: 'Dual-Depth Lateral Slit Implantation',
    description: 'Custom sapphire micro-incisions match the natural direction, depth, and 15–45 degree exit angles of native hair for seamless density and direction.',
    details: ['Single-hair units placed in hairline', 'Multi-hair units placed in interior fields', 'Zero unnatural doll-hair clustering'],
    visualType: 'placement'
  },
  {
    number: '07',
    title: 'Initial Healing & Recovery',
    tagline: '72-Hour Re-vascularization Window',
    description: 'Grafts acclimate and establish capillary connections within 72 hours. Tiny crusts shed naturally within 7–10 days with gentle saline rinses.',
    details: ['Rapid capillary integration in 72h', 'Normal activities resume within 48h', 'Protective aftercare protocol'],
    visualType: 'recovery'
  },
  {
    number: '08',
    title: 'Gradual Maturation & Growth',
    tagline: 'Progressive Density over 12–18 Months',
    description: 'After an expected dormant shedding cycle, new terminal hairs emerge at month 3–4, thicken significantly by month 9–12, and mature fully at month 15–18.',
    details: ['Month 3–4: Early fine emergence', 'Month 9–12: Dramatic cosmetic density', 'Month 15–18: Full caliber & texture maturity'],
    visualType: 'growth'
  }
];

export const RestorationProcessSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = PROCESS_STEPS[activeStepIndex];

  // Visual Graphic Renderers for each of the 8 steps
  const renderVisual = (type: ProcessStep['visualType']) => {
    switch (type) {
      case 'evaluation':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <circle cx="100" cy="100" r="75" fill="#FAF8F5" stroke="#18534F" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="50" fill="#E8F0E6" stroke="#18534F" strokeWidth="2" />
              {/* Magnifier grid */}
              <line x1="100" y1="50" x2="100" y2="150" stroke="#CDC5B8" strokeWidth="1" />
              <line x1="50" y1="100" x2="150" y2="100" stroke="#CDC5B8" strokeWidth="1" />
              {/* Follicular units */}
              <circle cx="85" cy="85" r="4" fill="#18534F" />
              <circle cx="95" cy="83" r="3" fill="#18534F" />
              <circle cx="115" cy="110" r="4" fill="#18534F" />
              <circle cx="125" cy="108" r="4" fill="#18534F" />
              <circle cx="120" cy="118" r="3" fill="#18534F" />
              <circle cx="80" cy="120" r="4" fill="#18534F" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              DIGITAL DERMATOSCOPY SCAN
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Evaluation of Follicular Groupings</span>
          </div>
        );

      case 'planning':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              {/* Head outline */}
              <ellipse cx="100" cy="110" rx="65" ry="75" fill="#FAF8F5" stroke="#CDC5B8" strokeWidth="2" />
              {/* Hairline planning guideline */}
              <path d="M50,95 Q100,75 150,95" fill="none" stroke="#18534F" strokeWidth="3" />
              <path d="M50,95 Q70,78 100,75 Q130,78 150,95" fill="none" stroke="#3FB950" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Temporal peak points */}
              <circle cx="50" cy="95" r="4" fill="#18534F" />
              <circle cx="150" cy="95" r="4" fill="#18534F" />
              <circle cx="100" cy="75" r="4" fill="#18534F" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              NATURAL HAIRLINE ARCHITECTURE
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Golden Ratio Facial Harmony</span>
          </div>
        );

      case 'donor':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              {/* Head rear outline */}
              <ellipse cx="100" cy="100" rx="70" ry="80" fill="#FAF8F5" stroke="#CDC5B8" strokeWidth="2" />
              {/* Occipital safe donor band */}
              <path d="M45,115 Q100,140 155,115 Q150,155 100,165 Q50,155 45,115 Z" fill="#E8F0E6" stroke="#18534F" strokeWidth="2" />
              <text x="100" y="140" textAnchor="middle" className="text-[9px] font-mono fill-[#18534F] font-bold uppercase tracking-wider">
                SAFE DONOR ZONE
              </text>
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              OCCIPITAL SAFE ZONE BOUNDARY
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Lifelong DHT-Resistant Follicles</span>
          </div>
        );

      case 'extraction':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <rect x="40" y="110" width="120" height="60" rx="8" fill="#FAF8F5" stroke="#CDC5B8" strokeWidth="2" />
              {/* Punch tool */}
              <line x1="100" y1="30" x2="100" y2="110" stroke="#18534F" strokeWidth="4" />
              <polygon points="94,110 106,110 100,122" fill="#18534F" />
              {/* Follicular unit harvested */}
              <circle cx="100" cy="135" r="6" fill="#3FB950" />
              <line x1="100" y1="135" x2="100" y2="155" stroke="#18534F" strokeWidth="2" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              0.8mm TRUMPET MICRO-EXTRACTION
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Zero Linear Scarring</span>
          </div>
        );

      case 'preparation':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              {/* Petri dish / chilled bath */}
              <circle cx="100" cy="100" r="70" fill="#E8F0E6" stroke="#18534F" strokeWidth="2" />
              <circle cx="100" cy="100" r="55" fill="white" stroke="#D7E7D2" strokeWidth="1.5" />
              {/* 1, 2, 3 hair groupings */}
              <g transform="translate(70, 85)">
                <circle cx="5" cy="5" r="3" fill="#18534F" />
                <text x="5" y="22" textAnchor="middle" className="text-[8px] font-mono fill-[#18534F]">1-Hair</text>
              </g>
              <g transform="translate(100, 85)">
                <circle cx="3" cy="5" r="3" fill="#18534F" />
                <circle cx="11" cy="5" r="3" fill="#18534F" />
                <text x="7" y="22" textAnchor="middle" className="text-[8px] font-mono fill-[#18534F]">2-Hair</text>
              </g>
              <g transform="translate(130, 85)">
                <circle cx="0" cy="5" r="3" fill="#18534F" />
                <circle cx="8" cy="5" r="3" fill="#18534F" />
                <circle cx="16" cy="5" r="3" fill="#18534F" />
                <text x="8" y="22" textAnchor="middle" className="text-[8px] font-mono fill-[#18534F]">3-Hair</text>
              </g>
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              MICROSCOPIC CALIBER SORTING
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Chilled Bio-Hydration Preservation</span>
          </div>
        );

      case 'placement':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <path d="M30,140 Q100,130 170,140" stroke="#CDC5B8" strokeWidth="3" fill="none" />
              {/* Angled slits and hairs */}
              <line x1="60" y1="138" x2="75" y2="85" stroke="#18534F" strokeWidth="2.5" />
              <line x1="85" y1="136" x2="100" y2="80" stroke="#18534F" strokeWidth="2.5" />
              <line x1="110" y1="135" x2="125" y2="78" stroke="#18534F" strokeWidth="2.5" />
              <line x1="135" y1="136" x2="150" y2="82" stroke="#18534F" strokeWidth="2.5" />
              {/* Arc angle indicator */}
              <path d="M85,120 A20,20 0 0,1 95,115" stroke="#3FB950" strokeWidth="1.5" fill="none" />
              <text x="110" y="112" className="text-[8px] font-mono fill-[#3FB950]">35° Natural</text>
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              DUAL-DEPTH ANGLED PLACEMENT
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Exact Anatomical Exit Angles</span>
          </div>
        );

      case 'recovery':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <circle cx="100" cy="100" r="65" fill="#FAF8F5" stroke="#18534F" strokeWidth="2" />
              <path d="M65,100 L90,125 L140,75" fill="none" stroke="#3FB950" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              72-HOUR VASCULARIZATION
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Rapid Micro-Capillary Integration</span>
          </div>
        );

      case 'growth':
      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <svg viewBox="0 0 200 200" className="w-44 h-44">
              <path d="M40,150 L80,130 L120,95 L160,50" fill="none" stroke="#18534F" strokeWidth="3" />
              <circle cx="40" cy="150" r="5" fill="#18534F" />
              <circle cx="80" cy="130" r="5" fill="#18534F" />
              <circle cx="120" cy="95" r="5" fill="#18534F" />
              <circle cx="160" cy="50" r="6" fill="#3FB950" />
              <text x="40" y="168" textAnchor="middle" className="text-[8px] font-mono fill-[#8E877E]">M0</text>
              <text x="80" y="148" textAnchor="middle" className="text-[8px] font-mono fill-[#8E877E]">M3</text>
              <text x="120" y="113" textAnchor="middle" className="text-[8px] font-mono fill-[#8E877E]">M9</text>
              <text x="160" y="38" textAnchor="middle" className="text-[8px] font-mono fill-[#18534F] font-bold">M12-18</text>
            </svg>
            <span className="font-mono text-xs uppercase tracking-wider text-[#18534F] font-bold mt-2">
              12–18 MONTH MATURATION TIMELINE
            </span>
            <span className="text-[11px] text-[#8E877E] mt-0.5">Full Permanent Terminal Hair Caliber</span>
          </div>
        );
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            EDUCATIONAL CLINICAL BLUEPRINT
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
          How Hair Restoration Works
        </h2>
        <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
          Understanding the journey makes the process transparent and manageable. Here is the 8-stage clinical sequence from initial diagnostic evaluation to lifelong hair growth.
        </p>
      </div>

      {/* Two-Column Composition: Sticky Visual (Left) + Interactive 8-Stage Track (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dynamic Visual Stage */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] p-6 shadow-xs aspect-square flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-3">
              <span className="font-mono text-xs text-[#8E877E] uppercase font-bold">
                STAGE {activeStep.number} OF 08
              </span>
              <span className="px-2.5 py-0.5 bg-[#E8F0E6] text-[#18534F] text-[10px] font-mono rounded-full font-bold uppercase">
                Active Step
              </span>
            </div>

            {/* Render Stage Specific Educational Diagram */}
            <div className="my-auto">
              {renderVisual(activeStep.visualType)}
            </div>

            <div className="border-t border-[#E7E2DA] pt-3 text-center">
              <span className="text-[10px] text-[#8E877E] italic font-sans">
                Educational visual diagram · Individual anatomical planning occurs in-clinic
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 8-Step Interactive Sequence */}
        <div className="lg:col-span-7 space-y-3">
          {PROCESS_STEPS.map((step, idx) => {
            const isSelected = activeStepIndex === idx;
            return (
              <div
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs ring-2 ring-[#18534F]/30'
                    : 'bg-white border-[#E7E2DA] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#18534F] text-white shadow-xs'
                        : 'bg-[#FAF8F5] border border-[#CDC5B8] text-[#78716C]'
                    }`}>
                      {step.number}
                    </span>
                    <div>
                      <h4 className="font-serif text-lg text-[#1B1F23] font-medium leading-snug">
                        {step.title}
                      </h4>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E]">
                        {step.tagline}
                      </span>
                    </div>
                  </div>

                  <span className={`material-symbols-outlined text-[20px] transition-transform ${
                    isSelected ? 'rotate-90 text-[#18534F]' : 'text-[#CDC5B8]'
                  }`}>
                    chevron_right
                  </span>
                </div>

                {/* Expanded Details when Selected */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-[#D6E6DF] space-y-3 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-[#423C33] leading-relaxed">
                      {step.description}
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-[#18534F]">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span className="font-medium text-[#524B40]">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
