/*
 * ============================================================================
 *  MASTER HAIR ASSESSMENT ENGINE  —  04_ASSESSMENT_ENGINE  ·  v1.1.0 (unified)
 * ============================================================================
 */

const VERSIONS = { engine: '1.1.0', questionnaire: '1.0.0', rulebook: '1.0.0', narrative: '1.0.0' };

const r6 = (x) => (x === null || x === undefined || Number.isNaN(x) ? null : Math.round(x * 1e6) / 1e6);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const norm5 = (a) => (a - 1) / 4;
const ge = (x, t) => x !== null && x !== undefined && x >= t;
const lt = (x, t) => x !== null && x !== undefined && x < t;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const list = (a) => (a.length <= 1 ? a[0] || '' : a.length === 2 ? a.join(' and ') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const normText = (s) => String(s).toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
const hash53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
};

const band = (s) => {
  if (s === null || s === undefined) return null;
  const v = r6(s);
  return v < 0.25 ? 'low' : v < 0.5 ? 'mild' : v < 0.7 ? 'moderate' : v < 0.85 ? 'high' : 'very_high';
};
const BAND_LABEL = { low: 'Low', mild: 'Mild', moderate: 'Moderate', high: 'High', very_high: 'Very High' };
const stageOf = (s) => {
  if (s === null || s === undefined) return null;
  const v = r6(s);
  return v < 0.2 ? 'curious' : v < 0.4 ? 'researching' : v < 0.6 ? 'exploring' : v < 0.8 ? 'seriously_considering' : 'ready_to_discuss';
};
const STAGES = ['curious', 'researching', 'exploring', 'seriously_considering', 'ready_to_discuss'];
const STAGE_LABEL = { curious: 'Curious', researching: 'Researching', exploring: 'Exploring', seriously_considering: 'Seriously Considering', ready_to_discuss: 'Ready to Discuss' };
const confBand = (c) => (c < 0.4 ? 'low' : c < 0.7 ? 'moderate' : c < 0.85 ? 'high' : 'very_high');
const treatBand = (t) => (t === null ? null : t < 0.25 ? 'Little/no previous exploration' : t < 0.5 ? 'Early exploration' : t < 0.7 ? 'Several approaches tried' : t < 0.85 ? 'Extensive exploration' : 'Extensive prior experimentation');
const tier = (x) => (x === null || x === undefined ? null : x >= 0.7 ? 'high' : x >= 0.5 ? 'moderate' : 'low');
const EV = { UNCERTAIN: 0, WEAK: 1, CONTEXTUAL: 2, SUPPORTING: 3, DIRECT: 4 };
const evName = (n) => Object.keys(EV).find((k) => EV[k] === n) || 'UNCERTAIN';

const scaleOpts = (labels, ind) => labels.map((label, i) => ({ id: null, value: i + 1, label, indicates: ind[i] }));
const catOpts = (arr) => arr.map(([key, label, indicates]) => ({ key, label, indicates }));

