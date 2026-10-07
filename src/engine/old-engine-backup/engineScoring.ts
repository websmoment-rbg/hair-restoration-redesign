import { r6, clamp01, band, confBand, EV, evName } from './engineCore';

export interface ScoreInput {
  q?: string;
  signal?: string;
  value: number | null | undefined;
  weight: number;
  strength: 'UNCERTAIN' | 'WEAK' | 'CONTEXTUAL' | 'SUPPORTING' | 'DIRECT';
  notSure?: boolean;
}

export function weighted(inputs: ScoreInput[]) {
  let num = 0, vw = 0, ew = 0, ns = 0, bestValid = 0, bestPositive = 0;
  const trail: any[] = [];
  for (const i of inputs) {
    ew += i.weight;
    const valid = i.value !== null && i.value !== undefined;
    if (valid) {
      vw += i.weight;
      num += (i.value as number) * i.weight;
      bestValid = Math.max(bestValid, EV[i.strength]);
      if ((i.value as number) > 0) bestPositive = Math.max(bestPositive, EV[i.strength]);
    }
    if (i.notSure) ns++;
    trail.push({
      question: i.q,
      signal: i.signal,
      normalized: valid ? r6(i.value) : null,
      weight: i.weight,
      contribution: valid ? r6((i.value as number) * i.weight) : null,
      evidence: i.strength,
      status: valid ? 'valid' : i.notSure ? 'not_sure' : 'missing',
    });
  }
  return {
    score: vw > 0 ? r6(num / vw) : null,
    validWeight: r6(vw),
    expectedWeight: r6(ew),
    availability: ew > 0 ? r6(vw / ew) : 0,
    trail,
    notSureCount: ns,
    bestValid,
    bestPositive,
  };
}

export const SEV_PEN: Record<string, number> = { low: 0.05, medium: 0.15, high: 0.35 };

export function confidenceOf({ availability, notSureCount, flags, bestValid }: {
  availability: number;
  notSureCount: number;
  flags: any[];
  bestValid: number;
}) {
  const uncertainty = Math.min(0.6, 0.2 * notSureCount);
  const contradiction = Math.min(0.6, flags.reduce((s: number, f: any) => s + (SEV_PEN[f.severity] || 0), 0));
  const missingData = availability < 1 ? (1 - availability) * 0.5 : 0;
  const weakEvidence = bestValid >= EV.SUPPORTING ? 0 : 0.15;
  let v = clamp01(availability * (1 - uncertainty) * (1 - contradiction) * (1 - missingData) * (1 - weakEvidence));
  if (availability < 0.6) v = Math.min(v, 0.39);
  return {
    value: r6(v) ?? 0,
    band: confBand(v),
    penalties: { uncertainty: r6(uncertainty), contradiction: r6(contradiction), missingData: r6(missingData), weakEvidence },
  };
}

export const statusOf = (avail: number) => (avail < 0.4 ? 'insufficient_evidence' : avail < 0.6 ? 'limited' : 'complete');
export const flagsFor = (flags: any[], id: string) => flags.filter((f) => f.affects.includes(id));
export const applyMods = (base: number | null, mods: any[]) => {
  if (base === null) return { score: null, total: 0 };
  const total = Math.max(-0.15, Math.min(0.15, mods.reduce((s, m) => s + m.value, 0)));
  return { score: r6(clamp01(base * (1 + total))), total: r6(total) };
};

export const SUPP_SCHEMA: Record<string, any> = {
  previousTransplant: { t: 'bool', src: 'patient' },
  prefersShortHair: { t: 'bool', src: 'patient' },
  willingToShave: { t: 'bool', src: 'patient' },
  comfortableWithLinearScar: { t: 'bool', src: 'patient' },
  wantsMaximumCoverage: { t: 'bool', src: 'patient' },
  multipleSessionsOk: { t: 'bool', src: 'patient' },
  scarringHistory: { t: 'enum', v: ['none', 'hypertrophic_or_keloid', 'poor_wound_healing', 'unsure'], src: 'patient' },
  previousTransplantIssues: { t: 'enumArray', v: ['unnatural_hairline', 'poor_angulation', 'visible_grafts', 'poor_density', 'uneven_density', 'gaps', 'donor_depletion', 'donor_scarring', 'recipient_scarring', 'visible_linear_scar', 'other'], src: 'patient' },
  donorDensity: { t: 'enum', v: ['good', 'limited', 'very_limited'], src: 'clinician' },
  safeDonorZone: { t: 'enum', v: ['adequate', 'narrow'], src: 'clinician' },
  donorStability: { t: 'enum', v: ['stable', 'uncertain', 'unstable'], src: 'clinician' },
  scalpLaxity: { t: 'enum', v: ['good', 'average', 'poor'], src: 'clinician' },
  bodyDonorAvailable: { t: 'bool', src: 'clinician' },
  previousFUT: { t: 'bool', src: 'clinician' },
  previousFUE: { t: 'bool', src: 'clinician' },
  donorSupplyRemaining: { t: 'enum', v: ['adequate', 'limited', 'none'], src: 'clinician' },
};
