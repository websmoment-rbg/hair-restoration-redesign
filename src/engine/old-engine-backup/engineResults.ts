import { r6, ge, band, treatBand, stageOf, EV, evName } from './engineCore';
import {
  GOAL14, GOAL18, COVERAGE_GOAL, GOAL_EXACT_LOC, LOC_PHRASE, LOC_SHORT,
  LOC_SIGNAL_LABEL, LOC_FAMILY, Q8_LOC, SIGNAL_OF
} from './engineDefinitions';
import { weighted, confidenceOf, statusOf, flagsFor, applyMods } from './engineScoring';

export function crossSignalPatterns(N: Record<string, number | null>, A: Record<string, any>) {
  const out: string[] = [];
  if (ge(N.Q1, 0.5) && ge(N.Q2, 0.5) && A.Q8.key === 'front_hairline') out.push('STRONG_FRONTAL_CONCERN_PATTERN');
  if (ge(N.Q5, 0.5) && A.Q8.key === 'crown') out.push('STRONG_CROWN_CONCERN_PATTERN');
  if (ge(N.Q4, 0.5) && ge(N.Q6, 0.5)) out.push('STRONG_COVERAGE_CONCERN_PATTERN');
  if (ge(N.Q3, 0.7) && ge(N.Q15, 0.7) && ge(N.Q17, 0.7)) out.push('HIGH_RESTORATION_MOTIVATION');
  if (ge(N.Q16, 0.7) && ge(N.Q19, 0.7) && ge(N.Q20, 0.7)) out.push('HIGH_RESTORATION_READINESS');
  return out;
}

export function detectFlags(N: Record<string, number | null>, A: Record<string, any>) {
  const f: any[] = [];
  const add = (id: string, severity: string, message: string, affects: string[], suppresses?: string) =>
    f.push({ id, severity, message, affects, suppresses: suppresses || null });
  const q8loc = Q8_LOC[A.Q8.key];
  const g14 = GOAL14[A.Q14.key];
  const g18 = GOAL18[A.Q18.key];

  if (g14 && g18 && LOC_FAMILY[g14] && LOC_FAMILY[g18] && LOC_FAMILY[g14] !== LOC_FAMILY[g18])
    add('C01_GOAL_CONTRADICTION', 'medium', 'Primary goal (Q14) and desired consultation outcome (Q18) point to different areas.', ['R4', 'R8']);
  const c02 = !!(q8loc && g14 && LOC_FAMILY[g14] && LOC_FAMILY[q8loc] !== LOC_FAMILY[g14]);
  if (c02) add('C02_LOCATION_GOAL_MISMATCH', 'low', 'Primary location (Q8) and primary goal (Q14) are in different regions.', ['R1', 'R4']);
  const c08 = (A.Q8.key === 'crown' && N.Q5 !== null && N.Q5 <= 0.25) || (A.Q8.key === 'front_hairline' && N.Q1 !== null && N.Q2 !== null && N.Q1 <= 0.25 && N.Q2 <= 0.25);
  if (c08) add('C08_LOCATION_VS_DIRECT', 'medium', 'Selected primary location is contradicted by its direct question(s).', ['R1']);
  if (c08 && c02) add('C10_LOCATION_INCONSISTENT', 'high', 'Location, its direct question and the goal are mutually inconsistent.', ['R1'], 'primary_concern');
  const concernMax = Math.max(...['Q1', 'Q2', 'Q4', 'Q5', 'Q6'].map((q) => (N[q] === null ? -1 : (N[q] as number))));
  const motVals = ['Q3', 'Q15', 'Q17'].map((q) => N[q]).filter((x) => x !== null) as number[];
  if (concernMax >= 0.75 && motVals.length === 3 && motVals.reduce((a, b) => a + b, 0) / 3 <= 0.25)
    add('C03_HIGH_CONCERN_LOW_IMPORTANCE', 'low', 'High perceived concern with low personal importance (valid combination; kept separate).', ['R5']);
  if (N.Q16 === 0 && ge(N.Q19, 0.75) && ge(N.Q20, 0.75)) {
    if (N.Q19 === 1 && N.Q20 === 1) add('C04_INTENT_CONTRADICTION', 'high', '"Just curious" conflicts with maximum timing and consultation intent.', ['R7'], 'readiness_stage');
    else add('C04_INTENT_CONTRADICTION', 'medium', '"Just curious" conflicts with near-term timing and consultation intent.', ['R7']);
  }
  if (N.Q16 === 1 && N.Q20 === 0) add('C04B_READY_BUT_NOT_NOW', 'medium', 'Ready to discuss with a specialist but "not right now" for consultation.', ['R7']);
  if (N.Q1 !== null && N.Q2 !== null && Math.abs(N.Q1 - N.Q2) >= 0.5) add('C05_FRONTAL_SPLIT', 'low', 'Hairline change (Q1) and frontal visibility (Q2) differ markedly.', ['R1']);
  const ap = A.Q13.approaches;
  const lvl = A.Q13.value;
  if (ap && lvl !== undefined && ((lvl >= 2 && ap.length === 1 && ap[0] === 'nothing_yet') || (lvl === 1 && ap.some((a: string) => a !== 'nothing_yet')) || (ap.includes('nothing_yet') && ap.length > 1)))
    add('C06_TREATMENT_MISMATCH', 'low', 'Treatment level (Q13) and selected approaches disagree.', ['R6']);
  if (N.Q7 === 0 && Math.max(N.Q1 ?? 0, N.Q6 ?? 0) >= 0.75) add('C07_CHANGE_VS_RECENT', 'low', 'Large overall change but none in the last 12–24 months (can be valid).', ['R3']);
  if (N.Q15 === 0 && ge(N.Q17, 0.75)) add('C09_MOTIVATION_SPLIT', 'medium', 'Restoration "not important" (Q15) conflicts with a major personal difference (Q17).', ['R5']);
  return f;
}

