import React, { useState } from 'react';

interface InteractivePoint {
  id: string;
  side: 'assessment' | 'specialist';
  title: string;
  shortDesc: string;
  expandedExplanation: string;
}

const ASSESSMENT_POINTS: InteractivePoint[] = [
  {
    id: 'a1',
    side: 'assessment',
    title: 'What You Notice',
    shortDesc: 'Your perception of frontal, mid-scalp, or crown thinning',
    expandedExplanation: 'The digital assessment captures your subjective everyday observations across mirrors, photographs, and bright lighting conditions.'
  },
  {
    id: 'a2',
    side: 'assessment',
    title: 'What You Want to Improve',
    shortDesc: 'Primary desired changes (hairline, density, coverage)',
    expandedExplanation: 'It organizes your personal aesthetic goals, identifying whether facial framing or vertex fullness matters most to you.'
  },
  {
    id: 'a3',
    side: 'assessment',
    title: 'Your Priorities & Motivation',
    shortDesc: 'How hair changes influence day-to-day presence and confidence',
    expandedExplanation: 'It measures the emotional and personal weight you attach to restoring your hair versus merely slowing progression.'
  },
  {
    id: 'a4',
    side: 'assessment',
    title: 'Your Exploration Stage',
    shortDesc: 'Where you stand in your decision timeline (curious to ready)',
    expandedExplanation: 'It ensures that clinic discussions match your pace, from exploratory education to surgical preparation.'
  },
  {
    id: 'a5',
    side: 'assessment',
    title: 'Previous Modalities Tried',
    shortDesc: 'Supplements, topicals, medications, or specialized care',
    expandedExplanation: 'It documents what conservative therapies you have explored to prevent redundant recommendations.'
  }
];

const SPECIALIST_POINTS: InteractivePoint[] = [
  {
    id: 's1',
    side: 'specialist',
    title: 'Microscopic Scalp Examination',
    shortDesc: 'Dermatoscopy diagnostics measuring follicle health',
    expandedExplanation: 'A specialist physically examines your scalp under high-magnification dermatoscopy to measure hair caliber variance and detect sub-clinical miniaturization.'
  },
  {
    id: 's2',
    side: 'specialist',
    title: 'Donor-Area Evaluation',
    shortDesc: 'Occipital safe-zone follicular density measurement',
    expandedExplanation: 'Your assessment cannot examine your donor area. A specialist physically evaluates the available donor region density (follicular units/cm²) and scalp laxity.'
  },
  {
    id: 's3',
    side: 'specialist',
    title: 'Biological Hair Characteristics',
    shortDesc: 'Curl, wave, caliber, and contrast against scalp skin tone',
    expandedExplanation: 'Hair curl, caliber (fine vs coarse), and skin-to-hair color contrast strongly dictate perceived visual density and graft placement strategy.'
  },
  {
    id: 's4',
    side: 'specialist',
    title: 'Clinical History & Medical Triage',
    shortDesc: 'Screening for autoimmune conditions and systemic health',
    expandedExplanation: 'A licensed physician reviews your medical history, ruling out cicatricial alopecia, telogen effluvium, or nutritional deficiencies before proposing surgery.'
  },
  {
    id: 's5',
    side: 'specialist',
    title: 'Surgical Suitability Determination',
    shortDesc: 'Objective clinical assessment of feasibility and safety',
    expandedExplanation: 'Whether an FUE procedure is appropriate depends on anatomical viability and long-term donor sustainability, determined solely by the surgeon.'
  },
  {
    id: 's6',
    side: 'specialist',
    title: 'Custom Graft Blueprint & Mapping',
    shortDesc: 'Exact count, hairline height, and temporal feathering',
    expandedExplanation: 'A bespoke surgical plan outlining exact graft numbers, extraction punch dimensions, and lateral-slit incision distribution calibrated to your facial landmarks.'
  }
];

