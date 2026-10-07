import React, { useState } from 'react';

interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  label: string;
  gradient: {
    bg: string;
    border: string;
    shadow: string;
    iconColor: string;
    accent: string;
  };
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    id: 'step-01',
    stepNumber: '01',
    title: 'Understand Your Hair',
    description:
      'Explore what you notice and put observations into clinical perspective. Remove anxious guesswork through measured, structured self-reporting.',
    label: 'VECTOR 01 · AWARENESS',
    gradient: {
      bg: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
      border: '#FBBF24',
      shadow: 'rgba(245, 158, 11, 0.28)',
      iconColor: '#78350F',
      accent: '#F59E0B'
    },
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C12 2 11 8 11 12C11 14.5 10 16 8.5 17.5C7.5 18.5 7 19.5 7 21C7 22.1 7.9 23 9 23C10.7 23 11.5 21 12 19C12.5 21 13.3 23 15 23C16.1 23 17 22.1 17 21C17 19.5 16.5 18.5 15.5 17.5C14 16 13 14.5 13 12C13 8 12 2 12 2Z" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 2C12 7 12 11 12 15" strokeWidth="2.2" />
        <path d="M4 14C7 14.5 10 13 12 13C14 13 17 14.5 20 14" strokeWidth="1.8" />
        <circle cx="9.5" cy="18.5" r="0.8" fill="currentColor" />
        <circle cx="14.5" cy="18.5" r="0.8" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'step-02',
    stepNumber: '02',
    title: 'Identify Important Patterns',
    description:
      'Distinguish perceived progression, localized hairline recession, temporal recession, and vertex density with validated classification guides.',
    label: 'VECTOR 02 · NORWOOD MAPPING',
    gradient: {
      bg: 'linear-gradient(135deg, #BAE6FD 0%, #38BDF8 50%, #0284C7 100%)',
      border: '#38BDF8',
      shadow: 'rgba(14, 165, 233, 0.28)',
      iconColor: '#0C4A6E',
      accent: '#0284C7'
    },
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="6.5" strokeWidth="2.2" />
        <line x1="15.5" y1="15.5" x2="21" y2="21" strokeWidth="2.5" />
        <path d="M9 13.5C9.5 11 11 9 12 7" strokeWidth="1.8" />
        <path d="M8 10C9 9 10.5 8 11.5 8" strokeWidth="1.5" strokeOpacity="0.7" />
      </svg>
    )
  },
  {
    id: 'step-03',
    stepNumber: '03',
    title: 'Receive a Personalized Report',
    description:
      '8 clinical result vectors synthesized without generic automated diagnosis. Receive clear, categorized metrics regarding your restoration potential.',
    label: 'VECTOR 03 · SYNTHESIZED DATA',
    gradient: {
      bg: 'linear-gradient(135deg, #C7D2FE 0%, #818CF8 50%, #4F46E5 100%)',
      border: '#818CF8',
      shadow: 'rgba(99, 102, 241, 0.28)',
      iconColor: '#1E1B4B',
      accent: '#4F46E5'
    },
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="17" rx="2.5" strokeWidth="2" />
        <path d="M9 3H15V6H9V3Z" rx="1" strokeWidth="1.8" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 9.5V13.5M10 11.5H14" strokeWidth="2" />
        <line x1="8" y1="16" x2="16" y2="16" strokeWidth="1.8" />
        <line x1="8" y1="19" x2="13" y2="19" strokeWidth="1.8" />
      </svg>
    )
  },
  {
    id: 'step-04',
    stepNumber: '04',
    title: 'Know What to Discuss',
    description:
      'Prepare targeted questions regarding donor density, FUE/FUT approaches, medical therapy combinations, and realistic follicular goals.',
    label: 'VECTOR 04 · SPECIALIST ALIGNMENT',
    gradient: {
      bg: 'linear-gradient(135deg, #A7F3D0 0%, #34D399 50%, #059669 100%)',
      border: '#34D399',
      shadow: 'rgba(16, 185, 129, 0.28)',
      iconColor: '#064E3B',
      accent: '#059669'
    },
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.45 20 8.98 19.63 7.69 18.98L3 20.5L4.54 16.18C3.58 14.82 3 13.22 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
        <circle cx="8.5" cy="11.5" r="1.2" fill="currentColor" />
        <circle cx="12" cy="11.5" r="1.2" fill="currentColor" />
        <circle cx="15.5" cy="11.5" r="1.2" fill="currentColor" />
      </svg>
    )
  }
];

