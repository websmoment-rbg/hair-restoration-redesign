import { list, cap, STAGES, 
  VERSIONS, r6, band, stageOf, BAND_LABEL, STAGE_LABEL, confBand,
  QUESTIONS, QUESTION_BY_ID, ALIASES, hash53, normText
} from './engineCore';
import { 
  LOC_SIGNAL_LABEL, GOAL14, GOAL18, GOAL_LABEL, OUTCOME_LABEL, GOAL_CODE,
  GOAL_FAMILY, LOC_FAMILY, GOAL_EXACT_LOC, LOC_SHORT, DURATION_LABEL,
  TIME_LABEL, APPROACH_LABEL, APPROACH_ROWS
} from './engineDefinitions';
import { 
  SAFETY_STATEMENT, APPROACHES_PARAGRAPH, SPECIALIST_CLOSING, TRANSITION,
  INTENT_LANGUAGE, PROHIBITED, validateStatement, safetyScan, collectText
} from './engineSafety';
import { 
  weighted, confidenceOf, statusOf, flagsFor, SUPP_SCHEMA
} from './engineScoring';
import { 
  crossSignalPatterns, detectFlags, computeR1, computeR2, computeR3,
  computeR4, computeR5, computeR6, computeR7, LOC_DEF
} from './engineResults';
import { 
  narrR1, narrR2, narrR3, narrR4, narrR5, narrR6, narrR7, broaden,
  personalize, focusPhrase
} from './engineNarratives';
import {  computePathways } from './enginePathways';

const err = (questionId: string | null, code: string, message: string) => ({ questionId, code, message });

export function parseAnswers(input: any, allowPartial: boolean) {
  const errors: any[] = [];
  const A: Record<string, any> = {};
  if (!input || typeof input !== 'object') return { errors: [err(null, 'invalid_input', 'Input must be an object.')], A };
  if (input.questionnaireVersion !== undefined && input.questionnaireVersion !== VERSIONS.questionnaire)
    errors.push(err(null, 'questionnaire_version_mismatch', `Expected questionnaire ${VERSIONS.questionnaire}, received ${input.questionnaireVersion}.`));
  let raw = input.answers !== undefined ? input.answers : (input.Q1 !== undefined || input.Q8 !== undefined ? input : undefined);
  if (Array.isArray(raw)) {
    const obj: Record<string, any> = {};
    const seen = new Set();
    for (const it of raw) {
      if (!it || typeof it !== 'object' || typeof it.questionId !== 'string') {
        errors.push(err(null, 'invalid_entry', 'Each answer must be {questionId, value}.'));
        continue;
      }
      if (seen.has(it.questionId)) errors.push(err(it.questionId, 'duplicate_answer', 'Duplicate answer for question.'));
      seen.add(it.questionId);
      obj[it.questionId] = it.value;
    }
    raw = obj;
  }
  if (!raw || typeof raw !== 'object') {
    errors.push(err(null, 'invalid_input', 'answers is required.'));
    return { errors, A };
  }
  for (const k of Object.keys(raw)) {
    if (!QUESTION_BY_ID[k] && k !== 'Q13_followup') errors.push(err(k, 'unknown_question', `Unknown question id "${k}".`));
  }

  const scale = (id: string, v: any) => {
    if (typeof v === 'string' && /^\s*\d+\s*$/.test(v)) v = Number(v);
    if (typeof v !== 'number' || !Number.isInteger(v)) {
      errors.push(err(id, 'type_error', `${id} must be an integer 1–5.`));
      return null;
    }
    if (v < 1 || v > 5) {
      errors.push(err(id, 'range_error', `${id} must be between 1 and 5 (received ${v}).`));
      return null;
    }
    return v;
  };

  for (const q of QUESTIONS) {
    const v = raw[q.id];
    const missing = v === undefined || v === null;
    const slot: any = { missing, notSure: false, value: undefined, key: undefined };
    if (missing) {
      if (!allowPartial) errors.push(err(q.id, 'required_missing', `${q.id} is required.`));
    } else if (q.type === 'scale5') {
      const s = scale(q.id, v);
      if (s === null) slot.missing = true;
      else slot.value = s;
    } else if (q.type === 'single') {
      const key = typeof v === 'string' ? (ALIASES[q.id][normText(v)] ?? ALIASES[q.id][v]) : undefined;
      if (!key) {
        errors.push(err(q.id, 'allowed_option_error', `${q.id}: "${v}" is not an allowed option.`));
        slot.missing = true;
      } else {
        slot.key = key;
        slot.notSure = key === 'not_sure';
      }
    } else if (q.type === 'scale5_followup') {
      let level = v;
      let ap = raw.Q13_followup;
      if (typeof v === 'object' && !Array.isArray(v)) {
        level = v.level;
        ap = v.approaches !== undefined ? v.approaches : ap;
      }
      const s = scale(q.id, level);
      if (s === null) slot.missing = true;
      else slot.value = s;
      if (ap !== undefined && ap !== null) {
        if (!Array.isArray(ap)) errors.push(err('Q13', 'type_error', 'Q13 approaches must be an array.'));
        else {
          const keys: string[] = [];
          for (const a of ap) {
            const k = typeof a === 'string' ? (ALIASES.Q13_followup[normText(a)] ?? ALIASES.Q13_followup[a]) : undefined;
            if (!k) errors.push(err('Q13', 'allowed_option_error', `Q13 follow-up: "${a}" is not an allowed option.`));
            else if (!keys.includes(k)) keys.push(k);
          }
          slot.approaches = keys;
        }
      } else if (slot.value === 1) slot.approaches = ['nothing_yet'];
    }
    A[q.id] = slot;
  }
  return { errors, A };
}

export function parseSupplementary(sup: any) {
  const errors: any[] = [];
  const S: Record<string, any> = {};
  const layers = new Set<string>();
  if (sup === undefined || sup === null) return { errors, S, layers: [] };
  if (typeof sup !== 'object' || Array.isArray(sup))
    return { errors: [err(null, 'invalid_supplementary', 'supplementary must be an object.')], S, layers: [] };
  for (const [k, v] of Object.entries(sup)) {
    const d = SUPP_SCHEMA[k];
    if (!d) {
      errors.push(err(k, 'unknown_supplementary_field', `Unknown supplementary field "${k}".`));
      continue;
    }
    if (v === null || v === undefined) continue;
    if (d.t === 'bool' && typeof v !== 'boolean') {
      errors.push(err(k, 'type_error', `${k} must be boolean.`));
      continue;
    }
    if (d.t === 'enum' && !d.v.includes(v)) {
      errors.push(err(k, 'allowed_option_error', `${k} must be one of ${d.v.join(', ')}.`));
      continue;
    }
    if (d.t === 'enumArray' && (!Array.isArray(v) || v.some((x: any) => !d.v.includes(x)))) {
      errors.push(err(k, 'allowed_option_error', `${k} must be an array of ${d.v.join(', ')}.`));
      continue;
    }
    S[k] = v;
    layers.add(d.src === 'clinician' ? 'CLINICIAN_ENTERED' : 'PATIENT_REPORTED_PREFERENCES');
  }
  return { errors, S, layers: [...layers].sort() };
}

