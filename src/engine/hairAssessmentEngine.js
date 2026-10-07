/* =========================================================================
   HAIR RESTORATION REPORT ENGINE
   =========================================================================

   20 ANSWERS
        ↓  NORMALISE
   ~24 CANONICAL SIGNALS  (strength + direction)
        ↓  RELATIONSHIPS
   CONCENTRATION · ALIGNMENT · CHANGE×IMPORTANCE · TIMELINE · GOAL
   MOTIVATION · EFFORT · DECISION STAGE · CONTRADICTIONS · CONFIDENCE
        ↓  CROSS-SIGNAL PATTERNS  (scored, ranked)
   PRIMARY / SECONDARY / BACKGROUND INSIGHTS
        ↓
   PROFILE ARCHETYPE
        ↓  DYNAMIC CONTENT + VISUALISATION SELECTION
   8 REPORT SECTIONS → SPECIALIST TOPICS → PERSONALISED QUESTIONS → CTA

   Deterministic: identical answers always produce an identical report.
   Clinical terms are validated by safety.js before anything renders.
   ========================================================================= */
var gRoot = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this);
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./questions.js'), require('./copy.js'), require('./safety.js'));
  } else {
    root.HairEngine = factory(root.HairQuestions, root.HairCopy, root.HairSafety);
  }
})(gRoot, function (Q, COPY, SAFETY) {
  'use strict';

  var QUESTIONS = Q.QUESTIONS;
  var AREA_LABELS = Q.AREA_LABELS;
  var STAGE_LABELS = Q.STAGE_LABELS;
  var VERSION = '1.0.0';

  /* ---------------------------------------------------------------- utils */
  function clamp(v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return v < a ? a : v > b ? b : v; }
  function num(v, d) { var x = Number(v); return isNaN(x) ? d : x; }
  function mean() {
    var s = 0, c = 0;
    for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; if (typeof v === 'number' && !isNaN(v)) { s += v; c++; } }
    return c ? s / c : 0;
  }
  function round(v, d) { var p = Math.pow(10, d === undefined ? 2 : d); return Math.round(v * p) / p; }
  function dots(v) { return Math.max(1, Math.min(5, Math.round(v * 5))); }
  function findOpt(qKey, optKey) {
    var q = getQ(qKey); if (!q || !q.options) return null;
    for (var i = 0; i < q.options.length; i++) if (q.options[i].key === optKey) return q.options[i];
    return null;
  }
  function getQ(key) {
    for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].key === key) return QUESTIONS[i];
    return null;
  }
  function optLabel(qKey, optKey) { var o = findOpt(qKey, optKey); return o ? o.label : '—'; }
  function optWeight(qKey, optKey) { var o = findOpt(qKey, optKey); return o && typeof o.weight === 'number' ? o.weight : 0.5; }

  /* ================================================================ 1. NORMALISE */
  function normalize(raw) {
    raw = raw || {};
    var n = {}, c = {}, m = { effort: 0, tried: [] }, missing = [];

    QUESTIONS.forEach(function (q) {
      var v = raw[q.key];

      if (q.mode === 'multi') {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          m.effort = clamp((num(v.effort !== undefined ? v.effort : v.value, 3) - 1) / 4);
          m.tried = Array.isArray(v.tried) ? v.tried.slice() : (Array.isArray(v.values) ? v.values.slice() : []);
        } else if (Array.isArray(v)) {
          m.tried = v.slice();
          var real = m.tried.filter(function (k) { return k !== 'none'; }).length;
          m.effort = m.tried.length === 0 ? 0.10 : (m.tried.indexOf('none') !== -1 ? 0.10 : clamp(0.35 + real * 0.14));
        } else if (typeof v === 'number') {
          m.effort = clamp((v - 1) / 4);
        } else {
          missing.push(q.key); m.effort = 0.5;
        }
        return;
      }

      if (v === undefined || v === null || v === '') {
        missing.push(q.key);
        if (q.mode === 'slider') n[q.key] = 0.5;
        else c[q.key] = 'unsure';
        return;
      }

      if (q.mode === 'slider') n[q.key] = clamp((num(v, 3) - 1) / 4);
      else c[q.key] = String(v);
    });

    return { n: n, c: c, m: m, missing: missing };
  }

  /* ================================================================ 2. SIGNALS */
  var SIGNAL_META = [
    { key: 'hairlineChange', label: 'Hairline change', q: 'q1' },
    { key: 'frontalVisibility', label: 'Frontal visibility', q: 'q2' },
    { key: 'appearanceImpact', label: 'Appearance impact', q: 'q3' },
    { key: 'scalpVisibility', label: 'Scalp visibility', q: 'q4' },
    { key: 'crownConcern', label: 'Crown concern', q: 'q5' },
    { key: 'fullnessChange', label: 'Perceived fullness change', q: 'q6' },
    { key: 'recentChange', label: 'Recent change (12–24 mo)', q: 'q7' },
    { key: 'concernTrajectory', label: 'Concern trajectory', q: 'q12' },
    { key: 'restorationMotivation', label: 'Restoration motivation', q: 'q15' },
    { key: 'restorationInterest', label: 'Restoration interest', q: 'q16' },
    { key: 'outcomeImportance', label: 'Personal outcome importance', q: 'q17' },
    { key: 'consultationIntent', label: 'Consultation intent', q: 'q20' },
    { key: 'previousEffort', label: 'Previous effort', q: 'q13' }
  ];

  function buildSignals(n, m) {
    var out = SIGNAL_META.map(function (s) {
      var v = s.key === 'previousEffort' ? m.effort : n[s.q];
      return { key: s.key, label: s.label, q: s.q, value: round(v, 3), dots: dots(v) };
    });
    return out;
  }

  /* ================================================================ 3. REGIONS */
  var REGIONS = ['hairline', 'temples', 'top', 'crown', 'overall'];

  function goalAreaFromIntent(intent) {
    return {
      natural_hairline: 'hairline',
      more_coverage: 'top',
      crown_coverage: 'crown',
      fuller_overall: 'overall'
    }[intent] || null;
  }

  function computeRegions(n, c) {
    var w = { hairline: 0, temples: 0, top: 0, crown: 0, overall: 0 };

    w.hairline += 1.5 * n.q1 + 1.1 * n.q2;
    w.temples += 0.6 * n.q1 + 0.7 * n.q2;
    w.top += 1.4 * n.q4 + 0.9 * n.q6;
    w.crown += 1.8 * n.q5;
    w.overall += 0.9 * n.q6 + 0.7 * n.q7 + 0.5 * n.q4;

    if (REGIONS.indexOf(c.q8) !== -1) w[c.q8] += 3.2;
    if (REGIONS.indexOf(c.q14) !== -1) w[c.q14] += 2.4;
    var g = goalAreaFromIntent(c.q18);
    if (g) w[g] += 1.1;

    var sum = REGIONS.reduce(function (s, k) { return s + w[k]; }, 0) || 1;
    var list = REGIONS.map(function (k) {
      return { key: k, label: AREA_LABELS[k], weight: round(w[k], 3), share: w[k] / sum };
    }).sort(function (a, b) { return b.share - a.share; });

    var max = list[0].share, second = list[1].share, min = list[list.length - 1].share, gap = max - second;
    var conc;
    if (max >= 0.42) conc = { key: 'concentrated', label: 'Highly concentrated' };
    else if (max >= 0.30) conc = { key: 'leaning', label: 'Leaning to one area' };
    else if ((max - min) <= 0.14) conc = { key: 'distributed', label: 'Distributed' };
    else conc = { key: 'mixed', label: 'Mixed' };

    list.forEach(function (r, i) {
      r.status = i === 0 ? 'primary' : (i === 1 && r.share >= 0.16 ? 'secondary' : 'weak');
      if (r.share < 0.12) r.status = 'weak';
    });

    return {
      list: list,
      map: list.reduce(function (o, r) { o[r.key] = r; return o; }, {}),
      top: list[0].key,
      topLabel: list[0].label,
      second: list[1].key,
      gap: round(gap, 3),
      concentration: { key: conc.key, label: conc.label, value: round(max, 3) }
    };
  }

  /* ================================================================ 4. ALIGNMENT */
  var ADJACENT = {
    hairline: ['temples', 'top', 'overall'],
    temples: ['hairline', 'overall'],
    top: ['hairline', 'crown', 'overall'],
    crown: ['top', 'overall'],
    overall: ['hairline', 'temples', 'top', 'crown']
  };

  function computeAlignment(regions, n, c) {
    var concern = REGIONS.indexOf(c.q8) !== -1 ? c.q8 : regions.top;
    var goal = c.q14 !== 'unsure' && REGIONS.indexOf(c.q14) !== -1 ? c.q14 : (goalAreaFromIntent(c.q18) || null);
    var key, label;

    if (c.q8 === 'unsure' && c.q14 === 'unsure') { key = 'unclear'; label = 'Not yet clear'; }
    else if (!goal) { key = 'unclear'; label = 'Still forming'; }
    else if (concern === goal) { key = 'strong'; label = 'Strongly aligned'; }
    else if (concern === 'overall' || goal === 'overall') { key = 'broad'; label = 'Broad rather than localised'; }
    else if (ADJACENT[concern] && ADJACENT[concern].indexOf(goal) !== -1) { key = 'partial'; label = 'Closely related'; }
    else { key = 'different'; label = 'Pointing in different directions'; }

    return { key: key, label: label, concern: concern, goal: goal, note: null };
  }

  /* ================================================================ 5. CHANGE × IMPORTANCE */
  function computeChangeImportance(n) {
    var change = mean(n.q1, n.q6, n.q7, n.q4);
    var importance = mean(n.q3, n.q15, n.q17, n.q12);
    var hiC = change >= 0.5, hiI = importance >= 0.5;
    var quadrant = hiC ? (hiI ? 'high_high' : 'high_low') : (hiI ? 'low_high' : 'low_low');
    var label = {
      high_high: 'Priority concern',
      high_low: 'Noticeable, lower personal priority',
      low_high: 'Smaller change, high personal importance',
      low_low: 'Contained change, contained weight'
    }[quadrant];
    return { change: round(change, 3), importance: round(importance, 3), quadrant: quadrant, label: label, gap: round(Math.abs(change - importance), 3) };
  }

  /* ================================================================ 6. TIMELINE */
  function computeTimeline(n, c) {
    var durKey = c.q10;
    var w = optWeight('q10', durKey);
    var traj = n.q12 >= 0.65 ? 'rising' : (n.q12 <= 0.35 ? 'flat' : 'moderate');
    return {
      durationKey: durKey,
      durationLabel: optLabel('q10', durKey),
      durationWeight: w,
      trajectoryKey: traj,
      trajectoryLabel: { rising: 'Concern has intensified', flat: 'Concern has stayed level', moderate: 'Concern has grown steadily' }[traj],
      recentKey: c.q7 || null,
      recentLabel: n.q7 >= 0.6 ? 'Noticeable change in the last 12–24 months' : 'Limited additional change recently',
      family: c.q11,
      familyLabel: optLabel('q11', c.q11)
    };
  }

  /* ================================================================ 7. GOAL */
  function computeGoal(regions, n, c) {
    var pinned = c.q14 !== 'unsure' && REGIONS.indexOf(c.q14) !== -1;
    var primary = pinned ? c.q14 : regions.top;
    var intentKey = c.q18;
    var intentArea = goalAreaFromIntent(intentKey);
    var secondary = null;
    if (intentArea && intentArea !== primary) secondary = intentArea;
    else if (pinned && regions.top !== primary && regions.map[regions.top].share > 0.2) secondary = regions.top;

    return {
      primary: primary,
      primaryLabel: AREA_LABELS[primary],
      pinned: pinned,
      secondary: secondary,
      secondaryLabel: secondary ? AREA_LABELS[secondary] : null,
      intentKey: intentKey,
      intentLabel: optLabel('q18', intentKey),
      intentIsClarity: intentKey === 'understand_options' || intentKey === 'realistic',
      discussionOutcome: intentKey
    };
  }

  /* ================================================================ 8. MOTIVATION */
  var MOTIVATION_LABELS = {
    appearance: 'Appearance-led',
    coverage: 'Coverage-led',
    outcome: 'Outcome-led',
    natural: 'Natural-result-led',
    clarity: 'Clarity-first',
    mixed: 'Mixed motivation'
  };

  function computeMotivation(n, c, regions, stageIndex) {
    var intent = c.q18;
    var s = {
      appearance: 0.38 * n.q3 + 0.32 * n.q17 + 0.15 * n.q1 + (intent === 'natural_hairline' ? 0.15 : 0) + (c.q14 === 'hairline' ? 0.10 : 0),
      coverage: 0.34 * n.q4 + 0.28 * n.q6 + ((c.q14 === 'top' || c.q14 === 'crown') ? 0.20 : 0) + ((intent === 'more_coverage' || intent === 'crown_coverage') ? 0.16 : 0),
      outcome: 0.45 * n.q17 + 0.30 * n.q15 + 0.25 * n.q20,
      natural: (intent === 'natural_hairline' ? 0.72 : 0.05) + (c.q14 === 'hairline' ? 0.16 : 0) + 0.12 * n.q3,
      clarity: (intent === 'understand_options' ? 0.66 : intent === 'realistic' ? 0.52 : 0.16) + (stageIndex <= 1 ? 0.28 : stageIndex === 2 ? 0.16 : 0.06)
    };

    var ranked = Object.keys(s).map(function (k) { return { key: k, score: s[k] }; })
      .sort(function (a, b) { return b.score - a.score; });

    var primary = ranked[0].key;
    var second = ranked[1].key;
    if (ranked[0].score - ranked[1].score < 0.05) primary = 'mixed';

    return {
      primary: primary,
      primaryLabel: MOTIVATION_LABELS[primary],
      alternate: primary === 'mixed' ? ranked[0].key : null,
      alternateLabel: primary === 'mixed' ? MOTIVATION_LABELS[ranked[0].key] : null,
      secondary: second,
      secondaryLabel: MOTIVATION_LABELS[second],
      scores: s,
      ranked: ranked.map(function (r) { return { key: r.key, label: MOTIVATION_LABELS[r.key], score: round(r.score, 3) }; })
    };
  }

  /* ================================================================ 9. EFFORT */
  function computeEffort(m) {
    var tried = m.tried.filter(function (k) { return k !== 'none'; });
    var tier, label;
    if (m.effort <= 0.25 && tried.length === 0) { tier = 'none'; label = 'Nothing yet'; }
    else if (m.effort <= 0.50) { tier = 'early'; label = 'Early explorer'; }
    else if (m.effort <= 0.75) { tier = 'multiple'; label = 'Several approaches tried'; }
    else { tier = 'extensive'; label = 'Experienced explorer'; }

    return {
      tier: tier, label: label, value: round(m.effort, 3),
      triedCount: tried.length,
      triedKeys: m.tried.slice(),
      triedLabels: m.tried.map(function (k) { return optLabel('q13', k); })
    };
  }

  /* ================================================================ 10. DECISION STAGE */
  function computeStage(n, c) {
    var tw = optWeight('q19', c.q19);
    var score = 0.38 * n.q16 + 0.34 * n.q20 + 0.28 * tw;
    var key;
    if (score < 0.34) key = 'curious';
    else if (score < 0.50) key = 'researching';
    else if (score < 0.66) key = 'comparing';
    else if (score < 0.82) key = 'exploring';
    else key = 'ready';

    var index = Q.STAGES.indexOf(key);
    return {
      key: key, label: STAGE_LABELS[key], index: index, score: round(score, 3),
      timeframeKey: c.q19, timeframeLabel: optLabel('q19', c.q19), timeframeWeight: tw
    };
  }

  /* ================================================================ 11. CONTRADICTIONS + UNCERTAINTY */
  function detectContradictions(n, c, ci, alignment, effort, stage) {
    var out = [];
    if (alignment.key === 'different') {
      out.push({
        id: 'concern_goal_split',
        title: 'Your concern and your desired change are not in the same place',
        body: 'You notice ' + AREA_LABELS[alignment.concern].toLowerCase() + ' most clearly, yet the improvement you would choose first is ' +
          AREA_LABELS[alignment.goal].toLowerCase() + '. Those are two separate conversations. Trying to resolve both at once is the usual reason people leave a consultation with more questions than they arrived with — naming both up front avoids that.'
      });
    }
    if (ci.change < 0.42 && (n.q16 >= 0.7 || n.q20 >= 0.7)) {
      out.push({
        id: 'low_change_high_intent',
        title: 'The change you perceive is modest, but your intent is strong',
        body: 'You describe relatively little visible change, yet you are considering restoration seriously. That combination is not a contradiction — it usually means your interest is about where you are heading rather than where you are standing, which is exactly what an early conversation is good for clarifying.'
      });
    }
    if ((n.q1 >= 0.7 || n.q5 >= 0.7) && ci.importance < 0.45) {
      out.push({
        id: 'visible_low_weight',
        title: 'What you can see carries less weight than you might expect',
        body: 'You report a clearly noticeable change, but it does not occupy as much personal importance as the change itself. Worth settling before acting: decisions made on visible change alone tend to feel different later than decisions made on what actually matters to you.'
      });
    }
    if (n.q16 >= 0.7 && c.q19 === 'undecided') {
      out.push({
        id: 'intent_without_timing',
        title: 'Real interest, deliberately open timing',
        body: 'You are considering restoration seriously while leaving the timing deliberately undecided. That is a deliberate position rather than an unresolved one, and a first conversation is often what gives the timing a shape.'
      });
    }
    if ((effort.tier === 'extensive' || effort.tier === 'multiple') && n.q16 < 0.35) {
      out.push({
        id: 'effort_without_interest',
        title: 'Substantial effort, low current restoration interest',
        body: 'You have already put significant work into managing your hair, yet restoration itself is not something you are actively weighing. Your answers are therefore mostly about maintenance rather than change — useful context, because it changes what a specialist would prioritise discussing.'
      });
    }
    return out;
  }

  function detectUncertainty(c, missing) {
    var out = [];
    if (c.q8 === 'unsure') out.push({ id: 'q8', label: 'Concern location', note: 'You are not certain where the change is clearest.' });
    if (c.q14 === 'unsure') out.push({ id: 'q14', label: 'Preferred improvement', note: 'You have not fixed on one area to improve first.' });
    if (c.q11 === 'unsure') out.push({ id: 'q11', label: 'Family history', note: 'Family context is genuinely unknown to you — treated as unknown, not as “no”.' });
    if (c.q19 === 'undecided') out.push({ id: 'q19', label: 'Timeframe', note: 'Your timing is intentionally open rather than fixed.' });
    if (missing.length) out.push({ id: 'missing', label: 'Unanswered questions', note: missing.length + ' answer' + (missing.length > 1 ? 's were' : ' was') + ' left blank and filled with a neutral value.' });
    return out;
  }

  function computeConfidence(regions, alignment, ci, uncertainties, n) {
    var v = 0.58;
    if (alignment.key !== 'unclear') v += 0.13;
    if (regions.concentration.key === 'concentrated' || regions.concentration.key === 'leaning') v += 0.10;
    if (alignment.key === 'strong') v += 0.07;
    v -= 0.05 * Math.max(0, uncertainties.length - 1);
    var decisive = SIGNAL_META.filter(function (s) { var x = n[s.q]; return x >= 0.75 || x <= 0.25; }).length;
    if (decisive >= 5) v += 0.10; else if (decisive <= 2) v -= 0.06;
    v = clamp(v);
    var label = v >= 0.75 ? 'High' : v >= 0.55 ? 'Moderate' : 'Early';
    return { value: round(v, 3), label: label, decisive: decisive };
  }

  /* ================================================================ 12. CROSS-SIGNAL PATTERNS */
  function detectPatterns(ctx) {
    var n = ctx.n, c = ctx.c, R = ctx.regions, ci = ctx.ci, al = ctx.alignment,
      mot = ctx.motivation, eff = ctx.effort, st = ctx.stage, tl = ctx.timeline;
    var frontal = R.top === 'hairline' || R.top === 'temples';
    var goalFrontal = ctx.goal.primary === 'hairline' || ctx.goal.primary === 'temples';
    var coverage = R.top === 'top' || R.top === 'overall';
    var P = [];

    function add(id, score, label, text) {
      if (score <= 0) return;
      P.push({ id: id, score: round(clamp(score), 3), label: label, copy: { id: id, label: label, text: text } });
    }

    add('frontal_appearance',
      0.26 * n.q1 + 0.18 * n.q2 + 0.26 * n.q3 + 0.16 * n.q17 + (frontal ? 0.16 : 0) + (goalFrontal ? 0.14 : 0) - (frontal ? 0 : 0.18),
      'Frontal appearance priority',
      'The front of your hair is not merely where you see change — it is where the change does something to how your face reads. ' +
      'That link between ' + 'what shifted and what it costs you visually is the part worth putting in front of a specialist first.');

    add('coverage_priority',
      0.30 * n.q4 + 0.26 * n.q6 + 0.14 * n.q7 + (coverage ? 0.18 : 0) + ((ctx.goal.primary === 'top' || ctx.goal.primary === 'overall') ? 0.16 : 0) - (coverage ? 0 : 0.15),
      'Coverage is the real target',
      'Underneath the specific areas sits a simpler concern: visible coverage. ' +
      'Your answers consistently point at how much hair you can actually see rather than at one isolated spot, which changes the right questions from “fix this area” to “change how this reads”.');
    if (R.top === 'crown') {
      add('crown_focus', 0.40 * n.q5 + 0.30 * (R.map.crown.share) + (ctx.goal.primary === 'crown' ? 0.30 : 0),
        'The crown is the anchor',
        'Your concern has a fixed centre: the crown. Because crown hair presents differently from the front — it is judged from above and behind rather than in a mirror at eye level — ' +
        'the conversation about it is a different conversation from the one about your hairline.');
    }

    add('diffuse_concern',
      R.concentration.key === 'distributed' ? 0.88 : R.concentration.key === 'mixed' ? 0.66 : R.concentration.key === 'leaning' ? 0.34 : 0.12,
      'A diffuse rather than localised concern',
      'Your answers do not collapse onto one region. You are reacting to the overall picture, ' +
      'which usually means the most valuable consultation question is not “what about this spot” but “where would a change be most visible”.');
    if (al.key === 'strong') {
      add('aligned_concern_goal', 0.72 + 0.20 * (frontal ? 1 : 0.6),
        'Concern and goal converge',
        'The area you notice most is also the area you would improve first. ' +
        'That convergence is rarer than it sounds — plenty of people want to change somewhere they barely notice — and it makes your request unusually specific.');
    }
    if (al.key === 'different') {
      add('concern_goal_split', 0.92,
        'Concern and goal point at different areas',
        'Your concern and your requested improvement are not the same thing. ' +
        'That is a genuinely useful discovery rather than an error: it means you effectively have two priorities, and a first conversation should decide which one leads.');
    }
    if (mot.primary === 'appearance' || mot.primary === 'mixed' && mot.alternate === 'appearance') {
      add('appearance_led', 0.62 + 0.30 * n.q3,
        'Appearance-led motivation',
        'Your strongest driver is not the amount of hair but what its shape does to your appearance. ' +
        'Two people with an identical pattern can feel completely differently about it, and you are firmly on the side where the visual frame matters.');
    }
    if (mot.primary === 'outcome') {
      add('outcome_led', 0.60 + 0.35 * n.q17,
        'Outcome-led motivation',
        'You consistently weight the destination above the process. ' +
        'That means the most useful thing a specialist can give you is a concrete description of what you would see afterwards — not a description of how it is done.');
    }
    if (mot.primary === 'natural' || c.q18 === 'natural_hairline') {
      add('natural_result', 0.55 + (c.q18 === 'natural_hairline' ? 0.40 : 0),
        'Natural result as the governing requirement',
        'Every answer bends toward one constraint: whatever changes, it must not look done. ' +
        'That is a design requirement rather than a preference, and it should be the first sentence of any consultation.');
    }
    if (mot.primary === 'clarity' || c.q18 === 'understand_options' || c.q18 === 'realistic') {
      add('clarity_first', 0.55 + (c.q18 === 'understand_options' ? 0.38 : c.q18 === 'realistic' ? 0.32 : 0),
        'Clarity before commitment',
        'You are asking for information rather than a decision. ' +
        'That positions you well: the strongest outcomes usually come from people who understood their options before they were emotionally invested in one.');
    }
    add('rising_trajectory', 0.40 * n.q12 + 0.26 * n.q7 + (tl.trajectoryKey === 'rising' ? 0.36 : 0),
      'A rising rather than static concern',
      'Your concern has been climbing across the period you were asked about. ' +
      'That matters because it separates an observation you have made peace with from one that is still moving — and only the second one justifies a conversation now.');
    add('long_standing', tl.durationWeight * 0.55 + 0.30 * n.q12,
      'A long-running concern',
      'This has been with you long enough to stop being new information. ' +
      'The useful question at that stage is no longer whether something has changed, but whether you have a plan for it.');
    if (eff.tier === 'extensive' || eff.tier === 'multiple') {
      add('experienced_explorer', 0.55 + 0.35 * eff.value,
        'An experienced explorer',
        'You have already worked through multiple approaches, so your answers come from an informed baseline rather than a first impression. ' +
        'A specialist can use that history far faster than you can explain it — bring the list.');
    }
    if (eff.tier === 'none') {
      add('early_explorer', 0.85 - 0.3 * st.index,
        'An early-stage position',
        'You have not tried much yet, which means your answers reflect what you notice rather than what a treatment has already altered. ' +
        'That is a clean baseline — and the cheapest moment to get an outside read, before anything has complicated the picture.');
    }
    if (st.score >= 0.78) {
      add('ready_signal', st.score,
        'Intent has turned into a next step',
        'Your interest, your timing and your consultation intent all point the same way. ' +
        'At this point more research has sharply diminishing returns; what is missing is information that only exists about you specifically.');
    }
    if (ci.change < 0.5 && ci.importance >= 0.62) {
      add('quiet_but_important', (1 - ci.change) * 0.5 + ci.importance * 0.5,
        'Contained change, high personal weight',
        'The change you perceive is fairly contained, yet it matters to you a great deal. ' +
        'That gap usually means the issue is about how your hair reads on you personally rather than about a measurable decline — and it is precisely what a mirror cannot settle.');
    }
    if (ci.change >= 0.62 && ci.importance < 0.5) {
      add('visible_lower_weight', ci.change * 0.55 + (1 - ci.importance) * 0.45,
        'Visible change, lower personal weight',
      'You can see a clear change without it dominating how you feel. ' +
      'Worth naming before you act: the reason to seek advice now is not pressure, it is the information — and information is cheapest to get early.');
    }
    if (ctx.uncertainties.length >= 2) {
      add('uncertain_path', 0.45 + 0.18 * ctx.uncertainties.length,
        'An intentionally open position',
        'Several of your answers are deliberately uncertain rather than wrong. ' +
        'The engine treats “not sure” as a real state, not a missing one — which means the most useful outcome of a consultation may simply be resolving those specific unknowns.');
    }

    P.sort(function (a, b) { return b.score - a.score; });
    P.forEach(function (p, i) {
      p.rank = i;
      p.tier = i === 0 ? 'primary' : i === 1 ? 'secondary' : 'background';
    });
    return P;
  }

  /* ================================================================ 13. ARCHETYPE */
  function pickArchetype(ctx) {
    var st = ctx.stage, eff = ctx.effort, mot = ctx.motivation, R = ctx.regions, g = ctx.goal;
    var frontal = R.top === 'hairline' || R.top === 'temples' || g.primary === 'hairline';

    function make(key, label, headline, lead) { return { key: key, label: label, headline: headline, lead: lead }; }

    if ((eff.tier === 'extensive' || eff.tier === 'multiple') && st.index >= 3) {
      return make('experienced', 'The Experienced Explorer',
        'You have done this research before — now it needs a specific read.',
        'Multiple attempts, a serious level of interest and a clear goal: you are past the generic information stage entirely. What you need is an opinion about your own hair, which no amount of reading will produce.');
    }
    if (st.index <= 1) {
      return make('curious', 'The Curious Researcher',
        'You are earlier than you think, and that works in your favour.',
        'You are gathering information before you have anything at stake. Everything you learn in this phase is learned honestly, because nothing is pushing you toward an answer.');
    }
    if (mot.primary === 'appearance' && frontal) {
      return make('appearance_focused', 'The Appearance-Focused Explorer',
        'Your concern is strongly appearance-led.',
        'This is not about a number on a chart for you. It is about how the front of your hair frames your face — and your answers point there consistently, from the area you notice through to the change you would choose first.');
    }
    if (frontal && st.index >= 3) {
      return make('hairline_planner', 'The Hairline-Focused Planner',
        'Your plan is taking shape around the front of your hair.',
        'You know which area you would change first and you are taking it seriously. The remaining questions are about design and realism rather than about whether to act.');
    }
    if (mot.primary === 'coverage' || (R.top === 'top' && g.primary === 'top')) {
      return make('coverage', 'The Coverage-Seeking Explorer',
        'Your concern is really about coverage.',
        'Rather than one troublesome spot, you are responding to how much hair you can actually see. That reframes the whole conversation — from fixing an area to changing an impression.');
    }
    if (R.top === 'crown') {
      return make('crown', 'The Crown-Focused Researcher',
        'Your attention is fixed on the crown.',
        'The crown is the part of your hair you almost never see yourself, yet it is carrying most of your concern. That is worth understanding before you decide what matters most.');
    }
    if (R.top === 'overall' || g.primary === 'overall') {
      return make('overall', 'The Overall-Improvement Seeker',
        'You want the whole picture to read differently.',
        'You are not isolating a single zone. Your answers treat your hair as one silhouette, which makes the right conversation about shape and distribution rather than about any one region.');
    }
    if (st.index >= 3) {
      return make('serious', 'The Serious Explorer',
        'You are past the point of idle curiosity.',
        'Your interest, your timing and your intent agree with each other. The gap between where you are and a decision is now mostly factual, and facts about your specific hair come from an assessment.');
    }
    return make('early', 'The Early Restoration Explorer',
      'You are earlier than you think — and that is an advantage.',
      'You have a concern, a rough sense of what you would change, and no urgency forcing your hand. That combination lets you learn what is realistic without having to decide anything yet.');
  }

  /* ================================================================ 14. PRIORITIES / TOPICS */
  function computePriorities(n, regions, c, stage) {
    var items = [
      { key: 'appearance', label: 'Appearance', v: mean(n.q3, n.q17) },
      { key: 'area', label: regions.topLabel + ' focus', v: 0.34 + 0.66 * regions.map[regions.top].share },
      { key: 'coverage', label: 'Fuller coverage', v: mean(n.q4, n.q6, n.q7) },
      { key: 'outcome', label: 'Personal outcome impact', v: n.q17 },
      { key: 'restoration', label: 'Restoring over slowing', v: n.q15 },
      { key: 'clarity', label: 'Understanding options', v: 0.28 + 0.34 * (c.q18 === 'understand_options' || c.q18 === 'realistic' ? 1 : 0.35) + 0.28 * (stage.index / 4) }
    ];
    items.sort(function (a, b) { return b.v - a.v; });
    items = items.slice(0, 4);
    var max = items[0].v || 1;
    items.forEach(function (it, i) {
      it.rank = i + 1;
      it.value = round(it.v, 3);
      it.width = Math.max(18, Math.round((it.v / max) * 100));
    });
    return items;
  }

  function computeRankDefaults(regions) {
    var scores = {
      hairline: regions.map.hairline.share + regions.map.temples.share,
      density: regions.map.top.share + regions.map.crown.share,
      overall: regions.map.overall.share
    };
    var labels = { hairline: 'Better hairline', density: 'More density', overall: 'Fuller overall appearance' };
    return Object.keys(scores).map(function (k) { return { key: k, label: labels[k], score: round(scores[k], 3) }; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function computeTopics(ctx) {
    var n = ctx.n, c = ctx.c, g = ctx.goal, R = ctx.regions, st = ctx.stage, eff = ctx.effort;
    var scored = [];
    function t(id, s) { if (s > 0) scored.push({ id: id, score: round(s, 3) }); }

    if (g.primary === 'hairline' || R.top === 'hairline' || R.top === 'temples') t('hairline_design', 0.9);
    if (R.top === 'temples' && g.primary === 'temples') t('temples', 0.8);
    if (c.q18 === 'natural_hairline' || ctx.motivation.primary === 'natural') t('naturalness', 0.92);
    if (g.primary === 'top' || n.q4 >= 0.6) t('top_density', 0.85);
    if (g.primary === 'crown' || n.q5 >= 0.6) t('crown', 0.85);
    if (g.primary === 'overall' || R.concentration.key === 'distributed') t('overall_shape', 0.78);
    if (st.index >= 2) { t('realistic', 0.95); t('long_term', 0.88); t('expectations', 0.7); }
    if (st.index <= 1) t('options', 0.9);
    if (eff.tier !== 'none') t('previous_efforts', 0.82);
    if (n.q12 >= 0.6) t('timing', 0.8);
    if (c.q11 === 'unsure') t('family', 0.62);
    if (g.intentIsClarity) t('options', 0.93);

    scored.sort(function (a, b) { return b.score - a.score; });
    var seen = {}, out = [];
    for (var i = 0; i < scored.length && out.length < 5; i++) {
      if (seen[scored[i].id]) continue;
      seen[scored[i].id] = 1;
      out.push(scored[i]);
    }
    var lib = COPY.brief(ctx).topicLibrary;
    return out.map(function (s) {
      var meta = lib[s.id] || { id: s.id, label: s.id, q: '' };
      return { id: meta.id, label: meta.label, question: meta.q, score: s.score, checked: true };
    });
  }

  /* ================================================================ 15. VIZ BUILDERS */
  function nodeExplanations(ctx) {
    var R = ctx.regions, n = ctx.n, g = ctx.goal, st = ctx.stage, mot = ctx.motivation;
    return {
      area: {
        title: 'Your main area',
        text: AREA_LABELS[R.top] + ' carries ' + Math.round(R.map[R.top].share * 100) + ' of the directional weight across your concern, goal and location answers. ' +
          (R.concentration.key === 'concentrated' || R.concentration.key === 'leaning'
            ? 'The concentration is strong enough that a specialist can start there immediately.'
            : 'The weight is spread, so this is a lead rather than a verdict.')
      },
      appearance: {
        title: 'Why it matters to you',
        text: n.q3 >= 0.6
          ? 'You rated the effect of your hairline on how your face looks highly. That is the link that turns an observation into a priority — plenty of people notice the same change and shrug at it.'
          : 'Appearance carries some weight for you, but it is not the leading driver. What matters more in your answers is the change itself and what you would like done about it.'
      },
      goal: {
        title: 'What you would change first',
        text: g.pinned
          ? AREA_LABELS[g.primary] + ' is the improvement you would choose ahead of everything else. ' +
            (ctx.alignment.key === 'strong' ? 'It is also the area you notice most, which is what makes your request specific.' :
              ctx.alignment.key === 'different' ? 'It sits somewhere other than your main concern — two priorities, in other words.' :
                'It sits close to your main concern without matching it exactly.')
          : 'You did not fix on a single area, so the engine used your highest-weighted region as a provisional goal. Treating that as a starting hypothesis rather than an answer is the right call.'
      },
      motivation: {
        title: 'Your motivation pattern',
        text: 'Across appearance, coverage, outcome, naturalness and clarity, your strongest reading is ' + mot.primaryLabel.toLowerCase() +
          (mot.secondaryLabel ? ', with ' + mot.secondaryLabel.toLowerCase() + ' behind it' : '') + '. ' +
          'This is derived from the relationship between several answers rather than from any one of them.'
      },
      stage: {
        title: 'Your decision stage',
        text: 'Your restoration interest, consultation intent and timeframe agree with each other, placing you at “' + st.label.toLowerCase() + '”. ' +
          'This is a decision position, not a medical one — it only controls how directly the report speaks to you about next steps.'
      }
    };
  }

  function buildConstellation(ctx) {
    var R = ctx.regions, g = ctx.goal;
    return {
      type: 'constellation',
      nodes: [
        { id: 'area', label: AREA_LABELS[R.top], sub: 'Where you notice it', tone: 'a' },
        { id: 'appearance', label: 'Appearance', sub: 'Why it matters', tone: 'b' },
        { id: 'goal', label: AREA_LABELS[g.primary] + ' goal', sub: 'What you would change', tone: 'c' },
        { id: 'motivation', label: ctx.motivation.primaryLabel, sub: 'Your motivation', tone: 'd' },
        { id: 'stage', label: ctx.stage.label, sub: 'Your decision stage', tone: 'e' }
      ],
      edges: [
        ['area', 'appearance'], ['appearance', 'goal'], ['goal', 'motivation'], ['motivation', 'stage']
      ],
      explain: nodeExplanations(ctx),
      chips: [
        { label: 'Primary area', value: AREA_LABELS[R.top], dots: dots(R.map[R.top].share * 1.6) },
        { label: 'Appearance weight', value: ctx.signals.find(function (s) { return s.key === 'appearanceImpact'; }).value >= 0.6 ? 'High' : 'Moderate', dots: dots(n03(ctx)) },
        { label: 'Restoration interest', value: ctx.stage.label, dots: dots(ctx.n.q16) },
        { label: 'Consultation openness', value: ctx.n.q20 >= 0.7 ? 'Open' : ctx.n.q20 >= 0.4 ? 'Considered' : 'Reserved', dots: dots(ctx.n.q20) }
      ]
    };
  }
  function n03(ctx) { return ctx.n.q3; }

  function buildHeadMap(ctx) {
    return {
      type: 'headmap',
      focus: ctx.regions.top,
      concentration: ctx.regions.concentration,
      regions: ctx.regions.list.map(function (r) {
        return {
          key: r.key, label: r.label, share: round(r.share, 3), status: r.status,
          intensity: round(clamp(r.share / Math.max(0.01, ctx.regions.map[ctx.regions.top].share)), 3),
          note: COPY.map(ctx).regionNote(ctx, r, r.status)
        };
      }),
      chain: buildRegionChain(ctx)
    };
  }

  function buildRegionChain(ctx) {
    var R = ctx.regions, g = ctx.goal;
    return {
      notice: AREA_LABELS[R.top] + ' change',
      matters: ctx.signals.appearanceImpact >= 0.6 ? 'Appearance impact' : ctx.ci.importance >= 0.6 ? 'How much it matters to you' : 'The change itself',
      want: 'Improve ' + AREA_LABELS[g.primary].toLowerCase(),
      discuss: ctx.goal.intentIsClarity
        ? 'What is realistic for you'
        : (g.intentKey === 'natural_hairline' ? 'A natural-looking result' : AREA_LABELS[g.primary] + ' improvement')
    };
  }

  function buildTimelineViz(ctx, storyCopy) {
    return {
      type: 'timeline',
      durationLabel: ctx.timeline.durationLabel,
      trajectoryLabel: ctx.timeline.trajectoryLabel,
      stages: storyCopy.stages,
      matrix: {
        type: 'matrix',
        change: ctx.ci.change,
        importance: ctx.ci.importance,
        quadrant: ctx.ci.quadrant,
        label: ctx.ci.label,
        gap: ctx.ci.gap,
        insight: storyCopy.matrix
      }
    };
  }

  function buildGoalViz(ctx, goalCopy) {
    var zones = ['hairline', 'top', 'crown', 'overall'].map(function (k) {
      var status = ctx.goal.primary === k ? 'primary' : (ctx.goal.secondary === k ? 'secondary' : 'none');
      return {
        key: k, label: AREA_LABELS[k], status: status,
        share: round(ctx.regions.map[k].share, 3),
        note: goalCopy.zoneNote(ctx, k, status)
      };
    });
    return { type: 'goalexplorer', zones: zones, intentLabel: ctx.goal.intentLabel, intentKey: ctx.goal.intentKey, considerations: goalCopy.considerations };
  }

  function buildPriorityViz(ctx, prioCopy) {
    return {
      type: 'priority',
      bars: ctx.priorities,
      combination: prioCopy.combination,
      ranking: ctx.rankDefaults.map(function (r) { return { key: r.key, label: r.label }; })
    };
  }

  function buildJourneyViz(ctx, jCopy) {
    return {
      type: 'journey',
      active: ctx.stage.index,
      stages: Q.STAGES.map(function (k, i) { return { key: k, label: STAGE_LABELS[k], index: i, active: i === ctx.stage.index }; }),
      position: round(ctx.stage.score, 3),
      timing: jCopy.timing,
      clarify: jCopy.clarify,
      timeframeLabel: ctx.stage.timeframeLabel,
      effortLabel: ctx.effort.label
    };
  }

  function buildBriefViz(ctx, bCopy) {
    return {
      type: 'briefbuilder',
      topics: ctx.topics,
      importanceDefaults: {
        natural: ctx.motivation.primary === 'natural' || ctx.goal.intentKey === 'natural_hairline' ? 5 : 3,
        coverage: ctx.signals.scalpVisibility >= 0.6 || ctx.goal.primary === 'top' ? 5 : 3,
        longterm: ctx.stage.index >= 2 ? 5 : 3
      },
      questions: ctx.questions,
      footnote: bCopy.footnote
    };
  }

  function buildFinalViz(ctx, fCopy) {
    return {
      type: 'profilecard',
      archetype: ctx.archetype,
      fields: [
        { k: 'Primary concern', v: AREA_LABELS[ctx.regions.top] + (ctx.regions.top === 'hairline' || ctx.regions.top === 'temples' ? ' / frontal appearance' : '') },
        { k: 'Main goal', v: goalStatement(ctx) },
        { k: 'What matters', v: ctx.priorities.slice(0, 2).map(function (p) { return p.label; }).join(' + ') },
        { k: 'Your journey', v: ctx.stage.label + ' restoration' },
        { k: 'What you want clarity on', v: ctx.goal.intentIsClarity ? 'What is realistically possible for you' : 'What could realistically be achieved for your hair and goals' }
      ],
      learned: fCopy.learned,
      happens: fCopy.happens,
      cta: fCopy.cta,
      disclaimer: SAFETY.DISCLAIMER
    };
  }

  function goalStatement(ctx) {
    var base = {
      hairline: 'A more natural-looking hairline',
      top: 'More visible coverage across the top',
      crown: 'Better crown coverage',
      overall: 'A fuller look overall',
      unsure: 'Clarity on which change would matter most'
    }[ctx.goal.primary] || 'A fuller-looking result';
    if (ctx.goal.intentKey === 'realistic') return base + ', with an honest read on what is realistic';
    if (ctx.goal.intentKey === 'understand_options') return 'Understanding the options before choosing a change';
    if (ctx.goal.intentKey === 'natural_hairline' && ctx.goal.primary !== 'hairline') return 'A natural-looking improvement at the ' + AREA_LABELS[ctx.goal.primary].toLowerCase();
    return base;
  }

  /* ================================================================ 16. BRIEF BUILDER */
  function buildBrief(report, ui) {
    ui = ui || {};
    var ctx = report.ctx;
    var order = ui.rankOrder && ui.rankOrder.length === 3 ? ui.rankOrder : report.ctx.rankDefaults.map(function (r) { return r.key; });
    var labels = { hairline: 'Better hairline', density: 'More density', overall: 'Fuller overall appearance' };
    var checked = ui.topics || {};
    var imp = ui.importance || {};

    var topics = report.topics.map(function (t) {
      var on = checked[t.id] === undefined ? true : !!checked[t.id];
      return { id: t.id, label: t.label, question: t.question, checked: on };
    }).filter(function (t) { return t.checked; });

    var importanceLines = [
      { label: 'Natural appearance', value: imp.natural === undefined ? report.viz.brief.importanceDefaults.natural : imp.natural },
      { label: 'Visible coverage', value: imp.coverage === undefined ? report.viz.brief.importanceDefaults.coverage : imp.coverage },
      { label: 'Long-term result', value: imp.longterm === undefined ? report.viz.brief.importanceDefaults.longterm : imp.longterm }
    ].sort(function (a, b) { return b.value - a.value; });

    var topMatter = importanceLines.slice(0, 2).map(function (i) { return i.label.toLowerCase(); }).join(' and ');

    return {
      fields: [
        { k: 'Main concern', v: AREA_LABELS[ctx.regions.top] + (ctx.regions.top === 'hairline' || ctx.regions.top === 'temples' ? ' appearance' : ' focus') },
        { k: 'Main goal', v: goalStatement(ctx) },
        { k: 'What matters most', v: topMatter.charAt(0).toUpperCase() + topMatter.slice(1) },
        { k: 'Your current stage', v: ctx.stage.label },
        { k: 'Priority order', v: order.map(function (k) { return labels[k]; }).join(' → ') },
        { k: 'What you want clarity on', v: topics.length ? topics.map(function (t) { return t.label.toLowerCase(); }).slice(0, 3).join(', ') : 'The overall picture' }
      ],
      topics: topics,
      importance: importanceLines,
      questions: report.viz.brief.questions.slice(0, 3).concat(
        topics.length > 2 ? topics.slice(2, 4).map(function (t) { return { tag: t.label, text: t.question, topic: t.id }; }) : []
      ).slice(0, 4),
      order: order
    };
  }

  /* ================================================================ MAIN BUILD */
  function build(rawAnswers) {
    var norm = normalize(rawAnswers);
    var n = norm.n, c = norm.c;

    /* --- signals --- */
    var signals = buildSignals(n, norm.m);
    var sig = {};
    signals.forEach(function (s) { sig[s.key] = s.value; });

    /* --- structural relationships --- */
    var regions = computeRegions(n, c);
    var alignment = computeAlignment(regions, n, c);
    var ci = computeChangeImportance(n);
    var timeline = computeTimeline(n, c);
    var goal = computeGoal(regions, n, c);

    /* --- stage must exist before motivation (motivation uses stage index) --- */
    var stage = computeStage(n, c);
    var motivation = computeMotivation(n, c, regions, stage.index);
    var effort = computeEffort(norm.m);

    var uncertainties = detectUncertainty(c, norm.missing);
    var contradictions = detectContradictions(n, c, ci, alignment, effort, stage);

    var ctx = {
      n: n, c: c, missing: norm.missing, signals: signals, sig: sig,
      regions: regions, alignment: alignment, ci: ci, timeline: timeline,
      goal: goal, motivation: motivation, effort: effort, stage: stage,
      uncertainties: uncertainties, contradictions: contradictions
    };
    ctx.confidence = computeConfidence(regions, alignment, ci, uncertainties, n);
    ctx.patterns = detectPatterns(ctx);
    ctx.topPattern = ctx.patterns[0] || null;
    ctx.archetype = pickArchetype(ctx);
    ctx.priorities = computePriorities(n, regions, c, stage);
    ctx.rankDefaults = computeRankDefaults(regions);
    ctx.topics = computeTopics(ctx);
    ctx.questions = COPY.brief(ctx) && questionList(ctx);

    /* --- copy + sections --- */
    var cProfile = COPY.profile(ctx);
    var cMap = COPY.map(ctx);
    var cStory = COPY.story(ctx);
    var cGoal = COPY.goal(ctx);
    var cPrio = COPY.priorities(ctx);
    var cJourney = COPY.journey(ctx);
    var cBrief = COPY.brief(ctx);
    var cFinal = COPY.final(ctx);

    var sections = [
      {
        id: '01', key: 'profile', label: 'Your Hair Profile', title: cProfile.title,
        eyebrow: cProfile.eyebrow, headline: cProfile.headline, lead: cProfile.lead,
        body: cProfile.body, pattern: cProfile.pattern,
        viz: buildConstellation(ctx)
      },
      {
        id: '02', key: 'map', label: 'Your Concern Map', title: cMap.title,
        eyebrow: cMap.eyebrow, headline: cMap.headline, body: cMap.body, hint: cMap.hint,
        viz: buildHeadMap(ctx)
      },
      {
        id: '03', key: 'story', label: 'Your Hair Story', title: cStory.title,
        eyebrow: cStory.eyebrow, headline: cStory.headline, body: cStory.body,
        viz: buildTimelineViz(ctx, cStory),
        showMatrix: ci.gap >= 0.12 || ci.quadrant === 'high_high'
      },
      {
        id: '04', key: 'goal', label: 'What You Want To Change', title: cGoal.title,
        eyebrow: cGoal.eyebrow, headline: cGoal.headline, body: cGoal.body, hint: cGoal.hint,
        viz: buildGoalViz(ctx, cGoal)
      },
      {
        id: '05', key: 'priorities', label: 'Your Restoration Priorities', title: cPrio.title,
        eyebrow: cPrio.eyebrow, headline: cPrio.headline, body: cPrio.body,
        rankHint: cPrio.rankHint, saved: cPrio.saved,
        viz: buildPriorityViz(ctx, cPrio)
      },
      {
        id: '06', key: 'journey', label: 'Your Restoration Journey', title: cJourney.title,
        eyebrow: cJourney.eyebrow, headline: cJourney.headline, body: cJourney.body, hint: cJourney.hint,
        viz: buildJourneyViz(ctx, cJourney)
      },
      {
        id: '07', key: 'brief', label: 'Build Your Specialist Discussion', title: cBrief.title,
        eyebrow: cBrief.eyebrow, headline: cBrief.headline, body: cBrief.body,
        viz: buildBriefViz(ctx, cBrief)
      },
      {
        id: '08', key: 'final', label: 'Your Personal Restoration Brief', title: cFinal.title,
        eyebrow: cFinal.eyebrow, headline: cFinal.headline, lead: cFinal.lead,
        body: [], viz: buildFinalViz(ctx, cFinal)
      }
    ];

    var report = {
      meta: {
        version: VERSION,
        generatedAt: new Date().toISOString(),
        archetype: ctx.archetype,
        confidence: ctx.confidence,
        stage: ctx.stage,
        concentration: ctx.regions.concentration,
        alignment: { key: alignment.key, label: alignment.label },
        motivation: { key: motivation.primary, label: motivation.primaryLabel },
        patternCount: ctx.patterns.length
      },
      signals: signals,
      insights: {
        primary: ctx.patterns.filter(function (p) { return p.tier === 'primary'; })[0] || null,
        secondary: ctx.patterns.filter(function (p) { return p.tier === 'secondary'; })[0] || null,
        background: ctx.patterns.filter(function (p) { return p.tier === 'background'; }).slice(0, 3)
      },
      contradictions: contradictions,
      uncertainties: uncertainties,
      topics: ctx.topics,
      sections: sections,
      ctx: ctx
    };

    report.viz = {};
    sections.forEach(function (s) { report.viz[s.key] = s.viz; });
    report.brief = buildBrief(report, null);

    /* --- safety gate: nothing unvetted leaves the engine --- */
    var violations = SAFETY.lint({ sections: sections, meta: report.meta, insights: report.insights, brief: report.brief, topics: report.topics, contradictions: contradictions });
    report.safe = violations.length === 0;
    if (!report.safe && typeof console !== 'undefined') {
      console.error('[HairEngine] safety violations:', violations);
    }
    return report;
  }

  function questionList(ctx) {
    var pool = [];
    var b = COPY.brief(ctx);
    /* questionPool lives on the brief builder in copy.js */
    pool = (COPY._questionPool ? COPY._questionPool(ctx) : []) ;
    if (!pool.length) {
      pool = [
        { tag: 'Realistic results', text: 'What is genuinely achievable for my hair as it is now — and what is not?', topic: 'realistic' },
        { tag: 'Long-term', text: 'How should today’s decision account for possible future changes to my hair?', topic: 'long_term' },
        { tag: 'Your read', text: 'Based on an in-person look, what would you say is actually going on?', topic: 'options' }
      ];
    }
    return pool;
  }

  return {
    build: build,
    buildBrief: buildBrief,
    version: VERSION,
    QUESTIONS: QUESTIONS,
    AREA_LABELS: AREA_LABELS,
    STAGE_LABELS: STAGE_LABELS,
    SAFETY: SAFETY,
    normalize: normalize
  };
});