export const HairRestorationSteps: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<string>('step-01');

  // Coordinates for the 4 nodes in SVG viewBox coordinates (540 x 680)
  const nodeCoords = [
    { id: 'step-01', cx: 430, cy: 145, num: '01' },
    { id: 'step-02', cx: 480, cy: 275, num: '02' },
    { id: 'step-03', cx: 480, cy: 405, num: '03' },
    { id: 'step-04', cx: 430, cy: 535, num: '04' }
  ];

  const handleCardClick = (id: string) => {
    setActiveStep(id);
    const cardEl = document.getElementById(`card-${id}`);
    if (cardEl && window.innerWidth < 1024) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section
      className="relative scroll-mt-24 py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#FAF9F6] overflow-hidden select-none border-y border-[#E2E8F0]/80"
      id="assessment"
    >
      {/* Soft Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-gradient-to-br from-blue-100/40 via-sky-50/30 to-transparent rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-10 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-tl from-slate-200/40 via-blue-50/20 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(120,119,198,0.06),rgba(255,255,255,0))]"></div>
      </div>

      <div className="max-w-[1360px] mx-auto relative z-10">
        
        {/* Header Eyebrow & Title for Context on all screens */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#CBD5E1]/60 shadow-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#0369A1] font-semibold">
              Clinical Diagnostic Architecture
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] font-medium tracking-tight">
            What You Get from the Assessment
          </h2>
          <p className="text-sm sm:text-base text-[#475569] mt-2 font-normal">
            Remove guesswork and gain clinical clarity.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* UNIFIED RESPONSIVE COMPOSITION: Fluid Auto-Arranging on Computer & Phone   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* ========================================================== */}
          {/* LEFT / CENTER VISUAL: Dimensional Circle & Flowing Track   */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center items-center">
            
            {/* Fluid Scaling Responsive Container */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[500px] xl:max-w-[530px] aspect-[540/680] mx-auto">
              
              {/* SVG Continuous Flowing Track & Numbered Nodes (Scales proportionally) */}
              <svg
                viewBox="0 0 540 680"
                className="w-full h-full drop-shadow-xl overflow-visible"
                fill="none"
              >
                <defs>
                  {/* Metallic 3D Oceanic Blue Gradient */}
                  <linearGradient id="fluidTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.85" />
                    <stop offset="70%" stopColor="#0369A1" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#075985" stopOpacity="1" />
                  </linearGradient>

                  {/* Specular Highlight along the track ridge */}
                  <linearGradient id="fluidTrackHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  </linearGradient>

                  {/* Node Button 3D Gradient */}
                  <linearGradient id="fluidNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="50%" stopColor="#0369A1" />
                    <stop offset="100%" stopColor="#075985" />
                  </linearGradient>

                  {/* Active Node Golden Accent Gradient */}
                  <linearGradient id="fluidNodeActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="60%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#0C4A6E" />
                  </linearGradient>
                </defs>

                {/* Lozenge Pathway Loop Backing Shadow */}
                <path
                  d="M 120 70 C 80 70, 75 110, 110 120 C 180 135, 230 90, 310 95 C 420 100, 480 200, 485 340 C 490 480, 420 575, 310 585 C 230 592, 175 550, 105 565 C 70 575, 75 615, 115 615 C 190 615, 260 625, 340 600 C 455 565, 525 455, 520 340 C 515 210, 440 90, 310 70 Z"
                  fill="url(#fluidTrackGrad)"
                  opacity="0.18"
                />

                {/* Outer Glass Track Tube 3D Bevel (Looping around right side) */}
                <path
                  d="M 125 80 
                     C 220 80, 450 140, 470 340 
                     C 490 540, 240 600, 125 600"
                  stroke="url(#fluidTrackGrad)"
                  strokeWidth="24"
                  strokeLinecap="round"
                  style={{
                    filter: 'drop-shadow(0 10px 18px rgba(2, 132, 199, 0.35))'
                  }}
                />

                {/* Specular Highlight along tube */}
                <path
                  d="M 125 80 
                     C 220 80, 450 140, 470 340 
                     C 490 540, 240 600, 125 600"
                  stroke="url(#fluidTrackHighlight)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.85"
                />

                {/* Inner dotted rhythm line */}
                <path
                  d="M 150 100 
                     C 240 100, 430 160, 445 340 
                     C 460 510, 250 580, 150 580"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  opacity="0.4"
                />

                {/* 4 Interactive SVG Numbered Nodes on the Curved Track */}
                {nodeCoords.map((nc) => {
                  const isHovered = hoveredStep === nc.id;
                  const isActive = activeStep === nc.id;

                  return (
                    <g
                      key={nc.id}
                      className="cursor-pointer transition-transform duration-300"
                      onClick={() => handleCardClick(nc.id)}
                      onMouseEnter={() => setHoveredStep(nc.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      {/* Outer pulse aura when hovered/active */}
                      {(isHovered || isActive) && (
                        <circle
                          cx={nc.cx}
                          cy={nc.cy}
                          r="42"
                          fill="#0284C7"
                          fillOpacity="0.18"
                          className="animate-pulse"
                        />
                      )}

                      {/* White dimensional bezel ring */}
                      <circle
                        cx={nc.cx}
                        cy={nc.cy}
                        r="32"
                        fill="#FFFFFF"
                        stroke={isActive ? '#0284C7' : '#E2E8F0'}
                        strokeWidth={isActive ? '3' : '2'}
                        style={{
                          filter: 'drop-shadow(0 6px 12px rgba(15, 23, 42, 0.15))'
                        }}
                      />

                      {/* Inner 3D Blue Button */}
                      <circle
                        cx={nc.cx}
                        cy={nc.cy}
                        r="26"
                        fill={isActive ? 'url(#fluidNodeActiveGrad)' : 'url(#fluidNodeGrad)'}
                      />

                      {/* Inner top highlight arc on button */}
                      <path
                        d={`M ${nc.cx - 18} ${nc.cy - 6} A 22 22 0 0 1 ${nc.cx + 18} ${nc.cy - 6}`}
                        stroke="#BAE6FD"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.8"
                      />

                      {/* Number Text: 01, 02, 03, 04 */}
                      <text
                        x={nc.cx}
                        y={nc.cy + 7}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="20"
                        fontWeight="bold"
                        fontFamily="serif"
                        className="select-none pointer-events-none drop-shadow-xs"
                      >
                        {nc.num}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Central Dimensional Circle Dish / Plate */}
              <div
                className="absolute top-[26%] left-[10%] w-[62%] aspect-square rounded-full flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-all duration-500 z-10"
                style={{
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F0F7FF 60%, #E0F0FE 100%)',
                  boxShadow: `
                    0 20px 45px -12px rgba(2, 132, 199, 0.25),
                    0 8px 18px -4px rgba(15, 23, 42, 0.08),
                    inset 0 2px 5px rgba(255, 255, 255, 0.95),
                    inset 0 -5px 10px rgba(2, 132, 199, 0.12),
                    0 0 0 1px rgba(186, 230, 253, 0.85)
                  `
                }}
              >
                {/* Outer Glass Bezel Ring around the Circle */}
                <div
                  className="absolute -inset-2 sm:-inset-2.5 rounded-full pointer-events-none"
                  style={{
                    border: '2.5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 0 0 1px rgba(56, 189, 248, 0.35), inset 0 0 12px rgba(56, 189, 248, 0.12)'
                  }}
                />

                {/* Subtle Geometric Apex Motif in background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none">
                  <svg viewBox="0 0 200 200" className="w-36 h-36 text-[#0284C7]">
                    <polygon points="100,20 180,180 20,180" fill="currentColor" />
                  </svg>
                </div>

                {/* Text inside the central plate */}
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl xl:text-3xl text-[#0F172A] font-bold leading-[1.12] tracking-tight">
                    What You Get
                    <span className="block text-[#0284C7] font-serif font-bold mt-0.5">
                      from the
                    </span>
                    <span className="block text-[#0284C7] font-serif font-bold">
                      Assessment
                    </span>
                  </h3>

                  <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-transparent via-[#0284C7]/40 to-transparent my-2 sm:my-3"></div>

                  <p className="text-[10px] sm:text-xs text-[#475569] font-medium leading-tight sm:leading-relaxed max-w-[160px] sm:max-w-[210px]">
                    Remove guesswork and<br />
                    gain clinical clarity.
                  </p>

                  {/* Refined Hair Follicle Motif */}
                  <div className="mt-2 sm:mt-3 relative flex items-center justify-center">
                    <svg viewBox="0 0 90 55" className="w-14 sm:w-18 h-8 sm:h-11 text-[#0284C7]">
                      <path
                        d="M 5 36 Q 45 42 85 36"
                        stroke="#0284C7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(2, 132, 199, 0.4))' }}
                      />
                      <path
                        d="M 15 36 Q 45 40 75 36"
                        stroke="#BAE6FD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M 45 42 C 43 32, 38 18, 48 4"
                        stroke="#0F172A"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M 45 40 C 43.5 32, 40 20, 47 6"
                        stroke="#38BDF8"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <ellipse cx="45" cy="43" rx="4" ry="2.5" fill="#0284C7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT / CARDS COLUMN: Arranged vertically on all devices   */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-3.5 sm:space-y-4 xl:space-y-5">
            {STEPS.map((step) => {
              const isHovered = hoveredStep === step.id;
              const isActive = activeStep === step.id;
              const isDimmed = (hoveredStep !== null && !isHovered) && (activeStep !== step.id);

              return (
                <div
                  key={step.id}
                  id={`card-${step.id}`}
                  onClick={() => handleCardClick(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`group relative rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white border-2 border-[#0284C7] shadow-xl sm:translate-x-1.5 ring-1 ring-[#0284C7]/20'
                      : isHovered
                      ? 'bg-white border-2 border-[#38BDF8] shadow-lg sm:translate-x-1'
                      : 'bg-white/95 hover:bg-white border border-slate-200/90 shadow-xs hover:shadow-md'
                  } ${isDimmed ? 'opacity-85' : 'opacity-100'}`}
                  style={{
                    boxShadow: isActive
                      ? '0 12px 30px -5px rgba(2, 132, 199, 0.16), 0 6px 12px -4px rgba(15, 23, 42, 0.05)'
                      : '0 6px 18px -4px rgba(15, 23, 42, 0.05), 0 2px 6px -2px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div className="flex items-start gap-3.5 sm:gap-5">
                    
                    {/* Step Number Tag (integrated into card for mobile and desktop alignment) */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div
                        className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0"
                        style={{
                          background: step.gradient.bg,
                          border: `1.5px solid ${step.gradient.border}`,
                          boxShadow: `0 8px 16px -2px ${step.gradient.shadow}, inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -2px 4px rgba(0, 0, 0, 0.15)`,
                          color: step.gradient.iconColor
                        }}
                      >
                        {step.icon}
                      </div>

                      {/* Mini pill with Step Number */}
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-[#0284C7] text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-[#0284C7]'
                      }`}>
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Text Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif text-lg sm:text-xl xl:text-2xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#0284C7] transition-colors">
                          {step.title}
                        </h4>
                        
                        {isActive && (
                          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 text-[#0284C7] border border-sky-200">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] xl:text-sm text-[#475569] leading-relaxed mt-1 font-normal">
                        {step.description}
                      </p>

                      {/* Divider & Vector Label */}
                      <div className="pt-2.5 sm:pt-3 mt-2.5 sm:mt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[#64748B] uppercase">
                          {step.label}
                        </span>

                        <span className={`text-[11px] font-mono font-medium transition-opacity ${
                          isActive ? 'text-[#0284C7] opacity-100 font-bold' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}>
                          SELECT →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Left accent bar on active state */}
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-[#0284C7] rounded-r-full" />
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HairRestorationSteps;
