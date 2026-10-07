import React, { useState } from 'react';

interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string[];
  diagramLabel: string;
  diagramDetails: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'Am I a candidate for a hair transplant?',
    answer: [
      'Candidacy depends on biological factors that cannot be determined by an online questionnaire alone. A specialist examines your occipital donor density (follicular units per square centimeter), hair caliber, scalp laxity, and whether your pattern of thinning has stabilized.',
      'Patients with sufficient, permanent donor reserves and realistic expectations regarding coverage are generally optimal candidates.'
    ],
    diagramLabel: 'CLINICAL CANDIDACY PILLARS',
    diagramDetails: [
      'Donor Density ≥ 70 FU/cm²',
      'Scalp Elasticity & Healthy Micro-Vasculature',
      'Stabilized Hair Loss Trajectory'
    ]
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'Which hair-transplant method is right for me?',
    answer: [
      'The modern standard of care is Ultra-Refined Micro-FUE (Follicular Unit Extraction) using 0.8mm trumpet hybrid punches. This leaves microscopic circular puncture sites that heal completely without linear scars.',
      'FUT (strip surgery) is rarely required today except in extreme mega-sessions where maximum grafts must be obtained from patients with tight scalps.'
    ],
    diagramLabel: 'MODALITY COMPARISON',
    diagramDetails: [
      'Micro-FUE: Individual 0.8mm harvest · Zero linear scar',
      'Sapphire Slits: Natural 30–45° anatomical exit angles',
      'Lateral Incisions: Maximum visual shingling effect'
    ]
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'Where does transplanted hair come from?',
    answer: [
      'Transplanted hair must come exclusively from your own scalp. Follicles are harvested from the occipital and temporal "safe donor zones" at the back and sides of your head.',
      'These follicles are biologically immune to dihydrotestosterone (DHT), the hormone responsible for male and female pattern androgenetic alopecia. Once moved to the hairline or crown, they retain this permanent immunity.'
    ],
    diagramLabel: 'GENETIC DONOR IMMUNITY',
    diagramDetails: [
      'Occipital Follicles: Lacking DHT androgen receptors',
      'Permanent Retention: Grow lifelong in recipient field',
      'Autologous Only: Donor hair cannot be taken from others'
    ]
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'How long does a hair transplant take to show results?',
    answer: [
      'Hair restoration follows a biological timeline that requires patience. Grafts take root within 72 hours. Around week 3–4, the transplanted shafts shed (an expected dormant phase called telogen effluvium).',
      'New terminal hair starts emerging at month 3–4. Significant cosmetic thickening occurs between months 9 and 12, with full hair caliber and texture maturity reached at month 15–18.'
    ],
    diagramLabel: 'CHRONOLOGICAL GROWTH ROADMAP',
    diagramDetails: [
      'Month 0–1: Acclimation & temporary shedding',
      'Month 3–4: Early fine hair emergence',
      'Month 9–12: Dramatic cosmetic density',
      'Month 15–18: Full caliber and texture maturity'
    ]
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'Will the transplanted hair look natural?',
    answer: [
      'Natural results depend entirely on surgical artistry and graft sorting. We place exclusively delicate 1-hair follicular units along the irregular, feathered transition perimeter of the hairline.',
      'Denser 2-hair and 3-hair groupings are reserved for the core zone behind the hairline. Every slit is created at exact 15–45 degree lateral angles matching your native hair trajectory.'
    ],
    diagramLabel: 'NATURAL FEATHERING PROTOCOL',
    diagramDetails: [
      'Perimeter: Irregular single-hair micro-feathering',
      'Core Density: Multi-hair follicular units placed behind',
      'Angle Matching: 15° to 45° lateral slit orientation'
    ]
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'Will I need more than one hair-transplant session?',
    answer: [
      'Many patients achieve their complete aesthetic goal in a single well-planned session. However, because native untreated hair can continue to thin with age, conservative donor harvesting is vital.',
      'Your surgeon designs your restoration so it looks natural today, while preserving ample donor reserves in case you choose to add density 10 or 15 years later.'
    ],
    diagramLabel: 'LIFETIME DONOR CONSERVATION',
    diagramDetails: [
      'Stage 1: Primary aesthetic framing (hairline/core)',
      'Reserve Fund: 40–50% donor follicles conserved',
      'Long-Term Security: Ample reserve for future decades'
    ]
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'What happens after the transplant?',
    answer: [
      'Recovery is gentle and predictable. You can return to desk work within 48–72 hours. Tiny pinhead crusts form at recipient sites and wash away naturally within 7–10 days using specialized foaming shampoo.',
      'We provide complete post-operative care kits, saline hydration sprays, and scheduled milestone check-ins at months 3, 6, 9, and 12.'
    ],
    diagramLabel: 'POST-PROCEDURE MILESTONES',
    diagramDetails: [
      'Day 1–3: Rest and gentle saline hydration misting',
      'Day 7–10: Crust shedding during wash protocol',
      'Day 14: Unrestricted exercise & styling resumes'
    ]
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'How much does a hair transplant cost?',
    answer: [
      'Restoration is priced on a surgical tier basis calibrated to the exact graft count, procedural complexity, and time required. We do not practice arbitrary per-graft upselling.',
      'During your in-person or virtual consultation, you receive an all-inclusive transparent fee covering surgeon-performed extraction, stereomicroscopic preparation, post-op medications, and 12 months of follow-up care.'
    ],
    diagramLabel: 'TRANSPARENT VALUE ARCHITECTURE',
    diagramDetails: [
      'All-Inclusive: Surgeon fees, facility, & medical team',
      'Zero Hidden Surcharges: All post-op care & visits included',
      'Tailored Tier: Calibrated to your anatomical graft count'
    ]
  }
];

