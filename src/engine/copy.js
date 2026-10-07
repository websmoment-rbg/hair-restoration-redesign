var gRoot = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this);
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HairCopy = factory();
  }
})(gRoot, function () {
  'use strict';

  var TOPIC_LIBRARY = {
    hairline_design: {
      id: 'hairline_design',
      label: 'Artistic Hairline Design',
      q: 'How do you design a natural transition zone tailored to my facial proportions and future aging?'
    },
    temples: {
      id: 'temples',
      label: 'Temporal Angles & Peaks',
      q: 'What is your technique for closing or reinforcing temporal recession points naturally?'
    },
    naturalness: {
      id: 'naturalness',
      label: 'Natural Appearance Standards',
      q: 'How do single-hair follicular units and microscopic irregularity guarantee an undetectable result?'
    },
    top_density: {
      id: 'top_density',
      label: 'Mid-Scalp Density Feathering',
      q: 'What follicular grouping density (FU/cm²) is needed to eliminate visible scalp under lighting?'
    },
    crown: {
      id: 'crown',
      label: 'Crown Vertex Spiral Coverage',
      q: 'How do you recreate the radial spiral whorl and protect future crown miniaturization?'
    },
    overall_shape: {
      id: 'overall_shape',
      label: 'Overall Visual Fullness',
      q: 'How will grafts be balanced across the scalp to create the highest visual impact?'
    },
    realistic: {
      id: 'realistic',
      label: 'Realistic Outcomes & Limits',
      q: 'What can realistically be achieved based on my biological donor caliber and density?'
    },
    long_term: {
      id: 'long_term',
      label: 'Long-Term Donor Preservation',
      q: 'How does your surgical plan safeguard my permanent safe donor reserves for 10–20 years from now?'
    },
    options: {
      id: 'options',
      label: 'Comparing Treatment Modalities',
      q: 'What are the trade-offs between Modern Micro-FUE, FUT, and medical bio-stimulation in my case?'
    },
    previous_efforts: {
      id: 'previous_efforts',
      label: 'Building on Previous Experience',
      q: 'How do my previous approaches inform what will be most effective moving forward?'
    },
    timing: {
      id: 'timing',
      label: 'Procedure Timing & Preparation',
      q: 'What is the optimal preparation timeline, and what milestones should I plan for?'
    },
    family: {
      id: 'family',
      label: 'Genetic History & Progression',
      q: 'How does my family history inform the surgical design and long-term hair maintenance plan?'
    },
    expectations: {
      id: 'expectations',
      label: 'Growth Timeline & Recovery',
      q: 'What are the exact day-by-day and month-by-month recovery and growth milestones?'
    }
  };

  return {
    profile: function (ctx) {
      var topArea = ctx.regions.topLabel;
      var goalArea = ctx.goal.primaryLabel;
      return {
        title: 'Your Hair Profile',
        eyebrow: 'Clinical Synthesis',
        headline: ctx.archetype.headline,
        lead: ctx.archetype.lead,
        body: [
          'Your responses point primarily toward ' + topArea.toLowerCase() + ', with ' + goalArea.toLowerCase() + ' as your chief restoration focus.',
          'Your stated motivation indicates ' + ctx.motivation.primaryLabel.toLowerCase() + ', placing you in the ' + ctx.stage.label.toLowerCase() + ' stage.'
        ],
        pattern: ctx.topPattern ? ctx.topPattern.label : 'Synthesized Diagnostic Pattern'
      };
    },

    map: function (ctx) {
      return {
        title: 'Your Concern Map',
        eyebrow: 'Topographical Analysis',
        headline: 'Where you notice changes most clearly',
        body: [
          'Based on your inputs, ' + ctx.regions.topLabel.toLowerCase() + ' carries ' + Math.round(ctx.regions.map[ctx.regions.top].share * 100) + '% of the directional weight.',
          ctx.regions.concentration.label + ' distribution across the scalp.'
        ],
        hint: 'Click individual scalp regions to inspect relative concern strength.',
        regionNote: function (ctx, r, status) {
          if (status === 'primary') return 'Primary reported area of concern (' + Math.round(r.share * 100) + '% directional weight).';
          if (status === 'secondary') return 'Secondary reported area (' + Math.round(r.share * 100) + '% directional weight).';
          return 'Lower relative concern weight (' + Math.round(r.share * 100) + '%).';
        }
      };
    },

    story: function (ctx) {
      return {
        title: 'Your Hair Story',
        eyebrow: 'Perceived Progression',
        headline: 'How your concern has evolved over time',
        body: [
          'You report that your concern has been present for ' + ctx.timeline.durationLabel.toLowerCase() + '.',
          ctx.timeline.trajectoryLabel + ' since you first noticed the change.'
        ],
        stages: [
          { label: 'Baseline', text: 'First awareness of change (' + ctx.timeline.durationLabel + ').' },
          { label: 'Observation', text: ctx.timeline.recentLabel },
          { label: 'Current State', text: ctx.timeline.trajectoryLabel }
        ],
        matrix: {
          insight: 'Your concern shows ' + ctx.ci.label.toLowerCase() + ', with change rated at ' + Math.round(ctx.ci.change * 100) + '% and personal importance at ' + Math.round(ctx.ci.importance * 100) + '%.'
        }
      };
    },

    goal: function (ctx) {
      return {
        title: 'What You Want To Change',
        eyebrow: 'Restoration Objectives',
        headline: 'Your primary restoration priority',
        body: [
          'Your strongest desired outcome is ' + ctx.goal.intentLabel.toLowerCase() + '.',
          'Focusing first on ' + ctx.goal.primaryLabel.toLowerCase() + ' establishes a clear baseline for surgical consultation.'
        ],
        hint: 'Restoration goals guide hairline framing and regional density distribution.',
        zoneNote: function (ctx, k, status) {
          if (status === 'primary') return 'Top priority target zone.';
          if (status === 'secondary') return 'Secondary priority target zone.';
          return 'Non-priority area.';
        },
        considerations: [
          'Age-appropriate hairline elevation and transition zones',
          'Follicular unit survival and safe donor extraction limits',
          'Sustained native hair preservation around transplanted zones'
        ]
      };
    },

    priorities: function (ctx) {
      return {
        title: 'Your Restoration Priorities',
        eyebrow: 'Personal Values',
        headline: 'What matters most to you personally',
        body: [
          'Personal importance and physical concern are decoupled to clarify what outcome matters most.',
          'Your profile combines ' + ctx.priorities.slice(0, 2).map(function (p) { return p.label.toLowerCase(); }).join(' with ') + '.'
        ],
        rankHint: 'Relative importance scores derived from your responses.',
        saved: 'Priorities saved for clinical review.',
        combination: ctx.priorities.slice(0, 2).map(function (p) { return p.label; }).join(' + ')
      };
    },

    journey: function (ctx) {
      return {
        title: 'Your Restoration Journey',
        eyebrow: 'Readiness & Experience',
        headline: 'Where you stand today in your decision journey',
        body: [
          'You are currently in the ' + ctx.stage.label.toLowerCase() + ' stage.',
          'You have indicated that your preferred timeline is ' + ctx.stage.timeframeLabel.toLowerCase() + '.'
        ],
        hint: 'Readiness describes your exploration stage, not biological candidacy.',
        timing: ctx.stage.timeframeLabel,
        clarify: 'What you need next is specific information about your donor reserves and achievable density.'
      };
    },

    brief: function (ctx) {
      return {
        title: 'Build Your Specialist Discussion',
        eyebrow: 'Consultation Brief',
        headline: 'Tailored discussion topics for your 1-on-1 visit',
        body: [
          'Based on your unique profile, these structured questions ensure you get exact, actionable answers from your surgeon.',
          'Bring these points to your appointment to evaluate your surgical plan thoroughly.'
        ],
        footnote: 'Questions are personalized based on your reported concern, goals, and experience level.',
        topicLibrary: TOPIC_LIBRARY
      };
    },

    final: function (ctx) {
      return {
        title: 'Your Personal Restoration Brief',
        eyebrow: 'Executive Summary',
        headline: 'Comprehensive restoration profile summary',
        lead: 'Your responses have been synthesized into a diagnostic roadmap for your specialist consultation.',
        learned: [
          'Primary focus is ' + ctx.regions.topLabel.toLowerCase() + ' with goal of ' + ctx.goal.primaryLabel.toLowerCase() + '.',
          'Motivation is ' + ctx.motivation.primaryLabel.toLowerCase() + ' with ' + ctx.stage.label.toLowerCase() + ' readiness.',
          'Previous approaches explored: ' + (ctx.effort.triedCount > 0 ? ctx.effort.triedCount + ' reported.' : 'none reported yet.')
        ],
        happens: [
          'Microscopic trichoscopy of recipient and safe donor zones',
          'Accurate graft count and follicular unit distribution modeling',
          'Customized hairline design review with facial framing simulation'
        ],
        cta: {
          label: 'Discuss Your Profile With a Specialist',
          button: 'Book Clinical Consultation',
          note: 'A hair-restoration specialist can review your profile in person.'
        }
      };
    },

    _questionPool: function (ctx) {
      return [
        { tag: 'Realistic results', text: 'What is genuinely achievable for my hair as it is now — and what is not?', topic: 'realistic' },
        { tag: 'Long-term planning', text: 'How should today’s decision account for possible future changes to my hair over 10–20 years?', topic: 'long_term' },
        { tag: 'Clinical evaluation', text: 'Based on high-magnification trichoscopy of my donor area, what is my safe lifetime graft reserve?', topic: 'options' },
        { tag: 'Hairline artistry', text: 'How will you design the frontal transition zone to guarantee an age-appropriate, natural appearance?', topic: 'hairline_design' }
      ];
    }
  };
});
