export const SAFETY_STATEMENT =
  'This assessment provides an informational profile based on your responses. It does not determine medical suitability or guarantee a particular procedure or result. A qualified hair-restoration specialist must evaluate your scalp, donor area, hair characteristics, restoration goals and overall clinical situation before recommending a treatment approach.';

export const APPROACHES_PARAGRAPH =
  'Depending on your clinical assessment, a specialist may discuss approaches such as FUE or FUT, but the appropriate approach depends on factors that this questionnaire cannot measure, including your donor area, hair characteristics and long-term restoration plan.';

export const SPECIALIST_CLOSING =
  'Your assessment helps organize your goals and concerns. The specialist consultation determines what is clinically appropriate.';

export const TRANSITION =
  "Based on the profile you've shared, a specialist consultation may help you understand which restoration options are worth exploring for your situation.";

export const INTENT_LANGUAGE: Record<string, string> = {
  lower: "Your responses suggest that you're still exploring your options. Learning more about the available restoration approaches may help you decide what, if anything, you would like to discuss with a specialist.",
  moderate: 'Based on your reported goals, a hair-restoration consultation may help you understand which options could be relevant to your situation.',
  high: 'Your responses indicate strong interest in restoration. A specialist can review your profile and discuss whether a hair-transplant pathway may be worth exploring.',
  very_high: "You're indicating strong interest in discussing restoration. The next useful step is a specialist consultation to review your profile and determine which options may be appropriate after clinical evaluation.",
};

export const PROHIBITED = [
  /androgenetic\s+alopecia/i, /norwood/i, /\b\d[\d,]*\s*grafts?\b/i, /ideal\s+(hair\s+)?(transplant\s+)?candidate/i,
  /you\s*(are|'re)\s+(a\s+|an\s+)?(good|suitable|ideal|strong|excellent|perfect)\s+candidate/i, /donor\s+(area|zone|supply|density)\s+(is|are|looks?)\b/i,
  /follicles?\s+(are|is)\s+(healthy|dead|miniaturi[sz]ed|strong)/i, /you\s+(definitely\s+)?need\s+(a\s+)?(hair\s+)?transplant/i, /\b(will|would)\s+(definitely\s+)?(work|succeed)\s+for\s+you/i,
  /treatment\s+will\s+succeed/i, /\d+\s*%\s*(growth|hair\s*loss|chance|success|suitab|medical)/i, /guarantee[ds]?\b/i, /best\s+procedure/i, /book\s+your\s+transplant/i,
  /you\s+(have|suffer\s+from|are\s+suffering\s+from)\s+(alopecia|baldness|a\s+hair[- ]loss\s+(disease|condition))/i, /you\s+(are|were)\s+diagnosed/i, /\bprescrib/i,
  /you\s+should\s+(take|start|use)\s+(finasteride|minoxidil|medication)/i, /you\s+(must|have\s+to)\s+(get|have|undergo)\s+(a\s+)?(transplant|surgery|procedure)/i,
  /\bPRP\s+(will|would|is\s+going\s+to)\s+(work|help|succeed)/i, /you\s+(are|'re)\s+norwood/i, /\byou\s+need\s+(fue|fut|bht)\b/i, /(fue|fut|bht)\s+is\s+the\s+(best|right)\s+(procedure|approach|option)/i,
  /you\s+will\s+(achieve|regrow|get)\b.*\b(growth|density|hair)/i,
];

export const APPROVED_STATEMENTS = [
  SAFETY_STATEMENT, APPROACHES_PARAGRAPH, SPECIALIST_CLOSING, TRANSITION,
  ...Object.values(INTENT_LANGUAGE)
];

export function validateStatement(s: string) {
  let t = String(s);
  for (const a of APPROVED_STATEMENTS) t = t.split(a).join(' ');
  const hits: string[] = [];
  for (const re of PROHIBITED) if (re.test(t)) hits.push(re.source);
  return { ok: hits.length === 0, violations: hits };
}

export const FALLBACK =
  'Your responses are summarized here based on what you reported. A specialist can discuss what they may mean for you after a clinical evaluation.';

export function safetyScan(node: any, path: string, log: any[]): any {
  if (typeof node === 'string') {
    const v = validateStatement(node);
    if (!v.ok) {
      log.push({ path, violations: v.violations, original: node });
      return FALLBACK;
    }
    return node;
  }
  if (Array.isArray(node)) return node.map((x, i) => safetyScan(x, `${path}[${i}]`, log));
  if (node && typeof node === 'object') {
    const o: Record<string, any> = {};
    for (const [k, v] of Object.entries(node)) o[k] = safetyScan(v, `${path}.${k}`, log);
    return o;
  }
  return node;
}

export const collectText = (n: any, out: string[] = []): string[] => {
  if (typeof n === 'string') out.push(n);
  else if (Array.isArray(n)) n.forEach((x) => collectText(x, out));
  else if (n && typeof n === 'object') Object.values(n).forEach((x) => collectText(x, out));
  return out;
};