export function ctaFor(r7: any, A: Record<string, any>) {
  const q20 = A.Q20.value ?? null;
  const R = r7.score;
  let t = 'lower';
  if (q20 !== null || R !== null) {
    if (q20 === 5 && (R !== null && R >= 0.4)) t = 'very_high';
    else if ((q20 !== null && q20 >= 4 && (R !== null && R >= 0.4)) || ((R !== null && R >= 0.6) && q20 !== null && q20 >= 3) || q20 === 5) t = 'high';
    else if ((q20 !== null && q20 >= 3) || (R !== null && R >= 0.4)) t = 'moderate';
    if (q20 === 1) t = 'lower';
    else if (q20 === 2 && (t === 'high' || t === 'very_high')) t = 'moderate';
    if (r7.stageSuppressed && (t === 'high' || t === 'very_high')) t = 'moderate';
  }
  const M: Record<string, any> = {
    lower: { label: 'Continue Exploring', button: 'Continue Exploring', intro: 'Take your time. You can revisit your profile whenever you like, and a specialist is available if and when you want to talk.' },
    moderate: { label: 'Learn More About Your Options', button: 'Learn More', intro: 'If you would like to understand what restoration could involve, you can learn more about the options a specialist may discuss with you.' },
    high: { label: 'Discuss Your Profile With a Specialist', button: 'Discuss My Profile', intro: 'A hair-restoration specialist can review your assessment and discuss which options may be worth exploring based on a clinical evaluation.' },
    very_high: { label: 'Speak With a Hair-Restoration Specialist', button: 'Speak With a Specialist', intro: 'You said you would like to speak with someone. A hair-restoration specialist can review your assessment and talk through which options may be worth exploring based on a clinical evaluation.' },
  };
  return { tier: t, ...M[t] };
}

export function classifyPatterns(c: any) {
  const p: string[] = [];
  const { r1, r2, r5, r6, r7 } = c;
  if (r1.primary && ['hairline', 'temples'].includes(r1.primary) && r1.dominance !== 'none') p.push('FRONTAL-FOCUSED CONCERN');
  if (r1.primary === 'crown' && r1.dominance !== 'none') p.push('CROWN-FOCUSED CONCERN');
  if (r1.primary === 'overall' || ((r2.score !== null && r2.score >= 0.7) && r1.locations.overall.score !== null && r1.locations.overall.score >= 0.6)) p.push('DIFFUSE COVERAGE CONCERN');
  const strong = (r1.ranking || []).filter((i: string) => r1.locations[i].score >= 0.6);
  if (r1.multiAreaFlag || r1.unresolved || strong.length >= 2) p.push('MULTI-AREA CONCERN');
  if ((r5.score !== null && r5.score >= 0.7) && (r7.score !== null && r7.score >= 0.6) && c.goalSpecific) p.push('RESTORATION-FOCUSED');
  else if (r7.score !== null && r7.score < 0.6) p.push('EXPLORATION-FOCUSED');
  if (r5.score !== null && r5.score >= 0.7) p.push('HIGH-MOTIVATION');
  if (r7.score !== null && r7.score >= 0.7) p.push('HIGH-READINESS');
  if (['newly_concerned', 'early_explorer'].includes(r6.journeyStage)) p.push('EARLY-JOURNEY');
  if (r6.treatmentExperience !== null && r6.treatmentExperience >= 0.7) p.push('EXTENSIVE-EXPLORATION');
  return p;
}

export function matrixOf(concern: number, motivation: number | null, readiness: number | null) {
  const t = [
    concern >= 0.7 ? 'high' : concern >= 0.5 ? 'moderate' : 'low',
    motivation !== null ? (motivation >= 0.7 ? 'high' : motivation >= 0.5 ? 'moderate' : 'low') : null,
    readiness !== null ? (readiness >= 0.7 ? 'high' : readiness >= 0.5 ? 'moderate' : 'low') : null
  ];
  const parts: string[] = [];
  if (t[0]) parts.push({ high: 'a strong perceived concern', moderate: 'a moderate perceived concern', low: 'a lower perceived concern' }[t[0]]);
  if (t[1]) parts.push({ high: 'high personal importance on improving your hair', moderate: 'moderate personal importance on improving your hair', low: 'lower personal importance on improving your hair' }[t[1]]);
  if (t[2]) parts.push({ high: 'strong interest in discussing restoration', moderate: 'a growing interest in discussing restoration', low: 'an early stage of exploring restoration' }[t[2]]);
  let id = 'custom', text: string | null = null;
  if (t.join() === 'high,high,high') { id = 'A'; text = 'Strong concern, strong personal importance and strong interest in discussing restoration.'; }
  else if (t[0] === 'high' && t[1] === 'high' && t[2] === 'low') { id = 'B'; text = 'Significant personal concern, but currently early in the exploration process.'; }
  else if (t[0] === 'moderate' && t[1] === 'high' && t[2] === 'high') { id = 'C'; text = 'The concern may be moderate, but you place high importance on exploring restoration.'; }
  else if (t.join() === 'low,low,low') { id = 'D'; text = 'You appear to be primarily exploring rather than actively pursuing restoration.'; }
  else if (parts.length === 3) text = `Your responses combine ${parts[0]}, ${parts[1]} and ${parts[2]}.`;
  return { id, tiers: { concern: t[0], motivation: t[1], readiness: t[2] }, interpretation: text };
}

export function consistencyCheck(sections: any[], calc: any) {
  const { r1, r5, r7, A, cta, sigs, goalValue } = calc;
  const fails: any[] = [];
  const checks: any[] = [];
  const chk = (id: string, ok: boolean, detail: string) => {
    checks.push({ id, ok });
    if (!ok) fails.push({ id, detail });
  };
  const sec = (id: string) => sections.find((s) => s.id === id);
  const prof = sec('personalized_profile').profileSummary;
  const expConcern = r1.suppressed ? 'Unclear' : r1.unresolved ? 'More than one area' : r1.primary && r1.dominance !== 'none' ? LOC_SIGNAL_LABEL[r1.primary] : 'No single area';
  chk('headline_matches_primary_concern', prof.primaryConcern === expConcern, `${prof.primaryConcern} vs ${expConcern}`);
  chk('signal1_matches_primary_concern', (sigs[0].value === (r1.suppressed ? 'Your answers about location point in different directions' : r1.unresolved ? 'More than one area' : r1.primary && r1.dominance !== 'none' ? LOC_SIGNAL_LABEL[r1.primary] : 'No single area stands out right now')), sigs[0].value);
  chk('goal_matches_primary_goal', prof.primaryGoal === goalValue && sigs[1].value === goalValue, `${prof.primaryGoal} / ${sigs[1].value} vs ${goalValue}`);
  chk('motivation_matches_band', prof.motivation === (r5.band ? BAND_LABEL[r5.band] : null), String(prof.motivation));
  chk('readiness_matches_stage', prof.restorationReadiness === (r7.stage && !r7.stageSuppressed ? STAGE_LABEL[r7.stage] : null), String(prof.restorationReadiness));
  chk('timeline_matches_q19', prof.idealTimeline === (A.Q19.key ? TIME_LABEL[A.Q19.key] : null), String(prof.idealTimeline));
  chk('cta_respects_consultation_intent', !(r7.consultationIntentLevel === 'none_now' && cta.tier !== 'lower') && !(r7.consultationIntentLevel === 'low' && ['high', 'very_high'].includes(cta.tier)), cta.tier);
  const text = collectText(sections.filter((s) => s.kind !== 'static')).join(' \n ');
  if (['curious', 'researching'].includes(r7.stage)) chk('no_overstated_readiness', !/ready to move forward|ready for surgery|ready to book/i.test(text), 'readiness overstated');
  if (r5.band === 'low') chk('no_overstated_motivation', !/restoration is extremely important to you/i.test(text), 'motivation overstated');
  if (r1.primary && r1.primary !== 'hairline') chk('no_wrong_primary_concern', !/your main concern is your hairline/i.test(text), 'wrong primary concern');
  chk('no_percentage_labels', !/\d+\s*%\s*(hair\s*loss|transplant|medical|chance)/i.test(text), 'percentage mislabel');
  return { ok: fails.length === 0, checks, failures: fails };
}

