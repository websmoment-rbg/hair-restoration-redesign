import { r6, clamp01, ge } from './engineCore';
import { SAFETY_STATEMENT, APPROACHES_PARAGRAPH, SPECIALIST_CLOSING } from './engineSafety';

export const PATHWAY_DEFS: Record<string, any> = {
  TRANSPLANT_CONSULTATION: {
    title: 'Hair-transplant consultation',
    summary: 'A conversation with a hair-restoration surgeon about whether and how transplant planning could fit your situation. The surgeon examines your scalp, donor area, hair characteristics and long-term pattern before any plan is made.',
    assess: [
      'Recipient area and long-term hair-loss pattern',
      'Donor area: density, distribution, caliber and stability',
      'Scalp characteristics, including elasticity',
      'Your hairstyle, scar and recovery preferences',
      'Realistic expectations and a long-term plan'
    ],
    tradeoffs: ['A consultation is an information step and does not commit you to a procedure.']
  },
  OPTIONS_REVIEW: {
    title: 'Hair-restoration options review',
    summary: 'A relaxed conversation with a specialist about what options exist, surgical and non-surgical, and what could realistically be achieved.',
    assess: [
      'Your main concern and what you would like to change',
      'Approaches you have already tried',
      'What is realistic and what timing suits you'
    ],
    tradeoffs: ['No decision is needed at this stage.']
  },
  FUE: {
    title: 'FUE (Follicular Unit Excision)',
    summary: 'Individual follicular units are taken one by one from the donor area and placed in the recipient area. It avoids a single linear donor scar, although it leaves many tiny extraction marks.',
    assess: [
      'Donor density and distribution',
      'Whether the donor area would remain acceptable after harvesting',
      'Hair length and shaving preferences'
    ],
    tradeoffs: ['Donor area may need trimming or shaving.', 'Many small extraction marks instead of one linear scar.']
  },
  FUT: {
    title: 'FUT (Follicular Unit Transplantation / strip)',
    summary: 'A thin strip of hair-bearing scalp is removed from the donor area, divided into individual grafts under magnification, and the donor wound is closed, leaving a linear scar.',
    assess: [
      'Safe donor zone width and scalp elasticity',
      'Your hairstyle and comfort with a linear scar',
      'Scarring and wound-healing history'
    ],
    tradeoffs: ['Leaves a linear scar that longer hair can usually conceal.', 'Less suited to very short hairstyles.']
  },
  HYBRID: {
    title: 'FUE + FUT (combination strategy)',
    summary: 'A surgeon-planning strategy in which both harvesting methods are used, often across a long-term restoration plan.',
    assess: [
      'Total long-term graft needs versus donor supply',
      'How to sequence sessions and manage donor reserves'
    ],
    tradeoffs: ['Usually involves more than one session.', 'Decided by the surgeon after donor assessment, not by this assessment.']
  },
  BHT: {
    title: 'Body-hair transplant (additional donor source)',
    summary: 'Non-scalp donor hair, commonly from the beard or body, can sometimes supplement a limited scalp donor supply. Extraction is generally FUE-style.',
    assess: [
      'Whether body or beard hair has suitable characteristics for the intended area',
      'How much scalp donor supply remains'
    ],
    tradeoffs: ['Body hair differs from scalp hair, and usefulness varies by person and goal.']
  },
  REPAIR: {
    title: 'Hair-transplant repair / corrective evaluation',
    summary: 'A review of a previous transplant that has an aesthetic, technical or donor-related concern. Corrective plans are highly individual and can involve graft removal, repositioning, additional grafting or combinations.',
    assess: [
      'What went wrong and why',
      'How much donor supply remains',
      'Whether further surgery is appropriate at all'
    ],
    tradeoffs: [
      'In some cases surgery should not be performed, for example if the specialist finds the remaining donor hair to be inadequate or if expectations cannot realistically be met.'
    ]
  }
};

