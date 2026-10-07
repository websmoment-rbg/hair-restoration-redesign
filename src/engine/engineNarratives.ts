import { ge, lt, band, BAND_LABEL, stageOf, STAGES, STAGE_LABEL, list } from './engineCore';
import {
  DURATION_LABEL, TIME_LABEL, GOAL_VERB, OUTCOME_LABEL, GOAL_FOCUS,
  LOC_PHRASE, LOC_SHORT, LOC_SIGNAL_LABEL, APPROACH_LABEL, CONTEXT_PHRASE,
  GOAL_FAMILY, LOC_FAMILY
} from './engineDefinitions';
import { flagsFor } from './engineScoring';
import { INTENT_LANGUAGE } from './engineSafety';

const lvlWord = (b: string | null) => ({ low: 'low', mild: 'mild', moderate: 'moderate', high: 'high', very_high: 'very high' }[b || ''] || '');
const INSUFF = 'There is not enough information in your answers to interpret this section in detail, so we have kept it general. A specialist can fill in the gaps with you.';

export function narrR1(r: any, c: any) {
  const P: string[] = [];
  let head: string;
  if (r.status === 'insufficient_evidence') return { headline: 'Not enough information to map your concern', paragraphs: [INSUFF], keyInsight: INSUFF };
  const L = r.locations;
  const sec = r.secondary;
  const pc = c.A.Q9.key;
  if (r.suppressed) head = 'Your answers about where you notice changes point in different directions, so we have kept this section broad.';
  else if (r.unresolved) head = `Your responses point to more than one area of focus: ${list(r.coPrimary.map((i: string) => LOC_SHORT[i]))}.`;
  else if (r.primary && r.dominance === 'primary') head = `Your main area of concern appears to be the ${LOC_PHRASE[r.primary]}${sec ? `, with additional concern around ${LOC_SHORT[sec]}` : ''}.`;
  else if (r.primary && r.dominance === 'leading') head = `Your responses suggest a ${lvlWord(r.band)} level of concern overall, most noticeable around the ${LOC_PHRASE[r.primary]}${sec ? `, and to a lesser degree around ${LOC_SHORT[sec]}` : ''}.`;
  else head = 'Your responses indicate little perceived concern in any specific area at the moment.';
  P.push(head);
  if (r.primary && r.dominance !== 'none') P.push(`Your responses place the strength of this concern signal at a ${lvlWord(r.band)} level${r.dominanceStrength ? ' and it stands out clearly from your other areas' : ''}. This is a product interpretation band based on what you reported, not a medical severity measure.`);
  if (L.hairline.modifiers.length) P.push('Your answers about hairline change, forehead visibility and where you notice loss all point the same way, which makes the frontal picture especially consistent.');
  if (L.crown.modifiers.length) P.push('Your crown answer and your chosen location agree, which makes the crown picture especially consistent.');
  if (c.A.Q8.notSure) P.push("You said you're not sure where it's most noticeable, so we based this on your other answers and kept our confidence in the specific location lower.");
  if (r.gapClass === 'near_tie' && r.tieBroken && !r.unresolved) P.push('Two areas scored very closely, so the leading area is a gentle indication rather than a firm conclusion.');
  if (pc && CONTEXT_PHRASE[pc]) P.push(CONTEXT_PHRASE[pc] as string);
  return { headline: 'Where you notice your concern', paragraphs: P, keyInsight: head };
}

