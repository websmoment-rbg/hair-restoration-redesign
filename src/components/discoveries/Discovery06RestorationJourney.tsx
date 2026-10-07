import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface Discovery06Props {
  result: any;
  onNext?: () => void;
}

export const Discovery06RestorationJourney: React.FC<Discovery06Props> = ({ result, onNext }) => {
  const readinessStage = result?.readinessStage || result?.readiness?.stage || 'exploring';
  const rawAnswers = result?.rawAnswers || result?.answers || {};

  // Map to one of the 5 stages
  const q16 = rawAnswers?.Q16 ?? 3;
  const initialStage = q16 === 1 ? 'curious'
    : q16 === 2 ? 'researching'
    : q16 === 3 ? 'comparing'
    : q16 === 4 ? 'seriously_exploring'
    : 'ready_to_discuss';

  const [activeStage, setActiveStage] = useState<string>(initialStage);

  const stages = [
    {
      id: 'curious',
      title: 'CURIOUS',
      icon: 'search',
      desc: "You're just starting to learn about hair restoration."
    },
    {
      id: 'researching',
      title: 'RESEARCHING',
      icon: 'menu_book',
      desc: "You're gathering information and exploring options."
    },
    {
      id: 'comparing',
      title: 'COMPARING',
      icon: 'balance',
      desc: "You're looking at different approaches and providers."
    },
    {
      id: 'seriously_exploring',
      title: 'SERIOUSLY EXPLORING',
      icon: 'explore',
      desc: "You're looking for clearer details about what could realistically be discussed for your goals."
    },
    {
      id: 'ready_to_discuss',
      title: 'READY TO DISCUSS',
      icon: 'chat',
      desc: "You're prepared to have a more focused conversation."
    }
  ];

  const stageHeadlines: Record<string, { headline: string; copy: string }> = {
    curious: {
      headline: "You're building initial awareness.",
      copy: "You're in the early observation phase, learning how hair loss evolves and discovering what modern restoration methods exist today."
    },
    researching: {
      headline: "You're gathering objective facts.",
      copy: "You've moved past passive curiosity and are actively educating yourself on surgical techniques, timeline expectations, and realistic outcomes."
    },
    comparing: {
      headline: "You're weighing different approaches.",
      copy: "You're assessing procedural modalities, non-surgical therapies, and clinic standards to understand which pathway fits your situation."
    },
    seriously_exploring: {
      headline: "You're seriously exploring restoration.",
      copy: "You're past the stage of simply wondering about hair restoration. You now want clearer information about what could realistically be discussed for your goals."
    },
    ready_to_discuss: {
      headline: "You're ready for specialist conversation.",
      copy: "You have specific questions and are prepared to review your personalized anatomical profile directly with a qualified hair restoration physician."
    }
  };

  const currentStageInfo = stageHeadlines[activeStage] || stageHeadlines.seriously_exploring;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Vertical Journey Stage (Center) & Current Stage Card*/}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Heading & Side Profile Avatar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              06
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR RESTORATION JOURNEY
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight tracking-tight">
            Where are you in your restoration journey?
          </h1>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            Your answers help us understand whether you're simply curious, actively researching, comparing possibilities, or ready to have a more focused conversation.
          </p>

          {/* Profile Circle Graphic */}
          <div className="pt-2 flex items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-sm bg-[#FAF8F5]">
              <img src={heroManProfile} alt="Journey Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FAF8F5] rounded-full border border-[#E7E2DA] text-xs text-[#635C52]">
              <span className="material-symbols-outlined text-[16px] text-[#18534F]">spa</span>
              <span className="font-mono text-[10px] uppercase font-semibold">YOUR PACE. YOUR TIMELINE.</span>
            </div>
          </div>
        </div>

        {/* Center Column: Vertical Journey Stage Pathway */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block border-b border-[#F0EBE1] pb-2">
            YOUR JOURNEY STAGE
          </span>

          <div className="relative space-y-5 pt-1">
            {/* Vertical connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-[2px] bg-[#E7E2DA]" />

            {stages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`relative z-10 w-full flex items-start gap-3.5 text-left p-2.5 rounded-xl transition cursor-pointer group ${
                    isSelected ? 'bg-[#F4F8F6]' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#18534F] text-white shadow-xs ring-4 ring-[#D7E7D2]'
                      : 'bg-white text-[#78716C] border border-[#CDC5B8] group-hover:border-[#18534F]'
                  }`}>
                    <span className="material-symbols-outlined text-[16px]">
                      {stage.icon}
                    </span>
                  </div>

                  <div>
                    <h5 className={`font-mono text-xs uppercase font-bold tracking-wide leading-tight ${
                      isSelected ? 'text-[#18534F]' : 'text-[#1B1F23]'
                    }`}>
                      {stage.title}
                    </h5>
                    <p className="text-[11px] text-[#635C52] mt-0.5 leading-snug">
                      {stage.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Current Stage Details & What a Consultation Can Clarify */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Card: Current Stage */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#18534F]">explore</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold">
                YOUR CURRENT STAGE
              </span>
            </div>

            <h3 className="font-serif text-2xl text-[#1B1F23] font-normal leading-snug">
              {currentStageInfo.headline}
            </h3>

            <p className="text-xs text-[#524B40] leading-relaxed">
              {currentStageInfo.copy}
            </p>
          </div>

          {/* Bottom Card: What a Consultation Can Clarify */}
          <div className="bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] p-5 shadow-2xs space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block border-b border-[#E7E2DA] pb-2">
              WHAT A CONSULTATION CAN CLARIFY
            </span>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CDC5B8] flex items-center justify-center font-mono text-[10px] font-bold text-[#18534F] shrink-0">
                  01
                </div>
                <div>
                  <span className="font-semibold text-[#1B1F23] block">Your current hair pattern</span>
                  <span className="text-[11px] text-[#635C52]">A closer look at your unique follicle density and donor reserve.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CDC5B8] flex items-center justify-center font-mono text-[10px] font-bold text-[#18534F] shrink-0">
                  02
                </div>
                <div>
                  <span className="font-semibold text-[#1B1F23] block">What improvement may realistically be possible</span>
                  <span className="text-[11px] text-[#635C52]">Based on your aesthetic goals and hair characteristics.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CDC5B8] flex items-center justify-center font-mono text-[10px] font-bold text-[#18534F] shrink-0">
                  03
                </div>
                <div>
                  <span className="font-semibold text-[#1B1F23] block">How your goals could be approached</span>
                  <span className="text-[11px] text-[#635C52]">Options, timelines, recovery milestones, and what to expect.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white border border-[#CDC5B8] flex items-center justify-center font-mono text-[10px] font-bold text-[#18534F] shrink-0">
                  04
                </div>
                <div>
                  <span className="font-semibold text-[#1B1F23] block">What makes sense for the longer term</span>
                  <span className="text-[11px] text-[#635C52]">Sustainable natural results and ongoing follicular support.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM ACTION BAR: Next Step Strip                                   */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E8F0E6] flex items-center justify-center shrink-0 text-[#18534F]">
            <span className="material-symbols-outlined text-[18px]">spa</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              NEXT STEP
            </span>
            <button
              type="button"
              onClick={onNext}
              className="font-serif text-lg sm:text-xl text-[#18534F] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <span>Continue to your personalized plan</span>
              <span>→</span>
            </button>
            <p className="text-[11px] text-[#8E877E] mt-0.5">
              No decision is required. This step is simply about understanding your options.
            </p>
          </div>
        </div>

        <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="text-[#CDC5B8] hidden sm:block">
          <path d="M0,12 Q15,4 30,12 T60,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </div>
  );
};