const QUESTIONS = [
  { id: 'Q1', section: 1, sectionTitle: 'Your Hairline', title: 'Hairline Change', type: 'scale5', category: 'A_CORE', signal: 'HAIRLINE_CHANGE', measures: 'Hairline Change',
    text: 'Think about your hairline compared with older photos. What feels most accurate today?',
    options: scaleOpts(['It looks almost the same', 'I notice a small change', 'There is a noticeable change', 'The change is quite significant', 'My hairline looks very different now'],
      ['Little or no meaningful change perceived in the hairline compared with older photos.', 'A mild perceived change in the hairline.', 'A clearly perceived change in the hairline.', 'A substantial perceived change in the hairline.', 'A very substantial perceived change compared with previous appearance.']),
    engineRole: ['Hairline Change', 'Frontal Concern', 'Overall Restoration Profile'], boundary: 'Self-reported perception of change, not an objective measurement of hairline recession.' },
  { id: 'Q2', section: 1, sectionTitle: 'Your Hairline', title: 'Frontal Visibility', type: 'scale5', category: 'A_CORE', signal: 'FRONTAL_VISIBILITY', measures: 'Frontal visibility',
    text: 'When you look at your forehead compared with a few years ago, how noticeable is the change?',
    options: scaleOpts(['Not noticeable at all', 'Slightly noticeable', 'Moderately noticeable', 'Very noticeable', 'Extremely noticeable'],
      ['Essentially no noticeable change in frontal/forehead appearance.', 'A subtle perceived change.', 'A clearly perceptible but moderate change.', 'A strong perceived change in frontal appearance.', 'The change is highly noticeable to the user.']),
    engineRole: ['Frontal Concern', 'Hairline-related appearance change'], boundary: 'Perceived frontal change, not a clinical measurement of forehead size or hairline position.' },
  { id: 'Q3', section: 1, sectionTitle: 'Your Hairline', title: 'Appearance Impact', type: 'scale5', category: 'C_MOTIVATION', signal: 'APPEARANCE_IMPACT', measures: 'Appearance impact',
    text: 'How much does the current shape of your hairline affect the way your face looks to you?',
    options: scaleOpts(['Not at all', 'Slightly', 'Moderately', 'Significantly', 'Very significantly'],
      ['Little or no personal appearance impact.', 'A small perceived effect on appearance.', 'A meaningful but moderate appearance impact.', 'A substantial effect on how the user perceives their appearance.', 'The hairline is a major component of the appearance concern.']),
    engineRole: ['Appearance Impact', 'Restoration Motivation'], boundary: 'Connects the physical concern with the personal reason for considering restoration. Not a medical severity score.' },
  { id: 'Q4', section: 2, sectionTitle: 'Density & Coverage', title: 'Scalp Visibility', type: 'scale5', category: 'A_CORE', signal: 'SCALP_VISIBILITY', measures: 'Density / coverage',
    text: 'Under normal indoor lighting, how easily can you see your scalp through your hair?',
    options: scaleOpts(['Not noticeable', 'Slightly visible', 'Moderately visible', 'Very noticeable', 'Extremely noticeable'],
      ['Little perceived scalp visibility.', 'Mild perceived scalp visibility.', 'Moderate perceived scalp visibility.', 'Substantial perceived scalp visibility.', 'Very high perceived scalp visibility.']),
    engineRole: ['Density / Coverage', 'Visible Scalp Concern'], boundary: 'Lighting, hairstyle and length affect visibility. Self-reported visual signal, not a clinical density measurement.' },
  { id: 'Q5', section: 2, sectionTitle: 'Density & Coverage', title: 'Crown Concern', type: 'scale5', category: 'A_CORE', signal: 'CROWN_CONCERN', measures: 'Crown concern',
    text: 'How noticeable is thinning around your crown or vertex area?',
    options: scaleOpts(['Not noticeable', 'Slightly noticeable', 'Moderately noticeable', 'Very noticeable', 'Extremely noticeable'],
      ['Little or no perceived crown thinning.', 'Mild perceived crown concern.', 'A moderate perceived crown concern.', 'A substantial perceived crown concern.', 'A highly noticeable crown concern according to the user.']),
    engineRole: ['Crown Concern', 'Coverage Profile', 'Restoration Goal Matching'], boundary: 'Self-reported concern; does not establish the cause of crown thinning.' },
  { id: 'Q6', section: 2, sectionTitle: 'Density & Coverage', title: 'Overall Density Change', type: 'scale5', category: 'A_CORE', signal: 'FULLNESS_LOSS', measures: 'Overall density change',
    text: 'When you compare your hair today with older photos, how much fullness do you feel you have lost?',
    options: scaleOpts(['Almost no difference', 'Slightly less full', 'Noticeably less full', 'Much less full', 'Dramatically less full'],
      ['Little perceived change in overall fullness.', 'Mild perceived loss of fullness.', 'A clear perceived reduction in fullness.', 'A substantial perceived reduction in fullness.', 'A very substantial perceived reduction in fullness.']),
    engineRole: ['Overall Density Change', 'Coverage Profile', 'Progression Context'], boundary: 'Perceived fullness change, not a measured density change.' },
  { id: 'Q7', section: 3, sectionTitle: 'Progression', title: 'Progression Signal', type: 'scale5', category: 'A_CORE', signal: 'PERCEIVED_CHANGE', measures: 'Progression signal',
    text: 'Over approximately the last 12–24 months, how much has your hair loss changed?',
    options: scaleOpts(["I haven't noticed any change", 'Very little change', 'Some noticeable change', 'Significant change', 'Major change'],
      ['No perceived change during the stated period.', 'Minimal perceived change.', 'A moderate perceived change.', 'Substantial perceived change.', 'Pronounced perceived change.']),
    engineRole: ['Progression Signal', 'Change Profile'], boundary: 'Perceived progression, not objectively verified progression.' },
  { id: 'Q8', section: 3, sectionTitle: 'Progression', title: 'Primary Location', type: 'single', category: 'B_CONTEXT', signal: 'PRIMARY_LOCATION', measures: 'Primary location',
    text: 'Where do you notice your hair loss most clearly?',
    options: catOpts([
      ['front_hairline', 'Front / hairline', 'The frontal/hairline region is the primary perceived area of concern.'],
      ['temples', 'Temples', 'The temple region is the primary perceived area of concern.'],
      ['top_midscalp', 'Top / mid-scalp', 'The top or mid-scalp region is the primary perceived area of concern.'],
      ['crown', 'Crown', 'The crown/vertex region is the primary perceived area of concern.'],
      ['overall_thinning', 'Overall thinning', 'A more generalized reduction in fullness rather than one isolated area.'],
      ['more_than_one', 'More than one area', 'Concern across multiple regions.'],
      ['not_sure', "I'm not sure", 'Cannot confidently identify the primary location.']]),
    engineRole: ['Location Profile', 'Report Personalization', 'Restoration Goal Matching'], boundary: 'Categorical location signal. Never converted into a generic severity score.' },
  { id: 'Q9', section: 3, sectionTitle: 'Progression', title: 'Perception / Context', type: 'single', category: 'B_CONTEXT', signal: 'PERCEPTION_CONTEXT', measures: 'Perception/context',
    text: 'When do you notice your hair loss most?',
    options: catOpts([
      ['mostly_mirror', 'Mostly in the mirror', 'Noticed mainly during direct self-observation.'],
      ['mostly_photos', 'Mostly in photographs', 'Photographs are the main context in which the concern is noticed.'],
      ['both_equally', 'Both equally', 'Noticed similarly in mirrors and photographs.'],
      ['bright_lighting', 'Mainly under bright lighting', 'Lighting strongly affects when the concern is noticed.'],
      ['everywhere', 'I notice it everywhere', 'Perceived across multiple everyday contexts.'],
      ['not_sure', "I'm not sure", 'Uncertain about the context in which the concern is most noticeable.']]),
    engineRole: ['Context only: report relatability and personalization'], boundary: 'Context only. Never heavily affects scoring (cap 5%).' },
  { id: 'Q10', section: 4, sectionTitle: 'Your Hair-Loss Story', title: 'Duration', type: 'single', category: 'B_CONTEXT', signal: 'DURATION', measures: 'Duration',
    text: 'How long have you been concerned about your hair loss or thinning?',
    options: catOpts([
      ['lt_6m', 'Less than 6 months', 'A relatively recent period of concern.'],
      ['6_12m', '6–12 months', 'Concern present for roughly six months to one year.'],
      ['1_2y', '1–2 years', 'An established concern over one to two years.'],
      ['2_5y', '2–5 years', 'A longer-standing concern.'],
      ['gt_5y', 'More than 5 years', 'A long-term hair concern.']]),
    engineRole: ['Duration', 'Hair-loss story', 'Report context'], boundary: 'Duration of concern does not necessarily equal duration of objectively verified hair loss.' },
  { id: 'Q11', section: 4, sectionTitle: 'Your Hair-Loss Story', title: 'Family Context', type: 'single', category: 'B_CONTEXT', signal: 'FAMILY_CONTEXT', measures: 'Family context',
    text: 'Does significant hair loss run in your family?',
    options: catOpts([
      ['yes', 'Yes', 'Reports significant hair loss among family members.'],
      ['no', 'No', 'Does not report significant family hair loss.'],
      ['not_sure', "I'm not sure", 'Does not know enough about family history to answer confidently.']]),
    engineRole: ['Contextual information only'], boundary: 'Never used to tell someone they have a particular condition (cap 5%).' },
  { id: 'Q12', section: 4, sectionTitle: 'Your Hair-Loss Story', title: 'Concern Trajectory', type: 'scale5', category: 'C_MOTIVATION', signal: 'CONCERN_TRAJECTORY', measures: 'Concern trajectory',
    text: 'Compared with when you first noticed the problem, how much has your concern increased?',
    options: scaleOpts(['Not at all', 'Slightly', 'Moderately', 'Significantly', 'Very significantly'],
      ['Concern has not meaningfully increased.', 'A small increase in concern.', 'A moderate increase in concern.', 'A substantial increase in concern.', 'A strong increase in concern over time.']),
    engineRole: ['Concern Trajectory', 'Motivation', 'Personal Impact'], boundary: "Measures the user's concern, not necessarily progression of the underlying hair issue." },
  { id: 'Q13', section: 5, sectionTitle: 'What Have You Already Done?', title: 'Treatment Journey', type: 'scale5_followup', category: 'B_CONTEXT', signal: 'TREATMENT_EXPERIENCE', measures: 'Treatment journey',
    text: 'How much have you already tried to manage or improve your hair?',
    options: scaleOpts(['Nothing yet', 'A few basic things', 'Several approaches', "I've tried quite a lot", "I've tried many different approaches"],
      ['No meaningful hair-management approach attempted.', 'Limited previous attempts.', 'Multiple approaches explored.', 'A substantial history of previous attempts.', 'Extensive previous attempts to manage or improve the concern.']),
    followUp: { text: 'Which have you tried?', multi: true, options: catOpts([
      ['medication', 'Medication', 'Previous or current use of medication related to the hair concern.'],
      ['prp', 'PRP', 'Previous experience with PRP.'],
      ['supplements', 'Supplements', 'Previous use of supplements.'],
      ['hair_products', 'Hair products', 'Use of hair-related products.'],
      ['special_shampoos', 'Special shampoos', 'Use of specialized shampoos.'],
      ['home_remedies', 'Home remedies', 'Use of home-based approaches.'],
      ['other', 'Other', 'An approach not represented in the predefined options.'],
      ['nothing_yet', 'Nothing yet', 'No previous approach reported.']]) },
    engineRole: ['Treatment Journey', 'Previous Experience', 'Conversation Context'], boundary: 'Never assume an attempted approach was effective, ineffective, appropriate or inappropriate.' },
  { id: 'Q14', section: 6, sectionTitle: 'What Do You Actually Want To Change?', title: 'Primary Restoration Goal', type: 'single', category: 'C_MOTIVATION', signal: 'RESTORATION_GOAL', measures: 'Primary restoration goal',
    text: 'If you could improve one area of your hair first, what would matter most to you?',
    options: catOpts([
      ['restore_hairline', 'Restore the hairline', 'Hairline restoration is the primary desired change.'],
      ['density_top', 'Improve density on top', 'Top/mid-scalp fullness is the primary goal.'],
      ['crown_coverage', 'Improve crown coverage', 'Crown coverage is the primary goal.'],
      ['reduce_visible_scalp', 'Reduce visible scalp', 'Reducing visible scalp is the primary desired outcome.'],
      ['fuller_overall', 'Create a fuller overall appearance', 'Focused on overall visual fullness rather than one region.'],
      ['not_sure', "I'm not sure yet", 'No specific restoration priority identified yet.']]),
    engineRole: ['Primary Goal', 'Report headline/personalization', 'Desired Outcome', 'Consultation discussion topic', 'Pathway-context matching'], boundary: 'Categorical only. No artificial severity score.' },
  { id: 'Q15', section: 6, sectionTitle: 'What Do You Actually Want To Change?', title: 'Restoration Motivation', type: 'scale5', category: 'C_MOTIVATION', signal: 'RESTORATION_MOTIVATION', measures: 'Restoration motivation',
    text: 'How important is restoring the way your hair looks to you, compared with simply slowing further hair loss?',
    options: scaleOpts(["Restoring appearance isn't important to me", 'Slightly important', 'Moderately important', 'Very important', 'Extremely important'],
      ['Low priority placed on restoration of appearance.', 'A limited restoration priority.', 'A meaningful but moderate restoration priority.', 'A strong desire to improve appearance.', 'Restoring appearance is a very high personal priority.']),
    engineRole: ['Restoration Motivation', 'Outcome Importance', 'Consultation Context'], boundary: 'Personal preference/motivation measure, not a medical severity score.' },
  { id: 'Q16', section: 7, sectionTitle: 'The Result They Want', title: 'Restoration Intent', type: 'scale5', category: 'D_INTENT', signal: 'RESTORATION_INTENT', measures: 'Restoration intent',
    text: 'How seriously are you currently considering hair restoration?',
    options: scaleOpts(["I'm just curious", "I'm starting to research it", "I'm seriously exploring my options", 'I would consider doing something if it felt right', "I'm ready to discuss restoration with a specialist"],
      ['Early-stage curiosity.', 'An initial research phase.', 'Active consideration.', 'Stronger consideration, conditional on finding a suitable option.', 'High stated readiness for a specialist conversation.']),
    engineRole: ['Restoration Intent', 'Lead Intent', 'Consultation Readiness'], boundary: 'Intent is not clinical suitability.' },
  { id: 'Q17', section: 7, sectionTitle: 'The Result They Want', title: 'Personal Outcome Importance', type: 'scale5', category: 'C_MOTIVATION', signal: 'PERSONAL_OUTCOME_IMPORTANCE', measures: 'Personal outcome importance',
    text: 'Imagine having a fuller-looking hairline and/or better coverage. How much difference would that make to you personally?',
    options: scaleOpts(['Very little', 'A small difference', 'A noticeable difference', 'A major difference', 'A life-changing difference'],
      ['Low personal importance attached to the desired visual outcome.', 'Modest personal importance.', 'Meaningful personal importance.', 'High personal importance.', 'Extremely high perceived personal importance.']),
    engineRole: ['Personal Outcome Importance', 'Motivation', 'Lead Intent Context'], boundary: 'Not a medical score. Measures how important the desired result feels to the individual.' },
  { id: 'Q18', section: 7, sectionTitle: 'The Result They Want', title: 'Desired Consultation Topic', type: 'single', category: 'C_MOTIVATION', signal: 'DESIRED_OUTCOME', measures: 'Desired outcome + consultation topic',
    text: 'Which result would you most want to discuss with a hair-restoration specialist?',
    options: catOpts([
      ['natural_hairline', 'A more natural-looking hairline', 'Wants to discuss hairline appearance and restoration.'],
      ['density_top', 'Greater density on top', 'Top/mid-scalp density is the preferred discussion topic.'],
      ['crown_coverage', 'Better crown coverage', 'Crown coverage is the preferred discussion topic.'],
      ['fuller_overall', 'Fuller overall appearance', 'Overall visual fullness is the desired topic.'],
      ['realistic_expectations', 'Understanding what could realistically be achieved', 'Primarily wants professional guidance about realistic possibilities.'],
      ['not_sure', "I'm not sure yet", 'Needs more information before identifying a specific desired result.']]),
    engineRole: ['Desired Outcome', 'Consultation Topic', 'Report Personalization', 'CTA Personalization'], boundary: 'Categorical; describes what the user wants to discuss.' },
  { id: 'Q19', section: 8, sectionTitle: 'Readiness', title: 'Time Intent', type: 'single', category: 'D_INTENT', signal: 'TIME_INTENT', measures: 'Time intent',
    text: 'If you decided to explore restoration, when would you ideally want to do it?',
    options: catOpts([
      ['researching', "I'm just researching for now", 'Early-stage research; low immediate time commitment.'],
      ['6_12m', 'Within the next 6–12 months', 'Longer-term consideration.'],
      ['3_6m', 'Within the next 3–6 months', 'Medium-term consideration.'],
      ['1_3m', 'Within the next 1–3 months', 'Relatively near-term intent.'],
      ['asap_right_option', 'As soon as I find the right option', 'High stated urgency, conditional on finding an option the user considers suitable.']]),
    engineRole: ['Readiness', 'Time Intent', 'Lead Segmentation'], boundary: 'Intent/timing score, not a recommendation to undergo treatment.' },
  { id: 'Q20', section: 8, sectionTitle: 'Readiness', title: 'Consultation Intent', type: 'scale5', category: 'D_INTENT', signal: 'CONSULTATION_INTENT', measures: 'Consultation intent',
    text: 'Would you like a hair-restoration specialist to review your profile and discuss what options may be worth exploring for you?',
    options: scaleOpts(['Not right now', 'Maybe later', "I'm open to it", "Yes, I'd like to learn more", "Yes, I'd like to speak with someone"],
      ['Does not currently want specialist contact.', 'Possible future interest, low immediate consultation intent.', 'Openness to consultation without strong immediate intent.', 'Positive interest in receiving more information.', 'Strong stated desire for direct specialist communication.']),
    engineRole: ['Consultation Intent', 'Lead Intent', 'CTA / Booking Flow'], boundary: 'Stated preference; the CTA must respect it.' },
];

for (const q of QUESTIONS) q.options.forEach((o, i) => { o.id = `${q.id}_A${i + 1}`; });
const QUESTION_BY_ID: Record<string, any> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
const ALIASES: Record<string, any> = {};
for (const q of QUESTIONS) {
  if (q.type === 'single') {
    ALIASES[q.id] = {};
    for (const o of q.options) {
      ALIASES[q.id][normText(o.label)] = o.key;
      ALIASES[q.id][o.key] = o.key;
      ALIASES[q.id][o.id] = o.key;
      ALIASES[q.id][normText(o.id)] = o.key;
    }
  }
  if (q.followUp) {
    ALIASES.Q13_followup = {};
    for (const o of q.followUp.options) {
      ALIASES.Q13_followup[normText(o.label)] = o.key;
      ALIASES.Q13_followup[o.key] = o.key;
    }
  }
}

export {
  VERSIONS,
  r6, clamp01, norm5, ge, lt, cap, list, normText, hash53,
  band, BAND_LABEL, stageOf, STAGES, STAGE_LABEL, confBand, treatBand, tier, EV, evName,
  QUESTIONS, QUESTION_BY_ID, ALIASES
};