export function narrR2(r: any, c: any) {
  if (r.status === 'insufficient_evidence') return { headline: 'Not enough information on coverage', paragraphs: [INSUFF], keyInsight: INSUFF };
  const o = r.outputs;
  const P: string[] = [];
  let key: string;
  if (ge(r.score, 0.5) && ge(o.scalpVisibilitySignal, 0.5) && ge(o.overallFullnessConcern, 0.5))
    key = 'Your responses suggest that reduced fullness and visible scalp are important parts of your current concern.';
  else if (r.score !== null && r.score < 0.25) key = 'Your responses indicate limited perceived concern about coverage and density right now.';
  else {
    const m = Math.max(o.scalpVisibilitySignal ?? -1, o.crownCoverageConcern ?? -1, o.overallFullnessConcern ?? -1);
    if (m === (o.overallFullnessConcern ?? -2)) key = 'Loss of overall fullness is the strongest coverage signal in your responses.';
    else if (m === (o.scalpVisibilitySignal ?? -2)) key = 'Visible scalp is the strongest coverage signal in your responses.';
    else key = 'Crown coverage is the strongest coverage signal in your responses.';
  }
  P.push(key, `Overall, your perceived coverage concern is ${lvlWord(r.band)}.`);
  if (ge(o.crownCoverageConcern, 0.5) && !ge(o.scalpVisibilitySignal, 0.5)) P.push('Your crown stands out more than your overall scalp visibility.');
  if (r.modifiers.length) P.push('Your scalp-visibility and fullness answers reinforce each other, which strengthens this reading.');
  if (c.A.Q9.key === 'bright_lighting') P.push('You mainly notice this under bright lighting, so how it looks to you can vary with the light.');
  P.push('These are perceived signals based on how you see your hair, not a measurement of density.');
  return { headline: 'How you perceive coverage and fullness', paragraphs: P, keyInsight: key };
}

export function narrR3(r: any, c: any) {
  if (r.status === 'insufficient_evidence') return { headline: 'Not enough information on change over time', paragraphs: [INSUFF], keyInsight: INSUFF };
  const P: string[] = [];
  const lvl = { limited: 'limited', mild: 'mild', moderate: 'moderate', high: 'high', very_high: 'very high' }[r.level as string] || '';
  const key = `Your responses suggest that you perceive a ${lvl} amount of change over time.`;
  P.push(key);
  const d = c.A.Q10.key;
  if (d) P.push(`Your concern has been with you for ${DURATION_LABEL[d]}${['2_5y', 'gt_5y'].includes(d) ? ', so this is a longer-standing part of your story' : d === 'lt_6m' ? ', so it is still fairly recent' : ''}.`);
  if (c.N.Q7 !== null) P.push(c.N.Q7 >= 0.75 ? 'You also noticed significant change in the last 12–24 months.' : c.N.Q7 <= 0.25 ? 'You have noticed little change over the last 12–24 months.' : 'You noticed some change over the last 12–24 months.');
  if (c.N.Q12 !== null && c.N.Q12 >= 0.75) P.push('Your concern has also grown noticeably since you first noticed the change.');
  else if (c.N.Q12 !== null && c.N.Q12 <= 0.25) P.push('Your level of concern has stayed about the same since you first noticed it.');
  P.push('This is perceived change as you experience it. It is not medically confirmed progression.');
  return { headline: 'How things have changed for you', paragraphs: P, keyInsight: key };
}

export function narrR4(r: any, c: any) {
  const P: string[] = [];
  const g14 = r.q14Goal, g18 = r.q18Outcome;
  if (r.status === 'insufficient_evidence') {
    const k = "You haven't settled on a single priority yet, which is completely fine. Working out what matters most is a good thing to explore with a specialist.";
    return { headline: "You're still shaping your goal", paragraphs: [k], keyInsight: k };
  }
  let key: string;
  if (g14 && g14 !== 'unsure') key = `Your strongest restoration priority is ${GOAL_VERB[g14]}.`;
  else key = g18 === 'realistic' ? 'Your strongest priority right now is understanding what could realistically be achieved.' : `The result you most want to explore is ${GOAL_VERB[g18]}.`;
  P.push(key);
  if (g18 && g18 !== 'unsure') P.push(`With a specialist, you would most like to discuss: ${OUTCOME_LABEL[g18].toLowerCase()}.`);
  if (r.alignment === 'high') P.push('Your top priority and the result you most want to discuss line up closely.');
  else if (r.alignment === 'moderate') P.push('Your top priority and the result you want to discuss overlap, though not completely.');
  else if (r.alignment === 'low') P.push('You pointed to different things for your top priority and the result you want to discuss. A specialist can help you decide what to approach first.');
  if (r.status === 'limited') P.push('Because one of these answers was "not sure", we have kept this section general.');
  const ga = c.goalConcernAlignment;
  if (ga === 'low' && c.r1.primary) P.push(`Your main concern appears to be around ${LOC_SHORT[c.r1.primary]}, while your primary restoration goal is focused on ${GOAL_FOCUS[r.primaryGoal] || 'a different area'}.`);
  return { headline: 'What you want to change', paragraphs: P, keyInsight: key };
}

