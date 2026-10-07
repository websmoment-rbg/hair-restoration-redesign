import {
  VERSIONS, r6, clamp01, norm5, ge, lt, cap, list, hash53,
  band, BAND_LABEL, stageOf, STAGES, STAGE_LABEL, confBand, treatBand, tier, EV, evName,
  QUESTIONS, QUESTION_BY_ID, ALIASES
} from './engineCore';

const DURATION_INDEX: Record<string, number> = { lt_6m: 0, '6_12m': 0.25, '1_2y': 0.5, '2_5y': 0.75, gt_5y: 1 };
const TIME_INDEX: Record<string, number> = { researching: 0, '6_12m': 0.25, '3_6m': 0.5, '1_3m': 0.75, asap_right_option: 1 };
const DURATION_LABEL: Record<string, string> = { lt_6m: 'less than 6 months', '6_12m': '6–12 months', '1_2y': '1–2 years', '2_5y': '2–5 years', gt_5y: 'more than 5 years' };
const TIME_LABEL: Record<string, string> = { researching: "you're just researching for now", '6_12m': 'within the next 6–12 months', '3_6m': 'within the next 3–6 months', '1_3m': 'within the next 1–3 months', asap_right_option: 'as soon as you find the right option' };
const GOAL14: Record<string, string> = { restore_hairline: 'hairline', density_top: 'top', crown_coverage: 'crown', reduce_visible_scalp: 'scalp', fuller_overall: 'overall', not_sure: 'unsure' };
const GOAL18: Record<string, string> = { natural_hairline: 'hairline', density_top: 'top', crown_coverage: 'crown', fuller_overall: 'overall', realistic_expectations: 'realistic', not_sure: 'unsure' };
const GOAL_LABEL: Record<string, string> = { hairline: 'Restore the hairline', top: 'Improve density on top', crown: 'Improve crown coverage', scalp: 'Reduce visible scalp', overall: 'Create a fuller overall appearance', realistic: 'Understand what could realistically be achieved', unsure: 'Not sure yet' };
const OUTCOME_LABEL: Record<string, string> = { hairline: 'A more natural-looking hairline', top: 'Greater density on top', crown: 'Better crown coverage', overall: 'A fuller overall appearance', realistic: 'Understanding what could realistically be achieved', unsure: 'Not sure yet' };
const GOAL_FOCUS: Record<string, string> = { hairline: 'your hairline', top: 'the density on top of your scalp', crown: 'your crown coverage', scalp: 'how visible your scalp is', overall: 'your overall fullness' };
const GOAL_VERB: Record<string, string> = { hairline: 'improving the appearance of your hairline', top: 'improving density on top', crown: 'improving crown coverage', scalp: 'reducing visible scalp', overall: 'creating a fuller overall appearance' };
const GOAL_CODE: Record<string, string> = { hairline: 'hairline_restoration_goal', top: 'top_density_goal', crown: 'crown_coverage_goal', scalp: 'visible_scalp_goal', overall: 'overall_fullness_goal', realistic: 'realistic_expectations_goal', unsure: 'goal_still_forming' };
const COVERAGE_GOAL: Record<string, number> = { scalp: 1, overall: 1, top: 0.75, crown: 0.75, hairline: 0.5 };
const GOAL_EXACT_LOC: Record<string, string[]> = { hairline: ['hairline', 'temples'], top: ['top'], crown: ['crown'], overall: ['overall'], scalp: ['top', 'overall'] };
const LOC_PHRASE: Record<string, string> = { hairline: 'frontal/hairline region', temples: 'temple region', top: 'top / mid-scalp area', crown: 'crown / vertex area', overall: 'overall density (a more diffuse pattern)' };
const LOC_SHORT: Record<string, string> = { hairline: 'the hairline', temples: 'the temples', top: 'the top of the scalp', crown: 'the crown', overall: 'overall density' };
const LOC_SIGNAL_LABEL: Record<string, string> = { hairline: 'Hairline / frontal region', temples: 'Temples', top: 'Top / mid-scalp', crown: 'Crown', overall: 'Overall thinning' };
const LOC_FAMILY: Record<string, string> = { hairline: 'frontal', temples: 'frontal', top: 'coverage', crown: 'coverage', overall: 'coverage' };
const Q8_LOC: Record<string, string> = { front_hairline: 'hairline', temples: 'temples', top_midscalp: 'top', crown: 'crown', overall_thinning: 'overall' };
const APPROACH_LABEL: Record<string, string> = { medication: 'medication', prp: 'PRP', supplements: 'supplements', hair_products: 'hair products', special_shampoos: 'special shampoos', home_remedies: 'home remedies', other: 'other approaches' };
const APPROACH_ROWS = [['medication', 'Medication'], ['prp', 'PRP'], ['supplements', 'Supplements'], ['hair_products', 'Hair products'], ['special_shampoos', 'Special shampoos'], ['home_remedies', 'Home remedies'], ['other', 'Other']];
const CONTEXT_PHRASE: Record<string, string | null> = { mostly_mirror: 'You mostly notice it when looking in the mirror.', mostly_photos: 'You mostly notice it in photographs.', both_equally: 'You notice it in mirrors and photographs alike.', bright_lighting: 'You notice it mainly under bright lighting, which can make scalp visibility look stronger or weaker depending on the light.', everywhere: 'You notice it across many everyday situations.', not_sure: null };
const GOAL_FAMILY = (g: string) => (g === 'hairline' ? 'frontal' : ['top', 'crown', 'scalp', 'overall'].includes(g) ? 'coverage' : null);
const SIGNAL_OF: Record<string, string> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.signal]));

export {
  DURATION_INDEX, TIME_INDEX, DURATION_LABEL, TIME_LABEL, GOAL14, GOAL18,
  GOAL_LABEL, OUTCOME_LABEL, GOAL_FOCUS, GOAL_VERB, GOAL_CODE, COVERAGE_GOAL,
  GOAL_EXACT_LOC, LOC_PHRASE, LOC_SHORT, LOC_SIGNAL_LABEL, LOC_FAMILY, Q8_LOC,
  APPROACH_LABEL, APPROACH_ROWS, CONTEXT_PHRASE, GOAL_FAMILY, SIGNAL_OF
};