export const WEIGHTS_USED = {
  R1_concernMap: { Q1: 0.2, Q2: 0.15, Q4: 0.15, Q5: 0.15, Q6: 0.15, Q8: 0.2 },
  R2_coverage: { Q4: 0.3, Q5: 0.2, Q6: 0.25, Q14: 0.1, Q17: 0.15 },
  R3_perceivedChange: { Q1: 0.2, Q6: 0.2, Q7: 0.3, Q10: 0.15, Q12: 0.15 },
  R4_desiredChange: { Q14: 0.6, Q18: 0.4 },
  R5_motivation: { Q3: 0.3, Q15: 0.35, Q17: 0.35 },
  R6_journey: { Q10: 0.3, Q13: 0.5, Q11: 0.05, historyDetail: 0.15 },
  R7_readiness: { Q16: 0.4, Q19: 0.3, Q20: 0.3 },
  R8_profile: { hairline: 0.15, coverage: 0.15, crown: 0.1, perceivedChange: 0.15, motivation: 0.15, intent: 0.15, goal: 0.15 },
};

export const namedResults = (R: any, r8: any) => ({
  concernMap: R.R1,
  coverage: R.R2,
  perceivedChange: R.R3,
  desiredChange: R.R4,
  motivation: R.R5,
  journey: R.R6,
  readiness: R.R7,
  personalizedProfile: r8 || null
});

export function assess(input: any) {
  const allowPartial = !!(input && input.options && input.options.allowPartial);
  const { errors, A } = parseAnswers(input, allowPartial);
  const sp = parseSupplementary(input && input.supplementary);
  const allErrors = errors.concat(sp.errors);
  const base = {
    engineVersion: VERSIONS.engine,
    questionnaireVersion: VERSIONS.questionnaire,
    assessmentVersion: VERSIONS.questionnaire,
    rulebookVersion: VERSIONS.rulebook,
    narrativeVersion: VERSIONS.narrative
  };
  if (allErrors.length) return { ...base, status: 'validation_error', errors: allErrors };
  try {
    return runEngine(input, A, sp, base);
  } catch (e: any) {
    return { ...base, status: 'calculation_error', error: String(e && e.message ? e.message : e) };
  }
}

