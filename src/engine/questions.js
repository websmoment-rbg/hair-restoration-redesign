var gRoot = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this);
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HairQuestions = factory();
  }
})(gRoot, function () {
  'use strict';

  var AREA_LABELS = {
    hairline: 'Hairline',
    temples: 'Temples',
    top: 'Top / mid-scalp',
    crown: 'Crown',
    overall: 'Overall'
  };

  var STAGE_LABELS = {
    curious: 'Curious',
    researching: 'Researching',
    comparing: 'Comparing options',
    exploring: 'Seriously exploring',
    ready: 'Ready to discuss'
  };

  var STAGES = ['curious', 'researching', 'comparing', 'exploring', 'ready'];

  function scale5(labels) {
    return labels.map(function (label, idx) {
      return { value: idx + 1, label: label, weight: (idx) / 4 };
    });
  }

  var QUESTIONS = [
    {
      key: 'q1',
      id: 'q1',
      number: 1,
      title: 'Hairline Change',
      text: 'Think about your hairline compared with older photos. What feels most accurate today?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'It looks almost the same',
        'I notice a small change',
        'There is a noticeable change',
        'The change is quite significant',
        'My hairline looks very different now'
      ])
    },
    {
      key: 'q2',
      id: 'q2',
      number: 2,
      title: 'Frontal Visibility',
      text: 'When you look at your forehead compared with a few years ago, how noticeable is the change?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not noticeable at all',
        'Slightly noticeable',
        'Moderately noticeable',
        'Very noticeable',
        'Extremely noticeable'
      ])
    },
    {
      key: 'q3',
      id: 'q3',
      number: 3,
      title: 'Appearance Impact',
      text: 'How much does the current shape of your hairline affect the way your face looks to you?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not at all',
        'Slightly',
        'Moderately',
        'Significantly',
        'Very significantly'
      ])
    },
    {
      key: 'q4',
      id: 'q4',
      number: 4,
      title: 'Scalp Visibility',
      text: 'Under normal indoor lighting, how easily can you see your scalp through your hair?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not noticeable',
        'Slightly visible',
        'Moderately visible',
        'Very noticeable',
        'Extremely noticeable'
      ])
    },
    {
      key: 'q5',
      id: 'q5',
      number: 5,
      title: 'Crown Concern',
      text: 'How noticeable is thinning around your crown or vertex area?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not noticeable',
        'Slightly noticeable',
        'Moderately noticeable',
        'Very noticeable',
        'Extremely noticeable'
      ])
    },
    {
      key: 'q6',
      id: 'q6',
      number: 6,
      title: 'Perceived Fullness Change',
      text: 'When you compare your hair today with older photos, how much fullness do you feel you have lost?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Almost no difference',
        'Slightly less full',
        'Noticeably less full',
        'Much less full',
        'Dramatically less full'
      ])
    },
    {
      key: 'q7',
      id: 'q7',
      number: 7,
      title: 'Recent Change (12–24 mo)',
      text: 'Over approximately the last 12–24 months, how much has your hair loss changed?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        "I haven't noticed any change",
        'Very little change',
        'Some noticeable change',
        'Significant change',
        'Major change'
      ])
    },
    {
      key: 'q8',
      id: 'q8',
      number: 8,
      title: 'Primary Location',
      text: 'Where do you notice your hair loss most clearly?',
      mode: 'single',
      options: [
        { key: 'hairline', label: 'Front / hairline', weight: 0.8 },
        { key: 'temples', label: 'Temples', weight: 0.7 },
        { key: 'top', label: 'Top / mid-scalp', weight: 0.75 },
        { key: 'crown', label: 'Crown / vertex', weight: 0.85 },
        { key: 'overall', label: 'Overall thinning', weight: 0.8 },
        { key: 'unsure', label: "I'm not sure", weight: 0.3 }
      ]
    },
    {
      key: 'q9',
      id: 'q9',
      number: 9,
      title: 'Perception Context',
      text: 'When do you notice your hair loss most?',
      mode: 'single',
      options: [
        { key: 'mostly_mirror', label: 'Mostly in the mirror', weight: 0.6 },
        { key: 'mostly_photos', label: 'Mostly in photographs', weight: 0.6 },
        { key: 'both_equally', label: 'Both equally', weight: 0.7 },
        { key: 'bright_lighting', label: 'Mainly under bright lighting', weight: 0.8 },
        { key: 'everywhere', label: 'I notice it everywhere', weight: 0.9 },
        { key: 'unsure', label: "I'm not sure", weight: 0.3 }
      ]
    },
    {
      key: 'q10',
      id: 'q10',
      number: 10,
      title: 'Duration',
      text: 'How long have you been concerned about your hair loss or thinning?',
      mode: 'single',
      options: [
        { key: 'lt_6m', label: 'Less than 6 months', weight: 0.15 },
        { key: '6_12m', label: '6–12 months', weight: 0.35 },
        { key: '1_2y', label: '1–2 years', weight: 0.55 },
        { key: '2_5y', label: '2–5 years', weight: 0.75 },
        { key: 'gt_5y', label: 'More than 5 years', weight: 0.95 }
      ]
    },
    {
      key: 'q11',
      id: 'q11',
      number: 11,
      title: 'Family History',
      text: 'Does significant hair loss run in your family?',
      mode: 'single',
      options: [
        { key: 'yes', label: 'Yes', weight: 0.8 },
        { key: 'no', label: 'No', weight: 0.2 },
        { key: 'unsure', label: "I'm not sure", weight: 0.5 }
      ]
    },
    {
      key: 'q12',
      id: 'q12',
      number: 12,
      title: 'Concern Trajectory',
      text: 'Compared with when you first noticed the problem, how much has your concern increased?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not at all',
        'Slightly',
        'Moderately',
        'Significantly',
        'Very significantly'
      ])
    },
    {
      key: 'q13',
      id: 'q13',
      number: 13,
      title: 'Previous Approaches',
      text: 'What have you already tried to manage or improve your hair?',
      mode: 'multi',
      options: [
        { key: 'medication', label: 'Prescription Medication (Minoxidil / Finasteride)' },
        { key: 'prp', label: 'PRP (Platelet-Rich Plasma)' },
        { key: 'supplements', label: 'Nutraceuticals & Supplements' },
        { key: 'hair_products', label: 'Topical Hair Serums' },
        { key: 'special_shampoos', label: 'Specialized Shampoos' },
        { key: 'home_remedies', label: 'Home Remedies & Scalp Massage' },
        { key: 'other', label: 'Other Explored Approaches' },
        { key: 'none', label: 'Nothing yet' }
      ]
    },
    {
      key: 'q14',
      id: 'q14',
      number: 14,
      title: 'Primary Restoration Goal',
      text: 'If you could improve one area of your hair first, what would matter most to you?',
      mode: 'single',
      options: [
        { key: 'hairline', label: 'Restore the hairline', weight: 0.8 },
        { key: 'top', label: 'Improve density on top', weight: 0.75 },
        { key: 'crown', label: 'Improve crown coverage', weight: 0.75 },
        { key: 'overall', label: 'Create a fuller overall appearance', weight: 0.7 },
        { key: 'unsure', label: "I'm not sure yet", weight: 0.3 }
      ]
    },
    {
      key: 'q15',
      id: 'q15',
      number: 15,
      title: 'Restoration Motivation',
      text: 'How important is restoring the way your hair looks to you, compared with simply slowing further hair loss?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        "Restoring appearance isn't important to me",
        'Slightly important',
        'Moderately important',
        'Very important',
        'Extremely important'
      ])
    },
    {
      key: 'q16',
      id: 'q16',
      number: 16,
      title: 'Restoration Interest',
      text: 'How seriously are you currently considering hair restoration?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        "I'm just curious",
        "I'm starting to research it",
        "I'm seriously exploring my options",
        'I would consider doing something if it felt right',
        "I'm ready to discuss restoration with a specialist"
      ])
    },
    {
      key: 'q17',
      id: 'q17',
      number: 17,
      title: 'Personal Outcome Importance',
      text: 'Imagine having a fuller-looking hairline and/or better coverage. How much difference would that make to you personally?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Very little',
        'A small difference',
        'A noticeable difference',
        'A major difference',
        'A life-changing difference'
      ])
    },
    {
      key: 'q18',
      id: 'q18',
      number: 18,
      title: 'Desired Consultation Topic',
      text: 'Which result would you most want to discuss with a hair-restoration specialist?',
      mode: 'single',
      options: [
        { key: 'natural_hairline', label: 'A more natural-looking hairline', weight: 0.85 },
        { key: 'more_coverage', label: 'Greater density on top', weight: 0.8 },
        { key: 'crown_coverage', label: 'Better crown coverage', weight: 0.8 },
        { key: 'fuller_overall', label: 'Fuller overall appearance', weight: 0.75 },
        { key: 'realistic', label: 'Understanding what could realistically be achieved', weight: 0.6 },
        { key: 'understand_options', label: 'Understanding treatment options', weight: 0.6 },
        { key: 'unsure', label: "I'm not sure yet", weight: 0.3 }
      ]
    },
    {
      key: 'q19',
      id: 'q19',
      number: 19,
      title: 'Ideal Timeline',
      text: 'If you decided to explore restoration, when would you ideally want to do it?',
      mode: 'single',
      options: [
        { key: 'undecided', label: 'Timing is undecided for now', weight: 0.15 },
        { key: 'researching', label: "I'm just researching for now", weight: 0.25 },
        { key: '6_12m', label: 'Within the next 6–12 months', weight: 0.50 },
        { key: '3_6m', label: 'Within the next 3–6 months', weight: 0.75 },
        { key: '1_3m', label: 'Within the next 1–3 months', weight: 0.90 },
        { key: 'asap', label: 'As soon as I find the right option', weight: 1.0 }
      ]
    },
    {
      key: 'q20',
      id: 'q20',
      number: 20,
      title: 'Consultation Intent',
      text: 'Would you like a hair-restoration specialist to review your profile and discuss what options may be worth exploring for you?',
      mode: 'slider',
      min: 1,
      max: 5,
      options: scale5([
        'Not right now',
        'Maybe later',
        "I'm open to it",
        "Yes, I'd like to learn more",
        "Yes, I'd like to speak with someone directly"
      ])
    }
  ];

  return {
    QUESTIONS: QUESTIONS,
    AREA_LABELS: AREA_LABELS,
    STAGE_LABELS: STAGE_LABELS,
    STAGES: STAGES
  };
});