export const LOC_DEF: Record<string, { inputs: [string, number, any][]; q8: string; spec: number }> = {
  hairline: { inputs: [['Q1', 0.2, 'DIRECT'], ['Q2', 0.15, 'DIRECT']], q8: 'front_hairline', spec: 3 },
  temples: { inputs: [['Q1', 0.1, 'SUPPORTING'], ['Q2', 0.1, 'SUPPORTING']], q8: 'temples', spec: 3 },
  top: { inputs: [['Q4', 0.15, 'SUPPORTING'], ['Q6', 0.1, 'SUPPORTING']], q8: 'top_midscalp', spec: 2 },
  crown: { inputs: [['Q5', 0.15, 'DIRECT'], ['Q4', 0.1, 'SUPPORTING']], q8: 'crown', spec: 3 },
  overall: { inputs: [['Q4', 0.1, 'SUPPORTING'], ['Q6', 0.15, 'DIRECT']], q8: 'overall_thinning', spec: 1 },
};
export const SPEC_W_R1: Record<string, number> = { Q1: 0.2, Q2: 0.15, Q4: 0.15, Q5: 0.15, Q6: 0.15, Q8: 0.2 };
export const TIE_NAMES = ['direct_evidence', 'question_specificity', 'explicit_patient_selection', 'explicit_patient_goal', 'cross_signal_agreement', 'confidence', 'higher_weight_signal'];