function runEngine(input: any, A: Record<string, any>, sp: any, base: any) {
  const rnd = (x: number) => Math.round(x * 1e6) / 1e6;
  const N: Record<string, number | null> = {};
  for (const q of QUESTIONS) {
    const a = A[q.id];
    if (a.missing) N[q.id] = null;
    else if (q.type === 'scale5' || q.type === 'scale5_followup') N[q.id] = (a.value - 1) / 4;
    else if (q.id === 'Q10') N[q.id] = { lt_6m: 0, '6_12m': 0.25, '1_2y': 0.5, '2_5y': 0.75, gt_5y: 1 }[a.key as string] ?? null;
    else if (q.id === 'Q19') N[q.id] = { researching: 0, '6_12m': 0.25, '3_6m': 0.5, '1_3m': 0.75, asap_right_option: 1 }[a.key as string] ?? null;
    else if (q.id === 'Q11') N[q.id] = a.key === 'yes' ? 1 : a.key === 'no' ? 0 : null;
    else N[q.id] = null;
  }
  const flags = detectFlags(N, A);
  const r1 = computeR1(N, A, flags);
  const r2 = computeR2(N, A, flags);
  const r3 = computeR3(N, A, flags);
  const r4 = computeR4(N, A, flags);
  const r5 = computeR5(N, A, flags);
  const r6 = computeR6(N, A, flags);
  const r7 = computeR7(N, A, flags);
  const results = { R1: r1, R2: r2, R3: r3, R4: r4, R5: r5, R6: r6, R7: r7 };
  const xsPatterns = crossSignalPatterns(N, A);

  const coreInsufficient = ['R1', 'R2', 'R3', 'R5', 'R7'].filter((k) => (results as any)[k].status === 'insufficient_evidence').length;
  const confVals = Object.values(results).map((r: any) => r.confidence.value);
  const overallConf = rnd(confVals.reduce((a, b) => a + b, 0) / confVals.length);
  const cta = ctaFor(r7, A);
  if (coreInsufficient >= 3) {
    return {
      ...base, status: 'insufficient_evidence',
      message: 'Not enough valid answers to build a profile. No report was generated.',
      confidence: { overall: overallConf, band: confBand(overallConf), byResult: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.confidence.value])) },
      flags, results: namedResults(results, null), safetyStatus: 'not_applicable'
    };
  }

  const coverageHigh = r2.perceptualCoverage;
  const concernIndex = rnd(Math.max(...Object.values(r1.locations).map((l: any) => l.quantScore ?? 0), coverageHigh ?? 0));
  const goalCat = r4.primaryGoal;
  const goalSpecific = !!goalCat && !['unsure', 'realistic'].includes(goalCat);
  const concernLoc = r1.primary;
  const goalConcernAlign = concernLoc && goalSpecific
    ? (GOAL_EXACT_LOC[goalCat] || []).includes(concernLoc) ? 'high' : LOC_FAMILY[concernLoc] === GOAL_FAMILY(goalCat) ? 'moderate' : 'low'
    : 'undetermined';
  const matrix = matrixOf(concernIndex, r5.score, r7.score);
  const ctx = { N, A, r1, r2, r3, r4, r5, r6, r7, flags, concernIndex, goalCat, goalSpecific, goalConcernAlignment: goalConcernAlign };
  const patterns = classifyPatterns(ctx);

  let journeyState: string | null = null;
  if (r6.journeyComposite !== null) {
    const jc = r6.journeyComposite;
    journeyState = (r7.score !== null && r7.score >= 0.8) && !r7.stageSuppressed ? 'ready_to_discuss' : jc < 0.15 ? 'early_awareness' : jc < 0.3 ? 'researching' : jc < 0.45 ? 'self_management' : jc < 0.65 ? 'active_exploration' : 'restoration_consideration';
  }
  const JOURNEY_LABEL: Record<string, string> = { early_awareness: 'Early awareness', researching: 'Researching', self_management: 'Self-management', active_exploration: 'Active exploration', restoration_consideration: 'Restoration consideration', ready_to_discuss: 'Ready to discuss' };
  const JOURNEY_STAGE_LABEL: Record<string, string> = { newly_concerned: 'Newly concerned', early_explorer: 'Early explorer', active_self_management: 'Active self-management', extensive_exploration: 'Extensive exploration', restoration_focused: 'Restoration-focused' };

  const crownVals = [r1.locations.crown.score, r2.outputs.crownCoverageConcern].filter((x) => x !== null && x !== undefined);
  const crownDim = crownVals.length ? rnd(crownVals.reduce((a: number, b: number) => a + b, 0) / crownVals.length) : null;
  const dims = [
    { id: 'hairline', label: 'Hairline', value: r1.locations.hairline.score, weight: 0.15 },
    { id: 'density_coverage', label: 'Density / Coverage', value: r2.score, weight: 0.15 },
    { id: 'crown', label: 'Crown', value: crownDim, weight: 0.1 },
    { id: 'perceived_change', label: 'Perceived Change', value: r3.score, weight: 0.15 },
    { id: 'motivation', label: 'Motivation', value: r5.score, weight: 0.15 },
    { id: 'restoration_intent', label: 'Restoration Intent', value: N.Q16, weight: 0.15 },
    { id: 'goal_strength', label: 'Goal Strength', value: r4.goalStrength, weight: 0.15 },
  ].map((d) => ({ ...d, band: band(d.value) }));
  const pw = weighted(dims.map((d) => ({ q: d.id, value: d.value, weight: d.weight, strength: 'SUPPORTING' })));
  const profileSignalIndex = pw.score;
  const r8conf = confidenceOf({ availability: pw.availability, notSureCount: 0, flags: flagsFor(flags, 'R8'), bestValid: pw.bestValid });
  const r8 = { id: 'R8', title: 'Your Personalized Restoration Profile', status: statusOf(pw.availability), score: profileSignalIndex, band: band(profileSignalIndex), availability: pw.availability, confidence: r8conf, trail: pw.trail, dimensions: dims, matrix, patterns, crossSignalPatterns: xsPatterns };

  const covBand = r2.band;
  const covLabel = covBand ? BAND_LABEL[covBand] : null;
  const secondaryConcern = r1.secondary || ((r2.score !== null && r2.score >= 0.6) && r1.primary !== 'overall' ? 'overall' : null);

  const sigs: any[] = [];
  if (r1.suppressed) sigs.push({ rank: 1, kind: 'concern', code: 'concern_unresolved', title: 'Primary concern', value: 'Your answers about location point in different directions' });
  else if (r1.unresolved) sigs.push({ rank: 1, kind: 'concern', code: 'multi_area_concern', title: 'Primary concern', value: 'More than one area' });
  else if (r1.primary && r1.dominance !== 'none') sigs.push({ rank: 1, kind: 'concern', code: `${r1.primary}_concern`, title: 'Primary concern', value: LOC_SIGNAL_LABEL[r1.primary] });
  else sigs.push({ rank: 1, kind: 'concern', code: 'limited_concern', title: 'Primary concern', value: 'No single area stands out right now' });

  let goalValue = GOAL_LABEL[goalCat] || 'Not sure yet';
  if (goalCat === 'hairline' && r4.q18Outcome === 'hairline') goalValue = 'A natural-looking hairline';
  else if (r4.primaryGoalSource === 'Q18') goalValue = OUTCOME_LABEL[goalCat] || goalValue;
  sigs.push({ rank: 2, kind: 'goal', code: GOAL_CODE[goalCat] || 'goal_still_forming', title: 'Primary goal', value: goalValue });

  const stageVal: Record<string, string> = { curious: 'Curious about restoration', researching: 'Researching restoration', exploring: 'Exploring restoration', seriously_considering: 'Seriously exploring restoration', ready_to_discuss: 'Ready to discuss restoration options' };
  if (r5.score !== null && r5.score >= 0.7 && (r7.score === null || r5.score >= r7.score + 0.15))
    sigs.push({ rank: 3, kind: 'motivation', code: 'high_restoration_motivation', title: 'Strongest drive', value: 'Restoration matters a great deal to you' });
  else if (r7.stage && !r7.stageSuppressed)
    sigs.push({ rank: 3, kind: 'stage', code: { curious: 'early_curiosity', researching: 'researching_restoration', exploring: 'exploring_restoration', seriously_considering: 'serious_restoration_interest', ready_to_discuss: 'ready_to_discuss' }[r7.stage], title: 'Current stage', value: stageVal[r7.stage] });
  else sigs.push({ rank: 3, kind: 'stage', code: 'stage_unclear', title: 'Current stage', value: 'Still clarifying where you are' });

  const narr = broaden({ R1: narrR1(r1, ctx), R2: narrR2(r2, ctx), R3: narrR3(r3, ctx), R4: narrR4(r4, ctx), R5: narrR5(r5, ctx), R6: narrR6(r6, ctx), R7: narrR7(r7, ctx) }, results, flags);
  const pers = personalize(ctx);
  const timelinePhrase = r7.timeline && r7.timeline !== 'researching' ? `a ${{ '6_12m': 'longer-term', '3_6m': 'medium-term', '1_3m': 'relatively near-term', asap_right_option: 'near-term, conditional' }[r7.timeline as string]} interest in discussing your options` : 'an interest in learning more at your own pace';
  const motWord = r5.band ? { low: 'low', mild: 'mild', moderate: 'moderate', high: 'high', very_high: 'very high' }[r5.band] : null;
  const finalMsg = `Your assessment suggests that your main focus is improving ${focusPhrase(ctx)}.${motWord ? ` Your responses also indicate ${motWord === 'low' ? 'lower' : motWord} motivation to explore restoration` : ' Your responses also describe where you are in exploring restoration'} and ${timelinePhrase}.`;
  const confPhrase = { low: 'less certain', moderate: 'reasonably confident', high: 'confident', very_high: 'very confident' }[confBand(overallConf)];
  const confSentence = `We are ${confPhrase} in how clearly your answers point to this profile. This reflects how complete and consistent your answers are, not medical certainty.`;

  const pathways = computePathways(ctx, sp.S, sp.layers);

  const topics: string[] = [];
  const gt = { hairline: 'How a natural-looking hairline is designed and what to expect', top: 'How density on top could be approached', crown: 'Crown coverage options and how coverage is planned', scalp: 'Ways to reduce how visible your scalp is', overall: 'Ways to improve overall fullness', realistic: 'What could realistically be achieved in your situation', unsure: 'What you want to prioritize first' }[goalCat];
  if (gt) topics.push(gt);
  if (r4.secondaryGoal && ['hairline', 'top', 'crown', 'overall'].includes(r4.secondaryGoal))
    topics.push(`Your second priority: ${OUTCOME_LABEL[r4.secondaryGoal].toLowerCase()}`);
  if (goalConcernAlign === 'low' || r1.unresolved) topics.push('How to prioritize between the different areas you mentioned');
  if (r6.approaches && r6.approaches.filter((a: string) => a !== 'nothing_yet').length)
    topics.push(`Your experience with ${list(r6.approaches.filter((a: string) => a !== 'nothing_yet').map((a: string) => APPROACH_LABEL[a]))} and what you noticed`);
  if (r6.familyContext === 'yes') topics.push('Your family history as context for a long-term plan');
  if (['1_3m', 'asap_right_option'].includes(r7.timeline)) topics.push('Timing, and what a realistic planning timeline looks like');
  topics.push('How a specialist examines your scalp and donor area in person');

  const matrixText = matrix.interpretation;
  const primaryConcernLabel = r1.suppressed ? 'Unclear' : r1.unresolved ? 'More than one area' : r1.primary && r1.dominance !== 'none' ? LOC_SIGNAL_LABEL[r1.primary] : 'No single area';

  const R = (num: string, id: string, title: string, question: string, resultNumber: number, viz: any, n: any, extra?: any) => ({ number: num, id, title, question, kind: 'result', resultNumber, visualization: viz, explanation: n, ...(extra || {}) });
  const sections: any[] = [];
  sections.push({ number: '01', id: 'assessment_summary', title: 'Assessment Summary', kind: 'summary', explanation: { headline: pers.headline, paragraphs: [pers.support, finalMsg, confSentence], keyInsight: pers.headline }, personalizationRule: pers.rule });
  sections.push(R('02', 'hair_concern_map', 'Your Hair Concern Map', 'Where is your concern?', 1,
    { type: 'interactive_head_map', regions: Object.keys(LOC_DEF).map((i) => ({ id: i, label: LOC_SIGNAL_LABEL[i], intensity: r1.locations[i].score, band: r1.locations[i].band, dominance: r1.locations[i].dominance || 'non_dominant', highlight: (r1.locations[i].score !== null && r1.locations[i].score >= 0.5) || i === r1.primary || i === r1.secondary })), multiArea: r1.multiAreaFlag || r1.unresolved, primary: r1.primary, secondary: r1.secondary }, narr.R1));
  sections.push(R('03', 'coverage_density', 'Your Coverage & Density Profile', 'How much fullness/coverage are you perceiving?', 2,
    { type: 'coverage_bars', bars: [{ id: 'overall_density', label: 'Overall Density', score: r2.score, band: r2.band }, { id: 'scalp_visibility', label: 'Scalp Visibility', score: r2.outputs.scalpVisibilitySignal, band: band(r2.outputs.scalpVisibilitySignal) }, { id: 'crown_coverage', label: 'Crown Coverage', score: r2.outputs.crownCoverageConcern, band: band(r2.outputs.crownCoverageConcern) }, { id: 'overall_fullness', label: 'Overall Fullness', score: r2.outputs.overallFullnessConcern, band: band(r2.outputs.overallFullnessConcern) }] }, narr.R2));
  sections.push(R('04', 'perceived_change', 'Your Perceived Change Over Time', 'How has your concern changed?', 3,
    { type: 'concern_timeline', durationKey: A.Q10.key || null, durationLabel: A.Q10.key ? DURATION_LABEL[A.Q10.key] : null, durationIndex: N.Q10, perceivedChange: r3.level, changeScore: r3.score, trajectory: N.Q12, milestones: ['Start of concern', 'Along the way', 'Now'] }, narr.R3, { labels: { 'Perceived change': r3.level ? cap(r3.level.replace('_', ' ')) : null, 'Concern duration': A.Q10.key ? DURATION_LABEL[A.Q10.key] : null } }));
  sections.push(R('05', 'what_you_want', 'What You Want To Change', 'What result matters most?', 4,
    { type: 'goal_card_priority_stack', primaryGoal: { code: goalCat, label: GOAL_LABEL[goalCat] }, desiredOutcome: r4.q18Outcome ? { code: r4.q18Outcome, label: OUTCOME_LABEL[r4.q18Outcome] } : null, alignment: r4.alignment,
      priorityStack: (() => { const st: string[] = []; if (goalSpecific || goalCat === 'realistic') st.push(GOAL_LABEL[goalCat]); if (r4.secondaryGoal) st.push(GOAL_LABEL[r4.secondaryGoal] || OUTCOME_LABEL[r4.secondaryGoal]); if (secondaryConcern === 'overall' && !st.some((x) => /overall|density/i.test(x))) st.push('Improve overall density'); if (r4.q18Outcome === 'realistic' || (!st.includes(GOAL_LABEL.realistic) && st.length)) st.push('Understand realistic options'); return [...new Set(st)].slice(0, 3).map((label, i) => ({ rank: i + 1, label })); })() }, narr.R4));
  sections.push(R('06', 'restoration_motivation', 'Your Restoration Motivation', 'How important is the outcome to you?', 5,
    { type: 'motivation_gauge', value: r5.score, band: r5.band, label: r5.band ? `Restoration motivation: ${BAND_LABEL[r5.band]}` : null, valueLabel: 'perceived importance signal', components: [{ label: 'Appearance impact', value: N.Q3 }, { label: 'Restoration priority', value: N.Q15 }, { label: 'Personal outcome importance', value: N.Q17 }] }, narr.R5, { matrix: { id: matrix.id, interpretation: matrixText } }));
  sections.push(R('07', 'restoration_journey', 'Your Hair Restoration Journey', 'What have you already tried?', 6,
    { type: 'journey_timeline_matrix', start: A.Q10.key ? `Concern started about ${DURATION_LABEL[A.Q10.key]} ago` : null, matrix: APPROACH_ROWS.map(([k, l]) => ({ id: k, label: l, used: r6.approaches ? r6.approaches.includes(k) : null })), nothingTried: !!(r6.approaches && r6.approaches.includes('nothing_yet')), experience: r6.treatmentBand, journeyStage: r6.journeyStage ? { code: r6.journeyStage, label: JOURNEY_STAGE_LABEL[r6.journeyStage] } : null, today: 'Today' }, narr.R6,
    { familyCard: A.Q11.key === 'yes' ? { label: 'Family context', text: 'You reported significant hair loss in your family. This is context only and does not indicate anything specific about your own situation.' } : A.Q11.key === 'no' ? { label: 'Family context', text: 'You did not report significant hair loss in your family. This is context only.' } : { label: 'Family context', text: "You weren't sure about your family history. This is context only." } }));
  sections.push(R('08', 'restoration_readiness', 'Your Restoration Readiness', 'How seriously and how soon are you considering it?', 7,
    { type: 'readiness_ladder', stages: STAGES.map((s) => ({ id: s, label: STAGE_LABEL[s] })), current: r7.stageSuppressed ? null : r7.stage, idealTimeline: r7.timeline ? { code: r7.timeline, label: TIME_LABEL[r7.timeline] } : null, consultationIntent: r7.consultationIntentLevel }, narr.R7));
  sections.push(R('09', 'personalized_profile', 'Your Personalized Restoration Profile', 'What does everything together say about your current restoration journey?', 8,
    { type: 'profile_radar', dimensions: dims.map((d) => ({ id: d.id, label: d.label, value: d.value, band: d.band })), note: 'Presentation of already-calculated values; never recalculated by the UI.' },
    { headline: 'Your complete profile', paragraphs: [finalMsg], keyInsight: finalMsg },
    { profileSummary: {
      primaryConcern: primaryConcernLabel,
      secondaryConcern: secondaryConcern ? (secondaryConcern === 'overall' ? 'Overall coverage' : LOC_SIGNAL_LABEL[secondaryConcern]) : null,
      coverageConcern: covLabel, perceivedChange: r3.level ? cap(r3.level.replace('_', ' ')) : null, primaryGoal: goalValue, motivation: r5.band ? BAND_LABEL[r5.band] : null,
      restorationIntent: N.Q16 === null ? null : BAND_LABEL[band(N.Q16) as string], journeyState: journeyState ? JOURNEY_LABEL[journeyState] : null, restorationReadiness: r7.stage && !r7.stageSuppressed ? STAGE_LABEL[r7.stage] : null,
      idealTimeline: r7.timeline ? TIME_LABEL[r7.timeline] : null, consultationIntent: r7.consultationIntentLevel, confidence: confBand(overallConf) },
      matrix: { id: matrix.id, tiers: matrix.tiers, interpretation: matrixText }, patterns, crossSignalPatterns: xsPatterns, goalConcernAlignment: goalConcernAlign }));
  sections.push({ number: '10', id: 'three_strongest_signals', title: 'Your 3 Strongest Signals', kind: 'synthesis', nestedUnder: 'result_08', signals: sigs.map((s, i) => ({ ...s, rank: i + 1 })), note: 'Summary generated from Results 01–07, not a separate result.' });
  sections.push({ number: '11', id: 'what_this_means', title: 'What This Means For Your Next Step', kind: 'narrative',
    explanation: { headline: 'What your profile may be useful for', paragraphs: [
      'Your answers describe how you see your hair, what you would like to change, and where you are in exploring restoration. They are self-reported signals and preferences.',
      `${pers.headline} ${pers.support}`,
      INTENT_LANGUAGE[cta.tier],
      'This assessment does not diagnose a condition, grade the extent of hair loss, assess donor hair, or decide whether any procedure is suitable. Those questions need an in-person clinical evaluation.',
      TRANSITION], keyInsight: 'Your profile is a starting point for a better-informed conversation.' }, discussionTopics: topics });
  sections.push({ number: '12', id: 'pathways', title: pathways.title, kind: 'pathways', framing: pathways.framing,
    explanation: { headline: pathways.framing, paragraphs: [pathways.softRecommendation, ...(pathways.approachesParagraph ? [pathways.approachesParagraph] : []), pathways.disclaimer, SPECIALIST_CLOSING], keyInsight: pathways.softRecommendation },
    pathways: pathways.pathways, potentialPathway: pathways.potentialPathway, relevance: pathways.relevance, procedurePathway: pathways.procedurePathway });
  const tags = [...new Set([r1.primary, goalCat, (r2.score !== null && r2.score >= 0.5) ? 'density' : null, r6.approaches && r6.approaches.includes('prp') ? 'prp' : null, r6.approaches && r6.approaches.includes('medication') ? 'medication' : null].filter(Boolean))];
  sections.push({ number: '13', id: 'specialist_video', title: 'Specialist Video', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags });
  sections.push({ number: '14', id: 'success_stories', title: 'Success Stories', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags, note: 'Stories are individual experiences and are not a prediction of your result.' });
  sections.push({ number: '15', id: 'before_after', title: 'Before / After Examples', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags, note: 'Examples are individual and are not a prediction of your result.' });
  sections.push({ number: '16', id: 'education', title: 'Education', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags, suggestedTopics: ['how_a_consultation_works', 'what_a_specialist_assesses', 'understanding_restoration_options', ...(r6.approaches && r6.approaches.includes('prp') ? ['prp_basics'] : [])] });
  sections.push({ number: '17', id: 'timeline', title: 'Timeline', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags, note: 'Timelines vary by individual and are confirmed by the specialist.' });
  sections.push({ number: '18', id: 'reviews', title: 'Reviews', kind: 'static', source: 'clinic-managed', content: null, suggestedTags: tags });
  sections.push({ number: '19', id: 'faq', title: 'FAQ', kind: 'static', source: 'clinic-managed', content: null, suggestedTopics: ['is_this_a_diagnosis', 'what_happens_in_a_consultation', ...(r6.approaches && r6.approaches.includes('prp') ? ['prp_and_next_steps'] : []), ...(r6.familyContext === 'yes' ? ['family_history'] : []), 'how_is_the_procedure_chosen'] });
  sections.push({ number: '20', id: 'consultation_cta', title: 'Consultation CTA', kind: 'cta', nestedUnder: 'result_08', cta });

  const safetyLog: any[] = [];
  const safeSections = safetyScan(sections, 'report.sections', safetyLog);
  const rescan: any[] = [];
  safetyScan(safeSections, 'report.sections', rescan);
  const safetyStatus = rescan.length ? 'safety_blocked' : 'passed';
  if (safetyStatus === 'safety_blocked') return { ...base, status: 'safety_blocked', safetyLog };

  const consistency = consistencyCheck(safeSections, { r1, r5, r7, A, cta, sigs, goalCat, goalValue });
  if (!consistency.ok) return { ...base, status: 'calculation_error', error: 'report_consistency_check_failed', consistency };

  const scores = { hairline: r1.locations.hairline.score, temples: r1.locations.temples.score, topMidScalp: r1.locations.top.score, crown: r1.locations.crown.score, overallThinning: r1.locations.overall.score, coverage: r2.score, perceivedChange: r3.score, goalStrength: r4.goalStrength, motivation: r5.score, journey: r6.score, readiness: r7.score, profileSignalIndex, concernIndex };
  const bands = { hairline: r1.locations.hairline.band, coverage: r2.band, perceivedChange: r3.level, motivation: r5.band, readiness: r7.stage };
  const canon = { raw: Object.fromEntries(Object.entries(A).map(([k, v]) => [k, v.missing ? (v.notSure ? 'not_sure' : null) : v.key !== undefined ? v.key : v.approaches ? { level: v.value, approaches: v.approaches } : v.value])), supplementary: sp.S };
  const meta = (input && input.meta) || null;
  const signals = {
    HAIRLINE_CHANGE: N.Q1, FRONTAL_VISIBILITY: N.Q2, APPEARANCE_IMPACT: N.Q3, SCALP_VISIBILITY: N.Q4, CROWN_CONCERN: N.Q5, FULLNESS_LOSS: N.Q6,
    PERCEIVED_CHANGE: weighted([{ value: N.Q1, weight: 0.6, strength: 'SUPPORTING' }, { value: N.Q6, weight: 0.6, strength: 'SUPPORTING' }, { value: N.Q7, weight: 1, strength: 'DIRECT' }]).score,
    DURATION_INDEX: N.Q10, FAMILY_CONTEXT: N.Q11, CONCERN_TRAJECTORY: N.Q12, TREATMENT_EXPERIENCE: N.Q13, RESTORATION_MOTIVATION: N.Q15, RESTORATION_INTENT: N.Q16, PERSONAL_OUTCOME_IMPORTANCE: N.Q17, TIME_INTENT: N.Q19, CONSULTATION_INTENT: N.Q20,
    PRIMARY_LOCATION: A.Q8.key || null, PERCEPTION_CONTEXT: A.Q9.key || null, PREVIOUS_APPROACHES: A.Q13.approaches || null, RESTORATION_GOAL: A.Q14.key || null, DESIRED_OUTCOME: A.Q18.key || null
  };
  const uncertaintyFlags = QUESTIONS.filter((q) => A[q.id].notSure).map((q) => ({ questionId: q.id, signal: q.signal, certainty: 'uncertain', value: null }));
  return {
    ...base, status: 'complete',
    answers: canon.raw, normalizedSignals: signals,
    scores: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v === null ? null : rnd(v)])), bands,
    primaryConcern: r1.suppressed ? 'unresolved' : r1.unresolved ? 'multiple_areas' : r1.primary && r1.dominance !== 'none' ? { hairline: 'hairline', temples: 'temples', top: 'top_mid_scalp', crown: 'crown', overall: 'overall_thinning' }[r1.primary] : 'no_dominant_area',
    secondaryConcern: secondaryConcern === 'overall' ? 'overall_coverage' : secondaryConcern,
    primaryGoal: { hairline: 'restore_hairline', top: 'density_top', crown: 'crown_coverage', scalp: 'reduce_visible_scalp', overall: 'fuller_overall', realistic: 'realistic_expectations', unsure: 'not_sure' }[goalCat],
    desiredOutcome: r4.q18Outcome, goalAlignment: r4.alignment, goalConcernAlignment: goalConcernAlign,
    journeyState, journeyStage: r6.journeyStage, timeline: r7.timeline,
    readiness: { score: r7.score === null ? null : rnd(r7.score), stage: r7.stageSuppressed ? 'unclear' : r7.stage },
    readinessStage: r7.stageSuppressed ? 'unclear' : r7.stage, consultationIntent: r7.consultationIntentLevel,
    confidence: { overall: overallConf, band: confBand(overallConf), byResult: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { value: v.confidence.value, band: v.confidence.band, status: v.status }])) },
    topSignals: sigs.map((s) => s.code), patterns, crossSignalPatterns: xsPatterns, matrix: { id: matrix.id, tiers: matrix.tiers, interpretation: matrixText }, cta,
    procedurePathway: pathways.procedurePathway,
    flags: flags.map(({ id, severity, message, affects }: any) => ({ id, severity, message, affects })), safetyStatus,
    results: namedResults(results, r8), pathways: { ...pathways }, report: { sections: safeSections, personalization: pers },
    audit: {
      assessmentId: (meta && meta.assessmentId) || null, patientId: (meta && meta.patientId) || null, timestamp: (meta && meta.timestamp) || null,
      questionnaireVersion: VERSIONS.questionnaire, engineVersion: VERSIONS.engine, rulebookVersion: VERSIONS.rulebook, narrativeVersion: VERSIONS.narrative,
      inputHash: hash53(JSON.stringify(canon)), meta, rawAnswers: canon.raw, supplementary: sp.S, normalizedAnswers: N, derivedSignals: signals, weightsUsed: WEIGHTS_USED,
      evidenceTrails: { R1: { spec: r1.specTrail, locations: Object.fromEntries(Object.entries(r1.locations).map(([k, v]: [string, any]) => [k, v.trail])) }, R2: r2.trail, R3: r3.trail, R4: r4.trail, R5: r5.trail, R6: r6.trail, R7: r7.trail, R8: r8.trail },
      modifiers: { R1: Object.fromEntries(Object.entries(r1.locations).map(([k, v]: [string, any]) => [k, v.modifiers])), R2: r2.modifiers, R5: r5.modifiers, R7: r7.modifiers },
      confidence: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.confidence])), dominance: { ranking: r1.ranking, gap: r1.gap, gapClass: r1.gapClass, tieBroken: r1.tieBroken, unresolved: r1.unresolved },
      contradictionFlags: flags, uncertaintyFlags, patternFlags: patterns.concat(xsPatterns), flags, personalizationRule: pers.rule, pathwayDecisionTrace: pathways.decisionTrace,
      safetyValidationStatus: safetyStatus, safetyReplacements: safetyLog.length, consistencyCheck: consistency,
    },
  };
}

