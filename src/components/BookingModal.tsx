import React, { useEffect, useId, useState } from 'react';
import { trackEvent } from '../analytics/events';
import { syncWithGoogleSheets } from '../integrations/sheets';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: { fullName: string; phone: string; email: string; problem: string; preferredLocation?: string };
  assessmentResult?: any;
}

/** A request form, not an appointment scheduler. The assessment reference is sent quietly with the request. */
export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, patient, assessmentResult }) => {
  const titleId = useId();
  const [format, setFormat] = useState<'online' | 'clinic'>('online');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [questions, setQuestions] = useState('');
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(patient.fullName || '');
    setEmail(patient.email || '');
    setPhone(patient.phone || '');
    setStatus('form');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, patient.fullName, patient.email, patient.phone]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    const reference = assessmentResult?.assessmentId || undefined;
    try {
      const response = await syncWithGoogleSheets({
        patient: { ...patient, fullName: name.trim(), email: email.trim(), phone: phone.trim() },
        assessment: { assessmentId: reference || 'assessment-not-completed', answers: assessmentResult?.rawAnswers || assessmentResult?.answers || {} },
        assessmentId: reference,
        booking: {
          scheduled: false,
          type: format === 'online' ? 'virtual' : 'in_person',
          location: format === 'clinic' ? 'At the Clinic' : 'Online / Digital',
          date: '', time: '', notes: questions.trim() || undefined,
        },
        leadType: 'consultation_request',
      });
      trackEvent('consultation_request_submitted', { format, assessment_id: reference, queued: response.queued });
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#10201b]/55 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="min-h-full flex items-start sm:items-center justify-center py-3 sm:py-8">
        <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#d9dfd6] bg-[#fbfaf6] shadow-2xl">
          <header className="flex items-start justify-between gap-4 border-b border-[#e7e2da] px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <p className="text-[10px] font-mono font-bold tracking-[.22em] text-[#18534f]">CONSULTATION REQUEST</p>
              <h2 id={titleId} className="mt-1 font-serif text-2xl text-[#15332e] sm:text-3xl">Start a focused conversation</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5b6c66]">Share a few details and we’ll associate your assessment profile automatically when one is available.</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#47615a] hover:bg-[#edf1eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18534f]" aria-label="Close consultation form"><span className="material-symbols-outlined">close</span></button>
          </header>

          {status === 'success' ? (
            <div className="px-6 py-12 text-center sm:px-10">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e2eee5] text-[#18534f]"><span className="material-symbols-outlined text-3xl">check</span></div>
              <p className="mt-6 text-[10px] font-mono font-bold tracking-[.22em] text-[#18534f]">REQUEST RECEIVED</p>
              <h3 className="mt-2 font-serif text-3xl text-[#15332e]">Thank you — your consultation request has been received.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5b6c66]">We’ll review your request and contact you once your consultation is confirmed.</p>
              <button type="button" onClick={onClose} className="mt-8 min-h-11 rounded-xl bg-[#18534f] px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#123e3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18534f]">Return to your profile</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <fieldset>
                <legend className="text-sm font-semibold text-[#1b3732]">How would you like to have your consultation?</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {([
                    ['online', 'Online / Digital', 'A private digital conversation.'],
                    ['clinic', 'Offline / At the Clinic', 'Meet at the clinic in person.'],
                  ] as const).map(([value, label, description]) => (
                    <label key={value} className={`relative block min-h-[104px] cursor-pointer rounded-xl border p-4 transition ${format === value ? 'border-[#18534f] bg-[#eaf3ed] ring-1 ring-[#18534f]' : 'border-[#dbe0d9] bg-white hover:border-[#8ea69d]'}`}>
                      <input className="sr-only" type="radio" name="consultation-format" value={value} checked={format === value} onChange={() => setFormat(value)} />
                      <span className="block text-sm font-semibold text-[#183a33]">{label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#5b6c66]">{description}</span>
                      {format === value && <span className="material-symbols-outlined absolute right-3 top-3 text-[#18534f]" aria-hidden="true">check_circle</span>}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2"><span className="text-xs font-semibold text-[#294840]">Full Name</span><input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-[#cbd6ce] bg-white px-3 text-sm text-[#1b3732] outline-none transition focus:border-[#18534f] focus:ring-2 focus:ring-[#18534f]/20" /></label>
                <label className="block"><span className="text-xs font-semibold text-[#294840]">Phone Number</span><input required type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-[#cbd6ce] bg-white px-3 text-sm text-[#1b3732] outline-none transition focus:border-[#18534f] focus:ring-2 focus:ring-[#18534f]/20" /></label>
                <label className="block"><span className="text-xs font-semibold text-[#294840]">Email Address</span><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-[#cbd6ce] bg-white px-3 text-sm text-[#1b3732] outline-none transition focus:border-[#18534f] focus:ring-2 focus:ring-[#18534f]/20" /></label>
              </div>
              <label className="block"><span className="text-xs font-semibold text-[#294840]">Any questions you’d like us to know before the consultation?</span><textarea value={questions} onChange={(e) => setQuestions(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-[#cbd6ce] bg-white p-3 text-sm text-[#1b3732] outline-none transition focus:border-[#18534f] focus:ring-2 focus:ring-[#18534f]/20" /></label>
              {status === 'error' && <p role="alert" className="rounded-lg bg-[#fff0ef] p-3 text-sm text-[#9b2722]">We couldn’t send your request just now. Please try again.</p>}
              <button disabled={isSubmitting} type="submit" className="min-h-12 w-full rounded-xl bg-[#18534f] px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#123e3b] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18534f]">{isSubmitting ? 'Sending request…' : 'Send consultation request'}</button>
              <p className="text-center text-[11px] leading-relaxed text-[#71827a]">Your assessment brief is attached automatically when available. No appointment is confirmed until the clinic contacts you.</p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};
