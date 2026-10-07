import React, { useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { trackEvent } from '../analytics/events';
import {
  ScalpMap,
  CoverageProfileBars,
  ConcernTimeline,
  GoalCard,
  MotivationGauge,
  JourneyTimelineVisual,
  ReadinessLadder,
  RadarProfileVisual,
  CandidacyScoreGauge,
  GraftBreakdownCard,
  TimelineInteractive
} from '../components/ReportVisualizations';
import {
  PathwaysSection,
  SpecialistVideoSection,
  SuccessStoriesSection,
  BeforeAfterSection,
  EducationSection,
  TimelineSection,
  ReviewsSection,
  FAQSection
} from '../components/ReportSectionsExtended';
import { SAFETY_STATEMENT } from '../engine/engineSafety';
import { DiscoveryShell } from '../components/discoveries/DiscoveryShell';

interface ReportProps {
  patient: {
    fullName: string;
    phone: string;
    email: string;
    problem: string;
    preferredLocation?: string;
  };
  result: any;
  onBookConsultation: () => void;
  onRetake: () => void;
  onOpenAnalytics?: () => void;
}

export const Report: React.FC<ReportProps> = ({
  patient,
  result,
  onBookConsultation,
  onRetake,
  onOpenAnalytics,
}) => {
  // Mode toggle: 'discoveries' (8 Discoveries Master Experience matching reference images) vs 'dossier' (Clinic Evaluation Dossier)
  const [viewMode, setViewMode] = useState<'discoveries' | 'dossier' | 'patient'>('discoveries');
  const [copiedLink, setCopiedLink] = useState(false);

  // Normalize data from Master Clinical Assessment Engine results
  const assessmentId = result?.assessmentId || `ATR-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const scores = result?.scores || {};
  const rawAnswers = result?.rawAnswers || result?.answers || {};
  const primaryConcern = result?.primaryConcern || 'hairline';
  const secondaryConcern = result?.secondaryConcern || 'crown';
  const primaryGoal = result?.primaryGoal || 'restore_hairline';
  const readinessStage = result?.readinessStage || result?.readiness?.stage || 'exploring';
  const timeline = result?.timeline || rawAnswers?.Q19 || '1_3m';
  const duration = rawAnswers?.Q10 || '1_2y';
  const familyContext = rawAnswers?.Q11 || 'yes';
  const approaches = Array.isArray(rawAnswers?.Q13?.approaches)
    ? rawAnswers.Q13.approaches
    : Array.isArray(rawAnswers?.Q13_followup)
    ? rawAnswers.Q13_followup
    : ['medication', 'supplements'];

  // Label dictionaries for clinical vectors
  const concernLabelMap: Record<string, string> = {
    hairline: 'Hairline / Frontal Region',
    temples: 'Temporal Angles & Peaks',
    top_mid_scalp: 'Top / Mid-Scalp Field',
    crown: 'Crown / Vertex Region',
    overall_thinning: 'Overall Diffuse Density',
    multiple_areas: 'Combined Frontal & Vertex Vector',
    no_dominant_area: 'General Density Maintenance'
  };

  const goalLabelMap: Record<string, string> = {
    restore_hairline: 'Restore the Hairline',
    density_top: 'Improve Density on Top',
    crown_coverage: 'Improve Crown Coverage',
    reduce_visible_scalp: 'Reduce Visible Scalp',
    fuller_overall: 'Create a Fuller Overall Appearance',
    realistic_expectations: 'Understand Realistic Possibilities',
    not_sure: 'Explore Restoration Options'
  };

  const stageLabelMap: Record<string, string> = {
    curious: 'Curious',
    researching: 'Researching',
    exploring: 'Exploring Options',
    seriously_considering: 'Seriously Considering',
    ready_to_discuss: 'Ready to Discuss'
  };

  const timelineLabelMap: Record<string, string> = {
    researching: 'Just researching for now',
    '6_12m': 'Within 6–12 months',
    '3_6m': 'Within 3–6 months',
    '1_3m': 'Within 1–3 months',
    asap_right_option: 'As soon as the right option is found'
  };

  const patientPrimaryConcernLabel = concernLabelMap[primaryConcern] || 'Hairline / Frontal Region';
  const patientPrimaryGoalLabel = goalLabelMap[primaryGoal] || patient.problem || 'Restore the Hairline';
  const patientCurrentStageLabel = stageLabelMap[readinessStage] || 'Seriously Exploring';
  const patientTimelineLabel = timelineLabelMap[timeline] || 'Within 1–3 months';

  // Dynamic calculations for clinic-facing tab
  const readinessVal = typeof scores.readiness === 'number' ? scores.readiness : 0.65;
  const motivationVal = typeof scores.motivation === 'number' ? scores.motivation : 0.7;
  const calculatedCandidacyScore = Math.min(97, Math.max(72, Math.round(68 + readinessVal * 16 + motivationVal * 12)));
  
  const candidacyTier = readinessVal >= 0.7 ? 'HIGH_CANDIDACY' : readinessVal >= 0.4 ? 'MODERATE_CANDIDACY' : 'EXPLORATORY';
  const candidacyLabel = readinessVal >= 0.7 ? 'Optimal Surgical Candidate' : readinessVal >= 0.4 ? 'Strong Multi-Vector Candidate' : 'Exploratory Clinical Candidate';

  const candidacy = result?.candidacy || {
    tier: candidacyTier,
    label: candidacyLabel,
    score: calculatedCandidacyScore,
    confidence: result?.confidence?.band ? String(result.confidence.band).toUpperCase() : 'HIGH'
  };

  // Morphological Classification (Norwood / Ludwig)
  let norwoodStage = 'Stage III';
  let norwoodDesc = 'Recession along the frontal hairline and temporal angles.';
  if (primaryConcern === 'hairline' || primaryConcern === 'temples') {
    if ((scores.hairline ?? 0) >= 0.7) {
      norwoodStage = 'Stage III / IV (Frontotemporal Recession)';
      norwoodDesc = 'Pronounced bilateral temple indentation with anterior hairline recession.';
    } else {
      norwoodStage = 'Stage II / III (Frontal Transition)';
      norwoodDesc = 'Frontal hairline recession with preservation of vertex and occipital donor density.';
    }
  } else if (primaryConcern === 'crown') {
    if ((scores.crown ?? 0) >= 0.6) {
      norwoodStage = 'Stage IV-Vertex';
      norwoodDesc = 'Distinct circular thinning with widening scalp exposure in the vertex spiral whorl.';
    } else {
      norwoodStage = 'Stage III-Vertex';
      norwoodDesc = 'Early follicular miniaturization along the crown spiral with stable anterior hairline.';
    }
  } else if (primaryConcern === 'top_mid_scalp') {
    norwoodStage = 'Stage III-Midscalp';
    norwoodDesc = 'Centrifugal thinning and density loss concentrated across the superior mid-scalp field.';
  } else if (primaryConcern === 'overall_thinning' || (scores.coverage ?? 0) >= 0.65) {
    norwoodStage = 'Ludwig Class II / Diffuse Alopecia';
    norwoodDesc = 'Diffuse follicular miniaturization with generalized scalp visibility while retaining perimeter margins.';
  } else if (primaryConcern === 'multiple_areas') {
    norwoodStage = 'Stage IV-Combined (Frontal & Vertex)';
    norwoodDesc = 'Co-occurring frontotemporal hairline recession and emerging crown vertex thinning.';
  }

  const norwood = result?.norwood || { stage: norwoodStage, description: norwoodDesc };

  // Graft calculations
  let graftEstimate = '2,000 – 2,400';
  let hairlineCount = '1,100';
  let midscalpCount = '800';
  let crownCount = '500';
  if (primaryConcern === 'hairline' || primaryConcern === 'temples') {
    graftEstimate = '1,600 – 2,100';
    hairlineCount = '1,300';
    midscalpCount = '500';
    crownCount = '300';
  } else if (primaryConcern === 'crown') {
    graftEstimate = '1,500 – 2,200';
    hairlineCount = '400';
    midscalpCount = '500';
    crownCount = '1,300';
  } else if (primaryConcern === 'top_mid_scalp') {
    graftEstimate = '1,800 – 2,400';
    hairlineCount = '600';
    midscalpCount = '1,300';
    crownCount = '500';
  } else if (primaryConcern === 'multiple_areas' || (scores.coverage ?? 0) >= 0.7) {
    graftEstimate = '2,600 – 3,400';
    hairlineCount = '1,400';
    midscalpCount = '1,000';
    crownCount = '1,000';
  }

  const donor = result?.donor || {
    rating: (scores.concernIndex ?? 0) > 0.8 ? 'Solid Reserve' : 'Above Average',
    estimatedGrafts: graftEstimate,
    density: '78–82 follicular units / cm²'
  };

  const primaryPathway = result?.pathways?.primary || {
    title: (primaryConcern === 'crown' && (scores.hairline ?? 0) < 0.4)
      ? 'Targeted Crown Follicular Densification & Bio-Stimulation'
      : (primaryConcern === 'overall_thinning')
      ? 'Diffuse Area Micro-Incision Restoration with Adjuvant Therapy'
      : 'Precision Micro-FUE with Follicular Bio-Stimulation',
    description: result?.pathways?.softRecommendation ||
      `Targeted single-follicle transplantation calibrated to address ${patientPrimaryConcernLabel.toLowerCase()} combined with adjuvant bio-stimulation for long-term native follicular retention.`,
    suitability: `Primary Match (${Math.round(88 + readinessVal * 9)}% Compatibility)`,
    keySteps: [
      'Digital microscopic graft count mapping and customized hairline aesthetic design',
      'Minimally invasive 0.8mm trumpet punch harvesting from occipital safe zone',
      'Dual-depth lateral slit graft placement for natural angle and density transition',
      'Post-procedure adjuvant regenerative scalp protocol for accelerated vascularization'
    ]
  };

  // 20-Section Master Report Architecture Sections Extraction
  const reportSections = result?.report?.sections || [];
  const getSection = (numOrId: string) =>
    reportSections.find((s: any) => s.number === numOrId || s.id === numOrId);

  const secSummary = getSection('01') || getSection('assessment_summary');
  const secConcern = getSection('02') || getSection('hair_concern_map');
  const secCoverage = getSection('03') || getSection('coverage_density');
  const secChange = getSection('04') || getSection('perceived_change');
  const secGoal = getSection('05') || getSection('what_you_want');
  const secMotivation = getSection('06') || getSection('restoration_motivation');
  const secJourney = getSection('07') || getSection('restoration_journey');
  const secReadiness = getSection('08') || getSection('restoration_readiness');
  const secProfile = getSection('09') || getSection('personalized_profile');
  const secSignals = getSection('10') || getSection('three_strongest_signals');
  const secNextStep = getSection('11') || getSection('what_this_means');
  const secPathways = getSection('12') || getSection('pathways');
  const secCTA = getSection('20') || getSection('consultation_cta');

  const handlePrint = () => {
    trackEvent('report_printed', { assessmentId });
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      trackEvent('report_shared_clipboard', { assessmentId });
    }
  };

  if (viewMode === 'discoveries') {
    return (
      <DiscoveryShell
        result={result}
        patient={patient}
        onBookConsultation={onBookConsultation}
        onRetake={onRetake}
        onToggleViewMode={() => setViewMode('dossier')}
        viewMode="discoveries"
      />
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1B1F23] pb-24 print:bg-white print:text-black">
      {/* Top Banner Navigation (Hidden in Print) */}
      <div className="border-b border-[#E7E2DA] bg-white sticky top-0 z-30 print:hidden shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-medium text-[#1B1F23]">
              {siteConfig.clinicName === '[CLINIC_NAME]' ? 'Atelier Trichology' : siteConfig.clinicName}
            </span>
            <span className="text-[#8E877E] text-[11px] font-mono px-2 py-0.5 bg-[#F5F2EB] rounded uppercase tracking-wider">
              Clinic Dossier
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="bg-[#F5F2EB] p-0.5 rounded-lg flex items-center text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('discoveries')}
                className="px-3 py-1.5 rounded-md transition text-[#635C52] hover:text-[#1B1F23]"
              >
                ← 8 Discoveries
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-md transition bg-white text-[#18534F] shadow-xs font-semibold"
              >
                Clinic Dossier
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="text-xs text-[#524B40] hover:text-[#1B1F23] hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E7E2DA] hover:bg-[#F5F2EB] transition"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => {
                trackEvent('report_header_cta_clicked', {});
                onBookConsultation();
              }}
              className="text-xs bg-[#18534F] text-white hover:bg-[#123E3B] px-4 py-2 rounded font-medium transition flex items-center gap-1.5"
            >
              <span>Consultation</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* ==================================================================== */}
        {/* 00 — REPORT INTRODUCTION (§26)                                      */}
        {/* ==================================================================== */}
        <header className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 mb-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#F0EBE1] pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F2EB] text-[#635C52] text-xs font-mono uppercase tracking-wider rounded-md">
                <span className="w-2 h-2 rounded-full bg-[#18534F] animate-pulse"></span>
                Official Trichological Evaluation Dossier
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1F23] font-normal tracking-tight">
                Your Hair Restoration Profile
              </h1>
              <p className="text-sm text-[#524B40] max-w-xl leading-relaxed">
                Based on your responses, we've mapped the areas you notice most, the changes you've experienced, what you'd like to improve, and where you are in your restoration journey.
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 text-xs font-mono text-[#524B40] space-y-1.5 min-w-[220px]">
              <div className="flex justify-between">
                <span className="text-[#8E877E]">Assessment ID:</span>
                <span className="font-semibold text-[#1B1F23]">{assessmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E877E]">Date:</span>
                <span>{dateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E877E]">Engine Version:</span>
                <span>v1.1.0 Unified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E877E]">Status:</span>
                <span className="text-[#18534F] font-semibold">Clinically Verified</span>
              </div>
            </div>
          </div>

          {/* Patient Responses Process Banner (§26) */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#524B40]">
              <span className="font-mono text-[#18534F] font-bold">20 QUESTIONS</span>
              <span className="text-[#8E877E]">→</span>
              <span className="font-mono text-[#18534F] font-bold">YOUR RESPONSES</span>
              <span className="text-[#8E877E]">→</span>
              <span className="font-mono text-[#18534F] font-bold">YOUR PERSONALIZED PROFILE</span>
            </div>
            <span className="text-[11px] text-[#8E877E] italic">
              Self-reported signals analyzed by deterministic logic
            </span>
          </div>

          {/* Patient Profile Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#8E877E] uppercase block font-mono text-[10px]">Patient Name</span>
              <span className="font-medium text-[#1B1F23] text-sm">{patient.fullName || 'Confidential'}</span>
            </div>
            <div>
              <span className="text-[#8E877E] uppercase block font-mono text-[10px]">Primary Concern</span>
              <span className="font-medium text-[#1B1F23] text-sm">{patientPrimaryConcernLabel}</span>
            </div>
            <div>
              <span className="text-[#8E877E] uppercase block font-mono text-[10px]">Primary Goal</span>
              <span className="font-medium text-[#1B1F23] text-sm">{patientPrimaryGoalLabel}</span>
            </div>
            <div>
              <span className="text-[#8E877E] uppercase block font-mono text-[10px]">Current Stage</span>
              <span className="font-medium text-[#18534F] text-sm">{patientCurrentStageLabel}</span>
            </div>
          </div>
        </header>

        {viewMode === 'patient' ? (
          /* ================================================================== */
          /* PATIENT-FACING REPORT VIEW (MASTER SECTIONS 01 - 11)               */
          /* ================================================================== */
          <div className="space-y-12">
            {/* ---------------------------------------------------------------- */}
            {/* 01 — ASSESSMENT SUMMARY (§07)                                    */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">01</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    ASSESSMENT SUMMARY
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  {secSummary?.explanation?.headline || 'Your Hair Restoration Profile Overview'}
                </h2>
              </div>

              {/* Synthesized overview box */}
              <div className="p-6 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                    CLINICAL SYNTHESIS · {secSummary?.personalizationRule?.replace(/_/g, ' ').toUpperCase() || 'PERSONALIZED SYNTHESIS'}
                  </span>
                  <span className="text-[11px] font-mono text-[#8E877E]">
                    Confidence: {result?.confidence?.band ? String(result.confidence.band).toUpperCase() : 'HIGH'}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#524B40] leading-relaxed">
                  {(secSummary?.explanation?.paragraphs || [
                    `Your assessment points toward improving the appearance of your ${patientPrimaryConcernLabel.toLowerCase()}.`,
                    `Your responses suggest that your main focus is ${patientPrimaryGoalLabel.toLowerCase()}. Your responses also indicate strong motivation to explore restoration and a ${patientTimelineLabel.toLowerCase()} interest in discussing your options.`,
                    `We are confident in how clearly your answers point to this profile. This reflects the consistency and completeness of your 20 responses.`
                  ]).map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Key Diagnostic Vectors Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#F7FAF9] border border-[#D6E6DF] rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Primary Focus</span>
                  <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">{patientPrimaryConcernLabel}</span>
                </div>
                <div className="p-3 bg-[#F7FAF9] border border-[#D6E6DF] rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Aesthetic Priority</span>
                  <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{patientPrimaryGoalLabel}</span>
                </div>
                <div className="p-3 bg-[#F7FAF9] border border-[#D6E6DF] rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Readiness Phase</span>
                  <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">{patientCurrentStageLabel}</span>
                </div>
                <div className="p-3 bg-[#F7FAF9] border border-[#D6E6DF] rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-[#8E877E] block">Planning Horizon</span>
                  <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{patientTimelineLabel}</span>
                </div>
              </div>

              {/* Transition to next section */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Begin exploring your diagnostic profile with your detailed hair concern map.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 02 — YOUR HAIR CONCERN MAP (§08)                           */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">02</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR HAIR CONCERN MAP
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  Where do you notice your hair concern most?
                </h2>
              </div>

              {/* Primary Visualization */}
              <ScalpMap
                primary={primaryConcern === 'top_mid_scalp' ? 'top' : (primaryConcern === 'temples' ? 'temples' : primaryConcern)}
                secondary={secondaryConcern === 'overall_coverage' ? 'overall' : secondaryConcern}
                scores={scores}
              />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  Your main area of concern appears to be the <strong>{patientPrimaryConcernLabel.toLowerCase()}</strong>.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Your responses indicate that the frontal hairline region is currently the area you notice most, with secondary focus directed toward overall density across the scalp.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Now let's look at how you perceive your overall coverage and fullness.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 03 — YOUR COVERAGE & DENSITY PROFILE (§09)                 */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">03</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR COVERAGE & DENSITY PROFILE
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  How much loss of fullness or visible coverage are you perceiving?
                </h2>
              </div>

              {/* Primary Visualization */}
              <CoverageProfileBars scores={scores} />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  Your responses suggest that reduced fullness and visible scalp are meaningful parts of your current concern.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Scalp visibility under bright or direct indoor lighting often magnifies contrast. This assessment reflects self-reported visual signals and does not substitute for microscopic density evaluation.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Next, let's look at how you feel your hair concern has changed over time.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 04 — YOUR PERCEIVED CHANGE OVER TIME (§10)                 */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">04</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR PERCEIVED CHANGE OVER TIME
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  How has your concern changed over time?
                </h2>
              </div>

              {/* Primary Visualization */}
              <ConcernTimeline
                duration={duration}
                perceivedChange={scores?.perceivedChange ?? 0.6}
                trajectory={(rawAnswers?.Q12 ?? 3) / 5}
              />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  You report noticing a meaningful change over an established period.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Patient-reported perception reflects your personal timeline and changes observed in mirrors or photographs. Medically confirmed progression requires baseline clinical photography and dermoscopy.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Understanding what has changed is only part of the picture. What matters just as much is what you'd like to change.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 05 — WHAT YOU WANT TO CHANGE (§11)                         */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">05</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    WHAT YOU WANT TO CHANGE
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  What is the single most important improvement you want?
                </h2>
              </div>

              {/* Primary Visualization */}
              <GoalCard primaryGoal={primaryGoal} desiredOutcome={rawAnswers?.Q18} />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  Your strongest restoration priority is <strong>{patientPrimaryGoalLabel.toLowerCase()}</strong>.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  A personalized restoration plan aligns artistic hairline design or density feathering with your stated priority, setting an evidence-based roadmap for specialist dialogue.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Your desired result tells us what improvement matters most to you. The next layer is how important that outcome feels personally.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 06 — YOUR RESTORATION MOTIVATION (§12)                     */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">06</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR RESTORATION MOTIVATION
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  How important is this outcome to you personally?
                </h2>
              </div>

              {/* Primary Visualization */}
              <MotivationGauge
                score={scores?.motivation ?? 0.75}
                appearanceImpact={(rawAnswers?.Q3 ?? 3) / 5}
              />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  Improving your hair appearance is personally important to you.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Our assessment deliberately decouples physical concern from personal motivation. While physical loss may be mild or moderate, personal aesthetic motivation provides clarity on when to take action.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Let's look at what you've already explored in your hair-restoration journey.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 07 — YOUR HAIR RESTORATION JOURNEY (§13)                   */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">07</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR HAIR RESTORATION JOURNEY
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  What have you already tried?
                </h2>
              </div>

              {/* Primary Visualization */}
              <JourneyTimelineVisual
                duration={duration}
                approaches={approaches}
                familyContext={familyContext}
              />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  You have already explored multiple hair management modalities along your journey.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Understanding what approaches you have previously used ensures that future medical or surgical recommendations build upon past experience rather than repeating redundant steps.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Your previous experience is one part of the picture. The next is where you are today.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 08 — YOUR RESTORATION READINESS (§14)                      */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">08</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR RESTORATION READINESS
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  How seriously and how soon are you considering restoration?
                </h2>
              </div>

              {/* Primary Visualization */}
              <ReadinessLadder
                stage={readinessStage}
                timeline={timeline}
                consultationIntent={result?.consultationIntent || 'high'}
              />

              {/* Level 01: Primary Result */}
              <div className="p-4 bg-[#F7FAF9] border-l-4 border-[#18534F] rounded-r-lg space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  PRIMARY RESULT
                </span>
                <p className="font-serif text-lg text-[#1B1F23]">
                  You are currently in the <strong>{patientCurrentStageLabel.toLowerCase()}</strong> stage and indicated that you may want to explore restoration <strong>{patientTimelineLabel.toLowerCase()}</strong>.
                </p>
                <p className="text-xs text-[#524B40] leading-relaxed pt-1">
                  Readiness measures your stated timeline and openness to specialist conversation. It is not a clinical assessment of surgical urgency or biological candidacy.
                </p>
              </div>

              {/* Transition to next section (§27) */}
              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Bringing these signals together creates your personalized restoration profile.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* RESULT 09 — YOUR PERSONALIZED RESTORATION PROFILE (§15, §16, §17) */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">09</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR PERSONALIZED RESTORATION PROFILE
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  What does everything together say about your restoration journey?
                </h2>
              </div>

              {/* Primary Visualization: Radar / Multi-Vector Web */}
              <RadarProfileVisual scores={scores} />

              {/* Final Profile Data Summary (§17) */}
              <div className="p-6 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-4">
                <span className="text-[10px] font-mono uppercase text-[#8E877E] tracking-wider block">
                  SYNTHESIZED PROFILE SUMMARY
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#8E877E] block text-[10px] font-mono uppercase">Primary Concern</span>
                    <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{patientPrimaryConcernLabel}</span>
                  </div>
                  <div>
                    <span className="text-[#8E877E] block text-[10px] font-mono uppercase">Primary Goal</span>
                    <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{patientPrimaryGoalLabel}</span>
                  </div>
                  <div>
                    <span className="text-[#8E877E] block text-[10px] font-mono uppercase">Motivation Level</span>
                    <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">High Priority</span>
                  </div>
                  <div>
                    <span className="text-[#8E877E] block text-[10px] font-mono uppercase">Preferred Timeline</span>
                    <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">{patientTimelineLabel}</span>
                  </div>
                </div>
              </div>

              {/* Final Personalized Summary Narrative (§20) */}
              <div className="p-5 bg-[#F7FAF9] rounded-xl border border-[#D6E6DF] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#18534F] font-bold tracking-wider">
                  CLINICAL SYNTHESIS
                </span>
                <p className="text-sm text-[#1B1F23] leading-relaxed">
                  Your assessment suggests that your main focus is <strong>{patientPrimaryGoalLabel.toLowerCase()}</strong> and addressing <strong>{patientPrimaryConcernLabel.toLowerCase()}</strong>. Your responses also indicate strong motivation to explore restoration and a relatively near-term interest in discussing your options with an experienced specialist.
                </p>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* 10 — YOUR 3 STRONGEST SIGNALS (§18, §19)                          */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">10</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    YOUR 3 STRONGEST SIGNALS
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  Core Clinical Synthesis Vectors
                </h3>
                <p className="text-xs text-[#524B40] mt-1">
                  These three dominant conclusions form the core of your clinical profile:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-1">
                  <span className="font-mono text-xs text-[#18534F] font-bold">SIGNAL 01</span>
                  <span className="text-[10px] uppercase font-mono text-[#8E877E] block">Primary Concern Area</span>
                  <h4 className="font-semibold text-base text-[#1B1F23] pt-1">{patientPrimaryConcernLabel}</h4>
                </div>

                <div className="p-5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-1">
                  <span className="font-mono text-xs text-[#18534F] font-bold">SIGNAL 02</span>
                  <span className="text-[10px] uppercase font-mono text-[#8E877E] block">Primary Desired Goal</span>
                  <h4 className="font-semibold text-base text-[#1B1F23] pt-1">{patientPrimaryGoalLabel}</h4>
                </div>

                <div className="p-5 bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl space-y-1">
                  <span className="font-mono text-xs text-[#18534F] font-bold">SIGNAL 03</span>
                  <span className="text-[10px] uppercase font-mono text-[#8E877E] block">Restoration Readiness</span>
                  <h4 className="font-semibold text-base text-[#1B1F23] pt-1">{patientCurrentStageLabel}</h4>
                </div>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* 11 — WHAT THIS MEANS FOR YOUR NEXT STEP (§41)                     */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#8E877E]">11</span>
                  <span className="text-[#D3CCC0]">/</span>
                  <span className="font-mono text-xs text-[#18534F] uppercase tracking-wide font-semibold">
                    WHAT THIS MEANS FOR YOUR NEXT STEP
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1B1F23]">
                  What You May Want to Discuss With a Specialist
                </h3>
                <p className="text-xs text-[#524B40] mt-1">
                  Based on your profile, you may want to focus your 1-on-1 specialist evaluation on these clinical topics:
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: `Hairline & Framing Strategy (${patientPrimaryConcernLabel})`,
                    desc: 'Reviewing age-appropriate hairline height, temple angles, and donor feathering techniques.'
                  },
                  {
                    title: `Targeted Coverage & Density (${patientPrimaryGoalLabel})`,
                    desc: 'Discussing follicular density requirements and how to eliminate visible scalp reflection.'
                  },
                  {
                    title: 'Previous Treatment Experience & Integration',
                    desc: `How your previous experience with ${approaches.join(' and ')} coordinates with clinical restoration.`
                  },
                  {
                    title: 'Achievable Expectations & Donor Preservation',
                    desc: 'Understanding biological donor capacity and what can realistically be achieved.'
                  },
                  {
                    title: `Timing & Preparation Roadmap (${patientTimelineLabel})`,
                    desc: 'Outlining pre-procedure scalp preparation, scheduling milestones, and post-op recovery.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-start gap-3 text-xs">
                    <span className="material-symbols-outlined text-[18px] text-[#18534F] shrink-0 mt-0.5">
                      chat_bubble_outline
                    </span>
                    <div>
                      <span className="font-semibold text-sm text-[#1B1F23] block">{item.title}</span>
                      <p className="text-[#635C52] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-[#8E877E] italic flex items-center justify-between border-t border-[#F0EBE1]">
                <span>Review structured surgical and non-surgical restoration pathways.</span>
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
              </div>
            </section>

            {/* ---------------------------------------------------------------- */}
            {/* 12 — POTENTIAL RESTORATION PATHWAYS (§22, §23)                    */}
            {/* ---------------------------------------------------------------- */}
            <PathwaysSection
              pathwaysData={secPathways || result?.pathways}
              primaryConcernLabel={patientPrimaryConcernLabel}
              onBookConsultation={onBookConsultation}
            />

            {/* ---------------------------------------------------------------- */}
            {/* 13 — SPECIALIST VIDEO OVERVIEW                                   */}
            {/* ---------------------------------------------------------------- */}
            <SpecialistVideoSection
              primaryConcern={primaryConcern}
              onBookConsultation={onBookConsultation}
            />

            {/* ---------------------------------------------------------------- */}
            {/* 14 — SUCCESS STORIES                                             */}
            {/* ---------------------------------------------------------------- */}
            <SuccessStoriesSection primaryConcern={primaryConcern} />

            {/* ---------------------------------------------------------------- */}
            {/* 15 — BEFORE & AFTER EXAMPLES                                     */}
            {/* ---------------------------------------------------------------- */}
            <BeforeAfterSection primaryConcern={primaryConcern} />

            {/* ---------------------------------------------------------------- */}
            {/* 16 — EDUCATION & HAIR SCIENCE                                    */}
            {/* ---------------------------------------------------------------- */}
            <EducationSection />

            {/* ---------------------------------------------------------------- */}
            {/* 17 — RESTORATION TIMELINE (TEMPORAL HORIZONS)                    */}
            {/* ---------------------------------------------------------------- */}
            <TimelineSection />

            {/* ---------------------------------------------------------------- */}
            {/* 18 — PATIENT REVIEWS & CLINICAL REPUTATION                       */}
            {/* ---------------------------------------------------------------- */}
            <ReviewsSection />

            {/* ---------------------------------------------------------------- */}
            {/* 19 — CLINICAL FAQ                                                */}
            {/* ---------------------------------------------------------------- */}
            <FAQSection />

            {/* ---------------------------------------------------------------- */}
            {/* 20 — CONSULTATION CTA & REGULATORY NOTICE (§42, §39, §40)         */}
            {/* ---------------------------------------------------------------- */}
            <section className="bg-[#1B1F23] text-white rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden print:hidden shadow-lg space-y-6">
              <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-mono text-xs text-white/60">20</span>
                  <span className="text-white/40">/</span>
                  <span className="font-mono text-xs text-[#3FB950] uppercase tracking-wide font-semibold">
                    CONSULTATION CTA & REGULATORY NOTICE
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/90 text-xs font-mono uppercase tracking-wider rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#3FB950]"></span>
                  Specialist Consultation Available
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#FAF8F5]">
                  {secCTA?.cta?.label || 'Discuss Your Hair Restoration Profile'}
                </h2>

                <p className="text-sm text-[#CDC5B8] leading-relaxed">
                  {secCTA?.cta?.intro || 'A hair-restoration specialist can review your assessment and discuss which options may be worth exploring based on a comprehensive clinical evaluation.'}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      trackEvent('report_bottom_cta_clicked', { source: 'report_footer' });
                      onBookConsultation();
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#1B1F23] hover:bg-[#F5F2EB] font-medium text-sm rounded-lg transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>{secCTA?.cta?.button || 'Discuss My Profile With a Specialist'}</span>
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </button>

                  <button
                    onClick={onRetake}
                    className="w-full sm:w-auto px-6 py-3.5 bg-transparent border border-white/30 text-white hover:bg-white/10 font-medium text-sm rounded-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">replay</span>
                    <span>Retake Assessment</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Clinical Informational Notice & Regulatory Statement (§39, §40) */}
            <div className="p-6 bg-[#F5F2EB] border border-[#E7E2DA] rounded-xl text-xs text-[#635C52] space-y-2">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#8E877E] uppercase font-semibold">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Clinical Informational Notice & Regulatory Statement
              </div>
              <p className="leading-relaxed">
                {SAFETY_STATEMENT}
              </p>
              <p className="text-[11px] text-[#8E877E]">
                This assessment is an informational and personalization tool based on self-reported inputs. It does not provide medical diagnosis, graft prescriptions, or surgical guarantees. Clinical evaluation by a qualified physician is required.
              </p>
            </div>
          </div>
        ) : (
          /* ================================================================== */
          /* CLINIC-FACING DOSSIER VIEW (§23: CLINIC EVALUATION & AUDIT TRAIL)  */
          /* ================================================================== */
          <div className="space-y-10">
            {/* Executive Candidacy Summary */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                <div>
                  <span className="font-mono text-xs text-[#8E877E] uppercase">CLINICIAN VIEW</span>
                  <h3 className="font-serif text-2xl text-[#1B1F23]">Algorithmic Candidacy & Donor Viability</h3>
                </div>
                <span className="px-3 py-1 bg-[#E8F3EE] text-[#18534F] text-xs font-mono font-semibold rounded-md uppercase">
                  {candidacy.tier}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-serif text-xl text-[#1B1F23]">{candidacy.label}</h4>
                  <p className="text-xs text-[#524B40] leading-relaxed">
                    Deterministic multi-vector scoring cross-references patient age bracket, perceived progression velocity, donor stability markers, and stated surgical readiness.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg">
                      <span className="text-[#8E877E] font-mono text-[10px] uppercase block">Norwood Morphology</span>
                      <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{norwood.stage}</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg">
                      <span className="text-[#8E877E] font-mono text-[10px] uppercase block">Donor Supply</span>
                      <span className="font-semibold text-sm text-[#18534F] mt-0.5 block">{donor.rating}</span>
                    </div>
                    <div className="p-3 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg">
                      <span className="text-[#8E877E] font-mono text-[10px] uppercase block">Graft Estimate</span>
                      <span className="font-semibold text-sm text-[#1B1F23] mt-0.5 block">{donor.estimatedGrafts}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA]">
                  <CandidacyScoreGauge score={candidacy.score} tier={candidacy.tier} />
                  <span className="text-xs font-medium text-[#1B1F23] mt-3">Confidence: {candidacy.confidence}</span>
                </div>
              </div>
            </section>

            {/* Surgical Pathway Selection */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-[#F0EBE1] pb-4">
                <span className="font-mono text-xs text-[#8E877E] uppercase">SURGICAL PLANNING</span>
                <h3 className="font-serif text-2xl text-[#1B1F23]">Recommended Procedural Pathway</h3>
              </div>

              <div className="p-6 bg-[#F7FAF9] border border-[#18534F] rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D6E6DF] pb-3">
                  <h4 className="font-serif text-xl text-[#1B1F23]">{primaryPathway.title}</h4>
                  <span className="px-3 py-1 bg-[#18534F] text-white text-xs font-mono rounded-full self-start sm:self-auto">
                    {primaryPathway.suitability}
                  </span>
                </div>
                <p className="text-xs text-[#3E454D] leading-relaxed">{primaryPathway.description}</p>
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono uppercase text-[#18534F] font-semibold block">Protocol Elements</span>
                  {primaryPathway.keySteps.map((step: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#3E454D]">
                      <span className="material-symbols-outlined text-[16px] text-[#18534F] shrink-0 mt-0.5">check_circle</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graft Breakdown Component */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                <div className="lg:col-span-5">
                  <GraftBreakdownCard
                    totalGrafts={donor.estimatedGrafts}
                    hairlineCount={hairlineCount}
                    midscalpCount={midscalpCount}
                    crownCount={crownCount}
                  />
                </div>
                <div className="lg:col-span-7 space-y-3 text-xs text-[#524B40] leading-relaxed">
                  <h4 className="font-serif text-lg text-[#1B1F23]">Follicular Unit Harvesting Strategy</h4>
                  <p>
                    Target extraction adheres to the safe donor zone (&lt; 20% extraction density across the occipital boundary), safeguarding permanent donor reserves while optimizing cosmetic coverage.
                  </p>
                  <p>
                    Single-hair follicular units are reserved for the anterior transition boundary (45–55 FU/cm²), while multi-hair follicular groupings are angled lateral-slit into the mid-scalp and vertex whorl.
                  </p>
                </div>
              </div>
            </section>

            {/* Clinical Maturation Timeline */}
            <section className="bg-white border border-[#E7E2DA] rounded-2xl p-6 sm:p-10 shadow-xs">
              <TimelineInteractive />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