export function narrR5(r: any, c: any) {
  if (r.status === 'insufficient_evidence') return { headline: 'Not enough information on motivation', paragraphs: [INSUFF], keyInsight: INSUFF };
  const P: string[] = [];
  const key = `Your answers indicate ${lvlWord(r.band)} personal importance around improving how your hair looks.`;
  P.push(key);
  if (c.N.Q15 !== null) P.push(c.N.Q15 >= 0.75 ? 'Restoring the way your hair looks matters more to you than simply slowing further loss.' : c.N.Q15 <= 0.25 ? 'Restoring appearance is not a high priority for you right now, and slowing further loss may matter more.' : 'Restoring appearance matters to you, alongside the wish to slow further loss.');
  const ct = { high: 'high', moderate: 'moderate', low: 'low' }[c.concernIndex >= 0.7 ? 'high' : c.concernIndex >= 0.5 ? 'moderate' : 'low'];
  const mt = { high: 'high', moderate: 'moderate', low: 'low' }[r.score >= 0.7 ? 'high' : r.score >= 0.5 ? 'moderate' : 'low'];
  if (ct !== 'high' && mt === 'high') P.push('This is different from physical concern: even where perceived concern is moderate, improving your appearance matters a great deal to you.');
  else if (ct === 'high' && mt === 'low') P.push('You perceive notable change, yet restoring appearance is not currently a high personal priority. Both are valid, and they are kept separate here.');
  P.push('This describes how much the result matters to you personally. It is not a medical severity score.');
  return { headline: 'How much this matters to you', paragraphs: P, keyInsight: key };
}

export function narrR6(r: any, c: any) {
  if (r.status === 'insufficient_evidence') return { headline: 'Not enough information on your journey', paragraphs: [INSUFF], keyInsight: INSUFF };
  const P: string[] = [];
  const ap = r.approaches ? r.approaches.filter((a: string) => a !== 'nothing_yet').map((a: string) => APPROACH_LABEL[a]) : [];
  const stageTxt: Record<string, string> = {
    newly_concerned: 'You are newly concerned and at the start of your journey.',
    early_explorer: 'You are an early explorer, having tried a little so far.',
    active_self_management: 'You have been actively managing your hair with several approaches.',
    extensive_exploration: 'You have explored a wide range of approaches.',
    restoration_focused: 'You are focused on restoration and have already explored approaches along the way.'
  };
  let key: string;
  if (ap.length) key = `You've already explored ${list(ap)}, which means you're further along in your journey than someone just beginning to research options.`;
  else key = r.journeyStage ? stageTxt[r.journeyStage] : 'You have not tried any approaches yet, which is a perfectly good place to begin.';
  P.push(key);
  if (r.journeyStage && ap.length && stageTxt[r.journeyStage]) P.push(stageTxt[r.journeyStage]);
  if (r.duration) P.push(`Your concern began about ${DURATION_LABEL[r.duration]} ago.`);
  P.push('Previous approaches are recorded for context only. They do not mean any particular treatment is needed, and we do not assume whether they worked.');
  return { headline: 'Your journey so far', paragraphs: P, keyInsight: key };
}

const READY_TXT: Record<string, string> = {
  curious: "You're at the curiosity stage, exploring what's possible with no pressure to act.",
  researching: "You're in the research stage, gathering information.",
  exploring: "You're actively exploring your options.",
  seriously_considering: "You're currently in the serious exploration stage.",
  ready_to_discuss: "You indicated you're ready to discuss restoration options with a specialist."
};

