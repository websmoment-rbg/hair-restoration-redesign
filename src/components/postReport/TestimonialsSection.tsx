import React, { useState } from 'react';
import heroManProfile from '../../assets/images/hero_man_profile_1791103781102.jpg';
import step1Img from '../../assets/images/journey_step_01_profile_1791038035905.jpg';
import step4Img from '../../assets/images/journey_step_04_report_1791038096988.jpg';
import step6Img from '../../assets/images/journey_step_06_consult_1791038131434.jpg';
import hairlineStage1 from '../../assets/images/hairline_stage_1_full_1791204641403.jpg';

interface PatientStory {
  id: string;
  name: string;
  age: string;
  location: string;
  procedure: string;
  timeframe: string;
  quote: string;
  keyTakeaway: string;
  image: string;
}

const STORIES: PatientStory[] = [
  {
    id: 'story-01',
    name: 'Jonathan M.',
    age: '34',
    location: 'London, UK',
    procedure: 'Precision FUE · 2,200 Grafts',
    timeframe: '14 Months Post-Op',
    quote: 'The assessment accurately captured what I saw in photos. Sitting down with the doctor confirmed the design was built specifically for my face shape.',
    keyTakeaway: 'Natural hairline transition without lowering age-appropriate forehead height',
    image: heroManProfile
  },
  {
    id: 'story-02',
    name: 'Alexander B.',
    age: '41',
    location: 'Zurich, Switzerland',
    procedure: 'Vertex Whorl Restoration · 2,450 Grafts',
    timeframe: '16 Months Post-Op',
    quote: 'I had avoided overhead lighting for years because of crown thinning. The rotational whorl placement completely closed the spiral with zero awkward transitions.',
    keyTakeaway: 'Restored crown whorl geometry using multi-hair graft groupings',
    image: step1Img
  },
  {
    id: 'story-03',
    name: 'Marcus K.',
    age: '29',
    location: 'New York, USA',
    procedure: 'Temporal Peak Advancement · 1,750 Grafts',
    timeframe: '12 Months Post-Op',
    quote: 'I was hesitant about early intervention, but understanding donor preservation made all the difference. The procedure was comfortable and recovery took under a week.',
    keyTakeaway: 'Conservative donor harvesting leaving ample reserve for future decades',
    image: step4Img
  },
  {
    id: 'story-04',
    name: 'Richard T.',
    age: '46',
    location: 'Toronto, Canada',
    procedure: 'Diffuse Thinning Densification · 2,600 Grafts',
    timeframe: '15 Months Post-Op',
    quote: 'I still had hair on top, but it was see-through. They placed grafts between my native follicles without shock loss. The fullness today feels like it did in my 20s.',
    keyTakeaway: 'Micro-lateral slit placement preserving native hair vascularity',
    image: step6Img
  },
  {
    id: 'story-05',
    name: 'Daniel S.',
    age: '38',
    location: 'Dubai, UAE',
    procedure: 'Frontal Reconstruction · 2,100 Grafts',
    timeframe: '13 Months Post-Op',
    quote: 'The transparency about what could and could not be accomplished was refreshing. No sales pressure, just clinical clarity and exceptional surgical execution.',
    keyTakeaway: 'Single-follicle feathering along the irregular anterior perimeter',
    image: hairlineStage1
  },
  {
    id: 'story-06',
    name: 'Edward P.',
    age: '52',
    location: 'Sydney, Australia',
    procedure: 'Multi-Zone Balanced Restoration · 2,900 Grafts',
    timeframe: '18 Months Post-Op',
    quote: 'At my age, looking like an 18-year-old would have looked ridiculous. They designed a dignified, full, mature hairline that friends constantly compliment.',
    keyTakeaway: 'Dignified mature hairline design with natural temple recession',
    image: heroManProfile
  }
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : STORIES.length - 1));
    setPlayingVideoId(null);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < STORIES.length - 1 ? prev + 1 : 0));
    setPlayingVideoId(null);
  };

  const activeStory = STORIES[currentIndex];

  return (
    <section className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 md:p-12 shadow-xs space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F0EBE1] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#18534F]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#18534F] font-bold">
              VERIFIED PATIENT EXPERIENCES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
            Real Patient Stories
          </h2>
          <p className="text-xs sm:text-sm text-[#524B40] max-w-xl leading-relaxed">
            Hear how other patients experienced their restoration journey — from initial digital assessment through procedural execution and permanent maturation.
          </p>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#524B40] transition cursor-pointer shadow-2xs"
            aria-label="Previous story"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <span className="font-mono text-xs font-semibold text-[#18534F] px-2">
            0{currentIndex + 1} / 0{STORIES.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#E7E2DA] bg-white hover:bg-[#FAF8F5] flex items-center justify-center text-[#524B40] transition cursor-pointer shadow-2xs"
            aria-label="Next story"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 3D Coverflow Stage */}
      <div className="relative py-4 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Main Active Card */}
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E2DA] p-6 sm:p-10 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left: Video / Portrait Player Container */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#E7E2DA] bg-[#182823] shadow-md group">
                  <img
                    src={activeStory.image}
                    alt={activeStory.name}
                    className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Play Button */}
                  {playingVideoId !== activeStory.id ? (
                    <button
                      type="button"
                      onClick={() => setPlayingVideoId(activeStory.id)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#18534F]/90 hover:bg-[#18534F] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ring-4 ring-white/30"
                      aria-label={`Play testimonial video for ${activeStory.name}`}
                    >
                      <span className="material-symbols-outlined text-3xl ml-0.5">play_arrow</span>
                    </button>
                  ) : (
                    <div className="absolute inset-0 bg-black/95 p-4 flex flex-col justify-between text-white text-xs animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase text-[#94C3AE]">Video Stream Preview</span>
                        <button
                          type="button"
                          onClick={() => setPlayingVideoId(null)}
                          className="text-stone-300 hover:text-white font-mono text-[10px]"
                        >
                          ✕ Close
                        </button>
                      </div>
                      <p className="font-serif italic text-stone-200 text-sm leading-snug my-auto">
                        "{activeStory.quote}"
                      </p>
                      <span className="font-mono text-[10px] text-stone-400">Verified Patient Interview · 1080p</span>
                    </div>
                  )}

                  {/* Bottom Video Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <span className="font-mono text-[10px] uppercase text-[#94C3AE] font-semibold block">
                      PATIENT TESTIMONIAL
                    </span>
                    <h5 className="font-serif text-base font-medium">{activeStory.name}</h5>
                    <span className="text-[11px] text-white/70">{activeStory.timeframe}</span>
                  </div>
                </div>
              </div>

              {/* Right: Testimonial Narrative & Treatment Context */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#18534F] font-bold uppercase tracking-wider">
                      {activeStory.procedure}
                    </span>
                    <span className="text-[#CDC5B8]">•</span>
                    <span className="font-mono text-xs text-[#8E877E]">{activeStory.location}</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23] font-normal leading-snug">
                    {activeStory.name}, {activeStory.age}
                  </h3>
                </div>

                {/* Big Quote */}
                <blockquote className="font-serif text-lg sm:text-xl text-[#3F3A33] italic leading-relaxed border-l-2 border-[#18534F] pl-4">
                  "{activeStory.quote}"
                </blockquote>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2DA] space-y-1.5 shadow-2xs">
                  <span className="font-mono text-[10px] uppercase text-[#18534F] font-bold block">
                    CLINICAL DESIGN HIGHLIGHT:
                  </span>
                  <p className="text-xs text-[#524B40] leading-relaxed">
                    {activeStory.keyTakeaway}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-6">
          {STORIES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setPlayingVideoId(null);
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-[#18534F]'
                  : 'w-2 h-2 bg-[#CDC5B8] hover:bg-[#8E877E]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
