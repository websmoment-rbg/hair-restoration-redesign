export interface AnalyticsEvent {
  event_id: string;
  event_name: string;
  timestamp: string;
  visitor_id: string;
  session_id: string;
  patient_id?: string | null;
  assessment_id?: string | null;
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  content?: string | null;
  term?: string | null;
  device: 'desktop' | 'tablet' | 'mobile';
  assessment_version?: string;
  engine_version?: string;
  report_version?: string;
  properties?: Record<string, any>;
  metadata?: Record<string, any>;
  [key: string]: any;
}

const STORAGE_KEY = 'aura_analytics_events';
const VISITOR_KEY = 'aura_visitor_id';
const SESSION_KEY = 'aura_session_id';

export function getVisitorId(): string {
  let vid = localStorage.getItem(VISITOR_KEY);
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem(VISITOR_KEY, vid);
  }
  return vid;
}

export function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 's_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  ['source', 'medium', 'campaign', 'content', 'term'].forEach((k) => {
    const val = params.get('utm_' + k) || params.get(k);
    if (val) utms[k] = val;
  });
  return utms;
}

export function trackEvent(name: string, payload: Record<string, any> = {}) {
  try {
    const utms = getUtmParams();
    const event: AnalyticsEvent = {
      event_id: 'evt_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      event_name: name,
      timestamp: new Date().toISOString(),
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      device: getDeviceType(),
      source: utms.source || 'direct',
      medium: utms.medium || 'web',
      campaign: utms.campaign || null,
      content: utms.content || null,
      term: utms.term || null,
      assessment_version: '1.0.0',
      engine_version: '1.1.0',
      report_version: '1.0.0',
      properties: payload,
      ...payload
    };

    const stored: AnalyticsEvent[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // prevent duplicate assessment_completed and report_generated per assessment
    if (
      (name === 'assessment_completed' || name === 'report_generated') &&
      stored.some((e: AnalyticsEvent) => e.event_name === name && e.assessment_id === payload.assessment_id)
    ) {
      return event;
    }

    stored.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return event;
  } catch (e) {
    console.warn('Analytics storage failed:', e);
    return null;
  }
}

export function trackPageView(pageName: string) {
  return trackEvent('page_view', { page: pageName });
}

export function getRecordedEvents(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearRecordedEvents(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear events:', e);
  }
}