export const indicatorSet = (C: any): Record<string, any[]> => {
  const T = (v: any) => (v === undefined ? null : !!v);
  const eq = (k: string, val: any) => (C[k] === undefined ? null : C[k] === val);
  const inn = (k: string, arr: any[]) => (C[k] === undefined ? null : arr.includes(C[k]));
  return {
    FUE: [
      { l: 'Prefers shorter hairstyles', s: 1, w: 2, v: T(C.prefersShortHair) },
      { l: 'Wants to avoid a linear scar', s: 1, w: 2, v: C.comfortableWithLinearScar === undefined ? null : C.comfortableWithLinearScar === false },
      { l: 'Clinician-recorded donor density: good', s: 1, w: 2, v: eq('donorDensity', 'good') },
      { l: 'Clinician-recorded donor stability: stable', s: 1, w: 1, v: eq('donorStability', 'stable') },
      { l: 'Willing to shave or trim the donor area', s: 1, w: 1, v: T(C.willingToShave) },
      { l: 'Previous FUT, so extra grafts without another strip may be of interest', s: 1, w: 1, v: T(C.previousFUT) },
      { l: 'Clinician-recorded donor density: very limited', s: -1, w: 2, v: eq('donorDensity', 'very_limited') },
      { l: 'Not willing to shave or trim the donor area', s: -1, w: 1, v: C.willingToShave === undefined ? null : C.willingToShave === false },
      { l: 'Clinician-recorded donor stability: unstable', s: -1, w: 1, v: eq('donorStability', 'unstable') },
    ],
    FUT: [
      { l: 'Narrow but good-quality safe donor zone', s: 1, w: 2, v: C.safeDonorZone === undefined || C.donorDensity === undefined ? null : C.safeDonorZone === 'narrow' && C.donorDensity === 'good' },
      { l: 'Clinician-recorded scalp laxity: good', s: 1, w: 2, v: eq('scalpLaxity', 'good') },
      { l: 'Comfortable with a linear scar', s: 1, w: 2, v: T(C.comfortableWithLinearScar) },
      { l: 'Keeps hair long enough to conceal a linear scar', s: 1, w: 1, v: C.prefersShortHair === undefined ? null : C.prefersShortHair === false },
      { l: 'Prefers not to shave the donor area', s: 1, w: 1, v: C.willingToShave === undefined ? null : C.willingToShave === false },
      { l: 'Broad perceived area of concern (may mean a substantial number of grafts is discussed)', s: 1, w: 1, v: T(C.perceivedBroadScope) },
      { l: 'Strong concern about a linear scar', s: -1, w: 3, v: C.comfortableWithLinearScar === undefined ? null : C.comfortableWithLinearScar === false },
      { l: 'Prefers very short hairstyles', s: -1, w: 2, v: T(C.prefersShortHair) },
      { l: 'Clinician-recorded scalp laxity: poor', s: -1, w: 3, v: eq('scalpLaxity', 'poor') },
      { l: 'History of hypertrophic or keloid scarring', s: -1, w: 3, v: eq('scarringHistory', 'hypertrophic_or_keloid') },
      { l: 'History of poor wound healing', s: -1, w: 2, v: eq('scarringHistory', 'poor_wound_healing') },
    ],
    HYBRID: [
      { l: 'Wants the maximum possible coverage', s: 1, w: 2, v: T(C.wantsMaximumCoverage) },
      { l: 'Broad perceived area of concern', s: 1, w: 2, v: T(C.perceivedBroadScope) },
      { l: 'Clinician-recorded donor density: limited', s: 1, w: 2, v: eq('donorDensity', 'limited') },
      { l: 'Previous donor harvesting', s: 1, w: 1, v: C.previousFUT === undefined && C.previousFUE === undefined ? null : !!(C.previousFUT || C.previousFUE) },
      { l: 'Open to more than one session', s: 1, w: 1, v: T(C.multipleSessionsOk) },
      { l: 'Not open to more than one session', s: -1, w: 2, v: C.multipleSessionsOk === undefined ? null : C.multipleSessionsOk === false },
      { l: 'Clinician-recorded donor density: very limited', s: -1, w: 2, v: eq('donorDensity', 'very_limited') },
    ],
    BHT: [
      { l: 'Suitable beard or body donor hair recorded by the clinician', s: 1, w: 3, v: T(C.bodyDonorAvailable) },
      { l: 'Clinician-recorded scalp donor density: very limited', s: 1, w: 2, v: eq('donorDensity', 'very_limited') },
      { l: 'Clinician-recorded scalp donor density: limited', s: 1, w: 1, v: eq('donorDensity', 'limited') },
      { l: 'Previous hair transplant', s: 1, w: 2, v: T(C.previousTransplant) },
      { l: 'Remaining scalp donor supply limited or none', s: 1, w: 1, v: inn('donorSupplyRemaining', ['limited', 'none']) },
      { l: 'No suitable beard or body donor hair recorded', s: -1, w: 3, v: C.bodyDonorAvailable === undefined ? null : C.bodyDonorAvailable === false },
      { l: 'Scalp donor density recorded as good, so extra donor sources may be unnecessary', s: -1, w: 2, v: eq('donorDensity', 'good') },
    ],
    REPAIR: [
      { l: 'Previous hair transplant', s: 1, w: 3, v: T(C.previousTransplant) },
      { l: 'Specific concerns about the previous result', s: 1, w: 2, v: C.previousTransplantIssues === undefined ? null : C.previousTransplantIssues.length > 0 },
      { l: 'Some donor supply remains', s: 1, w: 1, v: inn('donorSupplyRemaining', ['adequate', 'limited']) },
      { l: 'No donor supply remains, so further surgery may not be appropriate', s: -1, w: 3, v: eq('donorSupplyRemaining', 'none') },
    ],
  };
};

