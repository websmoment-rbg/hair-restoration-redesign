import React from 'react';
import { DoctorVideoSection } from './DoctorVideoSection';
import { SurgeonsSection } from './SurgeonsSection';
import { RestorationProcessSection } from './RestorationProcessSection';
import { DonorResourceSection } from './DonorResourceSection';
import { RestorationJourneyTimeline } from '../RestorationJourneyTimeline';
import { BeforeAfterSection } from './BeforeAfterSection';
import { TestimonialsSection } from './TestimonialsSection';
import { ConsultationAddsSection } from './ConsultationAddsSection';
import { PostReportFAQSection } from './PostReportFAQSection';
import { FinalConsultationSection } from './FinalConsultationSection';

interface PostReportProps {
  onBookConsultation: () => void;
  onReviewResults: () => void;
}

export const PostReportExperience: React.FC<PostReportProps> = ({
  onBookConsultation,
  onReviewResults
}) => {
  return (
    <div id="post-report-journey" className="space-y-16 sm:space-y-24 pt-12 border-t border-[#E7E2DA]">
      {/* Visual Journey Anchor Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pt-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold block">
          CONTINUE YOUR DISCOVERY
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Clinical Guidance & Surgical Evidence
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C]">
          Explore surgeon credentials, procedural science, donor hair preservation, and verified patient outcomes.
        </p>
      </div>

      {/* 01 — Doctor Video: What Your Assessment Can — and Can't — Tell You */}
      <DoctorVideoSection onBookConsultation={onBookConsultation} />

      {/* 02 — Meet Your Surgeons: 3 Board-Certified Profiles */}
      <SurgeonsSection />

      {/* 03 — How Hair Restoration Works: 8-Step Interactive Sequence */}
      <RestorationProcessSection />

      {/* 04 — Donor Hair Is a Limited Resource: Interactive Allocation & Conservation */}
      <DonorResourceSection />

      {/* 05 — The Restoration Journey Timeline (From Homepage, placed directly below Donor Area Section) */}
      <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-6 animate-fadeIn">
        <RestorationJourneyTimeline />
      </section>

      {/* 06 — Before / After: 6 Case Studies with Interactive Comparison Slider */}
      <BeforeAfterSection />

      {/* 07 — Real Patient Stories: 6 Video Stories with 3D Coverflow Carousel */}
      <TestimonialsSection />

      {/* 08 — What a Consultation Adds: Interactive "Two Worlds" Comparison */}
      <ConsultationAddsSection />

      {/* 09 — Frequently Asked Questions: 8 Approved Questions with Word-Reveal Accordion */}
      <PostReportFAQSection />

      {/* 10 — Final Consultation Section: "You Have a Starting Point. Now Make It Personal." */}
      <FinalConsultationSection
        onBookConsultation={onBookConsultation}
        onReviewResults={onReviewResults}
      />
    </div>
  );
};
