import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onBookConsultation?: () => void;
  onOpenAssessment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onBookConsultation, onOpenAssessment }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHowItWorksClick = () => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('hair-restoration-journey');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById('hair-restoration-journey');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAssessmentBenefitsClick = () => {
    setMobileMenuOpen(false);
    const scrollToBenefits = () => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (currentPage !== 'home') {
      onNavigate('home');
      window.setTimeout(scrollToBenefits, 150);
    } else {
      scrollToBenefits();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-14 h-20 max-w-[1440px] mx-auto bg-[#fbf9f3]/90 backdrop-blur-md border-b border-[#c8c7bf]/30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
          className="text-left font-serif text-base sm:text-lg md:text-xl uppercase tracking-[0.15em] text-[#1b1c18] flex items-center gap-2.5 transition-opacity hover:opacity-85 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#546252] inline-block shrink-0"></span>
          <span className="font-medium whitespace-nowrap">{siteConfig.clinicName === '[CLINIC_NAME]' ? 'ATELIER TRICHOLOGY' : siteConfig.clinicName}</span>
        </button>
      </div>

      {/* Desktop Navigation (>= 1280px large desktop screens): Only Home and How It Works */}
      <nav className="hidden xl:flex items-center space-x-8 text-sm font-medium">
        <button
          onClick={() => onNavigate('home')}
          className={`pb-1 transition-colors cursor-pointer ${currentPage === 'home' ? 'text-[#1b1c18] font-semibold border-b-2 border-black' : 'text-[#474741] hover:text-[#1b1c18]'}`}
        >
          Home
        </button>
        <button
          onClick={handleHowItWorksClick}
          className="pb-1 transition-colors text-[#474741] hover:text-[#1b1c18] cursor-pointer"
        >
          How It Works
        </button>
        <button
          onClick={handleAssessmentBenefitsClick}
          className="pb-1 transition-colors text-[#474741] hover:text-[#1b1c18] cursor-pointer"
        >
          What You Get From Assessment
        </button>
      </nav>

      {/* Actions Area */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Book Consultation & Start Assessment (>= 1280px) */}
        <button
          onClick={() => (onBookConsultation ? onBookConsultation() : onNavigate('consultation-booking'))}
          className="hidden xl:flex items-center gap-1.5 text-[#474741] hover:text-[#1b1c18] text-xs font-semibold uppercase tracking-wider py-2 px-3 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span>Book Consultation</span>
        </button>
        <button
          onClick={() => (onOpenAssessment ? onOpenAssessment() : onNavigate('assessment_entry'))}
          className="hidden xl:flex bg-[#1c1c1a] text-white hover:bg-neutral-800 transition-all text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl border border-[#546252]/20 shadow-xs items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Start Assessment</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>

        {/* Mobile & Tablet: Distinctive Animated Triple-Bar Button (< 1280px) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden flex flex-col justify-center items-center w-11 h-11 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#18534F] shadow-xs transition-all cursor-pointer p-2.5 space-y-1.5 focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <span
            className={`w-5 h-[2px] bg-[#1B1F23] rounded-full transition-transform duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[#1B1F23] rounded-full transition-opacity duration-200 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-[#1B1F23] rounded-full transition-transform duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile & Tablet Elegant Drawer with Smooth Slide & Fade Transition (< 1280px) */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#E7E2DA] p-5 sm:p-6 shadow-2xl flex flex-col gap-3 xl:hidden animate-in slide-in-from-top-4 fade-in duration-300 z-50">
          <div className="space-y-1">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm flex items-center justify-between transition cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-white text-[#18534F] font-semibold border border-[#E7E2DA] shadow-xs'
                  : 'text-[#1B1F23] hover:bg-white/60'
              }`}
            >
              <span>Home</span>
              <span className="material-symbols-outlined text-base">home</span>
            </button>
            <button
              onClick={handleHowItWorksClick}
              className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm text-[#1B1F23] hover:bg-white/60 flex items-center justify-between transition cursor-pointer"
            >
              <span>How It Works</span>
              <span className="material-symbols-outlined text-base">route</span>
            </button>
            <button
              onClick={handleAssessmentBenefitsClick}
              className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm text-[#1B1F23] hover:bg-white/60 flex items-center justify-between transition cursor-pointer"
            >
              <span>What You Get From Assessment</span>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#E7E2DA] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAssessment) onOpenAssessment();
                else onNavigate('assessment_entry');
              }}
              className="w-full bg-[#1c1c1a] hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <span>Start Assessment</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onBookConsultation) onBookConsultation();
                else onNavigate('consultation-booking');
              }}
              className="w-full bg-white hover:bg-[#FAF8F5] text-[#18534F] border border-[#18534F]/30 font-semibold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span>Book Priority Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
