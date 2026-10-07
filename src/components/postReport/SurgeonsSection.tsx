import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';
import step1Img from '../../assets/images/journey_step_01_profile_1791038035905.jpg';
import step6Img from '../../assets/images/journey_step_06_consult_1791038131434.jpg';

interface SurgeonProfile {
  id: string;
  number: string;
  name: string;
  credentials: string;
  specialty: string;
  casesCompleted: string;
  experienceYears: string;
  bio: string;
  focusAreas: string[];
  image: string;
}

const SURGEONS: SurgeonProfile[] = [
  {
    id: 'surgeon-01',
    number: '01',
    name: 'Dr. Julian Vance, MD',
    credentials: 'FISHRS · Fellow of International Society of Hair Restoration Surgery',
    specialty: 'Ultra-Refined Micro-FUE & Frontal Transition Design',
    casesCompleted: '3,400+',
    experienceYears: '16 Years',
    bio: 'Pioneered micro-incisional depth calibration to protect native sub-dermal vascular plexus. Specializes in multi-vector single-hair hairline transition feathering for undetectable natural results.',
    focusAreas: ['Natural Hairline Feathering', 'Donor Preservation Mapping', 'Trumpet Punch Harvesting'],
    image: heroManProfile
  },
  {
    id: 'surgeon-02',
    number: '02',
    name: 'Dr. Sarah Al-Mansoor, MD',
    credentials: 'ABHRS · Diplomate of the American Board of Hair Restoration Surgery',
    specialty: 'Crown Spiral Angulation & Diffuse Pattern Restructuring',
    casesCompleted: '2,800+',
    experienceYears: '14 Years',
    bio: 'Internationally recognized for anatomical reconstruction of the vertex whorl. Directs our regenerative follicle preparation unit using temperature-controlled bio-hydration baths.',
    focusAreas: ['Crown Vertex Whorl Design', 'Female Pattern Ludwig Alopecia', 'Adjuvant Growth Factor Protocols'],
    image: step1Img
  },
  {
    id: 'surgeon-03',
    number: '03',
    name: 'Dr. Alistair Chen, MD',
    credentials: 'FEBHS · Fellow of the European Board of Hair Restoration Surgeons',
    specialty: 'Corrective Revision & High-Density Follicular Implantation',
    casesCompleted: '2,950+',
    experienceYears: '15 Years',
    bio: 'Specialist in reconstructive dense-packing and previous graft redistribution. Focuses on minimal-trauma lateral slit placement and long-term donor resource management.',
    focusAreas: ['Corrective Scar Revision', 'High-Density Follicular Unit Implantation', 'Secondary Procedure Planning'],
    image: step6Img
  }
];

export const SurgeonsSection: React.FC = () => {
  const [activeSurgeonIndex, setActiveSurgeonIndex] = useState<number>(0);
  const activeSurgeon = SURGEONS[activeSurgeonIndex];

  const handlePrev = () => {
    setActiveSurgeonIndex((prev) => (prev > 0 ? prev - 1 : SURGEONS.length - 1));
  };

  const handleNext = () => {
    setActiveSurgeonIndex((prev) => (prev < SURGEONS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header with Title and Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F0EBE1] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18534F]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
              BOARD-CERTIFIED CLINICAL MASTERY
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
            Meet Your Surgeons
          </h2>
          <p className="text-xs sm:text-sm text-[#524B40] max-w-xl leading-relaxed">
            Every procedure at Atelier is planned, harvested, and placed directly by board-certified hair restoration surgeons with over a decade of dedicated specialization.
          </p>
        </div>

        {/* Surgeon Selector Controls (01, 02, 03 tabs) */}
        <div className="flex items-center gap-2">
          {SURGEONS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSurgeonIndex(idx)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeSurgeonIndex === idx
                  ? 'bg-[#18534F] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#524B40] border border-[#E7E2DA] hover:bg-[#E8F0E6]'
              }`}
            >
              <span>{s.number}</span>
              <span className="hidden sm:inline">{s.name.split(',')[0]}</span>
            </button>
          ))}
          <div className="flex items-center gap-1 pl-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#524B40] transition cursor-pointer"
              aria-label="Previous surgeon"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#524B40] transition cursor-pointer"
              aria-label="Next surgeon"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Active Surgeon Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Large Editorial Portrait */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-[#E7E2DA] bg-[#FAF8F5] shadow-sm">
            <img
              src={activeSurgeon.image}
              alt={activeSurgeon.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#94C3AE] block">
                SPECIALIST IN RESIDENCE
              </span>
              <h4 className="font-serif text-xl font-medium">{activeSurgeon.name}</h4>
              <p className="text-xs text-white/80 line-clamp-1">{activeSurgeon.specialty}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Credentials, Experience Metrics & Bio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[#18534F] font-bold uppercase tracking-wider block">
              SURGEON {activeSurgeon.number} OF 03
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal">
              {activeSurgeon.name}
            </h3>
            <p className="text-xs sm:text-sm font-mono text-[#8E877E] leading-relaxed">
              {activeSurgeon.credentials}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
              <span className="font-mono text-[10px] uppercase text-[#8E877E] block">SURGICAL CASES</span>
              <span className="font-serif text-2xl text-[#18534F] font-bold mt-0.5 block">{activeSurgeon.casesCompleted}</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
              <span className="font-mono text-[10px] uppercase text-[#8E877E] block">EXPERIENCE</span>
              <span className="font-serif text-2xl text-[#1B1F23] font-bold mt-0.5 block">{activeSurgeon.experienceYears}</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] uppercase text-[#8E877E] block">FELLOWSHIP</span>
              <span className="font-semibold text-xs text-[#1B1F23] mt-1 block">Board Certified</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#524B40] leading-relaxed">
            {activeSurgeon.bio}
          </p>

          {/* Focus Areas Pills */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#8E877E] font-semibold block">
              CORE PROCEDURAL SPECIALTIES:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeSurgeon.focusAreas.map((area, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#E8F0E6] text-[#18534F] text-xs font-mono rounded-lg border border-[#D7E7D2]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