export const PostReportFAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1'); // Default first FAQ open

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            CLINICAL TRANSPARENCY & EVIDENCE
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
          Objective clinical clarity on candidate evaluation, procedural techniques, graft survival, and recovery expectations.
        </p>
      </div>

      {/* Word-Reveal Accordion Rows */}
      <div className="divide-y divide-[#F0EBE1] border-y border-[#F0EBE1]">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="py-5 sm:py-6 transition-colors">
              {/* Question Row Button */}
              <button
                type="button"
                onClick={() => toggleFAQ(item.id)}
                className="w-full flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <div className="flex items-start sm:items-center gap-4">
                  <span className={`font-mono text-xs font-bold transition-colors ${
                    isOpen ? 'text-[#18534F]' : 'text-[#8E877E] group-hover:text-[#1B1F23]'
                  }`}>
                    {item.number}
                  </span>
                  <h4 className={`font-serif text-lg sm:text-xl md:text-2xl font-normal transition-colors ${
                    isOpen ? 'text-[#18534F] font-medium' : 'text-[#1B1F23] group-hover:text-[#18534F]'
                  }`}>
                    {item.question}
                  </h4>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-lg shrink-0 transition-all ${
                  isOpen
                    ? 'bg-[#18534F] text-white rotate-180 shadow-xs'
                    : 'bg-[#FAF8F5] text-[#524B40] border border-[#CDC5B8] group-hover:border-[#18534F]'
                }`}>
                  {isOpen ? '−' : '+'}
                </div>
              </button>

              {/* Smooth Expanded Answer Container */}
              {isOpen && (
                <div className="mt-5 pt-4 border-t border-[#FAF8F5] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                  {/* Left Column: Text Answer Paragraphs */}
                  <div className="lg:col-span-8 space-y-3 text-xs sm:text-sm text-[#423C33] leading-relaxed">
                    {item.answer.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Right Column: Educational Diagram Card */}
                  <div className="lg:col-span-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] p-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[#18534F]">
                      <span className="material-symbols-outlined text-[16px]">biotech</span>
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
                        {item.diagramLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {item.diagramDetails.map((det, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-[#524B40]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#18534F] shrink-0" />
                          <span className="text-[11px] leading-tight font-medium">{det}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
