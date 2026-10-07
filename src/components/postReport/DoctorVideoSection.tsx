import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';

interface DoctorVideoProps {
  onBookConsultation?: () => void;
}

export const DoctorVideoSection: React.FC<DoctorVideoProps> = ({ onBookConsultation }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* ==================================================================== */}
      {/* SECTION HEADER                                                       */}
      {/* ==================================================================== */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#18534F] animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
            DOCTOR TRUST & CLINICAL REALITY
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#1B1F23] font-normal leading-tight tracking-tight">
          What Your Assessment Can — and Can't — Tell You
        </h2>

        <p className="text-sm sm:text-base text-[#524B40] leading-relaxed">
          Your assessment gives you a clearer starting point. A specialist evaluation takes that understanding further by physically examining your scalp, donor follicular reserve, and biological hair characteristics.
        </p>
      </div>

      {/* ==================================================================== */}
      {/* EDITORIAL VIDEO STAGE                                                */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Key Principles */}
        <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#18534F] uppercase">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>What The Assessment Accomplishes</span>
            </div>
            <p className="text-xs text-[#524B40] leading-relaxed">
              Synthesizes your personal perception of hairline recession, thinning velocity, aesthetic priorities, and surgical readiness into structured consultation talking points.
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E7E2DA] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#8E877E] uppercase">
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>What Requires In-Person Examination</span>
            </div>
            <p className="text-xs text-[#524B40] leading-relaxed">
              Measurement of occipital donor density (follicular units/cm²), scalp laxity, hair caliber variation, and microscopic follicular miniaturization rates.
            </p>
          </div>

          <div className="p-3 bg-[#E8F0E6] rounded-xl border border-[#D7E7D2] flex items-center gap-3 text-xs text-[#18534F]">
            <span className="material-symbols-outlined text-[20px] shrink-0">info</span>
            <p className="text-[11px] leading-snug">
              Clinical consultations never carry treatment obligations. They provide objective medical clarity for your long-term restoration plan.
            </p>
          </div>
        </div>

        {/* Right Column: Cinematic Video Container */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#E7E2DA] bg-[#182823] shadow-md group">
            {!isPlaying ? (
              <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8">
                {/* Background Image / Thumbnail with dark cinematic gradient */}
                <img
                  src={heroManProfile}
                  alt="Lead Surgeon Consultation Briefing"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182823] via-[#182823]/40 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-full font-mono text-[10px] uppercase tracking-wider text-white border border-white/20">
                    Lead Surgeon Clinical Briefing
                  </span>
                  <span className="font-mono text-xs text-white/80 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    3:45
                  </span>
                </div>

                {/* Center Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#18534F] hover:bg-[#123E3B] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ring-4 ring-white/20"
                    aria-label="Play consultation briefing video"
                  >
                    <span className="material-symbols-outlined text-3xl sm:text-4xl ml-1">play_arrow</span>
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/80 mt-3 font-semibold">
                    CLICK TO WATCH BRIEFING
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 space-y-1">
                  <h4 className="font-serif text-lg sm:text-xl text-white font-medium">
                    "From Digital Signals to Surgical Precision"
                  </h4>
                  <p className="text-xs text-white/70">
                    Dr. Julian Vance, MD, FISHRS · Senior Hair Restoration Surgeon
                  </p>
                </div>
              </div>
            ) : (
              /* Active Video Player State */
              <div className="relative w-full h-full bg-black flex flex-col justify-between p-6 sm:p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3FB950] animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-[#94C3AE]">
                      Playing: Clinical Video Briefing
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>

                <div className="space-y-3 max-w-xl my-auto">
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
                    <span className="font-mono text-[10px] uppercase text-[#94C3AE] font-semibold block">
                      KEY TAKEAWAY FROM THIS BRIEFING:
                    </span>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                      "A successful hair restoration does not just replace lost hairs — it conserves donor follicles so your hair looks completely natural not just at 12 months, but 15 years down the road."
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <span className="font-mono text-[11px] text-stone-400">
                    Captions enabled · English (Stereo Audio)
                  </span>
                  {onBookConsultation && (
                    <button
                      type="button"
                      onClick={onBookConsultation}
                      className="px-4 py-2 bg-[#18534F] hover:bg-[#123E3B] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Schedule In-Person Consultation
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