export function runGoldenTests() {
  const DEF = { Q1: 3, Q2: 3, Q3: 3, Q4: 3, Q5: 3, Q6: 3, Q7: 3, Q8: 'top_midscalp', Q9: 'both_equally', Q10: '1_2y', Q11: 'no', Q12: 3, Q13: { level: 2, approaches: ['supplements'] }, Q14: 'density_top', Q15: 3, Q16: 3, Q17: 3, Q18: 'density_top', Q19: '6_12m', Q20: 3 };
  const run = (o: any, extra?: any) => assess({ answers: { ...DEF, ...o }, ...(extra || {}) });
  const allText = (out: any) => collectText(out.report.sections).join(' ');
  const tests: any[] = [];
  const T = (name: string, fn: () => void) => tests.push({ name, fn });
  const eq = (a: any, b: any, m?: string) => { if (a !== b) throw new Error(`${m || 'expected'}: got ${JSON.stringify(a)}, wanted ${JSON.stringify(b)}`); };
  const ok = (c: boolean, m?: string) => { if (!c) throw new Error(m || 'assertion failed'); };

  T('01 hairline-focused', () => { const o = run({ Q1: 5, Q2: 5, Q3: 4, Q4: 2, Q5: 1, Q6: 3, Q7: 4, Q8: 'front_hairline', Q14: 'restore_hairline', Q18: 'natural_hairline' }); eq(o.status, 'complete'); eq(o.primaryConcern, 'hairline'); eq(o.primaryGoal, 'restore_hairline'); eq(o.goalAlignment, 'high'); ok(o.crossSignalPatterns.includes('STRONG_FRONTAL_CONCERN_PATTERN'), 'frontal pattern'); });
  T('02 crown-focused', () => { const o = run({ Q1: 1, Q2: 1, Q4: 4, Q5: 5, Q8: 'crown', Q14: 'crown_coverage', Q18: 'crown_coverage' }); eq(o.primaryConcern, 'crown'); eq(o.primaryGoal, 'crown_coverage'); });
  T('03 diffuse coverage', () => { const o = run({ Q1: 2, Q2: 2, Q4: 5, Q5: 3, Q6: 5, Q8: 'overall_thinning', Q14: 'fuller_overall', Q18: 'fuller_overall', Q17: 4 }); ok(o.scores.coverage >= 0.7, 'coverage elevated'); ok(o.patterns.includes('DIFFUSE COVERAGE CONCERN'), 'diffuse pattern'); });
  T('04 high concern, low readiness stay independent', () => { const o = run({ Q1: 5, Q2: 5, Q4: 5, Q5: 5, Q6: 5, Q16: 1, Q19: 'researching', Q20: 1 }); ok(o.scores.concernIndex >= 0.7, 'concern high'); ok(o.scores.readiness < 0.2, 'readiness low'); eq(o.readinessStage, 'curious'); });
  T('05 low concern, high motivation', () => { const o = run({ Q1: 2, Q2: 2, Q4: 2, Q5: 2, Q6: 2, Q3: 5, Q15: 5, Q17: 5 }); ok(o.scores.concernIndex < 0.5, 'concern low/moderate'); ok(o.scores.motivation >= 0.85, 'motivation very high'); });
  T('06 high readiness', () => { const o = run({ Q16: 5, Q19: 'asap_right_option', Q20: 5 }); eq(o.scores.readiness, 1); eq(o.readinessStage, 'ready_to_discuss'); eq(o.cta.tier, 'very_high'); });
  T('07 all quantitative = 1 -> no fabricated concern', () => { const o = run({ Q1: 1, Q2: 1, Q3: 1, Q4: 1, Q5: 1, Q6: 1, Q7: 1, Q12: 1, Q13: 1, Q15: 1, Q16: 1, Q17: 1, Q20: 1, Q8: 'not_sure', Q9: 'not_sure', Q10: 'lt_6m', Q14: 'not_sure', Q18: 'not_sure', Q19: 'researching' }); eq(o.status, 'complete'); eq(o.scores.hairline, 0); eq(o.scores.coverage, 0); eq(o.scores.motivation, 0); eq(o.scores.readiness, 0); eq(o.primaryConcern, 'no_dominant_area'); });
  T('08 all quantitative = 5 -> no diagnosis / grafts / guarantees', () => { const o = run({ Q1: 5, Q2: 5, Q3: 5, Q4: 5, Q5: 5, Q6: 5, Q7: 5, Q12: 5, Q13: { level: 5, approaches: ['medication', 'prp', 'supplements', 'hair_products', 'special_shampoos', 'home_remedies'] }, Q15: 5, Q16: 5, Q17: 5, Q20: 5, Q8: 'more_than_one', Q10: 'gt_5y', Q19: 'asap_right_option', Q14: 'reduce_visible_scalp', Q18: 'fuller_overall' }); eq(o.scores.perceivedChange, 1); eq(o.scores.motivation, 1); eq(o.safetyStatus, 'passed'); const t = allText(o); for (const re of PROHIBITED) ok(!re.test(t.split(SAFETY_STATEMENT).join('')), 'prohibited claim: ' + re.source); });
  T('09 all-uncertain categoricals -> low-confidence goal, broader language', () => { const o = run({ Q8: 'not_sure', Q9: 'not_sure', Q11: 'not_sure', Q14: 'not_sure', Q18: 'not_sure' }); eq(o.status, 'complete'); eq(o.confidence.byResult.R4.status, 'insufficient_evidence'); eq(o.primaryGoal, 'not_sure'); ok(o.confidence.byResult.R1.band !== 'very_high', 'R1 confidence reduced'); ok(o.audit.uncertaintyFlags.length === 5, 'uncertainty flags'); });
  T('10 contradictory goals -> flag, reduced confidence, no forced reading', () => { const a = run({ Q14: 'restore_hairline', Q18: 'crown_coverage' }); const b = run({ Q14: 'restore_hairline', Q18: 'natural_hairline' }); ok(a.flags.some((f: any) => f.id === 'C01_GOAL_CONTRADICTION'), 'C01'); eq(a.goalAlignment, 'low'); ok(a.confidence.byResult.R4.value < b.confidence.byResult.R4.value, 'confidence reduced'); });
  T('11 determinism (same answers -> identical output)', () => { const a = JSON.stringify(run({ Q1: 4, Q8: 'front_hairline' })); const b = JSON.stringify(run({ Q1: 4, Q8: 'front_hairline' })); eq(a, b); });
  T('12 validation: range / option / unknown-value / missing / duplicate', () => { eq(run({ Q1: 7 }).status, 'validation_error'); eq(run({ Q8: 'banana' }).status, 'validation_error'); eq(run({ Q11: 'unknown_value' }).status, 'validation_error'); const m = { ...DEF }; delete (m as any).Q3; eq(assess({ answers: m }).status, 'validation_error'); eq(assess({ answers: [{ questionId: 'Q1', value: 3 }, { questionId: 'Q1', value: 4 }] }).status, 'validation_error'); });
  T('13 insufficient evidence (partial allowed, mostly empty)', () => { const o = assess({ answers: { Q8: 'crown' }, options: { allowPartial: true } }); eq(o.status, 'insufficient_evidence'); });
  T('14 "not sure" is NULL, never 0 (Rule 08)', () => { const o = run({ Q14: 'not_sure' }); const tr = o.audit.evidenceTrails.R2.find((x: any) => x.question === 'Q14'); eq(tr.normalized, null); eq(tr.status, 'not_sure'); });
  T('15 modifier cap +-15%', () => { const o = run({ Q1: 5, Q2: 5, Q4: 5, Q5: 5, Q6: 5, Q8: 'front_hairline' }); for (const l of Object.values(o.results.concernMap.locations) as any[]) ok(Math.abs(l.modifierTotal) <= 0.15 + 1e-9, 'cap'); });
  T('16 claim control rejects prohibited statements; approves safety statement', () => { for (const s of ['You have androgenetic alopecia.', 'You are Norwood 3.', 'You need 3000 grafts.', 'You are an ideal transplant candidate.', 'Your donor area is strong.', 'Your follicles are healthy.', 'You definitely need a transplant.', 'PRP will work for you.', 'Your treatment will succeed.', 'You will achieve 80% growth.', 'FUE is the best procedure for you.']) ok(!validateStatement(s).ok, 'should block: ' + s); ok(validateStatement(SAFETY_STATEMENT).ok, 'safety statement approved'); });
  T('17 pathway layer: questionnaire alone never yields REPAIR/BHT/HYBRID; repair needs transplant history', () => { const o = run({ Q1: 5, Q2: 5, Q8: 'front_hairline', Q3: 5, Q15: 5, Q17: 5, Q16: 5, Q19: '1_3m', Q20: 5 }); ok(!o.pathways.pathways.some((p: any) => ['REPAIR', 'BHT', 'HYBRID'].includes(p.id)), 'no specialist pathways'); eq(o.procedurePathway.specificApproachDetermined, false); const r = run({}, { supplementary: { previousTransplant: true, previousTransplantIssues: ['visible_grafts'], donorSupplyRemaining: 'limited' } }); ok(r.pathways.pathways.some((p: any) => p.id === 'REPAIR'), 'repair pathway'); });
  T('18 report has 20 sections in spec order', () => { const o = run({}); eq(o.report.sections.length, 20); eq(o.report.sections.map((s: any) => s.number).join(','), '01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20'); eq(o.audit.consistencyCheck.ok, true); });
  T('19 tie -> no forced winner', () => { const o = run({ Q1: 4, Q2: 4, Q4: 4, Q5: 4, Q6: 4, Q8: 'more_than_one' }); eq(o.primaryConcern, 'multiple_areas'); });
  T('20 consultation intent respected by CTA', () => { const o = run({ Q16: 5, Q19: 'asap_right_option', Q20: 1 }); eq(o.cta.tier, 'lower'); });

  const testResults = tests.map((t) => {
    try {
      t.fn();
      return { name: t.name, pass: true };
    } catch (e: any) {
      return { name: t.name, pass: false, error: e.message };
    }
  });
  return {
    passed: testResults.filter((r) => r.pass).length,
    failed: testResults.filter((r) => !r.pass).length,
    results: testResults
  };
}
