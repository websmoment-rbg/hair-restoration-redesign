import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface Discovery05Props {
  result: any;
  onNext?: () => void;
}

export const Discovery05RestorationPriorities: React.FC<Discovery05Props> = ({ result }) => {
  const scores = result?.scores || {};
  const primaryConcern = result?.primaryConcern || 'hairline';

  // Deterministically derived priority values from engine scores
  const appearancePct = Math.round(((scores.motivation ?? 0.8) * 0.4 + (scores.hairline ?? 0.85) * 0.6) * 100);
  const hairlinePct = Math.round((scores.hairline ?? 0.78) * 100);
  const densityPct = Math.round((scores.coverage ?? 0.65) * 100);
  const optionsPct = Math.round(((scores.readiness ?? 0.52) * 0.6 + 0.2) * 100);

  // Dynamic user priorities reordering
  const [priorities, setPriorities] = useState<string[]>([
    'Better hairline',
    'More density',
    'Fuller overall appearance'
  ]);
  const [hasSaved, setHasSaved] = useState<boolean>(true);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...priorities];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setPriorities(next);
    setHasSaved(true);
  };

  const moveDown = (index: number) => {
    if (index === priorities.length - 1) return;
    const next = [...priorities];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setPriorities(next);
    setHasSaved(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* TOP ROW: Header, Priority Stack (Center) & The Connection (Right)    */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Heading */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#E8F0E6] text-[#18534F] font-mono text-xs font-bold flex items-center justify-center border border-[#D7E7D2]">
              05
            </span>
            <span className="font-mono text-xs text-[#8E877E] uppercase tracking-widest font-semibold">
              YOUR RESTORATION PRIORITIES
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal leading-tight tracking-tight">
            What matters most to you.
          </h1>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            Based on your answers, we've identified what matters most to you — and how it all connects. This isn't just a list, it's a clear picture of your priorities and the bigger reason behind them.
          </p>
        </div>

        {/* Center Column: What Matters Most Priority Stack with Visual Bars */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              WHAT MATTERS MOST
            </span>
            <p className="text-[11px] text-[#78716C] mt-0.5">
              Your priority stack, based on your answers to Q3, Q4, Q6, Q12, Q14, Q15 & Q17.
            </p>
          </div>

          <div className="space-y-4">
            {/* 01 Appearance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#18534F]">01</span>
                  <span className="material-symbols-outlined text-[16px] text-[#18534F]">face</span>
                  <div>
                    <span className="font-semibold text-[#1B1F23] block leading-none">Appearance</span>
                    <span className="text-[10px] text-[#8E877E]">How you look overall</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#18534F]">{appearancePct}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-full overflow-hidden">
                <div className="h-full bg-[#18534F] rounded-full transition-all duration-500" style={{ width: `${appearancePct}%` }} />
              </div>
            </div>

            {/* 02 Hairline */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#18534F]">02</span>
                  <span className="material-symbols-outlined text-[16px] text-[#18534F]">straighten</span>
                  <div>
                    <span className="font-semibold text-[#1B1F23] block leading-none">Hairline</span>
                    <span className="text-[10px] text-[#8E877E]">Framing your face</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#18534F]">{hairlinePct}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-full overflow-hidden">
                <div className="h-full bg-[#18534F] rounded-full transition-all duration-500" style={{ width: `${hairlinePct}%` }} />
              </div>
            </div>

            {/* 03 Fuller Look */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#18534F]">03</span>
                  <span className="material-symbols-outlined text-[16px] text-[#18534F]">waves</span>
                  <div>
                    <span className="font-semibold text-[#1B1F23] block leading-none">Fuller look</span>
                    <span className="text-[10px] text-[#8E877E]">More density, more confidence</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#18534F]">{densityPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-full overflow-hidden">
                <div className="h-full bg-[#18534F] rounded-full transition-all duration-500" style={{ width: `${densityPct}%` }} />
              </div>
            </div>

            {/* 04 Understanding Options */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#18534F]">04</span>
                  <span className="material-symbols-outlined text-[16px] text-[#18534F]">settings</span>
                  <div>
                    <span className="font-semibold text-[#1B1F23] block leading-none">Understanding options</span>
                    <span className="text-[10px] text-[#8E877E]">Clarity and control</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-[#18534F]">{optionsPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-full overflow-hidden">
                <div className="h-full bg-[#18534F] rounded-full transition-all duration-500" style={{ width: `${optionsPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Connection (Vertical Equation Stack) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-xs space-y-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              THE CONNECTION
            </span>
            <p className="text-[11px] text-[#78716C] mt-0.5">
              These factors work together to show your true priority — not just what you want, but why it matters to you.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {/* Factor 1 */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#18534F] shrink-0">face</span>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Hairline change</span>
                <span className="text-[11px] text-[#635C52]">You want a more defined, natural-looking hairline.</span>
              </div>
            </div>

            <div className="text-center font-mono text-xs text-[#8E877E] leading-none">+</div>

            {/* Factor 2 */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#18534F] shrink-0">visibility</span>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Appearance impact</span>
                <span className="text-[11px] text-[#635C52]">You want to look better overall, not just reduce hair loss.</span>
              </div>
            </div>

            <div className="text-center font-mono text-xs text-[#8E877E] leading-none">+</div>

            {/* Factor 3 */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#18534F] shrink-0">track_changes</span>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Hairline goal</span>
                <span className="text-[11px] text-[#635C52]">You want a look that feels natural, confident and long-lasting.</span>
              </div>
            </div>

            <div className="text-center font-mono text-xs text-[#8E877E] leading-none">+</div>

            {/* Factor 4 */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center gap-3 text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#18534F] shrink-0">favorite</span>
              <div>
                <span className="font-semibold text-[#1B1F23] block">Restoration motivation</span>
                <span className="text-[11px] text-[#635C52]">You want to feel more confident and stay ahead in the future.</span>
              </div>
            </div>

            <div className="text-center font-mono text-xs text-[#8E877E] leading-none">↓</div>

            {/* Result Dark Card */}
            <div className="p-3.5 bg-[#182823] text-white rounded-xl shadow-xs flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#3FB950]">sparkles</span>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#94C3AE] block">THE RESULT</span>
                <span className="font-mono text-xs font-bold uppercase tracking-wide">
                  APPEARANCE-LED RESTORATION PRIORITY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MIDDLE CONTAINER: The Bigger Picture Banner with Profile Callouts    */}
      {/* ==================================================================== */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-[#E7E2DA] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 text-[#18534F]">
              <span className="material-symbols-outlined text-[20px]">spa</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold">
                THE BIGGER PICTURE
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23] font-normal leading-snug">
              Your main goal isn't simply "less hair loss."
            </h3>
            <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed max-w-xl">
              Your answers show that improving the way your hair frames your appearance is a major reason restoration has become important to you.
            </p>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-[#FAF8F5]">
              <img src={heroManProfile} alt="Profile" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                <div>
                  <span className="font-bold text-[#1B1F23] block leading-none">CONFIDENCE</span>
                  <span className="text-[10px] text-[#78716C]">in your appearance</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                <div>
                  <span className="font-bold text-[#1B1F23] block leading-none">BETTER</span>
                  <span className="text-[10px] text-[#78716C]">day-to-day presence</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#18534F]" />
                <div>
                  <span className="font-bold text-[#1B1F23] block leading-none">LONG-TERM</span>
                  <span className="text-[10px] text-[#78716C]">self-image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM AREA: Functional Priority Reordering Control                 */}
      {/* ==================================================================== */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-[#E7E2DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
              KEY TAKEAWAY
            </span>
            <h4 className="font-serif text-lg text-[#1B1F23] font-normal">
              What would make the biggest difference?
            </h4>
            <p className="text-xs text-[#78716C]">
              Rearrange the options below to reflect your personal consultation priorities.
            </p>
          </div>

          {hasSaved && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F0E6] text-[#18534F] text-xs font-mono font-medium rounded-full self-start sm:self-auto shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Your consultation priorities have been saved.</span>
            </div>
          )}
        </div>

        {/* 3 Reorderable Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {priorities.map((item, index) => (
            <div
              key={item}
              className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#8E877E] text-[18px]">drag_indicator</span>
                <span className="font-semibold text-xs text-[#1B1F23]">{item}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-white border border-[#CDC5B8] font-mono text-[10px] font-bold text-[#18534F] flex items-center justify-center">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="w-5 h-5 rounded bg-white border border-[#E7E2DA] hover:bg-[#E8F0E6] flex items-center justify-center text-[10px] disabled:opacity-30 cursor-pointer"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === priorities.length - 1}
                  className="w-5 h-5 rounded bg-white border border-[#E7E2DA] hover:bg-[#E8F0E6] flex items-center justify-center text-[10px] disabled:opacity-30 cursor-pointer"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