export function fitOf(inds: any[]) {
  let posMet = 0, posEval = 0, negMet = 0, evaluable = 0;
  const sup: string[] = [], lim: string[] = [], missing: string[] = [];
  for (const i of inds) {
    if (i.v === null) { missing.push(i.l); continue; }
    evaluable++;
    if (i.s > 0) { posEval += i.w; if (i.v) { posMet += i.w; sup.push(i.l); } }
    else if (i.v) { negMet += i.w; lim.push(i.l); }
  }
  if (evaluable < 2) return { fit: 'insufficient_information', score: null, sup, lim, missing };
  const score = posEval > 0 ? r6(clamp01((posMet - 1.5 * negMet) / posEval)) : 0;
  const fit = negMet >= 3 || (score !== null && score < 0.3) ? 'less_likely' : score !== null && score >= 0.6 && negMet === 0 ? 'worth_discussing' : 'may_be_discussed';
  return { fit, score, sup, lim, missing };
}

export const FIT_LABEL: Record<string, string> = {
  worth_discussing: 'Worth discussing first',
  may_be_discussed: 'May be discussed',
  less_likely: 'Less likely to fit your reported preferences',
  insufficient_information: 'Needs an in-person assessment',
  not_applicable: 'Not applicable'
};

export const FIT_RANK: Record<string, number> = {
  worth_discussing: 3,
  may_be_discussed: 2,
  insufficient_information: 1,
  less_likely: 0
};