export function computeR1(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const q8 = A.Q8.key;
  const q8Valid = !A.Q8.missing && !A.Q8.notSure;
  const XS = crossSignalPatterns(N, A);
  let ew = 0, vw = 0, ns = 0;
  const specTrail: any[] = [];
  for (const [q, w] of Object.entries(SPEC_W_R1)) {
    ew += w;
    const valid = q === 'Q8' ? q8Valid : N[q] !== null;
    if (valid) vw += w;
    if (A[q].notSure) ns++;
    specTrail.push({ question: q, signal: SIGNAL_OF[q], weight: w, normalized: q === 'Q8' ? (q8Valid ? q8 : null) : N[q], status: valid ? 'valid' : A[q].notSure ? 'not_sure' : 'missing' });
  }
  const availability = r6(vw / ew) ?? 0;
  const own = flagsFor(flags, 'R1');
  const conf = confidenceOf({ availability, notSureCount: ns, flags: own, bestValid: q8Valid || vw > 0 ? EV.DIRECT : 0 });
  const status = statusOf(availability);
  const multiAreaFlag = q8 === 'more_than_one';
  const g14 = GOAL14[A.Q14.key];
  const locs: Record<string, any> = {};

  for (const [id, d] of Object.entries(LOC_DEF)) {
    const ev = q8Valid && !multiAreaFlag ? (q8 === d.q8 ? 1 : 0) : null;
    const inputs: any[] = d.inputs.map(([q, w, s]) => ({ q, signal: SIGNAL_OF[q], value: N[q], weight: w, strength: s }));
    inputs.push({ q: 'Q8', signal: 'PRIMARY_LOCATION', value: ev, weight: 0.2, strength: 'DIRECT', notSure: A.Q8.notSure });
    const quant = weighted(inputs.filter((x) => x.q !== 'Q8'));
    const w = weighted(inputs);
    const mods: any[] = [];
    if (id === 'hairline' && XS.includes('STRONG_FRONTAL_CONCERN_PATTERN')) mods.push({ id: 'hairline_reinforcement', pattern: 'STRONG_FRONTAL_CONCERN_PATTERN', value: 0.08 });
    if (id === 'crown' && XS.includes('STRONG_CROWN_CONCERN_PATTERN')) mods.push({ id: 'crown_reinforcement', pattern: 'STRONG_CROWN_CONCERN_PATTERN', value: 0.08 });
    const m = applyMods(w.score, mods);
    const goalMatch = g14 && (GOAL_EXACT_LOC[g14] || []).includes(id) ? 1 : 0;
    const locConf = r6((conf.value ?? 0) * w.availability);
    locs[id] = { id, label: LOC_PHRASE[id], quantScore: quant.score, baseScore: w.score, score: m.score, modifierTotal: m.total, modifiers: mods, band: band(m.score), strength: w.bestPositive, strengthName: evName(w.bestPositive), q8Explicit: ev === 1, goalMatch, confidence: locConf, expectedWeight: w.expectedWeight, availability: w.availability, trail: w.trail };
  }
  const ids = Object.keys(locs).filter((i) => locs[i].score !== null).sort((a, b) => (locs[b].score - locs[a].score) || (a < b ? -1 : 1));
  const res: any = { id: 'R1', title: 'Your Hair Concern Map', status, availability, confidence: conf, locations: locs, ranking: ids, multiAreaFlag, specTrail, locationConfidencePenalty: A.Q8.notSure ? 0.2 : 0, primary: null, secondary: null, coPrimary: [], unresolved: false, suppressed: false, tieBroken: null, gap: null, gapClass: null, dominance: 'none', dominanceStrength: null, score: null, band: null };
  if (status === 'insufficient_evidence' || !ids.length) return res;
  const topId = ids[0];
  const topScore = locs[topId].score;
  const tied = ids.filter((i) => (r6(topScore - locs[i].score) ?? 0) < 0.08);
  const tuple = (i: string) => [locs[i].strength, LOC_DEF[i].spec, locs[i].q8Explicit ? 1 : 0, locs[i].goalMatch, locs[i].modifiers.length ? 1 : 0, locs[i].confidence, locs[i].expectedWeight];
  let primary = topId;

  if (tied.length > 1) {
    const cmp = (a: string, b: string) => {
      const ta = tuple(a), tb = tuple(b);
      for (let k = 0; k < ta.length; k++) if (ta[k] !== tb[k]) return { k, d: tb[k] - ta[k] };
      return { k: -1, d: 0 };
    };
    const sorted = [...tied].sort((a, b) => cmp(a, b).d || (a < b ? -1 : 1));
    const first = cmp(sorted[0], sorted[1]);
    if (multiAreaFlag || first.k === -1) { res.unresolved = true; res.coPrimary = tied; primary = ''; }
    else { primary = sorted[0]; res.tieBroken = TIE_NAMES[first.k]; }
  }
  const suppressed = flags.some((f) => f.suppresses === 'primary_concern');
  if (suppressed) { res.suppressed = true; primary = ''; res.unresolved = false; res.coPrimary = []; }
  if (primary) {
    const rest = ids.filter((i) => i !== primary);
    const sec = rest[0] || null;
    res.primary = primary;
    res.secondary = sec && locs[sec].score >= 0.45 ? sec : null;
    res.gap = sec ? r6(Math.abs(locs[primary].score - locs[sec].score)) : null;
    res.gapClass = res.gap === null ? null : res.gap >= 0.15 ? 'clear_primary' : res.gap >= 0.08 ? 'moderate_primary' : 'near_tie';
    const L = locs[primary];
    res.dominance = L.score < 0.25 ? 'none' : (L.score >= 0.6 && L.strength >= EV.SUPPORTING && L.confidence >= 0.5) ? 'primary' : 'leading';
    res.dominanceStrength = L.score >= 0.85 ? 'very_strong' : L.score >= 0.75 ? 'strong' : null;
    res.score = L.score;
    res.band = L.band;
  } else if (res.unresolved) {
    res.secondary = null;
    res.score = topScore;
    res.band = band(topScore);
    res.dominance = topScore >= 0.6 ? 'co_primary' : 'none';
    res.gap = r6(topScore - (locs[ids.find((i) => !tied.includes(i))]?.score ?? 0));
  }
  for (const i of ids) {
    const s = locs[i].score;
    const isP = i === res.primary || (res.unresolved && tied.includes(i));
    locs[i].dominance = isP ? (res.unresolved ? 'co_primary' : res.dominance === 'primary' ? 'primary' : s >= 0.25 ? 'leading' : 'non_dominant') : i === res.secondary ? 'secondary' : s >= 0.25 ? 'supporting' : 'non_dominant';
  }
  return res;
}