export function narrR7(r: any, c: any) {
  if (r.status === 'insufficient_evidence' || r.score === null) return { headline: 'Not enough information on readiness', paragraphs: [INSUFF], keyInsight: INSUFF };
  const P: string[] = [];
  if (r.stageSuppressed) {
    const k = 'Your answers about how ready you are point in different directions, so we have not placed you at a specific stage. A specialist can help clarify what feels right for you.';
    return { headline: 'Where you are right now', paragraphs: [k], keyInsight: k };
  }
  const tl = r.timeline;
  const key = tl && tl !== 'researching' ? `${READY_TXT[r.stage]} You indicated you may want to explore restoration ${TIME_LABEL[tl]}.` : `${READY_TXT[r.stage]} You indicated ${TIME_LABEL[tl] || 'no fixed timeline'}.`;
  P.push(key);
  if (r.consultationIntentLevel === 'none_now') P.push("You'd prefer not to be contacted right now, and that is respected.");
  else if (r.consultationIntentLevel === 'very_high') P.push('You said you would like to speak with someone directly.');
  else if (r.consultationIntentLevel === 'high') P.push("You'd like to learn more.");
  P.push('This describes how ready you are to discuss options. It does not mean you are ready for, or suited to, any procedure.');
  return { headline: 'Where you are right now', paragraphs: P, keyInsight: key };
}

const GENERAL_NOTE = 'Because some answers were unavailable or marked "not sure", we have kept this section general.';
const BROAD_NOTE = 'Some of your answers pointed in different directions, so we have kept this section broad rather than specific.';

export function broaden(narr: Record<string, any>, results: Record<string, any>, flags: any[]) {
  const keys = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];
  for (const k of keys) {
    const n = narr[k], r = results[k];
    if (!n || r.status === 'insufficient_evidence') continue;
    const has = (s: string) => n.paragraphs.some((p: string) => p.includes(s));
    if ((r.status === 'limited' || (r.confidence.band === 'low' && r.availability < 1)) && !has('general')) n.paragraphs.push(GENERAL_NOTE);
    if (flagsFor(flags, k).some((f: any) => f.severity === 'medium' || f.severity === 'high') && !has('broad') && !has('not placed you')) n.paragraphs.push(BROAD_NOTE);
  }
  return narr;
}

export function personalize(c: any) {
  const { r1, r7 } = c;
  const ready = r7.score;
  const loc = r1.primary;
  const goal = c.goalCat;
  const R = [
    { id: 'hairline_hairline_ready', when: () => loc === 'hairline' && goal === 'hairline' && ge(ready, 0.6), headline: 'Your assessment points strongly toward improving the appearance of your hairline.', support: 'Your responses also show that you are seriously exploring restoration.' },
    { id: 'crown_crown_ready', when: () => loc === 'crown' && goal === 'crown' && ge(ready, 0.6), headline: 'Your assessment points strongly toward improving the coverage at your crown.', support: 'Your responses also show that you are seriously exploring restoration.' },
    { id: 'coverage_ready', when: () => GOAL_FAMILY(goal) === 'coverage' && LOC_FAMILY[loc] === 'coverage' && ge(ready, 0.6), headline: `Your assessment points strongly toward improving ${GOAL_FOCUS[goal]}.`, support: 'Your responses also show that you are seriously exploring restoration.' },
    { id: 'mismatch', when: () => c.goalConcernAlignment === 'low' && loc, headline: `Your main concern appears to be around ${LOC_SHORT[loc]}, while your top priority is ${GOAL_FOCUS[goal]}.`, support: 'That difference is useful to talk through with a specialist.' },
    { id: 'goal_early', when: () => GOAL_FOCUS[goal] && lt(ready, 0.6), headline: `Your assessment points toward improving ${GOAL_FOCUS[goal]}.`, support: "You're still at an earlier stage, which is a perfectly good place to gather information." },
    { id: 'multi_or_unsure', when: () => r1.unresolved || goal === 'unsure' || goal === 'realistic' || !loc, headline: 'Your responses point to more than one area of focus, and you are still shaping what you want.', support: 'A specialist conversation can help bring that into focus.' },
  ];
  const hit = R.find((x) => x.when());
  if (hit) return { rule: hit.id, headline: hit.headline, support: hit.support };
  return { rule: 'generic', headline: 'Your assessment gives a picture of what you notice, what you want and where you are in your journey.', support: 'A specialist can help you decide what is worth exploring.' };
}

export const focusPhrase = (c: any) => {
  const g = c.goalCat;
  let base = GOAL_FOCUS[g] || (c.r1.primary ? LOC_SHORT[c.r1.primary] : 'your hair');
  if (g !== 'overall' && ge(c.r2.score, 0.7) && GOAL_FAMILY(g) !== 'coverage') base += ' and overall coverage';
  return base;
};