export function computePathways(c: any, S: any, layers: string[]) {
  const { N, r1, r2, r5, r7 } = c;
  const concernIdx = c.concernIndex;
  const trace: string[] = [];
  const q15Low = N.Q15 !== null && N.Q15 <= 0.25;
  let relevance = 'exploratory';
  if (!q15Low && ge(concernIdx, 0.6) && ge(r5.score, 0.6) && ge(r7.score, 0.4)) relevance = 'strong';
  else if (!q15Low && (ge(concernIdx, 0.5) || ge(r5.score, 0.5)) && ge(r7.score, 0.2)) relevance = 'moderate';
  trace.push(`relevance=${relevance} (concernIndex=${concernIdx}, motivation=${r5.score}, readiness=${r7.score}, q15Low=${q15Low})`);
  const perceivedBroadScope = !!(r1.multiAreaFlag || r1.unresolved || (ge(r2.score, 0.7) && ge(r1.locations.hairline.score, 0.6)));
  const C = { ...S, perceivedBroadScope };
  const hasSupp = Object.keys(S).length > 0;
  const lead = relevance === 'exploratory' ? 'OPTIONS_REVIEW' : 'TRANSPLANT_CONSULTATION';
  const mk = (id: string, ev: any) => ({
    id, ...PATHWAY_DEFS[id], fit: ev.fit, fitLabel: FIT_LABEL[ev.fit],
    fitScore: ev.score, supportingFactors: ev.sup, limitingFactors: ev.lim, missingInformation: ev.missing
  });
  const out: any[] = [mk(lead, { fit: 'worth_discussing', score: null, sup: [], lim: [], missing: [] })];
  let branch: string;
  if (S.previousTransplant === true) branch = 'repair';
  else if (S.previousTransplant === false) branch = S.donorDensity ? `primary_${S.donorDensity}` : 'primary_donor_unknown';
  else branch = 'history_unknown';
  trace.push(`branch=${branch}`);

  const inds = indicatorSet(C);
  const evalP = (id: string) => {
    const e = fitOf(inds[id]);
    trace.push(`${id}: fit=${e.fit} score=${e.score} +${e.sup.length} -${e.lim.length}`);
    return e;
  };

  let ids: string[] = [];
  if (!hasSupp || branch === 'history_unknown' || branch === 'primary_donor_unknown') {
    if (relevance !== 'exploratory') {
      for (const id of ['FUE', 'FUT']) {
        const e = evalP(id);
        out.push(mk(id, { ...e, fit: 'insufficient_information' }));
      }
    }
  } else if (branch === 'repair') ids = ['REPAIR', 'BHT', 'FUE', 'FUT'];
  else if (branch === 'primary_good') ids = ['FUE', 'FUT'];
  else if (branch === 'primary_limited') ids = ['FUE', 'FUT', 'HYBRID'];
  else if (branch === 'primary_very_limited') ids = ['BHT'];

  const evals = ids.map((id) => ({ id, e: evalP(id) }));
  evals
    .filter((x) => x.e.fit !== 'insufficient_information' || x.id === 'REPAIR')
    .sort((a, b) => (FIT_RANK[b.e.fit] - FIT_RANK[a.e.fit]) || (((b.e.score as number) ?? -1) - ((a.e.score as number) ?? -1)) || (a.id < b.id ? -1 : 1))
    .forEach((x) => out.push(mk(x.id, x.e)));

  const top = out.slice(1).find((p) => p.fit === 'worth_discussing' || p.fit === 'may_be_discussed');
  const soft = {
    strong: 'Because your responses show a clear area of concern, strong personal importance and an interest in discussing options, a hair-transplant consultation may be a useful next conversation. A surgeon can explain whether and how transplant planning could fit your situation after examining your scalp and donor area.',
    moderate: 'Your responses suggest it may be worth learning what a hair-transplant consultation involves. It is an information step, and a surgeon can explain what could be relevant for you after an in-person assessment.',
    exploratory: 'Your responses suggest you are still exploring. A relaxed options review with a specialist can help you understand what exists, what is realistic, and whether anything is worth pursuing now.',
  }[relevance];

  const potentialApproaches = [...new Set(out.slice(1).filter((p) => p.fit !== 'less_likely').map((p) => p.id))];
  const reason: string[] = [];
  if (ge(r7.score, 0.6)) reason.push('restoration intent is elevated');
  if (c.goalSpecific) reason.push('patient goal relates to restoration');
  if (relevance === 'exploratory') reason.push('patient is still exploring');
  reason.push('clinical donor assessment is still required');

  const procedurePathway = {
    category: relevance === 'exploratory' ? 'restoration_options_discussion' : 'hair_transplant_discussion',
    specificApproach: null,
    confidence: 'informational_only',
    pathwayCategory: relevance === 'exploratory' ? 'restoration_options_discussion' : 'hair_transplant_discussion',
    potentialApproaches: relevance === 'exploratory' && !hasSupp ? [] : potentialApproaches.length ? potentialApproaches : ['FUE', 'FUT'],
    specificApproachDetermined: false,
    reason,
    clinicalEvaluationRequired: true,
  };

  return {
    title: 'Potential Restoration Pathway',
    framing: 'Potential treatment pathway based on your reported profile',
    relevance,
    softRecommendation: soft,
    approachesParagraph: relevance === 'exploratory' ? null : APPROACHES_PARAGRAPH,
    disclaimer: `${SAFETY_STATEMENT} These pathways are topics to discuss and are not a recommendation for any procedure.`,
    branch,
    potentialPathway: top ? top.id : lead,
    pathways: out,
    evidenceLayersUsed: ['PATIENT_REPORTED_QUESTIONNAIRE', ...layers],
    perceivedBroadScope,
    decisionTrace: trace,
    procedurePathway,
    notes: [
      'FUE and FUT are the two principal donor-harvesting methods. DHI refers to an implantation approach, not a separate harvesting method.',
      'Hybrid, body-hair and repair pathways are never output from the questionnaire alone; they require supplementary patient preferences, clinician findings or a stated transplant history.',
      'Donor density, caliber, donor stability, scalp laxity and body-donor suitability are clinician-entered findings and are never inferred from questionnaire answers.'
    ],
    missingInputsForRefinement: hasSupp ? [] : ['donorDensity', 'safeDonorZone', 'donorStability', 'scalpLaxity', 'donorSupplyRemaining'],
  };
}