export function computeR2(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const g = GOAL14[A.Q14.key];
  const gc = g && g !== 'unsure' ? COVERAGE_GOAL[g] : null;
  const w = weighted([
    { q: 'Q4', signal: 'SCALP_VISIBILITY', value: N.Q4, weight: 0.3, strength: 'DIRECT' },
    { q: 'Q5', signal: 'CROWN_CONCERN', value: N.Q5, weight: 0.2, strength: 'DIRECT' },
    { q: 'Q6', signal: 'FULLNESS_LOSS', value: N.Q6, weight: 0.25, strength: 'DIRECT' },
    { q: 'Q14', signal: 'RESTORATION_GOAL', value: gc, weight: 0.1, strength: 'SUPPORTING', notSure: A.Q14.notSure },
    { q: 'Q17', signal: 'PERSONAL_OUTCOME_IMPORTANCE', value: N.Q17, weight: 0.15, strength: 'SUPPORTING' },
  ]);
  const mods: any[] = [];
  if (crossSignalPatterns(N, A).includes('STRONG_COVERAGE_CONCERN_PATTERN'))
    mods.push({ id: 'coverage_reinforcement', pattern: 'STRONG_COVERAGE_CONCERN_PATTERN', value: 0.08 });
  const m = applyMods(w.score, mods);
  const status = statusOf(w.availability);
  const conf = confidenceOf({ ...w, flags: flagsFor(flags, 'R2') });
  const sub = (x: number | null) => (x === null ? null : r6(x));
  return {
    id: 'R2', title: 'Your Coverage & Density Profile', status, score: status === 'insufficient_evidence' ? null : m.score,
    baseScore: w.score, band: status === 'insufficient_evidence' ? null : band(m.score),
    modifiers: mods, modifierTotal: m.total, availability: w.availability, confidence: conf, trail: w.trail,
    goalCoverageComponent: gc,
    outputs: { overallDensityConcern: m.score, scalpVisibilitySignal: sub(N.Q4), crownCoverageConcern: sub(N.Q5), overallFullnessConcern: sub(N.Q6) },
    perceptualCoverage: weighted([
      { q: 'Q4', value: N.Q4, weight: 0.35, strength: 'DIRECT' },
      { q: 'Q5', value: N.Q5, weight: 0.25, strength: 'DIRECT' },
      { q: 'Q6', value: N.Q6, weight: 0.4, strength: 'DIRECT' }
    ]).score,
  };
}

export function computeR3(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const w = weighted([
    { q: 'Q1', signal: 'HAIRLINE_CHANGE', value: N.Q1, weight: 0.2, strength: 'DIRECT' },
    { q: 'Q6', signal: 'FULLNESS_LOSS', value: N.Q6, weight: 0.2, strength: 'DIRECT' },
    { q: 'Q7', signal: 'PERCEIVED_CHANGE', value: N.Q7, weight: 0.3, strength: 'DIRECT' },
    { q: 'Q10', signal: 'DURATION', value: N.Q10, weight: 0.15, strength: 'CONTEXTUAL' },
    { q: 'Q12', signal: 'CONCERN_TRAJECTORY', value: N.Q12, weight: 0.15, strength: 'SUPPORTING' },
  ]);
  const status = statusOf(w.availability);
  const conf = confidenceOf({ ...w, flags: flagsFor(flags, 'R3') });
  const lv = w.score === null ? null : w.score < 0.25 ? 'limited' : w.score < 0.5 ? 'mild' : w.score < 0.7 ? 'moderate' : w.score < 0.85 ? 'high' : 'very_high';
  return {
    id: 'R3', title: 'Your Perceived Change Over Time', status, score: status === 'insufficient_evidence' ? null : w.score,
    band: status === 'insufficient_evidence' ? null : band(w.score), level: status === 'insufficient_evidence' ? null : lv,
    availability: w.availability, confidence: conf, trail: w.trail,
    outputs: {
      perceivedProgressionSignal: N.Q7, durationOfConcern: A.Q10.key || null,
      changeIntensity: N.Q1 === null && N.Q6 === null ? null : r6(Math.max(N.Q1 ?? 0, N.Q6 ?? 0)),
      concernTrajectory: N.Q12
    }
  };
}

