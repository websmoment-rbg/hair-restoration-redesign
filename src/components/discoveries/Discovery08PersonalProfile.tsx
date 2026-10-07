import React from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface Discovery08Props {
  result: any;
  onBookConsultation: () => void;
  onReviewProfile?: () => void;
}

export const Discovery08PersonalProfile: React.FC<Discovery08Props> = ({
  result,
  onBookConsultation,
  onReviewProfile
}) => {
  const scores = result?.scores || {};
  const rawAnswers = result?.rawAnswers || result?.answers || {};
  const primaryConcern = result?.primaryConcern || 'hairline';
  const primaryGoal = result?.primaryGoal || 'restore_hairline';

  // Dynamic tags
  const tag1 = 'FOCUSED';
  const tag2 = (scores.motivation ?? 0.8) >= 0.7 ? 'APPEARANCE-LED' : 'DENSITY-LED';
  const tag3 = (rawAnswers?.Q16 ?? 4) >= 4 ? 'SERIOUSLY EXPLORING' : 'RESEARCHING';

  // 5 Profile Summary Cards
  const cards = [
    {
      num: '01',
      label: 'YOUR CONCERN',
      value: primaryConcern === 'hairline' ? 'Hairline / frontal appearance'
        : primaryConcern === 'temples' ? 'Temples & hairline angles'
        : primaryConcern === 'crown' ? 'Crown / vertex thinning'
        : 'Overall thinning / fullness'
    },
    {
      num: '02',
      label: 'YOUR MAIN GOAL',
      value: primaryGoal === 'restore_hairline' ? 'Natural-looking hairline improvement'
        : primaryGoal === 'density_top' ? 'Mid-scalp density & coverage'
        : primaryGoal === 'crown_coverage' ? 'Crown coverage & vertex fullness'
        : 'Fuller overall visual appearance'
    },
    {
      num: '03',
      label: 'WHAT MATTERS',
      value: 'Appearance + long-term result'
    },
    {
      num: '04',
      label: 'YOUR JOURNEY',
      value: (rawAnswers?.Q16 ?? 4) >= 4 ? 'Seriously exploring restoration' : 'Comparing options & researching'
    },
    {
      num: '05',
      label: 'WHAT YOU WANT CLARITY ON',
      value: 'What could realistically be achieved'
    }
  ];

  // 5 Key Insights dynamically tailored to the engine profile
  const insights = [
    {
      num: '01',
      text: primaryConcern === 'hairline'
        ? 'Your concern is concentrated around the front of your hair.'
        : primaryConcern === 'crown'
        ? 'Your concern is concentrated around the crown whorl of your hair.'
        : 'Your concern involves diffuse changes across multiple scalp fields.'
    },
    {
      num: '02',
      text: 'The importance of the issue comes strongly from how that area affects your overall appearance.'
    },
    {
      num: '03',
      text: 'Your preferred improvement is closely aligned with the area you notice most.'
    },
    {
      num: '04',
      text: "You are no longer simply observing the change — you're actively considering restoration."
    },
    {
      num: '05',
      text: 'Your next useful step is understanding what is realistically possible for your hair and your goals.'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Large Header & 5 Summary Cards Row                          */}
      {/* ==================================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#1B1F23] font-normal leading-tight tracking-tight">
              Your Personal Hair Restoration Profile
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#18534F] font-bold mt-2">
              <span>{tag1}</span>
              <span className="text-[#CDC5B8]">·</span>
              <span>{tag2}</span>
              <span className="text-[#CDC5B8]">·</span>
              <span>{tag3}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#524B40] mt-2 max-w-2xl leading-relaxed">
              A concise picture of what matters to you, what you want to improve, and what you need clarity on next.
            </p>
          </div>
        </div>

        {/* 5 Cards in a Row matching "Personal Hair Restoration Profile.png" */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {cards.map((c) => (
            <div
              key={c.num}
              className="p-4 bg-white rounded-2xl border border-[#E7E2DA] flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="w-6 h-6 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] font-mono text-[10px] font-bold text-[#18534F] flex items-center justify-center mb-3">
                  {c.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block leading-tight">
                  {c.label}
                </span>
                <h4 className="font-serif text-sm text-[#1B1F23] font-medium leading-snug mt-2">
                  {c.value}
                </h4>
              </div>
              <div className="w-8 h-[1px] bg-[#E7E2DA] mt-4" />
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MIDDLE CONTAINER: What You've Learned (Left) + Profile Graphic (Right)*/}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 5 Key Insights */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
                KEY INSIGHTS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight mt-1">
                What you've learned
              </h2>
            </div>

            <div className="space-y-4 pt-2">
              {insights.map((ins) => (
                <div key={ins.num} className="flex items-start gap-4 border-b border-[#F0EBE1] pb-3 last:border-0">
                  <span className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#CDC5B8] font-mono text-xs font-bold text-[#18534F] flex items-center justify-center shrink-0 mt-0.5">
                    {ins.num}
                  </span>
                  <p className="text-xs sm:text-sm text-[#423C33] leading-relaxed">
                    {ins.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Illustration with Callout Guides */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[340px] aspect-[4/5] flex items-center justify-center">
              {/* Profile Image */}
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#FAF8F5]">
                <img src={heroManProfile} alt="Profile Result" className="w-full h-full object-cover object-center" />
              </div>

              {/* Callout Lines and Labels matching Reference */}
              <div className="absolute top-10 right-0 max-w-[160px] text-right">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#18534F] font-bold">
                    PRIMARY CONCERN
                  </span>
                </div>
                <span className="text-[11px] text-[#524B40] leading-tight block">
                  {primaryConcern === 'hairline' ? 'Front hairline / temple area' : 'Crown / vertex area'}
                </span>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 right-0 max-w-[160px] text-right">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#18534F] font-bold">
                    DESIRED CHANGE
                  </span>
                </div>
                <span className="text-[11px] text-[#524B40] leading-tight block">
                  More defined, natural-looking hairline
                </span>
              </div>

              <div className="absolute bottom-6 right-2 max-w-[160px] text-right">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#18534F] font-bold">
                    NEXT CLARITY
                  </span>
                </div>
                <span className="text-[11px] text-[#524B40] leading-tight block">
                  What's realistically achievable for your hair and goals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM DARK GREEN CTA BAR (Matching Reference)                       */}
      {/* ==================================================================== */}
      <div className="p-6 sm:p-8 bg-[#182823] text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#94C3AE]">
            <span className="material-symbols-outlined text-[24px]">spa</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
              Ready to understand what's realistic for you?
            </h3>
            <p className="text-xs sm:text-sm text-[#CDC5B8] leading-relaxed">
              Bring your profile to a specialist and turn your answers into a clearer next step.
            </p>
            <p className="text-[11px] text-[#94C3AE] italic pt-1">
              No pressure. Just a clearer understanding of your options.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBookConsultation}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#E8F0E6] text-[#18534F] hover:bg-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>DISCUSS YOUR PROFILE WITH A SPECIALIST</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>

          {onReviewProfile && (
            <button
              type="button"
              onClick={onReviewProfile}
              className="text-xs text-white/80 hover:text-white underline cursor-pointer py-2 px-3"
            >
              Review my profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
