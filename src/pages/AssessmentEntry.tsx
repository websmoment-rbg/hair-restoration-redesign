import React, { useState } from 'react';
import { trackEvent } from '../analytics/events';

interface AssessmentEntryProps {
  onStart: (patient: { fullName: string; phone: string; email: string; problem: string; preferredLocation?: string }) => void;
  onCancel: () => void;
}

export const AssessmentEntry: React.FC<AssessmentEntryProps> = ({ onStart, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    problem: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      setError('Please provide a valid contact phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.problem.trim()) {
      setError('Please describe your main hair concern in your own words.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    trackEvent('patient_details_submitted', {
      metadata: { namePresent: true, phonePresent: true, emailPresent: true }
    });

    setTimeout(() => {
      onStart(formData);
    }, 400);
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-14 max-w-2xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl hairline-border shadow-sm space-y-8">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#546252] block mb-2">
            Discreet Clinical Gate
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1b1c18] font-normal leading-tight">
            First, Tell Us a Little About You
          </h1>
          <p className="text-sm text-[#474741] mt-3 leading-relaxed">
            Before we begin, share a few details so we can create and save your personalized assessment.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-red-700">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-[#474741] tracking-wider block">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Dr. / Mr. / Ms. Alexander Wright"
              className="w-full bg-[#fbf9f3] border border-[#c8c7bf]/60 rounded-xl px-4 py-3.5 text-sm text-[#1b1c18] placeholder-neutral-400 focus:outline-none focus:border-[#1b1c18] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-[#474741] tracking-wider block">
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7946 0912"
                className="w-full bg-[#fbf9f3] border border-[#c8c7bf]/60 rounded-xl px-4 py-3.5 text-sm text-[#1b1c18] placeholder-neutral-400 focus:outline-none focus:border-[#1b1c18] transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase text-[#474741] tracking-wider block">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@atelier.com"
                className="w-full bg-[#fbf9f3] border border-[#c8c7bf]/60 rounded-xl px-4 py-3.5 text-sm text-[#1b1c18] placeholder-neutral-400 focus:outline-none focus:border-[#1b1c18] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase text-[#474741] tracking-wider block">
              Tell us about your hair concern *
            </label>
            <textarea
              rows={3}
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              placeholder="In your own words, what would you most like to understand or change about your hair?"
              className="w-full bg-[#fbf9f3] border border-[#c8c7bf]/60 rounded-xl px-4 py-3 text-sm text-[#1b1c18] placeholder-neutral-400 focus:outline-none focus:border-[#1b1c18] transition-colors resize-none"
            />
          </div>

          <p className="text-[11px] text-[#474741] leading-relaxed">
            Your information is used to provide your assessment and support your consultation journey.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-[#1c1c1a] text-white hover:bg-neutral-800 transition-all text-xs font-semibold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Unlocking Assessment...' : 'Continue to My Assessment'}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-xs font-semibold text-[#474741] hover:bg-[#f0eee8] transition-colors"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