export const ConsultationAddsSection: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<InteractivePoint>(SPECIALIST_POINTS[1]); // Default to Donor-Area Evaluation

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            THE COLLABORATIVE CONTINUUM
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
          Your Assessment Starts the Conversation.<br />
          A Specialist Evaluation Takes It Further.
        </h2>
        <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
          The assessment organizes what you notice and what matters to you. An in-person consultation adds the anatomical diagnostics and clinical judgment required for safe, beautiful results.
        </p>
      </div>

      {/* Central Interactive Transformation Bridge */}
      <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] flex items-center justify-center flex-wrap gap-2 text-xs font-mono">
        <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E7E2DA] text-[#524B40] font-semibold">
          YOUR ANSWERS
        </span>
        <span className="text-[#CDC5B8]">→</span>
        <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E7E2DA] text-[#18534F] font-semibold">
          YOUR PROFILE
        </span>
        <span className="text-[#CDC5B8]">→</span>
        <span className="px-2.5 py-1 bg-[#E8F0E6] rounded-lg border border-[#D7E7D2] text-[#18534F] font-bold">
          SPECIALIST CONVERSATION
        </span>
        <span className="text-[#CDC5B8]">→</span>
        <span className="px-2.5 py-1 bg-white rounded-lg border border-[#E7E2DA] text-[#524B40] font-semibold">
          IN-PERSON EVALUATION
        </span>
        <span className="text-[#CDC5B8]">→</span>
        <span className="px-2.5 py-1 bg-[#182823] text-white rounded-lg font-bold">
          PERSONALIZED PLAN
        </span>
      </div>

      {/* Two Worlds Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: What The Assessment Organizes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-2">
            <span className="font-mono text-xs font-bold uppercase text-[#524B40] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#18534F]">assignment</span>
              <span>YOUR ASSESSMENT ORGANIZES</span>
            </span>
            <span className="text-[11px] font-mono text-[#8E877E]">5 Diagnostic Vectors</span>
          </div>

          <div className="space-y-2">
            {ASSESSMENT_POINTS.map((pt) => {
              const isSelected = selectedPoint.id === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPoint(pt)}
                  className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#F4F8F6] border-[#18534F] shadow-xs ring-2 ring-[#18534F]/30'
                      : 'bg-white border-[#E7E2DA] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div>
                    <h5 className="font-semibold text-xs text-[#1B1F23]">{pt.title}</h5>
                    <p className="text-[11px] text-[#635C52] mt-0.5">{pt.shortDesc}</p>
                  </div>
                  <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-[#18534F]' : 'text-[#CDC5B8]'}`}>
                    info
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: What Specialist Consultation Adds */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-2">
            <span className="font-mono text-xs font-bold uppercase text-[#18534F] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">stethoscope</span>
              <span>SPECIALIST CONSULTATION ADDS</span>
            </span>
            <span className="text-[11px] font-mono text-[#18534F] font-semibold">6 Clinical Dimensions</span>
          </div>

          <div className="space-y-2">
            {SPECIALIST_POINTS.map((pt) => {
              const isSelected = selectedPoint.id === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => setSelectedPoint(pt)}
                  className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#18534F] text-white border-[#18534F] shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E7E2DA] hover:bg-white text-[#524B40]'
                  }`}
                >
                  <div>
                    <h5 className={`font-semibold text-xs ${isSelected ? 'text-white' : 'text-[#1B1F23]'}`}>
                      {pt.title}
                    </h5>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-[#635C52]'}`}>
                      {pt.shortDesc}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-[#94C3AE]' : 'text-[#8E877E]'}`}>
                    arrow_forward
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Item Detail Callout Box */}
      <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#D7E7D2] shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="uppercase font-bold text-[#18534F]">
            {selectedPoint.side === 'assessment' ? 'FROM YOUR ASSESSMENT' : 'FROM CLINICAL IN-PERSON EVALUATION'}
          </span>
          <span className="text-[#8E877E] italic">Tap any item above to inspect</span>
        </div>
        <h4 className="font-serif text-lg text-[#1B1F23] font-medium">
          {selectedPoint.title}
        </h4>
        <p className="text-xs sm:text-sm text-[#423C33] leading-relaxed">
          {selectedPoint.expandedExplanation}
        </p>
      </div>

      {/* Bottom Key Mathematical Formula Statement */}
      <div className="p-5 bg-white rounded-2xl border border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8E877E] font-semibold block">
            CORE PRINCIPLE
          </span>
          <p className="font-serif text-base text-[#1B1F23]">
            Your assessment gives you a clearer starting point. A specialist evaluation helps turn that starting point into an informed medical conversation.
          </p>
        </div>

        {/* Visual Equation */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#18534F] bg-[#FAF8F5] px-4 py-2 rounded-xl border border-[#E7E2DA] shrink-0 font-bold">
          <span>ASSESSMENT</span>
          <span className="text-[#8E877E]">+</span>
          <span>SPECIALIST EVALUATION</span>
          <span className="text-[#8E877E]">=</span>
          <span className="text-[#18534F]">INFORMED PLAN</span>
        </div>
      </div>
    </section>
  );
};
