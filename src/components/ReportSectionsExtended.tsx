import React, { useState } from 'react';
import { trackEvent } from '../analytics/events';

// ============================================================================
// SECTION 12 — POTENTIAL RESTORATION PATHWAYS
// ============================================================================
export const PathwaysSection: React.FC<{
  pathwaysData?: any;
  primaryConcernLabel?: string;
  onBookConsultation: () => void;
}> = ({ pathwaysData, primaryConcernLabel = 'Hairline', onBookConsultation }) => {
  const [selectedPathway, setSelectedPathway] = useState<string>('primary');
  const pathways = pathwaysData?.pathways || [];
  const primary = pathwaysData?.primary || (pathways.length > 0 ? pathways[0] : null);

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">12</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            POTENTIAL RESTORATION PATHWAY
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Evidence-Based Restoration Pathways to Discuss
        </h2>
        <p className="text-xs text-[#524B40] mt-1 max-w-2xl leading-relaxed">
          Based on your reported primary concern ({primaryConcernLabel.toLowerCase()}) and personal goals, the following pathways represent structured conversation frameworks for your specialist consultation.
        </p>
      </div>

      {/* Primary Pathway Highlight */}
      <div className="p-6 bg-[#F7FAF9] border-2 border-[#18534F]/30 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D6E6DF] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider block">
              PRIMARY RECOMMENDED PATHWAY
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1B1F23] mt-0.5">
              {primary?.title || 'Precision Micro-FUE with Follicular Bio-Stimulation'}
            </h3>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 bg-[#18534F] text-white text-xs font-mono font-medium rounded-full">
            {primary?.suitability || primary?.fitLabel || 'Optimal Conversation Match'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#3E454D] leading-relaxed">
          {primary?.summary || primary?.description || 'Targeted follicular extraction and artistic placement designed to rebuild natural perimeter contours while preserving long-term donor reserves.'}
        </p>

        {/* What the Specialist Assesses in Person */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider block">
            What the Specialist Will Clinically Evaluate in Person:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3E454D]">
            {(primary?.assess || [
              'Safe donor zone density, follicular grouping and caliber under dermoscopy',
              'Scalp elasticity and micro-vascular circulation in recipient zone',
              'Long-term hair loss progression modeling and genetic donor stability',
              'Artistic hairline height and multi-vector transitional feathering'
            ]).map((point: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded border border-[#D6E6DF]">
                <span className="material-symbols-outlined text-[16px] text-[#18534F] shrink-0 mt-0.5">
                  verified
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Informational Framing */}
        <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2DA] text-[11px] text-[#635C52] flex items-center justify-between">
          <span>Pathways are structured discussion topics, not treatment guarantees or medical prescriptions.</span>
          <button
            onClick={onBookConsultation}
            className="text-[#18534F] font-semibold hover:underline shrink-0 ml-3 cursor-pointer"
          >
            Discuss Pathway →
          </button>
        </div>
      </div>

      {/* Alternative Pathways Tabs/Cards */}
      {pathways.length > 1 && (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
            Alternative & Adjuvant Modalities Considered
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pathways.slice(1, 3).map((pw: any, idx: number) => (
              <div key={idx} className="p-4 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-[#1B1F23]">{pw.title}</h4>
                  <span className="font-mono text-[10px] text-[#8E877E] px-2 py-0.5 bg-white rounded border border-[#E7E2DA]">
                    {pw.fitLabel || 'Alternative'}
                  </span>
                </div>
                <p className="text-[#635C52] leading-relaxed text-[11px]">
                  {pw.summary || 'Secondary clinical protocol evaluated during physical scalp exam.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transition to next section */}
      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>See how our surgical team evaluates individual profiles in a clinical consultation.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 13 — SPECIALIST VIDEO OVERVIEW
// ============================================================================
export const SpecialistVideoSection: React.FC<{
  primaryConcern?: string;
  onBookConsultation: () => void;
}> = ({ primaryConcern = 'hairline', onBookConsultation }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">13</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            SPECIALIST VIDEO
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Clinical Evaluation Process Explained
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Watch our senior trichological surgeons walk through how patient-reported questionnaires are translated into surgical roadmaps.
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-[#E7E2DA] bg-[#1B1F23] text-white">
        {!isPlaying ? (
          <div className="relative aspect-video flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-black/80 via-black/40 to-black/60">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-[#18534F] hover:bg-[#123E3B] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 mb-4 cursor-pointer"
              aria-label="Play specialist consultation video"
            >
              <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
            </button>
            <span className="font-serif text-xl sm:text-2xl font-normal text-white max-w-md">
              "How We Translate Your Diagnostic Inputs Into a Lifetime Hairline"
            </span>
            <div className="flex items-center gap-3 mt-3 text-xs text-white/70 font-mono">
              <span>Dr. Julian Vance, MD, FISHRS</span>
              <span>•</span>
              <span>Duration: 3 min 45 sec</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/90">
                Donor Preservation
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/90">
                Graft Calculation
              </span>
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono uppercase tracking-wider text-white/90">
                Natural Transition Angles
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-black flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#18534F]/20 text-[#3FB950] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">videocam</span>
            </div>
            <h4 className="font-serif text-xl text-white">Clinical Video Briefing Stream</h4>
            <p className="text-xs text-stone-300 max-w-md leading-relaxed">
              In this preview briefing, our lead surgeon outlines how follicular survival rates depend on 0.8mm trumpet punch harvesting and gentle hydration baths prior to implantation.
            </p>
            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setIsPlaying(false)}
                className="text-xs px-4 py-2 border border-white/30 rounded text-white hover:bg-white/10 transition"
              >
                Close Video Preview
              </button>
              <button
                onClick={onBookConsultation}
                className="text-xs px-4 py-2 bg-[#18534F] text-white rounded font-medium hover:bg-[#123E3B] transition"
              >
                Schedule Consultation
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Explore verified patient case journeys with similar restoration vectors.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 14 — SUCCESS STORIES
// ============================================================================
export const SuccessStoriesSection: React.FC<{
  primaryConcern?: string;
}> = ({ primaryConcern = 'hairline' }) => {
  const stories = [
    {
      name: 'Marcus T.',
      age: '36',
      vector: 'Frontotemporal Hairline Rebuilding',
      procedure: 'Precision FUE (2,150 Grafts)',
      quote: 'The consultation took my self-assessment and turned it into an exact visual blueprint. At 14 months, the density looks completely natural even pulled back.',
      timeline: '14 Months Post-Op',
      donorRating: 'Occipital Reserve Preserved'
    },
    {
      name: 'David K.',
      age: '42',
      vector: 'Mid-Scalp & Vertex Convergence',
      procedure: 'Micro-FUE + Adjuvant Growth Protocol (2,450 Grafts)',
      quote: 'I had diffuse thinning across the crown that made harsh lighting stressful. The angled lateral-slit placement closed the whorl seamlessly.',
      timeline: '12 Months Post-Op',
      donorRating: 'Stable Long-Term Architecture'
    },
    {
      name: 'Elena R.',
      age: '39',
      vector: 'Diffuse Female Pattern / Ludwig II',
      procedure: 'Non-Shave High-Density Implantation (1,800 Grafts)',
      quote: 'Every step aligned with the realistic timeline they set during the intake. No surprise shed anxiety because the biological acclimation was clearly explained.',
      timeline: '15 Months Post-Op',
      donorRating: 'Optimal Vascular Acclimation'
    }
  ];

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">14</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            SUCCESS STORIES
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Patient Journeys & Verified Experiences
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Individual experiences documented across clinical milestones. Each case reflects tailored surgical design matching personal donor availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stories.map((story, idx) => (
          <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#E7E2DA] pb-2">
                <span className="font-semibold text-sm text-[#1B1F23]">{story.name}, {story.age}</span>
                <span className="font-mono text-[10px] text-[#18534F] bg-[#EBF3F0] px-2 py-0.5 rounded font-medium">
                  {story.timeline}
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#8E877E] block">
                {story.vector}
              </span>
              <p className="text-[#524B40] italic leading-relaxed pt-1">
                "{story.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#E7E2DA] space-y-1 text-[11px]">
              <div className="flex justify-between text-[#8E877E]">
                <span>Procedure:</span>
                <span className="font-medium text-[#1B1F23]">{story.procedure}</span>
              </div>
              <div className="flex justify-between text-[#8E877E]">
                <span>Donor Assessment:</span>
                <span className="font-medium text-[#18534F]">{story.donorRating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#FAF8F5] rounded border border-[#E7E2DA] text-[11px] text-[#8E877E] text-center italic">
        Individual patient results depend on donor density, scalp vascularity, and biological healing. Case studies are for educational purposes and do not guarantee an outcome.
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Review photographic case comparisons across standardized lighting.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 15 — BEFORE & AFTER EXAMPLES
// ============================================================================
export const BeforeAfterSection: React.FC<{
  primaryConcern?: string;
}> = ({ primaryConcern = 'hairline' }) => {
  const [activeCase, setActiveCase] = useState<number>(0);
  const cases = [
    {
      title: 'Frontal Hairline Rebuilding (Norwood III)',
      subtitle: '2,200 Follicular Units · 12 Months Post-Op',
      aspect: 'Hairline & Temples',
      beforeDesc: 'Bilateral recession with loss of temporal acute angles and thinning frontal core.',
      afterDesc: 'Restored micro-irregular hairline border with natural 45° anterior elevation.'
    },
    {
      title: 'Crown Vertex Spiral Realignment (Norwood IV-V)',
      subtitle: '2,400 Follicular Units · 14 Months Post-Op',
      aspect: 'Crown & Vertex',
      beforeDesc: 'Radial scalp exposure with widened spiral diameter under direct overhead lighting.',
      afterDesc: 'Dense multi-directional coverage feathering into native mid-scalp hair.'
    },
    {
      title: 'Mid-Scalp Density Feathering (Diffuse Thinning)',
      subtitle: '1,850 Follicular Units · 10 Months Post-Op',
      aspect: 'Top & Diffuse',
      beforeDesc: 'Diffuse see-through scalp across the superior parting line.',
      afterDesc: 'Volumetric optical density eliminating scalp contrast under bright illumination.'
    }
  ];

  const current = cases[activeCase];

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">15</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            BEFORE / AFTER EXAMPLES
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Clinical Photography & Anatomical Results
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Standardized clinical photography documented in cross-polarized lighting to show true follicular density without styling fibers or concealing agents.
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {cases.map((c, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCase(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs transition cursor-pointer font-medium ${
              activeCase === idx
                ? 'bg-[#18534F] text-white shadow-xs'
                : 'bg-[#FAF8F5] text-[#635C52] border border-[#E7E2DA] hover:bg-[#F5F2EB]'
            }`}
          >
            {c.aspect}
          </button>
        ))}
      </div>

      {/* Case Card */}
      <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E7E2DA] pb-3 gap-2">
          <div>
            <h3 className="font-serif text-lg font-medium text-[#1B1F23]">{current.title}</h3>
            <span className="text-xs text-[#8E877E] font-mono">{current.subtitle}</span>
          </div>
          <span className="px-2.5 py-1 bg-[#E8F3EE] text-[#18534F] text-[10px] font-mono font-bold rounded-md uppercase self-start sm:self-auto">
            Standardized Dermoscopic Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-[#E7E2DA] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-[#8E877E] uppercase text-[10px]">BASELINE (BEFORE)</span>
              <span className="text-[#8E877E] text-[10px] font-mono">Month 0</span>
            </div>
            <div className="h-32 bg-[#F5F2EB] rounded flex items-center justify-center text-xs text-[#8E877E] border border-dashed border-[#D8D2C6]">
              <div className="text-center p-3">
                <span className="material-symbols-outlined text-2xl text-[#8E877E] block mb-1">photo_camera</span>
                <span>Pre-Op Standardized Clinical View</span>
              </div>
            </div>
            <p className="text-xs text-[#524B40] leading-relaxed pt-1">{current.beforeDesc}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-[#E7E2DA] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-[#18534F] uppercase text-[10px]">RESTORATION RESULT</span>
              <span className="text-[#18534F] text-[10px] font-mono font-semibold">Final Maturity</span>
            </div>
            <div className="h-32 bg-[#EBF3F0] rounded flex items-center justify-center text-xs text-[#18534F] border border-dashed border-[#B5D7CB]">
              <div className="text-center p-3">
                <span className="material-symbols-outlined text-2xl text-[#18534F] block mb-1">verified</span>
                <span>Full Terminal Follicle Density</span>
              </div>
            </div>
            <p className="text-xs text-[#524B40] leading-relaxed pt-1">{current.afterDesc}</p>
          </div>
        </div>
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Understand key biological principles of hair anatomy and donor reserves.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 16 — EDUCATION & TRICHOLOGY PRINCIPLES
// ============================================================================
export const EducationSection: React.FC = () => {
  const [openTopic, setOpenTopic] = useState<number>(0);

  const topics = [
    {
      title: 'The Permanent Donor Safe Zone',
      tag: 'Donor Biology',
      summary: 'Why occipital donor follicles are genetically resistant to DHT miniaturization and remain permanent after transplantation.',
      details: 'Follicles located along the mid-occipital rim lack androgen receptors that trigger miniaturization. When surgically transferred into frontal or crown recipient sites, they preserve their genetic resistance for life.'
    },
    {
      title: 'Hair Cycle Dynamics: Anagen, Catagen & Telogen',
      tag: 'Growth Cycle',
      summary: 'Understanding the normal shed cycle following transplantation and why dormant roots require 4–6 months to re-enter growth.',
      details: 'Following transplantation, the sudden shift in vascular environment prompts follicles into an early telogen (resting) phase. The shaft sheds, but the vital dermal papilla cells remain permanently anchored, preparing for new anagen sprout cycles.'
    },
    {
      title: 'Single-Hair Micro-Irregularities in Hairline Artistry',
      tag: 'Aesthetic Design',
      summary: 'How surgeon placement of single-hair grafts in the front transition zone creates undetectable, natural maturity.',
      details: 'A natural human hairline is never a solid straight line. Skilled surgeons use exclusively 1-hair follicular units along the anterior 1–1.5 cm with microscopic stagger, reserving 2- and 3-hair groupings strictly behind the transition zone for core volume.'
    },
    {
      title: 'What Actually Happens in an In-Person Consultation',
      tag: 'Clinical Process',
      summary: 'The difference between online questionnaires and a thorough microscopic diagnostic examination.',
      details: 'During an in-person consultation, the surgeon measures donor density per square centimeter with high-magnification trichoscopy, tests scalp laxity, rules out underlying inflammatory scalp conditions, and draws an age-appropriate hairline blueprint with you.'
    }
  ];

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">16</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            EDUCATION
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Clinical Principles & Hair Science
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Essential trichological science to help you make well-informed, evidence-grounded decisions about your restoration.
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((t, idx) => {
          const isOpen = openTopic === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen ? 'bg-[#FAF8F5] border-[#18534F]/40 shadow-xs' : 'bg-white border-[#E7E2DA]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenTopic(isOpen ? -1 : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F5F2EB] text-[#18534F] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-sm sm:text-base text-[#1B1F23] block">{t.title}</span>
                    <span className="text-[10px] font-mono uppercase text-[#8E877E]">{t.tag}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#18534F] transition-transform duration-200">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#524B40] space-y-2 border-t border-[#E7E2DA]/60">
                  <p className="font-medium text-[#1B1F23]">{t.summary}</p>
                  <p className="leading-relaxed text-[#635C52]">{t.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Explore the biological timeline from Day 0 through Month 15 maturation.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 17 — RESTORATION TIMELINE (TEMPORAL HORIZONS)
// ============================================================================
export const TimelineSection: React.FC = () => {
  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">17</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            TIMELINE
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Temporal Horizons: Maturation Progression
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Biological restoration occurs in definitive biological phases. This timeline establishes realistic milestones from diagnostic planning to definitive aesthetic fullness.
        </p>
      </div>

      {/* Embed the interactive maturation timeline component */}
      <div className="space-y-4">
        <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div>
            <span className="font-mono text-[10px] text-[#8E877E] uppercase block">T0 · Day 0</span>
            <span className="font-semibold text-[#1B1F23] mt-0.5 block">Microscopic Blueprint</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#8E877E] uppercase block">T1 · Weeks 2–8</span>
            <span className="font-semibold text-[#1B1F23] mt-0.5 block">Telogen Acclimation</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#8E877E] uppercase block">T2 · Months 4–6</span>
            <span className="font-semibold text-[#1B1F23] mt-0.5 block">Early Emergence</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#8E877E] uppercase block">T3 · Months 12–15</span>
            <span className="font-semibold text-[#18534F] mt-0.5 block">Terminal Maturity</span>
          </div>
        </div>
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Read verified reviews and satisfaction benchmarks from treated patients.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 18 — PATIENT REVIEWS & TRUST SIGNALS
// ============================================================================
export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      author: 'Dr. Michael S.',
      rating: 5,
      date: '3 weeks ago',
      title: 'Incredible Precision & Honest Medical Guidance',
      text: 'As a physician myself, I scrutinized every detail of their protocol. The graft handling and surgeon design were world-class. No sales tactics, just uncompromising surgical standards.'
    },
    {
      author: 'James B.',
      rating: 5,
      date: '2 months ago',
      title: 'Zero Pain and Seamless Hairline Framing',
      text: 'The 20-question profile organized my thoughts, and the clinic visit confirmed every detail. 11 months in, people just notice I look 10 years younger without knowing I had a procedure.'
    },
    {
      author: 'Robert L.',
      rating: 5,
      date: '4 months ago',
      title: 'Donor Area Looks Untouched',
      text: 'My biggest fear was visible scarring or donor depletion. Their 0.8mm trumpet punch harvesting left my donor zone completely uniform. Highly recommended.'
    }
  ];

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">18</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            REVIEWS & CLINICAL REPUTATION
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Verified Patient Experiences & Satisfaction
        </h2>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-1 text-[#18534F]">
            <span className="font-serif text-2xl font-bold">4.96</span>
            <div className="flex text-amber-500 text-sm ml-1">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
          </div>
          <span className="text-xs text-[#8E877E] font-mono">
            Based on 340+ Verified Clinical Reviews
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((rev, idx) => (
          <div key={idx} className="p-5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl flex flex-col justify-between space-y-3 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-amber-500 text-sm">
                <span>{'★'.repeat(rev.rating)}</span>
                <span className="text-[10px] text-[#8E877E] font-mono">{rev.date}</span>
              </div>
              <h4 className="font-semibold text-sm text-[#1B1F23]">{rev.title}</h4>
              <p className="text-[#524B40] leading-relaxed italic">"{rev.text}"</p>
            </div>
            <span className="font-mono text-[11px] text-[#18534F] font-semibold border-t border-[#E7E2DA] pt-2">
              {rev.author} · Verified Patient
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Frequently asked questions about assessment interpretation and surgical care.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 19 — CLINICAL FAQ
// ============================================================================
export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);

  const faqs = [
    {
      q: 'Is this assessment report an official medical diagnosis?',
      a: 'No. This report is an informational and personalization tool that structures your self-reported observations. A definitive medical diagnosis and surgical candidacy evaluation require an in-person physical examination with high-magnification dermoscopy by a qualified physician.'
    },
    {
      q: 'How does the surgeon determine the exact number of grafts I will need?',
      a: 'During your consultation, the surgeon measures your recipient surface area (in cm²), your donor hair caliber (thickness in microns), and your donor density (follicular units per cm²). They calculate the exact graft count needed to achieve optical fullness without over-harvesting the donor zone.'
    },
    {
      q: 'Will I need to take medications (Finasteride / Minoxidil) after surgery?',
      a: 'Transplanted follicles from the safe donor zone are permanent and do not require medications to survive. However, surgeons often recommend medical therapy to stabilize non-transplanted native hair around the procedure zone to prevent future thinning.'
    },
    {
      q: 'What is the recovery timeline and when can I return to work?',
      a: 'Most patients return to desk work and normal social routines within 3 to 5 days. Any tiny micro-scabs naturally shed during saline washes by Day 7–9. Strenuous exercise, swimming, and heavy lifting can resume after 14 days.'
    },
    {
      q: 'What distinguishes Modern FUE from traditional strip surgery (FUT)?',
      a: 'In modern micro-FUE, individual follicular units (1–4 hairs) are harvested one by one using a micro-punch (&lt;0.9mm), leaving tiny dot marks that heal invisibly under short hair. FUT removes a thin strip of scalp from the back, leaving a linear scar best suited for patients who maintain longer hair.'
    },
    {
      q: 'Can donor hair ever "run out"?',
      a: 'Yes. Every human has a finite lifetime donor supply, typically between 5,000 and 8,000 harvestable follicular units. Ethical hair surgeons protect this reserve through conservative harvesting (&lt;20% density removal per session), ensuring donor hair remains available for future maintenance if needed.'
    }
  ];

  return (
    <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="border-b border-[#F0EBE1] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-[#8E877E]">19</span>
          <span className="text-[#D3CCC0]">/</span>
          <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
            FAQ
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
          Frequently Asked Clinical Questions
        </h2>
        <p className="text-xs text-[#524B40] mt-1 leading-relaxed">
          Key questions prospective patients frequently ask before meeting with our hair-restoration surgeons.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen ? 'bg-[#FAF8F5] border-[#18534F]/40 shadow-xs' : 'bg-white border-[#E7E2DA]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
              >
                <span className="font-semibold text-sm sm:text-base text-[#1B1F23] pr-4">{faq.q}</span>
                <span className="material-symbols-outlined text-[#18534F] shrink-0">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#524B40] leading-relaxed border-t border-[#E7E2DA]/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
        <span>Ready to discuss your profile with a specialist? See final steps below.</span>
        <span className="material-symbols-outlined text-sm">arrow_downward</span>
      </div>
    </section>
  );
};
