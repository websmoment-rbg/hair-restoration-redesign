import { AnalyticsEvent, getRecordedEvents } from './events';

export interface FunnelMetrics {
  traffic: number;
  assessmentStarts: number;
  patientDetailsSubmitted: number;
  assessmentCompletions: number;
  reportsGenerated: number;
  reportsViewed: number;
  reportViews: number;
  pathwayViews: number;
  ctaClicks: number;
  consultationRequests: number;
  bookings: number;
  consultationBookings: number;
  showUps: number;
  treatments: number;
  // Rates
  startRate: number;
  patientDetailRate: number;
  completionRate: number;
  reportViewRate: number;
  ctaEngagementRate: number;
  requestRate: number;
  bookingRate: number;
  showUpRate: number;
  treatmentConversionRate: number;
  overallConversionRate: number;
  rates: {
    visitorToStart: string;
    startToLead: string;
    leadToCompletion: string;
    completionToBooking: string;
    overallConversion: string;
  };
}

export function computeFunnelMetrics(events: AnalyticsEvent[] = getRecordedEvents()): FunnelMetrics {
  const count = (name: string) => events.filter((e) => e.event_name === name).length;

  const traffic = Math.max(1, count('page_view') || (events.length ? new Set(events.map(e => e.visitor_id)).size : 1));
  const assessmentStarts = count('assessment_started');
  const patientDetailsSubmitted = count('patient_details_submitted');
  const assessmentCompletions = count('assessment_completed');
  const reportsGenerated = count('report_generated');
  const reportsViewed = count('report_viewed') + (events.some(e => e.properties?.page === 'report' || e.event_name === 'report_viewed') ? 1 : 0);
  const pathwayViews = count('procedure_pathway_viewed');
  const ctaClicks = count('consultation_cta_clicked') + count('report_bottom_cta_clicked') + count('report_header_cta_clicked');
  const consultationRequests = count('consultation_requested');
  const bookings = count('consultation_booked');
  const showUps = count('consultation_attended');
  const treatments = count('treatment_started');

  const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);
  const fmtPct = (num: number, den: number) => `${pct(num, den).toFixed(1)}%`;

  return {
    traffic,
    assessmentStarts,
    patientDetailsSubmitted,
    assessmentCompletions,
    reportsGenerated,
    reportsViewed,
    reportViews: reportsViewed,
    pathwayViews,
    ctaClicks,
    consultationRequests,
    bookings,
    consultationBookings: bookings,
    showUps,
    treatments,
    startRate: pct(assessmentStarts, traffic),
    patientDetailRate: pct(patientDetailsSubmitted, Math.max(1, assessmentStarts)),
    completionRate: pct(assessmentCompletions, Math.max(1, patientDetailsSubmitted)),
    reportViewRate: pct(reportsViewed, Math.max(1, assessmentCompletions)),
    ctaEngagementRate: pct(ctaClicks, Math.max(1, reportsViewed)),
    requestRate: pct(consultationRequests, Math.max(1, ctaClicks)),
    bookingRate: pct(bookings, Math.max(1, consultationRequests)),
    showUpRate: pct(showUps, Math.max(1, bookings)),
    treatmentConversionRate: pct(treatments, Math.max(1, showUps)),
    overallConversionRate: pct(bookings, traffic),
    rates: {
      visitorToStart: fmtPct(assessmentStarts, traffic),
      startToLead: fmtPct(patientDetailsSubmitted, Math.max(1, assessmentStarts)),
      leadToCompletion: fmtPct(assessmentCompletions, Math.max(1, patientDetailsSubmitted)),
      completionToBooking: fmtPct(bookings, Math.max(1, assessmentCompletions)),
      overallConversion: fmtPct(bookings, traffic)
    }
  };
}
