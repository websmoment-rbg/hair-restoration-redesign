import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { InteractiveHero } from '../components/InteractiveHero';
import { HairRestorationSteps } from '../components/HairRestorationSteps';
import { HairRestorationJourney } from '../components/HairRestorationJourney';
import { RestorationJourneyTimeline } from '../components/RestorationJourneyTimeline';

interface HomeProps {
  onStartAssessment: () => void;
  onBookConsultation: () => void;
}

export const Home: React.FC<HomeProps> = ({ onStartAssessment, onBookConsultation }) => {
  return (
    <div className="pt-20 overflow-hidden">
      {/* HERO SECTION */}
      <InteractiveHero onStartAssessment={onStartAssessment} />

      {/* SECTION 2: THE 4 STEPS TO YOUR HAIR RESTORATION */}
      <HairRestorationSteps />

      {/* SECTION 3: HAIR RESTORATION & TRANSPLANT JOURNEY (INTERACTIVE SERPENTINE TIMELINE) */}
      <HairRestorationJourney />

      {/* SECTION 4: THE RESTORATION JOURNEY TIMELINE (INTERACTIVE EXPLORER) */}
      <RestorationJourneyTimeline />

      {/* SECTION 6: HIGH-CONTRAST CLOSING SECTION (BOOK CONSULTATION) */}
      <section className="bg-[#1c1c1a] text-white py-28 px-6 md:px-14 border-t border-[#787770]/30" id="consultation-booking">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-neutral-900 border hairline-border-dark w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fedeb2]"></span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#e4e2dd]">Discreet Medical Counsel</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight font-normal leading-tight">
              You Have a Starting Point.<br />
              <span className="italic text-[#fedeb2]">Now Make It Personal.</span>
            </h2>

            <p className="text-base text-neutral-300 max-w-xl font-light leading-relaxed">
              Your assessment can help you understand what matters most to you. A specialist can take that starting point further by evaluating your scalp, donor area, hair characteristics and restoration goals.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
              <button
                type="button"
                onClick={onBookConsultation}
                className="bg-white text-[#1b1c18] hover:bg-neutral-100 px-8 py-4 rounded-xl text-sm font-semibold transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Discuss My Restoration Profile</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">calendar_today</span>
              </button>
              <button
                onClick={onStartAssessment}
                className="hairline-border-dark text-white hover:bg-neutral-800/80 px-8 py-4 rounded-xl text-sm font-semibold transition-all text-center flex items-center justify-center cursor-pointer"
              >
                <span>Take Assessment First</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-neutral-400 pt-2 text-xs">
              <span className="material-symbols-outlined text-[#bbcbb7] text-lg">check_circle</span>
              <p>No pressure. Just a more informed conversation about your options.</p>
            </div>
          </div>

          {/* A single consistent consultation request flow */}
          <div className="lg:col-span-5 bg-neutral-900/90 p-8 md:p-10 rounded-2xl hairline-border-dark backdrop-blur-sm">
            <h3 className="font-serif text-2xl text-white mb-2 font-normal">A clearer next conversation</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Choose how you’d like to meet, share your contact details, and send any questions. Your assessment profile is attached when available.
            </p>
            <ul className="space-y-3 text-xs text-neutral-300" aria-label="Consultation request steps">
              <li className="flex gap-3"><span className="text-[#fedeb2]">01</span><span>Select online or in-clinic consultation.</span></li>
              <li className="flex gap-3"><span className="text-[#fedeb2]">02</span><span>Share your name, email, phone number, and questions.</span></li>
              <li className="flex gap-3"><span className="text-[#fedeb2]">03</span><span>Receive a follow-up once the request is reviewed.</span></li>
            </ul>
            <button type="button" onClick={onBookConsultation} className="mt-8 w-full rounded-xl bg-[#e0c298] px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1c1c1a] transition hover:bg-[#fedeb2]">Request a consultation</button>
          </div>
        </div>
      </section>
    </div>
  );
};
