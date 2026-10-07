import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface Discovery07Props {
  result: any;
  onNext?: () => void;
}

export const Discovery07SpecialistDiscussion: React.FC<Discovery07Props> = ({ result, onNext }) => {
  const scores = result?.scores || {};
  const rawAnswers = result?.rawAnswers || result?.answers || {};
  const primaryConcern = result?.primaryConcern || 'hairline';
  const primaryGoal = result?.primaryGoal || 'restore_hairline';

  // Topic checkboxes state
  const [topics, setTopics] = useState<Record<string, boolean>>({
    hairline: true,
    density: true,
    crown: primaryConcern === 'crown',
    overall: true,
    longterm: true,
    previous: (rawAnswers?.Q13?.level ?? 1) > 1
  });

  const toggleTopic = (key: string) => {
    setTopics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Brief Data derived deterministically from engine
  const concernLabel = primaryConcern === 'hairline' ? 'Hairline / frontal appearance'
    : primaryConcern === 'temples' ? 'Temple angles & frontal framing'
    : primaryConcern === 'crown' ? 'Crown / vertex thinning'
    : 'Overall density & fullness';

  const goalLabel = primaryGoal === 'restore_hairline' ? 'Natural-looking hairline improvement'
    : primaryGoal === 'density_top' ? 'Mid-scalp density & fullness'
    : primaryGoal === 'crown_coverage' ? 'Rotational crown vertex coverage'
    : 'Fuller overall visual appearance';

  const whatMattersLabel = (scores.motivation ?? 0.8) >= 0.7
    ? 'Appearance + long-term result'
    : 'Stabilization + progressive density';

  const currentStageLabel = (rawAnswers?.Q16 ?? 4) >= 4 ? 'Seriously exploring' : 'Researching options';

  const mainDiscussion = (primaryConcern === 'hairline')
    ? 'What could realistically be achieved for your hairline framing and facial balance?'
    : (primaryConcern === 'crown')
    ? 'How to best approach crown whorl coverage while preserving future donor reserve?'
    : 'What strategic density distribution will produce the most natural visual impact?';

  // Questions derived from actual answers
  const personalizedQuestions = [
    {
      num: '01',
      tag: 'HAIRLINE',
      text: 'What would be a natural hairline design for my current facial structure?'
    },
    {
      num: '02',
      tag: 'COVERAGE',
      text: 'What level of visual improvement is realistic for my donor characteristics?'
    },
    {
      num: '03',
      tag: 'LONG-TERM',
      text: 'How should today\'s decision account for natural aging and future progression?'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Checklist/Ratings & Specialist Brief (Right)        */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Heading, Subtext & Editorial Photo Frame */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              07
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              BUILD YOUR SPECIALIST DISCUSSION
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight tracking-tight">
            Turn your assessment into a real conversation.
          </h1>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            This section helps you take your results and turn them into a clear, focused consultation — so you can get the right advice, for your goals.
          </p>

          {/* Editorial Profile Photo with Dark Green Framing */}
          <div className="relative rounded-2xl overflow-hidden border border-[#E7E2DA] shadow-xs bg-[#182823]">
            <div className="aspect-[4/3] w-full overflow-hidden opacity-90">
              <img src={heroManProfile} alt="Consultation Profile" className="w-full h-full object-cover object-top" />
            </div>
            <div className="p-3 bg-[#182823] text-center border-t border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#94C3AE] font-semibold">
                BETTER QUESTIONS · BETTER GUIDANCE · BETTER RESULTS
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: Questions Checklist + What Matters Most */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Checklist Card */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-2">
              <span className="material-symbols-outlined text-[18px] text-[#18534F]">chat</span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] block leading-none">
                  QUESTIONS
                </span>
                <h4 className="font-serif text-base text-[#1B1F23] font-normal mt-0.5">
                  What do you want to discuss?
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {[
                { key: 'hairline', label: 'Hairline' },
                { key: 'overall', label: 'Overall appearance' },
                { key: 'density', label: 'Density' },
                { key: 'longterm', label: 'Long-term planning' },
                { key: 'crown', label: 'Crown' },
                { key: 'previous', label: 'Previous approaches' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleTopic(item.key)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                    topics[item.key]
                      ? 'bg-[#EBF3F0] border-[#18534F] text-[#18534F] font-semibold'
                      : 'bg-white text-[#524B40] border-[#E7E2DA] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="truncate pr-1 text-[11px]">{item.label}</span>
                  <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                    topics[item.key] ? 'bg-[#18534F] text-white' : 'border border-[#CDC5B8]'
                  }`}>
                    {topics[item.key] ? '✓' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Card: What Matters Most (5-dot ratings) */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F0EBE1] pb-2">
              <span className="material-symbols-outlined text-[18px] text-[#18534F]">star</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold">
                WHAT MATTERS MOST?
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Natural Appearance */}
              <div className="flex items-center justify-between">
                <span className="text-[#3F3A33] font-medium">Natural appearance</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span key={d} className="w-2.5 h-2.5 rounded-full bg-[#18534F]" />
                  ))}
                </div>
              </div>

              {/* Coverage */}
              <div className="flex items-center justify-between">
                <span className="text-[#3F3A33] font-medium">Coverage</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((d) => (
                    <span key={d} className="w-2.5 h-2.5 rounded-full bg-[#18534F]" />
                  ))}
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E7E2DA]" />
                </div>
              </div>

              {/* Long-term Result */}
              <div className="flex items-center justify-between">
                <span className="text-[#3F3A33] font-medium">Long-term result</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((d) => (
                    <span key={d} className="w-2.5 h-2.5 rounded-full bg-[#18534F]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Automatically Generated Specialist Brief (Dark Green) */}
        <div className="lg:col-span-4 bg-[#182823] text-white rounded-2xl p-6 shadow-md space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-[#94C3AE] font-mono text-[10px] uppercase tracking-wider font-semibold mb-1">
              <span className="material-symbols-outlined text-[14px]">sparkles</span>
              <span>AUTOMATICALLY GENERATED</span>
            </div>
            <h3 className="font-serif text-2xl text-white font-normal leading-snug">
              Your Specialist Discussion Brief
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Main Concern */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
                <span className="material-symbols-outlined text-[16px]">target</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">
                  MAIN CONCERN
                </span>
                <span className="text-white text-xs font-medium leading-snug">
                  {concernLabel}
                </span>
              </div>
            </div>

            {/* Main Goal */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
                <span className="material-symbols-outlined text-[16px]">straighten</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">
                  MAIN GOAL
                </span>
                <span className="text-white text-xs font-medium leading-snug">
                  {goalLabel}
                </span>
              </div>
            </div>

            {/* What Matters Most */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
                <span className="material-symbols-outlined text-[16px]">star</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">
                  WHAT MATTERS MOST
                </span>
                <span className="text-white text-xs font-medium leading-snug">
                  {whatMattersLabel}
                </span>
              </div>
            </div>

            {/* Current Stage */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">
                  CURRENT STAGE
                </span>
                <span className="text-white text-xs font-medium leading-snug">
                  {currentStageLabel}
                </span>
              </div>
            </div>

            {/* Main Discussion */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
                <span className="material-symbols-outlined text-[16px]">chat</span>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">
                  MAIN DISCUSSION
                </span>
                <span className="text-white text-xs font-medium leading-snug">
                  {mainDiscussion}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM BANNER: Your 3 Personalized Questions Card Strip             */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] flex items-center justify-center font-mono text-xs font-bold text-[#18534F]">
            ?
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold">
            YOUR 3 PERSONALIZED QUESTIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {personalizedQuestions.map((q) => (
            <div
              key={q.num}
              className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex flex-col justify-between group hover:border-[#18534F] transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#18534F]">{q.num}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E877E] font-semibold">
                    {q.tag}
                  </span>
                </div>
                <p className="text-xs text-[#1B1F23] font-medium leading-relaxed">
                  {q.text}
                </p>
              </div>
              <div className="pt-3 text-right">
                <span className="font-mono text-xs text-[#18534F] group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOWER ACTION BAR                                                     */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-5 bg-[#182823] text-white rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
            <span className="material-symbols-outlined text-[18px]">spa</span>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#94C3AE] font-semibold block">
              YOUR CONSULTATION · YOUR PLAN
            </span>
            <p className="text-xs text-white/90">
              Bring this brief to your specialist and get answers that are specific to your goals.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-[#E8F0E6] text-[#18534F] hover:bg-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <span>GET READY FOR CONSULTATION</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
