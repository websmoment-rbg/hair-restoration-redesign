import { siteConfig, isPlaceholder } from '../config/siteConfig';

export interface ClinicSyncPayload {
  patient: {
    fullName: string;
    phone: string;
    email: string;
    problem?: string;
    age?: string | number;
    preferredLocation?: string;
    [key: string]: any;
  };
  assessment?: {
    assessmentId: string;
    candidacyTier?: string;
    candidacyScore?: number;
    norwoodStage?: string;
    primaryPathway?: string;
    estimatedGrafts?: string;
    answers?: Record<string, any>;
    [key: string]: any;
  };
  booking?: {
    scheduled: boolean;
    date: string;
    time: string;
    type: 'in_person' | 'virtual';
    location: string;
    notes?: string;
    [key: string]: any;
  };
  assessmentId?: string;
  patientId?: string;
  sessionId?: string;
  timestamp?: string;
  leadType?: string;
  answers?: Record<string, any>;
  [key: string]: any;
}

const OUTBOX_KEY = 'aura_sheets_outbox';

export async function syncWithGoogleSheets(payload: ClinicSyncPayload): Promise<{ success: boolean; queued: boolean; message: string }> {
  try {
    const queue = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
    const record = {
      id: 'sync_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ...payload
    };
    queue.push(record);
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(queue));

    const webhook = siteConfig.googleSheetsWebhookUrl || siteConfig.googleAppsScriptUrl;

    if (!webhook || isPlaceholder(webhook)) {
      console.info('[Google Sheets Sync] Webhook endpoint is placeholder. Record cached securely in local clinic queue.');
      return {
        success: true,
        queued: true,
        message: 'Buffered in local persistent outbox. Configure VITE_GOOGLE_SHEETS_WEBHOOK_URL to stream to live Sheets.'
      };
    }

    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });

    if (res.ok) {
      return { success: true, queued: false, message: 'Dispatched to remote endpoint' };
    }
    return { success: false, queued: true, message: `Remote endpoint returned HTTP ${res.status}` };
  } catch (err: any) {
    console.warn('[Google Sheets Sync] Network error, retained in local outbox queue.', err);
    return { success: false, queued: true, message: err?.message || 'Network unreachable' };
  }
}

export const syncLeadToGoogleSheets = syncWithGoogleSheets;

export async function testSheetsConnection(): Promise<{ success: boolean; message: string }> {
  const webhook = siteConfig.googleSheetsWebhookUrl || siteConfig.googleAppsScriptUrl;
  if (!webhook || isPlaceholder(webhook)) {
    return {
      success: true,
      message: 'Local buffer simulator is active and accepting leads (no external HTTP required).'
    };
  }

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true, timestamp: new Date().toISOString() })
    });
    if (res.ok) {
      return { success: true, message: 'Live connection verified! HTTP 200 OK' };
    }
    return { success: false, message: `Endpoint returned HTTP status ${res.status}` };
  } catch (err: any) {
    return { success: false, message: `Could not reach endpoint: ${err.message}` };
  }
}

export function getOutboxQueue(): any[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearOutboxQueue(): void {
  try {
    localStorage.removeItem(OUTBOX_KEY);
  } catch (e) {
    console.warn('Failed to clear outbox:', e);
  }
}
