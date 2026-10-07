import React from 'react';
import { siteConfig } from '../config/siteConfig';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full px-6 md:px-14 py-16 max-w-[1440px] mx-auto bg-[#1c1c1a] text-[#fbf9f3] border-t border-[#c8c7bf]/20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
        {/* Brand Narrative */}
        <div className="md:col-span-4 space-y-4">
          <span className="font-serif text-xl tracking-[0.2em] uppercase text-white block font-medium">
            {siteConfig.clinicName === '[CLINIC_NAME]' ? 'AURA TRICHOLOGY' : siteConfig.clinicName}
          </span>
          <p className="text-xs md:text-sm text-[#858480] max-w-sm leading-relaxed">
            Atelier clinical dermatology, follicular unit extraction, and non-surgical scalp therapies delivered with architectural precision and high-touch medical discretion.
          </p>
          <div className="pt-2 text-neutral-400 text-xs space-y-1">
            <p className="text-white font-medium">{siteConfig.clinicName}: Atelier Aura Trichology Clinic</p>
            <p>{siteConfig.clinicAddress}: 14 Harley Place, Marylebone, London, W1G 8PN</p>
            <p>{siteConfig.clinicPhone}: +44 (0) 20 7946 0991</p>
            <p>{siteConfig.clinicEmail}: clinical@atelier-trichology.com</p>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="md:col-span-2 space-y-4">
          <span className="text-xs uppercase text-white tracking-wider font-semibold block">Navigation</span>
          <ul className="space-y-2.5 text-xs text-[#858480]">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
            <li>
              <button
                onClick={() => {
                  onNavigate('home');
                  setTimeout(() => {
                    const el = document.getElementById('hair-restoration-journey');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </li>
            <li><button onClick={() => onNavigate('consultation-booking')} className="hover:text-white transition-colors cursor-pointer">Consultation</button></li>
          </ul>
        </div>

        {/* Clinical Governance & Protocols */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-xs uppercase text-white tracking-wider font-semibold block">Clinical Governance</span>
          <ul className="space-y-2.5 text-xs text-[#858480]">
            <li><a href="#governance" className="hover:text-white transition-colors">Clinical Governance</a></li>
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Protocol</a></li>
            <li><a href="#science" className="hover:text-white transition-colors">Scientific Advisory</a></li>
            <li><a href="#norwood" className="hover:text-white transition-colors">Norwood Scale Matrix</a></li>
            <li><button onClick={() => onNavigate('internal-funnel')} className="hover:text-white transition-colors">Clinic Funnel Analytics</button></li>
          </ul>
        </div>

        {/* Medical Disclaimer */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-xs uppercase text-white tracking-wider font-semibold block">Non-Diagnostic Notice</span>
          <p className="text-xs text-[#858480] leading-relaxed">
            The Hair Restoration Assessment is an exploratory educational tool and does not constitute formal medical diagnosis or surgical prescription. Individual surgical suitability and graft extraction yields require an in-person clinical examination by a certified trichologist or restoration surgeon.
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="pt-8 border-t border-[#c8c7bf]/10 flex flex-col md:flex-row items-center justify-between text-[#858480] text-xs gap-4">
        <p>© 2025 Aura Clinical Trichology & Surgical Restoration. All rights reserved. Medical discretion assured.</p>
        <div className="flex items-center gap-4 text-neutral-400">
          <span>GDPR Compliant</span>
          <span>·</span>
          <span>CQC Registered Pathway</span>
          <span>·</span>
          <span>Confidentiality Protocol</span>
        </div>
      </div>
    </footer>
  );
};
