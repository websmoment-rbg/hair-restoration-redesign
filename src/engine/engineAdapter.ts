import { assess, runGoldenTests } from './engineMain';
import { QUESTIONS } from './engineCore';
import { SAFETY_STATEMENT, INTENT_LANGUAGE } from './engineSafety';

export interface AssessmentSubmission {
  answers: Record<string, any>;
  supplementary?: Record<string, any>;
  options?: { allowPartial?: boolean };
  meta?: {
    assessmentId: string;
    patientId: string;
    timestamp: string;
  };
}

export function evaluateAssessment(submission: AssessmentSubmission) {
  try {
    const result = assess(submission);
    return result;
  } catch (error: any) {
    return {
      status: 'calculation_error',
      error: error?.message || 'An unexpected assessment error occurred',
      engineVersion: '1.1.0'
    };
  }
}

export { assess, runGoldenTests, QUESTIONS, SAFETY_STATEMENT, INTENT_LANGUAGE };