export function computeR4(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const g14 = GOAL14[A.Q14.key] || null;
  const g18 = GOAL18[A.Q18.key] || null;
  const v14 = g14 && g14 !== 'unsure';
  const v18 = g18 && g18 !== 'unsure';
  const availability = r6((v14 ? 0.6 : 0) + (v18 ? 0.4 : 0)) ?? 0;
  const status = statusOf(availability);
  const alignment = g14 && g18 ? (g14 === g18 ? 'high' : g18 === 'realistic' || LOC_FAMILY[g14] === LOC_FAMILY[g18] ? 'moderate' : 'low') : 'undetermined';
  const spec = weighted([
    { q: 'Q14', signal: 'RESTORATION_GOAL', value: v14 ? 1 : null, weight: 0.6, strength: 'DIRECT', notSure: A.Q14.notSure },
    { q: 'Q18', signal: 'DESIRED_OUTCOME', value: v18 ? (g18 === 'realistic' ? 0.6 : 1) : null, weight: 0.4, strength: 'DIRECT', notSure: A.Q18.notSure }
  ]);
  const factor = { high: 1, moderate: 0.85, low: 0.6, undetermined: 1 }[alignment];
  const goalStrength = spec.score === null ? null : r6(spec.score * factor);
  const conf = confidenceOf({ availability, notSureCount: spec.notSureCount, flags: flagsFor(flags, 'R4'), bestValid: spec.bestValid });
  const primaryGoal = v14 ? g14 : v18 && g18 !== 'realistic' ? g18 : v18 ? 'realistic' : 'unsure';
  const secondaryGoal = v14 && v18 && g18 !== g14 ? g18 : null;
  return {
    id: 'R4', title: 'What You Want To Change', status, score: status === 'insufficient_evidence' ? null : goalStrength,
    band: null, availability, confidence: conf, trail: spec.trail,
    q14Goal: g14, q18Outcome: g18, primaryGoal, primaryGoalSource: v14 ? 'Q14' : v18 ? 'Q18' : null, secondaryGoal, alignment, goalStrength, weights: { Q14: 0.6, Q18: 0.4 }
  };
}

export function computeR5(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const w = weighted([
    { q: 'Q3', signal: 'APPEARANCE_IMPACT', value: N.Q3, weight: 0.3, strength: 'DIRECT' },
    { q: 'Q15', signal: 'RESTORATION_MOTIVATION', value: N.Q15, weight: 0.35, strength: 'DIRECT' },
    { q: 'Q17', signal: 'PERSONAL_OUTCOME_IMPORTANCE', value: N.Q17, weight: 0.35, strength: 'DIRECT' }
  ]);
  const mods: any[] = [];
  if (crossSignalPatterns(N, A).includes('HIGH_RESTORATION_MOTIVATION'))
    mods.push({ id: 'motivation_reinforcement', pattern: 'HIGH_RESTORATION_MOTIVATION', value: 0.05 });
  const m = applyMods(w.score, mods);
  const status = statusOf(w.availability);
  const conf = confidenceOf({ ...w, flags: flagsFor(flags, 'R5') });
  return {
    id: 'R5', title: 'Your Restoration Motivation', status, score: status === 'insufficient_evidence' ? null : m.score,
    baseScore: w.score, band: status === 'insufficient_evidence' ? null : band(m.score),
    modifiers: mods, modifierTotal: m.total, availability: w.availability, confidence: conf, trail: w.trail,
    outputs: { appearanceImpact: N.Q3, restorationMotivation: N.Q15, personalOutcomeImportance: N.Q17 }
  };
}

const historyDetail = (n: number) => (n <= 0 ? 0 : n === 1 ? 0.25 : n <= 3 ? 0.5 : n <= 5 ? 0.75 : 1);

