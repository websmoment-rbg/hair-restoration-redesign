import React from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface FinalConsultationProps {
  onBookConsultation: () => void;
  onReviewResults: () => void;
}

export const FinalConsultationSection: React.FC<FinalConsultationProps> = ({
  onBookConsultation,
  onReviewResults
}) => {
  return (
    <section className="bg-[#182823] text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-xl relative overflow-hidden animate-fadeIn">
      {/* Subtle organic background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3FB950]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 text-center sm:text-left">
        {/* Top Connecting Pipeline Graphic */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono text-[#94C3AE] uppercase tracking-wider mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
          <span>YOUR ASSESSMENT · YOUR PLAN · YOUR SPECIALIST</span>
        </div>

        {/* Big Editorial Headline */}
        <div className="space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[54px] text-white font-normal leading-tight tracking-tight">
            You Have a Starting Point.<br />
            Now Make It Personal.
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            Your assessment organizes what you notice and what matters most to you. A specialist can take that starting point further by evaluating your scalp, donor area, hair characteristics, and restoration goals in a comfortable, no-pressure environment.
          </p>
        </div>

        {/* Visual Transformation Sequence Pathway */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <span className="text-white/80 font-medium">YOUR ASSESSMENT</span>
          <span className="text-[#3FB950]">→</span>
          <span className="text-white/80 font-medium">YOUR PROFILE</span>
          <span className="text-[#3FB950]">→</span>
          <span className="text-white/80 font-medium">YOUR QUESTIONS</span>
          <span className="text-[#3FB950]">→</span>
          <span className="text-white/80 font-medium">SPECIALIST EVALUATION</span>
          <span className="text-[#3FB950]">→</span>
          <span className="text-[#3FB950] font-bold">PERSONALIZED CONVERSATION</span>
        </div>

        {/* Action Buttons & Reassurance */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={onBookConsultation}
            className="w-full sm:w-auto px-8 py-4 bg-[#E8F0E6] text-[#18534F] hover:bg-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
          >
            <span>Discuss My Profile With a Specialist</span>
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          </button>

          <button
            type="button"
            onClick={onReviewResults}
            className="w-full sm:w-auto px-6 py-4 bg-transparent border border-white/30 text-white hover:bg-white/10 text-sm font-medium rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            <span>Review My Results</span>
          </button>
        </div>

        {/* Trust Reassurance Footnote */}
        <div className="pt-2 text-center sm:text-left border-t border-white/10">
          <p className="text-xs text-[#94C3AE] font-mono">
            No pressure. Just a more informed conversation about your options.
          </p>
        </div>
      </div>
    </section>
  );
};
