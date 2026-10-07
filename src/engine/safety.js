var gRoot = typeof globalThis !== 'undefined' ? globalThis : (typeof self !== 'undefined' ? self : this);
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.HairSafety = factory();
  }
})(gRoot, function () {
  'use strict';

  var DISCLAIMER = 'This assessment is an informational and educational profiling tool based on your self-reported observations. It does not provide medical diagnosis, graft prescriptions, or treatment guarantees. Clinical evaluation by a qualified hair-restoration physician is required before any treatment plan is established.';

  var PROHIBITED = [
    /\byou have (androgenetic alopecia|male pattern baldness|alopecia areata)\b/i,
    /\byou are norwood (scale )?[1-7]\b/i,
    /\byou (need|require) \d+ grafts\b/i,
    /\byou are (an? )?(ideal|perfect) (transplant )?candidate\b/i,
    /\byour (hair loss|treatment) is guaranteed\b/i,
    /\b100% (success|growth|retention)\b/i
  ];

  function lint(data) {
    var violations = [];
    if (!data) return violations;
    var str = JSON.stringify(data);
    for (var i = 0; i < PROHIBITED.length; i++) {
      if (PROHIBITED[i].test(str)) {
        violations.push({ rule: 'prohibited_claim', pattern: PROHIBITED[i].source });
      }
    }
    return violations;
  }

  return {
    DISCLAIMER: DISCLAIMER,
    lint: lint
  };
});
