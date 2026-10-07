import React, { useState, useEffect } from 'react';
import { getRecordedEvents, clearRecordedEvents, trackEvent, AnalyticsEvent } from '../analytics/events';
import { computeFunnelMetrics, FunnelMetrics } from '../analytics/funnel';
import { syncWithGoogleSheets, testSheetsConnection } from '../integrations/sheets';
import { siteConfig } from '../config/siteConfig';

interface AnalyticsDashboardProps {
  onBackToApp: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBackToApp }) => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [funnel, setFunnel] = useState<FunnelMetrics>(() => computeFunnelMetrics([]));
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [rawWebhookUrl, setRawWebhookUrl] = useState(siteConfig.googleSheetsWebhookUrl);

  const refreshData = () => {
    const recorded = getRecordedEvents();
    setEvents(recorded);
    setFunnel(computeFunnelMetrics(recorded));
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTestSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Initiating test ping to Google Sheets endpoint...');
    try {
      const res = await testSheetsConnection();
      if (res.success) {
        setSyncStatus(`Sync simulation successful: ${res.message}`);
      } else {
        setSyncStatus(`Webhook error: ${res.message}`);
      }
    } catch (e: any) {
      setSyncStatus(`Connection failed: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all recorded analytics events for this browser session?')) {
      clearRecordedEvents();
      refreshData();
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `trichology_analytics_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleExportCSV = () => {
    if (events.length === 0) return;
    const headers = ['Event ID', 'Event Name', 'Timestamp', 'Visitor ID', 'Patient ID', 'Properties'];
    const rows = events.map(e => [
      e.event_id,
      e.event_name,
      e.timestamp,
      e.visitor_id,
      e.patient_id || '',
      JSON.stringify(e.properties).replace(/"/g, '""')
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => `"${r.join('","')}"`)].join('\n');
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', encodeURI(csvContent));
    dlAnchor.setAttribute('download', `trichology_events_${Date.now()}.csv`);
    dlAnchor.click();
  };

  const filteredEvents = selectedFilter === 'ALL'
    ? events
    : events.filter(e => e.event_name === selectedFilter);

  const eventTypeCounts = events.reduce((acc, ev) => {
    acc[ev.event_name] = (acc[ev.event_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-[#121517] min-h-screen text-[#E6E8EA] font-sans">
      {/* Header */}
      <header className="border-b border-[#2A2E33] bg-[#181B1F] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse"></span>
            <div>
              <h1 className="text-base font-medium tracking-tight text-white flex items-center gap-2">
                Conversion Analytics Engine
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#2A2E33] text-[#A0A6AD] rounded">
                  v1.1.0 Telemetry
                </span>
              </h1>
              <p className="text-xs text-[#8A9099]">Real-time patient acquisition funnel and Google Sheets bridge</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={events.length === 0}
              className="px-3 py-1.5 bg-[#22272C] hover:bg-[#2C3238] text-xs font-mono text-[#D0D4D9] rounded border border-[#323840] disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              CSV
            </button>
            <button
              onClick={handleExportJSON}
              disabled={events.length === 0}
              className="px-3 py-1.5 bg-[#22272C] hover:bg-[#2C3238] text-xs font-mono text-[#D0D4D9] rounded border border-[#323840] disabled:opacity-40 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">data_object</span>
              JSON
            </button>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1.5 bg-[#3B1D1D] hover:bg-[#4E2727] text-xs font-mono text-[#F87171] rounded border border-[#5E2B2B] transition"
            >
              Clear Logs
            </button>
            <button
              onClick={onBackToApp}
              className="px-4 py-1.5 bg-[#FAF8F5] hover:bg-white text-[#121517] text-xs font-semibold rounded transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Return to Site
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Funnel Metrics Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#8A9099]">
              Conversion Funnel Stages
            </h2>
            <span className="text-xs font-mono text-[#10B981]">
              Live Sessions: {events.length > 0 ? new Set(events.map(e => e.session_id)).size : 1}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#181B1F] p-4 rounded border border-[#2A2E33]">
              <div className="text-[11px] font-mono text-[#8A9099] uppercase">1. Site Visitors</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.traffic}</div>
              <div className="text-[10px] text-[#A0A6AD] mt-1 font-mono">100% baseline</div>
            </div>

            <div className="bg-[#181B1F] p-4 rounded border border-[#2A2E33]">
              <div className="text-[11px] font-mono text-[#8A9099] uppercase">2. Started Quiz</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.assessmentStarts}</div>
              <div className="text-[10px] text-[#34D399] mt-1 font-mono">{funnel.rates.visitorToStart} start rate</div>
            </div>

            <div className="bg-[#181B1F] p-4 rounded border border-[#2A2E33]">
              <div className="text-[11px] font-mono text-[#8A9099] uppercase">3. Leads Captured</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.patientDetailsSubmitted}</div>
              <div className="text-[10px] text-[#60A5FA] mt-1 font-mono">{funnel.rates.startToLead} entry rate</div>
            </div>

            <div className="bg-[#181B1F] p-4 rounded border border-[#2A2E33]">
              <div className="text-[11px] font-mono text-[#8A9099] uppercase">4. Completed Q1-18</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.assessmentCompletions}</div>
              <div className="text-[10px] text-[#A78BFA] mt-1 font-mono">{funnel.rates.leadToCompletion} completion</div>
            </div>

            <div className="bg-[#181B1F] p-4 rounded border border-[#2A2E33]">
              <div className="text-[11px] font-mono text-[#8A9099] uppercase">5. Report Views</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.reportViews}</div>
              <div className="text-[10px] text-[#FBBF24] mt-1 font-mono">Dossier generated</div>
            </div>

            <div className="bg-[#181B1F] p-4 rounded border border-[#10B981]/40 bg-gradient-to-b from-[#181B1F] to-[#122E22]">
              <div className="text-[11px] font-mono text-[#34D399] uppercase font-semibold">6. Consultations</div>
              <div className="text-2xl font-semibold text-white mt-1">{funnel.consultationBookings}</div>
              <div className="text-[10px] text-[#34D399] mt-1 font-mono">{funnel.rates.overallConversion} end-to-end</div>
            </div>
          </div>
        </section>

        {/* Integration Status & Google Sheets Webhook Bridge */}
        <section className="bg-[#181B1F] rounded border border-[#2A2E33] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#34D399]">sync_alt</span>
                Google Sheets & Clinic CRM Webhook Connector
              </h3>
              <p className="text-xs text-[#8A9099] mt-0.5">
                Automatically dispatches completed patient intakes and consultation bookings to Google Sheets / Make / Zapier.
              </p>
            </div>

            <button
              onClick={handleTestSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded disabled:opacity-50 transition flex items-center gap-2 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSyncing ? 'refresh' : 'send'}
              </span>
              <span>{isSyncing ? 'Testing...' : 'Test Webhook Dispatch'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-[#121517] rounded border border-[#22272C] text-xs font-mono space-y-1.5">
              <div className="text-[#8A9099] uppercase text-[10px]">Configured Endpoint</div>
              <div className="text-[#D0D4D9] truncate">
                {rawWebhookUrl || 'No custom URL set (using local fallback)'}
              </div>
              <div className="text-[11px] text-[#5A6069]">
                To route to a live spreadsheet, set `VITE_GOOGLE_SHEETS_WEBHOOK_URL` or edit `siteConfig.ts`.
              </div>
            </div>

            <div className="p-3 bg-[#121517] rounded border border-[#22272C] text-xs font-mono space-y-1.5">
              <div className="text-[#8A9099] uppercase text-[10px]">Bridge Health</div>
              <div className="flex items-center gap-2 text-[#34D399]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                Ready (Buffered In-Memory Storage Active)
              </div>
              {syncStatus && (
                <div className="text-[11px] text-[#FBBF24] pt-1 border-t border-[#22272C]">
                  {syncStatus}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Live Event Stream Table */}
        <section className="bg-[#181B1F] rounded border border-[#2A2E33] overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-[#2A2E33] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-white">Live Event Ledger</h3>
              <p className="text-xs text-[#8A9099]">All telemetry events dispatched during this visitor session</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'page_view', 'assessment_started', 'patient_details_submitted', 'question_answered', 'assessment_completed', 'consultation_booked'].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded transition ${
                    selectedFilter === f
                      ? 'bg-[#323840] text-white font-semibold'
                      : 'bg-[#22272C] text-[#8A9099] hover:text-[#D0D4D9]'
                  }`}
                >
                  {f} {eventTypeCounts[f] ? `(${eventTypeCounts[f]})` : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#14171A] text-[#8A9099] uppercase text-[10px] border-b border-[#2A2E33]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Visitor / Session</th>
                  <th className="py-3 px-4">Payload Attributes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22272C] text-[#C2C7CC]">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#5A6069] text-xs">
                      No matching events recorded yet. Navigate through the assessment to see real-time updates.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.slice(0, 50).map(e => (
                    <tr key={e.event_id} className="hover:bg-[#1C2025] transition-colors">
                      <td className="py-2.5 px-4 text-[#8A9099] whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                          e.event_name === 'consultation_booked'
                            ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30'
                            : e.event_name === 'assessment_completed'
                            ? 'bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30'
                            : e.event_name === 'patient_details_submitted'
                            ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30'
                            : 'bg-[#22272C] text-[#A0A6AD]'
                        }`}>
                          {e.event_name}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[#757D87] whitespace-nowrap">
                        {e.visitor_id.slice(0, 10)}...
                      </td>
                      <td className="py-2.5 px-4 text-[#9BA2AB] truncate max-w-md">
                        {JSON.stringify(e.properties)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};
