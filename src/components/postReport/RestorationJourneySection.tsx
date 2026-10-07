import React from 'react';
import { HairRestorationJourney } from '../HairRestorationJourney';

export const RestorationJourneySection: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-6 animate-fadeIn">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            PATIENT EXPERIENCE ROADMAP
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
          The Restoration Journey
        </h2>
        <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
          From the first diagnostic consultation through the gradual maturation of your new hairline, restoration is an organized, predictable medical process.
        </p>
      </div>

      {/* Render Approved Clinical Journey Component directly */}
      <div className="pt-2">
        <HairRestorationJourney />
      </div>
    </section>
  );
};