export function computeR6(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const ap = A.Q13.approaches;
  const chosen = ap ? ap.filter((a: string) => a !== 'nothing_yet') : null;
  const detail = chosen === null ? null : historyDetail(chosen.length);
  const fam = A.Q11.key === 'yes' ? 1 : A.Q11.key === 'no' ? 0 : null;
  const w = weighted([
    { q: 'Q10', signal: 'DURATION', value: N.Q10, weight: 0.3, strength: 'CONTEXTUAL' },
    { q: 'Q13', signal: 'TREATMENT_EXPERIENCE', value: N.Q13, weight: 0.5, strength: 'DIRECT' },
    { q: 'Q11', signal: 'FAMILY_CONTEXT', value: fam, weight: 0.05, strength: 'CONTEXTUAL', notSure: A.Q11.notSure },
    { q: 'Q13', signal: 'PREVIOUS_APPROACHES', value: detail, weight: 0.15, strength: 'SUPPORTING' }
  ]);
  const status = statusOf(w.availability);
  const conf = confidenceOf({ ...w, flags: flagsFor(flags, 'R6') });
  const T = N.Q13;
  const D = N.Q10;
  let stage: string | null = null;
  if (T !== null) {
    if (T >= 0.25 && ge(N.Q16, 0.75)) stage = 'restoration_focused';
    else if (T < 0.25 && (D === null || D < 0.5)) stage = 'newly_concerned';
    else if (T < 0.5) stage = 'early_explorer';
    else if (T < 0.7) stage = 'active_self_management';
    else stage = 'extensive_exploration';
  }
  const jw = weighted([
    { q: 'Q10', value: N.Q10, weight: 0.25, strength: 'CONTEXTUAL' },
    { q: 'Q13', value: N.Q13, weight: 0.35, strength: 'DIRECT' },
    { q: 'Q16', value: N.Q16, weight: 0.25, strength: 'DIRECT' },
    { q: 'Q19', value: N.Q19, weight: 0.15, strength: 'DIRECT' }
  ]);
  return {
    id: 'R6', title: 'Your Hair Restoration Journey', status, score: status === 'insufficient_evidence' ? null : w.score,
    band: status === 'insufficient_evidence' ? null : band(w.score), availability: w.availability, confidence: conf, trail: w.trail,
    treatmentExperience: T, treatmentBand: treatBand(T), approaches: ap || null, approachDetail: detail, journeyStage: stage,
    journeyComposite: jw.score, familyContext: A.Q11.key || null, duration: A.Q10.key || null
  };
}

export function computeR7(N: Record<string, number | null>, A: Record<string, any>, flags: any[]) {
  const w = weighted([
    { q: 'Q16', signal: 'RESTORATION_INTENT', value: N.Q16, weight: 0.4, strength: 'DIRECT' },
    { q: 'Q19', signal: 'TIME_INTENT', value: N.Q19, weight: 0.3, strength: 'DIRECT' },
    { q: 'Q20', signal: 'CONSULTATION_INTENT', value: N.Q20, weight: 0.3, strength: 'DIRECT' }
  ]);
  const mods: any[] = [];
  if (crossSignalPatterns(N, A).includes('HIGH_RESTORATION_READINESS'))
    mods.push({ id: 'readiness_reinforcement', pattern: 'HIGH_RESTORATION_READINESS', value: 0.05 });
  const m = applyMods(w.score, mods);
  const status = statusOf(w.availability);
  const own = flagsFor(flags, 'R7');
  const conf = confidenceOf({ ...w, flags: own });
  const score = status === 'insufficient_evidence' ? null : m.score;
  const stageSuppressed = flags.some((f) => f.suppresses === 'readiness_stage');
  const q20 = A.Q20.value ?? null;
  const consultLevel = q20 === null ? null : ['none_now', 'low', 'moderate', 'high', 'very_high'][q20 - 1];
  return {
    id: 'R7', title: 'Your Restoration Readiness', status, score, baseScore: w.score, band: score === null ? null : band(score),
    stage: score === null ? null : stageOf(score), stageSuppressed, modifiers: mods, modifierTotal: m.total,
    availability: w.availability, confidence: conf, trail: w.trail, timeline: A.Q19.key || null, timelineIndex: N.Q19,
    consultationIntentLevel: consultLevel, consultationScore: N.Q20, intentScore: N.Q16
  };
}
