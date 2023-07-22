/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/normalize-strings/index.js":
/*!*************************************************!*\
  !*** ./node_modules/normalize-strings/index.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function(global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return factory(global, global.document);
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
} (typeof window !== 'undefined' ? window : this, function (window, document) {
  var charmap = __webpack_require__(/*! ./charmap.json */ "./node_modules/normalize-strings/charmap.json");
  var regex = null;
  var current_charmap;
  var old_charmap;

  function normalize(str, custom_charmap) {
    old_charmap = current_charmap;
    current_charmap = custom_charmap || charmap;

    regex = (regex && old_charmap === current_charmap) ? regex : buildRegExp(current_charmap);

    return str.replace(regex, function(charToReplace) {
      return current_charmap[charToReplace.charCodeAt(0)] || charToReplace;
    });
  }

  function buildRegExp(charmap){
     return new RegExp('[' + Object.keys(charmap).map(function(code) {return String.fromCharCode(code); }).join(' ') + ']', 'g');
   }

  return normalize;
}));


/***/ }),

/***/ "./node_modules/pluralize/pluralize.js":
/*!*********************************************!*\
  !*** ./node_modules/pluralize/pluralize.js ***!
  \*********************************************/
/***/ (function(module) {

/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (true) {
    // Node.
    module.exports = pluralize();
  } else {}
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Lower cased words. E.g. "hello".
    if (word === word.toLowerCase()) return token.toLowerCase();

    // Upper cased words. E.g. "WHISKY".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word      The word to pluralize
   * @param  {number}  count     How many of the word exist
   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['passerby', 'passersby']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'aircraft',
    'alcohol',
    'ammo',
    'analytics',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'firmware',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'hardware',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'mud',
    'manga',
    'news',
    'only',
    'personnel',
    'pike',
    'plankton',
    'pliers',
    'police',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'software',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transportation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    /pok[eé]mon$/i,
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});


/***/ }),

/***/ "./src/grading.js":
/*!************************!*\
  !*** ./src/grading.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scoreToAgeObj": () => (/* binding */ scoreToAgeObj)
/* harmony export */ });
const scoreToAgeObj = {
  0: {
    grade: "Under 5th grade/Year 6",
    age: "Under 10",
    description: "Very easy."
  },
  5: {
    age: "10 - 11",
    description:
      "Very easy to read. Easily understood by an average 11 year old school student."
  },
  6: {
    age: "11 - 12",
    description: "Easy to read. Conversational English for Consumers."
  },
  7: {
    age: "12 - 13",
    description: "Fairly easy to read."
  },
  8: {
    age: "13 - 14",
    description:
      "Plain English. Easily understood by 13 to 15 year old students."
  },
  9: {
    age: "14 - 15",
    description:
      "Plain English. Easily understood by 13 to 15 year old students."
  },
  10: { age: "15 - 16", description: "Fairly difficult to read." },
  11: { age: "16 - 17", description: "Fairly difficult to read." },
  12: { age: "17 - 18", description: "Fairly difficult to read." },
  13: { age: "Over 18", description: "Difficult to read." },
  14: { age: "Over 18", description: "Difficult to read." },
  15: {
    age: "Over 18",
    description:
      "Very difficult to read. Best understood by university graduates."
  },
  16: {
    age: "Over 18",
    description:
      "Very difficult to read. Best understood by university graduates."
  },
  17: {
    age: "Over 18",
    description:
      "Very difficult to read. Best understood by university graduates."
  },
  18: {
    age: "Over 18",
    description:
      "Extremely difficult to read. Best understood by university graduates."
  },
  isNumber: {
    age: String.fromCodePoint(0x1f62c),
    description: "I can't do numbers :("
  }
};


/***/ }),

/***/ "./node_modules/syllable/index.js":
/*!****************************************!*\
  !*** ./node_modules/syllable/index.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "syllable": () => (/* binding */ syllable)
/* harmony export */ });
/* harmony import */ var pluralize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pluralize */ "./node_modules/pluralize/pluralize.js");
/* harmony import */ var normalize_strings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! normalize-strings */ "./node_modules/normalize-strings/index.js");
/* harmony import */ var _problematic_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./problematic.js */ "./node_modules/syllable/problematic.js");

// @ts-ignore remove when typed.



var own = {}.hasOwnProperty

// Two expressions of occurrences which normally would be counted as two
// syllables, but should be counted as one.
var EXPRESSION_MONOSYLLABIC_ONE = new RegExp(
  [
    'awe($|d|so)',
    'cia(?:l|$)',
    'tia',
    'cius',
    'cious',
    '[^aeiou]giu',
    '[aeiouy][^aeiouy]ion',
    'iou',
    'sia$',
    'eous$',
    '[oa]gue$',
    '.[^aeiuoycgltdb]{2,}ed$',
    '.ely$',
    '^jua',
    'uai',
    'eau',
    '^busi$',
    '(?:[aeiouy](?:' +
      [
        '[bcfgklmnprsvwxyz]',
        'ch',
        'dg',
        'g[hn]',
        'lch',
        'l[lv]',
        'mm',
        'nch',
        'n[cgn]',
        'r[bcnsv]',
        'squ',
        's[chkls]',
        'th'
      ].join('|') +
      ')ed$)',
    '(?:[aeiouy](?:' +
      [
        '[bdfklmnprstvy]',
        'ch',
        'g[hn]',
        'lch',
        'l[lv]',
        'mm',
        'nch',
        'nn',
        'r[nsv]',
        'squ',
        's[cklst]',
        'th'
      ].join('|') +
      ')es$)'
  ].join('|'),
  'g'
)

var EXPRESSION_MONOSYLLABIC_TWO = new RegExp(
  '[aeiouy](?:' +
    [
      '[bcdfgklmnprstvyz]',
      'ch',
      'dg',
      'g[hn]',
      'l[lv]',
      'mm',
      'n[cgns]',
      'r[cnsv]',
      'squ',
      's[cklst]',
      'th'
    ].join('|') +
    ')e$',
  'g'
)

// Four expression of occurrences which normally would be counted as one
// syllable, but should be counted as two.
var EXPRESSION_DOUBLE_SYLLABIC_ONE = new RegExp(
  '(?:' +
    [
      '([^aeiouy])\\1l',
      '[^aeiouy]ie(?:r|s?t)',
      '[aeiouym]bl',
      'eo',
      'ism',
      'asm',
      'thm',
      'dnt',
      'snt',
      'uity',
      'dea',
      'gean',
      'oa',
      'ua',
      'react?',
      'orbed', // Cancel `'.[^aeiuoycgltdb]{2,}ed$',`
      'shred', // Cancel `'.[^aeiuoycgltdb]{2,}ed$',`
      'eings?',
      '[aeiouy]sh?e[rs]'
    ].join('|') +
    ')$',
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_TWO = new RegExp(
  [
    'creat(?!u)',
    '[^gq]ua[^auieo]',
    '[aeiou]{3}',
    '^(?:ia|mc|coa[dglx].)',
    '^re(app|es|im|us)',
    '(th|d)eist'
  ].join('|'),
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_THREE = new RegExp(
  [
    '[^aeiou]y[ae]',
    '[^l]lien',
    'riet',
    'dien',
    'iu',
    'io',
    'ii',
    'uen',
    '[aeilotu]real',
    'real[aeilotu]',
    'iell',
    'eo[^aeiou]',
    '[aeiou]y[aeiou]'
  ].join('|'),
  'g'
)

var EXPRESSION_DOUBLE_SYLLABIC_FOUR = /[^s]ia/

// Expression to match single syllable pre- and suffixes.
var EXPRESSION_SINGLE = new RegExp(
  [
    '^(?:' +
      [
        'un',
        'fore',
        'ware',
        'none?',
        'out',
        'post',
        'sub',
        'pre',
        'pro',
        'dis',
        'side',
        'some'
      ].join('|') +
      ')',
    '(?:' +
      [
        'ly',
        'less',
        'some',
        'ful',
        'ers?',
        'ness',
        'cians?',
        'ments?',
        'ettes?',
        'villes?',
        'ships?',
        'sides?',
        'ports?',
        'shires?',
        '[gnst]ion(?:ed|s)?'
      ].join('|') +
      ')$'
  ].join('|'),
  'g'
)

// Expression to match double syllable pre- and suffixes.
var EXPRESSION_DOUBLE = new RegExp(
  [
    '^' +
      '(?:' +
      [
        'above',
        'anti',
        'ante',
        'counter',
        'hyper',
        'afore',
        'agri',
        'infra',
        'intra',
        'inter',
        'over',
        'semi',
        'ultra',
        'under',
        'extra',
        'dia',
        'micro',
        'mega',
        'kilo',
        'pico',
        'nano',
        'macro',
        'somer'
      ].join('|') +
      ')',
    '(?:fully|berry|woman|women|edly|union|((?:[bcdfghjklmnpqrstvwxz])|[aeiou])ye?ing)$'
  ].join('|'),
  'g'
)

// Expression to match triple syllable suffixes.
var EXPRESSION_TRIPLE = /(creations?|ology|ologist|onomy|onomist)$/g

// Wrapper to support multiple word-parts (GH-11).
/**
 * Syllable count
 *
 * @param {string} value
 * @returns {number}
 */
function syllable(value) {
  var values = normalize_strings__WEBPACK_IMPORTED_MODULE_1__(String(value))
    .toLowerCase()
    // Remove apostrophes.
    .replace(/['’]/g, '')
    // Split on word boundaries.
    .split(/\b/g)
  var index = -1
  var sum = 0

  while (++index < values.length) {
    // Remove non-alphabetic characters from a given value.
    sum += one(values[index].replace(/[^a-z]/g, ''))
  }

  return sum
}

/**
 * Get syllables in a given value.
 *
 * @param {string} value
 * @returns {number}
 */
function one(value) {
  var count = 0
  /** @type {number} */
  var index
  /** @type {string} */
  var singular
  /** @type {Array.<string>} */
  var parts
  /** @type {ReturnType.<returnFactory>} */
  var addOne
  /** @type {ReturnType.<returnFactory>} */
  var subtractOne

  if (value.length === 0) {
    return count
  }

  // Return early when possible.
  if (value.length < 3) {
    return 1
  }

  // If `value` is a hard to count, it might be in `problematic`.
  if (own.call(_problematic_js__WEBPACK_IMPORTED_MODULE_2__.problematic, value)) {
    return _problematic_js__WEBPACK_IMPORTED_MODULE_2__.problematic[value]
  }

  // Additionally, the singular word might be in `problematic`.
  singular = pluralize__WEBPACK_IMPORTED_MODULE_0__(value, 1)

  if (own.call(_problematic_js__WEBPACK_IMPORTED_MODULE_2__.problematic, singular)) {
    return _problematic_js__WEBPACK_IMPORTED_MODULE_2__.problematic[singular]
  }

  addOne = returnFactory(1)
  subtractOne = returnFactory(-1)

  // Count some prefixes and suffixes, and remove their matched ranges.
  value = value
    .replace(EXPRESSION_TRIPLE, countFactory(3))
    .replace(EXPRESSION_DOUBLE, countFactory(2))
    .replace(EXPRESSION_SINGLE, countFactory(1))

  // Count multiple consonants.
  parts = value.split(/[^aeiouy]+/)
  index = -1

  while (++index < parts.length) {
    if (parts[index] !== '') {
      count++
    }
  }

  // Subtract one for occurrences which should be counted as one (but are
  // counted as two).
  value
    .replace(EXPRESSION_MONOSYLLABIC_ONE, subtractOne)
    .replace(EXPRESSION_MONOSYLLABIC_TWO, subtractOne)

  // Add one for occurrences which should be counted as two (but are counted as
  // one).
  value
    .replace(EXPRESSION_DOUBLE_SYLLABIC_ONE, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_TWO, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_THREE, addOne)
    .replace(EXPRESSION_DOUBLE_SYLLABIC_FOUR, addOne)

  // Make sure at least on is returned.
  return count || 1

  /**
   * Define scoped counters, to be used in `String#replace()` calls.
   * The scoped counter removes the matched value from the input.
   *
   * @param {number} addition
   */
  function countFactory(addition) {
    return counter
    /**
     * @returns {string}
     */
    function counter() {
      count += addition
      return ''
    }
  }

  /**
   * This scoped counter does not remove the matched value from the input.
   *
   * @param {number} addition
   */
  function returnFactory(addition) {
    return returner
    /**
     * @param {string} $0
     * @returns {string}
     */
    function returner($0) {
      count += addition
      return $0
    }
  }
}


/***/ }),

/***/ "./node_modules/syllable/problematic.js":
/*!**********************************************!*\
  !*** ./node_modules/syllable/problematic.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "problematic": () => (/* binding */ problematic)
/* harmony export */ });
var problematic = {
  abalone: 4,
  abare: 3,
  abbruzzese: 4,
  abed: 2,
  aborigine: 5,
  abruzzese: 4,
  acreage: 3,
  adame: 3,
  adieu: 2,
  adobe: 3,
  anemone: 4,
  anyone: 3,
  apache: 3,
  aphrodite: 4,
  apostrophe: 4,
  ariadne: 4,
  cafe: 2,
  calliope: 4,
  catastrophe: 4,
  chile: 2,
  chloe: 2,
  circe: 2,
  coyote: 3,
  daphne: 2,
  epitome: 4,
  eurydice: 4,
  euterpe: 3,
  every: 2,
  everywhere: 3,
  forever: 3,
  gethsemane: 4,
  guacamole: 4,
  hermione: 4,
  hyperbole: 4,
  jesse: 2,
  jukebox: 2,
  karate: 3,
  machete: 3,
  maybe: 2,
  naive: 2,
  newlywed: 3,
  penelope: 4,
  people: 2,
  persephone: 4,
  phoebe: 2,
  pulse: 1,
  queue: 1,
  recipe: 3,
  riverbed: 3,
  sesame: 3,
  shoreline: 2,
  simile: 3,
  snuffleupagus: 5,
  sometimes: 2,
  syncope: 3,
  tamale: 3,
  waterbed: 3,
  wednesday: 2,
  yosemite: 4,
  zoe: 2
}


/***/ }),

/***/ "./node_modules/normalize-strings/charmap.json":
/*!*****************************************************!*\
  !*** ./node_modules/normalize-strings/charmap.json ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"105":"i","192":"A","193":"A","194":"A","195":"A","196":"A","197":"A","199":"C","200":"E","201":"E","202":"E","203":"E","204":"I","205":"I","206":"I","207":"I","209":"N","210":"O","211":"O","212":"O","213":"O","214":"O","216":"O","217":"U","218":"U","219":"U","220":"U","221":"Y","224":"a","225":"a","226":"a","227":"a","228":"a","229":"a","231":"c","232":"e","233":"e","234":"e","235":"e","236":"i","237":"i","238":"i","239":"i","241":"n","242":"o","243":"o","244":"o","245":"o","246":"o","248":"o","249":"u","250":"u","251":"u","252":"u","253":"y","255":"y","256":"A","257":"a","258":"A","259":"a","260":"A","261":"a","262":"C","263":"c","264":"C","265":"c","266":"C","267":"c","268":"C","269":"c","270":"D","271":"d","272":"D","273":"d","274":"E","275":"e","276":"E","277":"e","278":"E","279":"e","280":"E","281":"e","282":"E","283":"e","284":"G","285":"g","286":"G","287":"g","288":"G","289":"g","290":"G","291":"g","292":"H","293":"h","294":"H","295":"h","296":"I","297":"i","298":"I","299":"i","300":"I","301":"i","302":"I","303":"i","304":"I","308":"J","309":"j","310":"K","311":"k","313":"L","314":"l","315":"L","316":"l","317":"L","318":"l","319":"L","320":"l","321":"L","322":"l","323":"N","324":"n","325":"N","326":"n","327":"N","328":"n","332":"O","333":"o","334":"O","335":"o","336":"O","337":"o","338":"O","339":"o","340":"R","341":"r","342":"R","343":"r","344":"R","345":"r","346":"S","347":"s","348":"S","349":"s","350":"S","351":"s","352":"S","353":"s","354":"T","355":"t","356":"T","357":"t","358":"T","359":"t","360":"U","361":"u","362":"U","363":"u","364":"U","365":"u","366":"U","367":"u","368":"U","369":"u","370":"U","371":"u","372":"W","373":"w","374":"Y","375":"y","376":"Y","377":"Z","378":"z","379":"Z","380":"z","381":"Z","382":"z","384":"b","385":"B","386":"B","387":"b","390":"O","391":"C","392":"c","393":"D","394":"D","395":"D","396":"d","398":"E","400":"E","401":"F","402":"f","403":"G","407":"I","408":"K","409":"k","410":"l","412":"M","413":"N","414":"n","415":"O","416":"O","417":"o","420":"P","421":"p","422":"R","427":"t","428":"T","429":"t","430":"T","431":"U","432":"u","434":"V","435":"Y","436":"y","437":"Z","438":"z","461":"A","462":"a","463":"I","464":"i","465":"O","466":"o","467":"U","468":"u","477":"e","484":"G","485":"g","486":"G","487":"g","488":"K","489":"k","490":"O","491":"o","500":"G","501":"g","504":"N","505":"n","512":"A","513":"a","514":"A","515":"a","516":"E","517":"e","518":"E","519":"e","520":"I","521":"i","522":"I","523":"i","524":"O","525":"o","526":"O","527":"o","528":"R","529":"r","530":"R","531":"r","532":"U","533":"u","534":"U","535":"u","536":"S","537":"s","538":"T","539":"t","542":"H","543":"h","544":"N","545":"d","548":"Z","549":"z","550":"A","551":"a","552":"E","553":"e","558":"O","559":"o","562":"Y","563":"y","564":"l","565":"n","566":"t","567":"j","570":"A","571":"C","572":"c","573":"L","574":"T","575":"s","576":"z","579":"B","580":"U","581":"V","582":"E","583":"e","584":"J","585":"j","586":"Q","587":"q","588":"R","589":"r","590":"Y","591":"y","592":"a","593":"a","595":"b","596":"o","597":"c","598":"d","599":"d","600":"e","603":"e","604":"e","605":"e","606":"e","607":"j","608":"g","609":"g","610":"g","613":"h","614":"h","616":"i","618":"i","619":"l","620":"l","621":"l","623":"m","624":"m","625":"m","626":"n","627":"n","628":"n","629":"o","633":"r","634":"r","635":"r","636":"r","637":"r","638":"r","639":"r","640":"r","641":"r","642":"s","647":"t","648":"t","649":"u","651":"v","652":"v","653":"w","654":"y","655":"y","656":"z","657":"z","663":"c","665":"b","666":"e","667":"g","668":"h","669":"j","670":"k","671":"l","672":"q","686":"h","688":"h","690":"j","691":"r","692":"r","694":"r","695":"w","696":"y","737":"l","738":"s","739":"x","780":"v","829":"x","851":"x","867":"a","868":"e","869":"i","870":"o","871":"u","872":"c","873":"d","874":"h","875":"m","876":"r","877":"t","878":"v","879":"x","7424":"a","7427":"b","7428":"c","7429":"d","7431":"e","7432":"e","7433":"i","7434":"j","7435":"k","7436":"l","7437":"m","7438":"n","7439":"o","7440":"o","7441":"o","7442":"o","7443":"o","7446":"o","7447":"o","7448":"p","7449":"r","7450":"r","7451":"t","7452":"u","7453":"u","7454":"u","7455":"m","7456":"v","7457":"w","7458":"z","7522":"i","7523":"r","7524":"u","7525":"v","7680":"A","7681":"a","7682":"B","7683":"b","7684":"B","7685":"b","7686":"B","7687":"b","7690":"D","7691":"d","7692":"D","7693":"d","7694":"D","7695":"d","7696":"D","7697":"d","7698":"D","7699":"d","7704":"E","7705":"e","7706":"E","7707":"e","7710":"F","7711":"f","7712":"G","7713":"g","7714":"H","7715":"h","7716":"H","7717":"h","7718":"H","7719":"h","7720":"H","7721":"h","7722":"H","7723":"h","7724":"I","7725":"i","7728":"K","7729":"k","7730":"K","7731":"k","7732":"K","7733":"k","7734":"L","7735":"l","7738":"L","7739":"l","7740":"L","7741":"l","7742":"M","7743":"m","7744":"M","7745":"m","7746":"M","7747":"m","7748":"N","7749":"n","7750":"N","7751":"n","7752":"N","7753":"n","7754":"N","7755":"n","7764":"P","7765":"p","7766":"P","7767":"p","7768":"R","7769":"r","7770":"R","7771":"r","7774":"R","7775":"r","7776":"S","7777":"s","7778":"S","7779":"s","7786":"T","7787":"t","7788":"T","7789":"t","7790":"T","7791":"t","7792":"T","7793":"t","7794":"U","7795":"u","7796":"U","7797":"u","7798":"U","7799":"u","7804":"V","7805":"v","7806":"V","7807":"v","7808":"W","7809":"w","7810":"W","7811":"w","7812":"W","7813":"w","7814":"W","7815":"w","7816":"W","7817":"w","7818":"X","7819":"x","7820":"X","7821":"x","7822":"Y","7823":"y","7824":"Z","7825":"z","7826":"Z","7827":"z","7828":"Z","7829":"z","7835":"s","7840":"A","7841":"a","7842":"A","7843":"a","7864":"E","7865":"e","7866":"E","7867":"e","7868":"E","7869":"e","7880":"I","7881":"i","7882":"I","7883":"i","7884":"O","7885":"o","7886":"O","7887":"o","7908":"U","7909":"u","7910":"U","7911":"u","7922":"Y","7923":"y","7924":"Y","7925":"y","7926":"Y","7927":"y","7928":"Y","7929":"y","8305":"i","8341":"h","8342":"k","8343":"l","8344":"m","8345":"n","8346":"p","8347":"s","8348":"t","8450":"c","8458":"g","8459":"h","8460":"h","8461":"h","8464":"i","8465":"i","8466":"l","8467":"l","8468":"l","8469":"n","8472":"p","8473":"p","8474":"q","8475":"r","8476":"r","8477":"r","8484":"z","8488":"z","8492":"b","8493":"c","8495":"e","8496":"e","8497":"f","8498":"F","8499":"m","8500":"o","8506":"q","8513":"g","8514":"l","8515":"l","8516":"y","8517":"d","8518":"d","8519":"e","8520":"i","8521":"j","8526":"f","8579":"C","8580":"c","8765":"s","8766":"s","8959":"z","8999":"x","9746":"x","9776":"i","9866":"i","10005":"x","10006":"x","10007":"x","10008":"x","10625":"z","10626":"z","11362":"L","11364":"R","11365":"a","11366":"t","11373":"A","11374":"M","11375":"A","11390":"S","11391":"Z","19904":"i","42893":"H","42922":"H","42923":"E","42924":"G","42925":"L","42928":"K","42929":"T","62937":"x"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/code.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var syllable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! syllable */ "./node_modules/syllable/index.js");
/* harmony import */ var _grading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grading */ "./src/grading.js");



var sentenceWeight = 1.015;
var wordWeight = 84.6;
var base = 206.835;

const flesch = (counts) => {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN || _grading__WEBPACK_IMPORTED_MODULE_0__.scoreToAgeObj.isNumber.age;
  }

  const total = Number(
    (
      base -
      sentenceWeight * (counts.word / counts.sentence) -
      wordWeight * (counts.syllable / counts.word)
    ).toPrecision(2)
  );

  if (total < 0) return 0;
  if (total > 100) return 100;

  return total;
};

const grade = (counts) => {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN;
  }

  const total = Math.round(
    0.39 * (counts.word / counts.sentence) +
      11.8 * (counts.syllable / counts.word) -
      15.59
  );

  if (total < 5) return 0;
  if (total > 18) return 18;

  return total;
};

const words = (string) => {
  const getWords = string
    .toLowerCase()
    //   .replaceAll(/(^\w+'\w+)|,|\!|\?|\./g, '')
    .replaceAll(/'\B|[^a-z' ]/g, "")
    .split(" ")
    .filter(Boolean);

  return getWords.length;
};

const sentences = (string) => {
  const getPunctuation = string.match(/\!|\?|\./g);

  return getPunctuation
    ? string
        .split(getPunctuation)
        .map((x) => x.trim())
        .filter(Boolean).length
    : 1;
};

const scoreToAge = (score) => {
  return score < 5
    ? _grading__WEBPACK_IMPORTED_MODULE_0__.scoreToAgeObj[0]
    : score > 18
    ? _grading__WEBPACK_IMPORTED_MODULE_0__.scoreToAgeObj[18]
    : isNaN(score)
    ? _grading__WEBPACK_IMPORTED_MODULE_0__.scoreToAgeObj.isNumber
    : _grading__WEBPACK_IMPORTED_MODULE_0__.scoreToAgeObj[score];
};

figma.showUI(__html__, {
  width: 300,
  height: 250,
  title: "Flesch-Kincaid Score"
});

// figma.on('run', async () => {
// 	// const currentTheme = await figma.clientStorage.getAsync('theme');
// 	// figma.ui.postMessage({ type: 'theme', theme: currentTheme });
// });

// figma.ui.onmessage = msg => {
// 	// setting theme type in figma clientStorage
//   if (msg.type === 'theme-change') {
//     figma.clientStorage.setAsync('theme', msg.theme);
//   }
// };

// Handles sending flesch results to the UI
figma.on("selectionchange", (e) => {
  const selection = figma.currentPage.selection[0];

  if (selection && selection.type !== "TEXT") {
    const result = "No Text";
    const results = {
      type: "selection",
      score: result,
      age: result,
      description: ""
    };

    figma.ui.postMessage(results);
  }

  if (selection && selection.type === "TEXT" && selection.characters.length) {
    const numberOfSyllables = (0,syllable__WEBPACK_IMPORTED_MODULE_1__.syllable)(selection.characters);
    console.log("# Syllables: ", numberOfSyllables);
    const numberOfWords = words(selection.characters);
    console.log("# Words: ", numberOfWords);
    const numberOfSentences = sentences(selection.characters);
    console.log("# Sentences", numberOfSentences);

    const readingScore = flesch({
      word: numberOfWords,
      syllable: numberOfSyllables,
      sentence: numberOfSentences
    });

    const readingGrade = grade({
      word: numberOfWords,
      syllable: numberOfSyllables,
      sentence: numberOfSentences
    });

    const readingAge = scoreToAge(readingGrade);

    const results = {
      type: "selection",
      score: readingScore,
      age: readingAge.age,
      description: readingAge.description
    };

    figma.ui.postMessage(results);
  }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Zk07QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsbURBQW1EO0FBQzNELFFBQVEsbURBQW1EO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRGlDO0FBQ2pDO0FBQ3lDO0FBQ0c7O0FBRTVDLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLEdBQUc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxHQUFHO0FBQy9DLDRDQUE0QyxHQUFHO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFFQTtBQUNBO0FBQ0EsTUFBTSxzREFBZ0I7QUFDdEI7QUFDQSxNQUFNLHVEQUFpQjtBQUN2QjtBQUNBLE1BQU0sNERBQXlCO0FBQy9CLE1BQU0sbURBQWE7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSw4QkFBOEIsb0NBQW9DO0FBQ2xFLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsa0RBQVE7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3JlYWRpbmctc2NvcmUvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLXN0cmluZ3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS8uL25vZGVfbW9kdWxlcy9wbHVyYWxpemUvcGx1cmFsaXplLmpzIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvLi9zcmMvZ3JhZGluZy5qcyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vbm9kZV9tb2R1bGVzL3N5bGxhYmxlL2luZGV4LmpzIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvLi9ub2RlX21vZHVsZXMvc3lsbGFibGUvcHJvYmxlbWF0aWMuanMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvLi9zcmMvY29kZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShnbG9iYWwsIGdsb2JhbC5kb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoZ2xvYmFsLCBnbG9iYWwuZG9jdW1lbnQpO1xuICB9IGVsc2Uge1xuICAgICAgZ2xvYmFsLm5vcm1hbGl6ZSA9IGZhY3RvcnkoZ2xvYmFsLCBnbG9iYWwuZG9jdW1lbnQpO1xuICB9XG59ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIHZhciBjaGFybWFwID0gcmVxdWlyZSgnLi9jaGFybWFwLmpzb24nKTtcbiAgdmFyIHJlZ2V4ID0gbnVsbDtcbiAgdmFyIGN1cnJlbnRfY2hhcm1hcDtcbiAgdmFyIG9sZF9jaGFybWFwO1xuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZShzdHIsIGN1c3RvbV9jaGFybWFwKSB7XG4gICAgb2xkX2NoYXJtYXAgPSBjdXJyZW50X2NoYXJtYXA7XG4gICAgY3VycmVudF9jaGFybWFwID0gY3VzdG9tX2NoYXJtYXAgfHwgY2hhcm1hcDtcblxuICAgIHJlZ2V4ID0gKHJlZ2V4ICYmIG9sZF9jaGFybWFwID09PSBjdXJyZW50X2NoYXJtYXApID8gcmVnZXggOiBidWlsZFJlZ0V4cChjdXJyZW50X2NoYXJtYXApO1xuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCBmdW5jdGlvbihjaGFyVG9SZXBsYWNlKSB7XG4gICAgICByZXR1cm4gY3VycmVudF9jaGFybWFwW2NoYXJUb1JlcGxhY2UuY2hhckNvZGVBdCgwKV0gfHwgY2hhclRvUmVwbGFjZTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkUmVnRXhwKGNoYXJtYXApe1xuICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnWycgKyBPYmplY3Qua2V5cyhjaGFybWFwKS5tYXAoZnVuY3Rpb24oY29kZSkge3JldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpOyB9KS5qb2luKCcgJykgKyAnXScsICdnJyk7XG4gICB9XG5cbiAgcmV0dXJuIG5vcm1hbGl6ZTtcbn0pKTtcbiIsIi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uIChyb290LCBwbHVyYWxpemUpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwbHVyYWxpemUoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQsIHJlZ2lzdGVycyBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcGx1cmFsaXplKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWwuXG4gICAgcm9vdC5wbHVyYWxpemUgPSBwbHVyYWxpemUoKTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKCkge1xuICAvLyBSdWxlIHN0b3JhZ2UgLSBwbHVyYWxpemUgYW5kIHNpbmd1bGFyaXplIG5lZWQgdG8gYmUgcnVuIHNlcXVlbnRpYWxseSxcbiAgLy8gd2hpbGUgb3RoZXIgcnVsZXMgY2FuIGJlIG9wdGltaXplZCB1c2luZyBhbiBvYmplY3QgZm9yIGluc3RhbnQgbG9va3Vwcy5cbiAgdmFyIHBsdXJhbFJ1bGVzID0gW107XG4gIHZhciBzaW5ndWxhclJ1bGVzID0gW107XG4gIHZhciB1bmNvdW50YWJsZXMgPSB7fTtcbiAgdmFyIGlycmVndWxhclBsdXJhbHMgPSB7fTtcbiAgdmFyIGlycmVndWxhclNpbmdsZXMgPSB7fTtcblxuICAvKipcbiAgICogU2FuaXRpemUgYSBwbHVyYWxpemF0aW9uIHJ1bGUgdG8gYSB1c2FibGUgcmVndWxhciBleHByZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHsoUmVnRXhwfHN0cmluZyl9IHJ1bGVcbiAgICogQHJldHVybiB7UmVnRXhwfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSdWxlIChydWxlKSB7XG4gICAgaWYgKHR5cGVvZiBydWxlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcnVsZSArICckJywgJ2knKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzIGluIGEgd29yZCB0b2tlbiB0byBwcm9kdWNlIGEgZnVuY3Rpb24gdGhhdCBjYW4gcmVwbGljYXRlIHRoZSBjYXNlIG9uXG4gICAqIGFub3RoZXIgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHdvcmRcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcmVzdG9yZUNhc2UgKHdvcmQsIHRva2VuKSB7XG4gICAgLy8gVG9rZW5zIGFyZSBhbiBleGFjdCBtYXRjaC5cbiAgICBpZiAod29yZCA9PT0gdG9rZW4pIHJldHVybiB0b2tlbjtcblxuICAgIC8vIExvd2VyIGNhc2VkIHdvcmRzLiBFLmcuIFwiaGVsbG9cIi5cbiAgICBpZiAod29yZCA9PT0gd29yZC50b0xvd2VyQ2FzZSgpKSByZXR1cm4gdG9rZW4udG9Mb3dlckNhc2UoKTtcblxuICAgIC8vIFVwcGVyIGNhc2VkIHdvcmRzLiBFLmcuIFwiV0hJU0tZXCIuXG4gICAgaWYgKHdvcmQgPT09IHdvcmQudG9VcHBlckNhc2UoKSkgcmV0dXJuIHRva2VuLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAvLyBUaXRsZSBjYXNlZCB3b3Jkcy4gRS5nLiBcIlRpdGxlXCIuXG4gICAgaWYgKHdvcmRbMF0gPT09IHdvcmRbMF0udG9VcHBlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIHRva2VuLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdG9rZW4uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgLy8gTG93ZXIgY2FzZWQgd29yZHMuIEUuZy4gXCJ0ZXN0XCIuXG4gICAgcmV0dXJuIHRva2VuLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJwb2xhdGUgYSByZWdleHAgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICAgKiBAcGFyYW0gIHtBcnJheX0gIGFyZ3NcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUgKHN0ciwgYXJncykge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwkKFxcZHsxLDJ9KS9nLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4KSB7XG4gICAgICByZXR1cm4gYXJnc1tpbmRleF0gfHwgJyc7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgdXNpbmcgYSBydWxlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHdvcmRcbiAgICogQHBhcmFtICB7QXJyYXl9ICBydWxlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2UgKHdvcmQsIHJ1bGUpIHtcbiAgICByZXR1cm4gd29yZC5yZXBsYWNlKHJ1bGVbMF0sIGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgpIHtcbiAgICAgIHZhciByZXN1bHQgPSBpbnRlcnBvbGF0ZShydWxlWzFdLCBhcmd1bWVudHMpO1xuXG4gICAgICBpZiAobWF0Y2ggPT09ICcnKSB7XG4gICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkW2luZGV4IC0gMV0sIHJlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN0b3JlQ2FzZShtYXRjaCwgcmVzdWx0KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSBhIHdvcmQgYnkgcGFzc2luZyBpbiB0aGUgd29yZCBhbmQgc2FuaXRpemF0aW9uIHJ1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdG9rZW5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHdvcmRcbiAgICogQHBhcmFtICB7QXJyYXl9ICAgIHJ1bGVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplV29yZCAodG9rZW4sIHdvcmQsIHJ1bGVzKSB7XG4gICAgLy8gRW1wdHkgc3RyaW5nIG9yIGRvZXNuJ3QgbmVlZCBmaXhpbmcuXG4gICAgaWYgKCF0b2tlbi5sZW5ndGggfHwgdW5jb3VudGFibGVzLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IHJ1bGVzLmxlbmd0aDtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgc2FuaXRpemF0aW9uIHJ1bGVzIGFuZCB1c2UgdGhlIGZpcnN0IG9uZSB0byBtYXRjaC5cbiAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgIHZhciBydWxlID0gcnVsZXNbbGVuXTtcblxuICAgICAgaWYgKHJ1bGVbMF0udGVzdCh3b3JkKSkgcmV0dXJuIHJlcGxhY2Uod29yZCwgcnVsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgd2l0aCB0aGUgdXBkYXRlZCB3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgcmVwbGFjZU1hcFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAga2VlcE1hcFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgcnVsZXNcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlV29yZCAocmVwbGFjZU1hcCwga2VlcE1hcCwgcnVsZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgIC8vIEdldCB0aGUgY29ycmVjdCB0b2tlbiBhbmQgY2FzZSByZXN0b3JhdGlvbiBmdW5jdGlvbnMuXG4gICAgICB2YXIgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIGtlZXAgb2JqZWN0IG1hcC5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZCwgdG9rZW4pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSByZXBsYWNlbWVudCBtYXAgZm9yIGEgZGlyZWN0IHdvcmQgcmVwbGFjZW1lbnQuXG4gICAgICBpZiAocmVwbGFjZU1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHJlcGxhY2VNYXBbdG9rZW5dKTtcbiAgICAgIH1cblxuICAgICAgLy8gUnVuIGFsbCB0aGUgcnVsZXMgYWdhaW5zdCB0aGUgd29yZC5cbiAgICAgIHJldHVybiBzYW5pdGl6ZVdvcmQodG9rZW4sIHdvcmQsIHJ1bGVzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBwYXJ0IG9mIHRoZSBtYXAuXG4gICAqL1xuICBmdW5jdGlvbiBjaGVja1dvcmQgKHJlcGxhY2VNYXAsIGtlZXBNYXAsIHJ1bGVzLCBib29sKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICB2YXIgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAocmVwbGFjZU1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHJldHVybiBmYWxzZTtcblxuICAgICAgcmV0dXJuIHNhbml0aXplV29yZCh0b2tlbiwgdG9rZW4sIHJ1bGVzKSA9PT0gdG9rZW47XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgb3Igc2luZ3VsYXJpemUgYSB3b3JkIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gIHdvcmQgICAgICBUaGUgd29yZCB0byBwbHVyYWxpemVcbiAgICogQHBhcmFtICB7bnVtYmVyfSAgY291bnQgICAgIEhvdyBtYW55IG9mIHRoZSB3b3JkIGV4aXN0XG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1c2l2ZSBXaGV0aGVyIHRvIHByZWZpeCB3aXRoIHRoZSBudW1iZXIgKGUuZy4gMyBkdWNrcylcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gcGx1cmFsaXplICh3b3JkLCBjb3VudCwgaW5jbHVzaXZlKSB7XG4gICAgdmFyIHBsdXJhbGl6ZWQgPSBjb3VudCA9PT0gMVxuICAgICAgPyBwbHVyYWxpemUuc2luZ3VsYXIod29yZCkgOiBwbHVyYWxpemUucGx1cmFsKHdvcmQpO1xuXG4gICAgcmV0dXJuIChpbmNsdXNpdmUgPyBjb3VudCArICcgJyA6ICcnKSArIHBsdXJhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIGEgd29yZC5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcGx1cmFsaXplLnBsdXJhbCA9IHJlcGxhY2VXb3JkKFxuICAgIGlycmVndWxhclNpbmdsZXMsIGlycmVndWxhclBsdXJhbHMsIHBsdXJhbFJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBwbHVyYWwuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5pc1BsdXJhbCA9IGNoZWNrV29yZChcbiAgICBpcnJlZ3VsYXJTaW5nbGVzLCBpcnJlZ3VsYXJQbHVyYWxzLCBwbHVyYWxSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBTaW5ndWxhcml6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5zaW5ndWxhciA9IHJlcGxhY2VXb3JkKFxuICAgIGlycmVndWxhclBsdXJhbHMsIGlycmVndWxhclNpbmdsZXMsIHNpbmd1bGFyUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSB3b3JkIGlzIHNpbmd1bGFyLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuaXNTaW5ndWxhciA9IGNoZWNrV29yZChcbiAgICBpcnJlZ3VsYXJQbHVyYWxzLCBpcnJlZ3VsYXJTaW5nbGVzLCBzaW5ndWxhclJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHBsdXJhbFJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGEgc2luZ3VsYXJpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFNpbmd1bGFyUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHNpbmd1bGFyUnVsZXMucHVzaChbc2FuaXRpemVSdWxlKHJ1bGUpLCByZXBsYWNlbWVudF0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gdW5jb3VudGFibGUgd29yZCBydWxlLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gd29yZFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFVuY291bnRhYmxlUnVsZSA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgaWYgKHR5cGVvZiB3b3JkID09PSAnc3RyaW5nJykge1xuICAgICAgdW5jb3VudGFibGVzW3dvcmQudG9Mb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFNldCBzaW5ndWxhciBhbmQgcGx1cmFsIHJlZmVyZW5jZXMgZm9yIHRoZSB3b3JkLlxuICAgIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHdvcmQsICckMCcpO1xuICAgIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUod29yZCwgJyQwJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBpcnJlZ3VsYXIgd29yZCBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2luZ2xlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwbHVyYWxcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlID0gZnVuY3Rpb24gKHNpbmdsZSwgcGx1cmFsKSB7XG4gICAgcGx1cmFsID0gcGx1cmFsLnRvTG93ZXJDYXNlKCk7XG4gICAgc2luZ2xlID0gc2luZ2xlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpcnJlZ3VsYXJTaW5nbGVzW3NpbmdsZV0gPSBwbHVyYWw7XG4gICAgaXJyZWd1bGFyUGx1cmFsc1twbHVyYWxdID0gc2luZ2xlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJcnJlZ3VsYXIgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gUHJvbm91bnMuXG4gICAgWydJJywgJ3dlJ10sXG4gICAgWydtZScsICd1cyddLFxuICAgIFsnaGUnLCAndGhleSddLFxuICAgIFsnc2hlJywgJ3RoZXknXSxcbiAgICBbJ3RoZW0nLCAndGhlbSddLFxuICAgIFsnbXlzZWxmJywgJ291cnNlbHZlcyddLFxuICAgIFsneW91cnNlbGYnLCAneW91cnNlbHZlcyddLFxuICAgIFsnaXRzZWxmJywgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hlcnNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsnaGltc2VsZicsICd0aGVtc2VsdmVzJ10sXG4gICAgWyd0aGVtc2VsZicsICd0aGVtc2VsdmVzJ10sXG4gICAgWydpcycsICdhcmUnXSxcbiAgICBbJ3dhcycsICd3ZXJlJ10sXG4gICAgWydoYXMnLCAnaGF2ZSddLFxuICAgIFsndGhpcycsICd0aGVzZSddLFxuICAgIFsndGhhdCcsICd0aG9zZSddLFxuICAgIC8vIFdvcmRzIGVuZGluZyBpbiB3aXRoIGEgY29uc29uYW50IGFuZCBgb2AuXG4gICAgWydlY2hvJywgJ2VjaG9lcyddLFxuICAgIFsnZGluZ28nLCAnZGluZ29lcyddLFxuICAgIFsndm9sY2FubycsICd2b2xjYW5vZXMnXSxcbiAgICBbJ3Rvcm5hZG8nLCAndG9ybmFkb2VzJ10sXG4gICAgWyd0b3JwZWRvJywgJ3RvcnBlZG9lcyddLFxuICAgIC8vIEVuZHMgd2l0aCBgdXNgLlxuICAgIFsnZ2VudXMnLCAnZ2VuZXJhJ10sXG4gICAgWyd2aXNjdXMnLCAndmlzY2VyYSddLFxuICAgIC8vIEVuZHMgd2l0aCBgbWFgLlxuICAgIFsnc3RpZ21hJywgJ3N0aWdtYXRhJ10sXG4gICAgWydzdG9tYScsICdzdG9tYXRhJ10sXG4gICAgWydkb2dtYScsICdkb2dtYXRhJ10sXG4gICAgWydsZW1tYScsICdsZW1tYXRhJ10sXG4gICAgWydzY2hlbWEnLCAnc2NoZW1hdGEnXSxcbiAgICBbJ2FuYXRoZW1hJywgJ2FuYXRoZW1hdGEnXSxcbiAgICAvLyBPdGhlciBpcnJlZ3VsYXIgcnVsZXMuXG4gICAgWydveCcsICdveGVuJ10sXG4gICAgWydheGUnLCAnYXhlcyddLFxuICAgIFsnZGllJywgJ2RpY2UnXSxcbiAgICBbJ3llcycsICd5ZXNlcyddLFxuICAgIFsnZm9vdCcsICdmZWV0J10sXG4gICAgWydlYXZlJywgJ2VhdmVzJ10sXG4gICAgWydnb29zZScsICdnZWVzZSddLFxuICAgIFsndG9vdGgnLCAndGVldGgnXSxcbiAgICBbJ3F1aXonLCAncXVpenplcyddLFxuICAgIFsnaHVtYW4nLCAnaHVtYW5zJ10sXG4gICAgWydwcm9vZicsICdwcm9vZnMnXSxcbiAgICBbJ2NhcnZlJywgJ2NhcnZlcyddLFxuICAgIFsndmFsdmUnLCAndmFsdmVzJ10sXG4gICAgWydsb29leScsICdsb29pZXMnXSxcbiAgICBbJ3RoaWVmJywgJ3RoaWV2ZXMnXSxcbiAgICBbJ2dyb292ZScsICdncm9vdmVzJ10sXG4gICAgWydwaWNrYXhlJywgJ3BpY2theGVzJ10sXG4gICAgWydwYXNzZXJieScsICdwYXNzZXJzYnknXVxuICBdLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICByZXR1cm4gcGx1cmFsaXplLmFkZElycmVndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBQbHVyYWxpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcz8kL2ksICdzJ10sXG4gICAgWy9bXlxcdTAwMDAtXFx1MDA3Rl0kL2ksICckMCddLFxuICAgIFsvKFteYWVpb3VdZXNlKSQvaSwgJyQxJ10sXG4gICAgWy8oYXh8dGVzdClpcyQvaSwgJyQxZXMnXSxcbiAgICBbLyhhbGlhc3xbXmFvdV11c3x0W2xtXWFzfGdhc3xyaXMpJC9pLCAnJDFlcyddLFxuICAgIFsvKGVbbW5ddSlzPyQvaSwgJyQxcyddLFxuICAgIFsvKFtebF1pYXN8W2FlaW91XWxhc3xbZWp6cl1hc3xbaXVdYW0pJC9pLCAnJDEnXSxcbiAgICBbLyhhbHVtbnxzeWxsYWJ8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxaSddLFxuICAgIFsvKGFsdW1ufGFsZ3x2ZXJ0ZWJyKSg/OmF8YWUpJC9pLCAnJDFhZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpKD86aW0pPyQvaSwgJyQxaW0nXSxcbiAgICBbLyhoZXJ8YXR8Z3IpbyQvaSwgJyQxb2VzJ10sXG4gICAgWy8oYWdlbmR8YWRkZW5kfG1pbGxlbm5pfGRhdHxleHRyZW18YmFjdGVyaXxkZXNpZGVyYXR8c3RyYXR8Y2FuZGVsYWJyfGVycmF0fG92fHN5bXBvc2l8Y3VycmljdWx8YXV0b21hdHxxdW9yKSg/OmF8dW0pJC9pLCAnJDFhJ10sXG4gICAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxoZWRyfGF1dG9tYXQpKD86YXxvbikkL2ksICckMWEnXSxcbiAgICBbL3NpcyQvaSwgJ3NlcyddLFxuICAgIFsvKD86KGtuaXx3aXxsaSlmZXwoYXJ8bHxlYXxlb3xvYXxob28pZikkL2ksICckMSQydmVzJ10sXG4gICAgWy8oW15hZWlvdXldfHF1KXkkL2ksICckMWllcyddLFxuICAgIFsvKFteY2hdW2llb11bbG5dKWV5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyh4fGNofHNzfHNofHp6KSQvaSwgJyQxZXMnXSxcbiAgICBbLyhtYXRyfGNvZHxtdXJ8c2lsfHZlcnR8aW5kfGFwcGVuZCkoPzppeHxleCkkL2ksICckMWljZXMnXSxcbiAgICBbL1xcYigoPzp0aXQpP218bCkoPzppY2V8b3VzZSkkL2ksICckMWljZSddLFxuICAgIFsvKHBlKSg/OnJzb258b3BsZSkkL2ksICckMW9wbGUnXSxcbiAgICBbLyhjaGlsZCkoPzpyZW4pPyQvaSwgJyQxcmVuJ10sXG4gICAgWy9lYXV4JC9pLCAnJDAnXSxcbiAgICBbL21bYWVdbiQvaSwgJ21lbiddLFxuICAgIFsndGhvdScsICd5b3UnXVxuICBdLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICByZXR1cm4gcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTaW5ndWxhcml6YXRpb24gcnVsZXMuXG4gICAqL1xuICBbXG4gICAgWy9zJC9pLCAnJ10sXG4gICAgWy8oc3MpJC9pLCAnJDEnXSxcbiAgICBbLyh3aXxrbml8KD86YWZ0ZXJ8aGFsZnxoaWdofGxvd3xtaWR8bm9ufG5pZ2h0fFteXFx3XXxeKWxpKXZlcyQvaSwgJyQxZmUnXSxcbiAgICBbLyhhcnwoPzp3b3xbYWVdKWx8W2VvXVthb10pdmVzJC9pLCAnJDFmJ10sXG4gICAgWy9pZXMkL2ksICd5J10sXG4gICAgWy9cXGIoW3BsXXx6b21ifCg/Om5lY2t8Y3Jvc3MpP3R8Y29sbHxmYWVyfGZvb2R8Z2VufGdvb258Z3JvdXB8bGFzc3x0YWxrfGdvYWx8Y3V0KWllcyQvaSwgJyQxaWUnXSxcbiAgICBbL1xcYihtb258c21pbClpZXMkL2ksICckMWV5J10sXG4gICAgWy9cXGIoKD86dGl0KT9tfGwpaWNlJC9pLCAnJDFvdXNlJ10sXG4gICAgWy8oc2VyYXBofGNoZXJ1YilpbSQvaSwgJyQxJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6enx0dG98Z298Y2hvfGFsaWFzfFteYW91XXVzfHRbbG1dYXN8Z2FzfCg/OmhlcnxhdHxncilvfFthZWlvdV1yaXMpKD86ZXMpPyQvaSwgJyQxJ10sXG4gICAgWy8oYW5hbHl8ZGlhZ25vfHBhcmVudGhlfHByb2dub3xzeW5vcHx0aGV8ZW1waGF8Y3JpfG5lKSg/OnNpc3xzZXMpJC9pLCAnJDFzaXMnXSxcbiAgICBbLyhtb3ZpZXx0d2VsdmV8YWJ1c2V8ZVttbl11KXMkL2ksICckMSddLFxuICAgIFsvKHRlc3QpKD86aXN8ZXMpJC9pLCAnJDFpcyddLFxuICAgIFsvKGFsdW1ufHN5bGxhYnx2aXJ8cmFkaXxudWNsZXxmdW5nfGNhY3R8c3RpbXVsfHRlcm1pbnxiYWNpbGx8Zm9jfHV0ZXJ8bG9jfHN0cmF0KSg/OnVzfGkpJC9pLCAnJDF1cyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfHF1b3IpYSQvaSwgJyQxdW0nXSxcbiAgICBbLyhhcGhlbGl8aHlwZXJiYXR8cGVyaWhlbGl8YXN5bmRldHxub3VtZW58cGhlbm9tZW58Y3JpdGVyaXxvcmdhbnxwcm9sZWdvbWVufGhlZHJ8YXV0b21hdClhJC9pLCAnJDFvbiddLFxuICAgIFsvKGFsdW1ufGFsZ3x2ZXJ0ZWJyKWFlJC9pLCAnJDFhJ10sXG4gICAgWy8oY29kfG11cnxzaWx8dmVydHxpbmQpaWNlcyQvaSwgJyQxZXgnXSxcbiAgICBbLyhtYXRyfGFwcGVuZClpY2VzJC9pLCAnJDFpeCddLFxuICAgIFsvKHBlKShyc29ufG9wbGUpJC9pLCAnJDFyc29uJ10sXG4gICAgWy8oY2hpbGQpcmVuJC9pLCAnJDEnXSxcbiAgICBbLyhlYXUpeD8kL2ksICckMSddLFxuICAgIFsvbWVuJC9pLCAnbWFuJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBVbmNvdW50YWJsZSBydWxlcy5cbiAgICovXG4gIFtcbiAgICAvLyBTaW5ndWxhciB3b3JkcyB3aXRoIG5vIHBsdXJhbHMuXG4gICAgJ2FkdWx0aG9vZCcsXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZW5kYScsXG4gICAgJ2FpZCcsXG4gICAgJ2FpcmNyYWZ0JyxcbiAgICAnYWxjb2hvbCcsXG4gICAgJ2FtbW8nLFxuICAgICdhbmFseXRpY3MnLFxuICAgICdhbmltZScsXG4gICAgJ2F0aGxldGljcycsXG4gICAgJ2F1ZGlvJyxcbiAgICAnYmlzb24nLFxuICAgICdibG9vZCcsXG4gICAgJ2JyZWFtJyxcbiAgICAnYnVmZmFsbycsXG4gICAgJ2J1dHRlcicsXG4gICAgJ2NhcnAnLFxuICAgICdjYXNoJyxcbiAgICAnY2hhc3NpcycsXG4gICAgJ2NoZXNzJyxcbiAgICAnY2xvdGhpbmcnLFxuICAgICdjb2QnLFxuICAgICdjb21tZXJjZScsXG4gICAgJ2Nvb3BlcmF0aW9uJyxcbiAgICAnY29ycHMnLFxuICAgICdkZWJyaXMnLFxuICAgICdkaWFiZXRlcycsXG4gICAgJ2RpZ2VzdGlvbicsXG4gICAgJ2VsaycsXG4gICAgJ2VuZXJneScsXG4gICAgJ2VxdWlwbWVudCcsXG4gICAgJ2V4Y3JldGlvbicsXG4gICAgJ2V4cGVydGlzZScsXG4gICAgJ2Zpcm13YXJlJyxcbiAgICAnZmxvdW5kZXInLFxuICAgICdmdW4nLFxuICAgICdnYWxsb3dzJyxcbiAgICAnZ2FyYmFnZScsXG4gICAgJ2dyYWZmaXRpJyxcbiAgICAnaGFyZHdhcmUnLFxuICAgICdoZWFkcXVhcnRlcnMnLFxuICAgICdoZWFsdGgnLFxuICAgICdoZXJwZXMnLFxuICAgICdoaWdoamlua3MnLFxuICAgICdob21ld29yaycsXG4gICAgJ2hvdXNld29yaycsXG4gICAgJ2luZm9ybWF0aW9uJyxcbiAgICAnamVhbnMnLFxuICAgICdqdXN0aWNlJyxcbiAgICAna3Vkb3MnLFxuICAgICdsYWJvdXInLFxuICAgICdsaXRlcmF0dXJlJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFja2VyZWwnLFxuICAgICdtYWlsJyxcbiAgICAnbWVkaWEnLFxuICAgICdtZXdzJyxcbiAgICAnbW9vc2UnLFxuICAgICdtdXNpYycsXG4gICAgJ211ZCcsXG4gICAgJ21hbmdhJyxcbiAgICAnbmV3cycsXG4gICAgJ29ubHknLFxuICAgICdwZXJzb25uZWwnLFxuICAgICdwaWtlJyxcbiAgICAncGxhbmt0b24nLFxuICAgICdwbGllcnMnLFxuICAgICdwb2xpY2UnLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwcmVtaXNlcycsXG4gICAgJ3JhaW4nLFxuICAgICdyZXNlYXJjaCcsXG4gICAgJ3JpY2UnLFxuICAgICdzYWxtb24nLFxuICAgICdzY2lzc29ycycsXG4gICAgJ3NlcmllcycsXG4gICAgJ3Nld2FnZScsXG4gICAgJ3NoYW1ibGVzJyxcbiAgICAnc2hyaW1wJyxcbiAgICAnc29mdHdhcmUnLFxuICAgICdzcGVjaWVzJyxcbiAgICAnc3RhZmYnLFxuICAgICdzd2luZScsXG4gICAgJ3Rlbm5pcycsXG4gICAgJ3RyYWZmaWMnLFxuICAgICd0cmFuc3BvcnRhdGlvbicsXG4gICAgJ3Ryb3V0JyxcbiAgICAndHVuYScsXG4gICAgJ3dlYWx0aCcsXG4gICAgJ3dlbGZhcmUnLFxuICAgICd3aGl0aW5nJyxcbiAgICAnd2lsZGViZWVzdCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAneW91JyxcbiAgICAvcG9rW2XDqV1tb24kL2ksXG4gICAgLy8gUmVnZXhlcy5cbiAgICAvW15hZWlvdV1lc2UkL2ksIC8vIFwiY2hpbmVzZVwiLCBcImphcGFuZXNlXCJcbiAgICAvZGVlciQvaSwgLy8gXCJkZWVyXCIsIFwicmVpbmRlZXJcIlxuICAgIC9maXNoJC9pLCAvLyBcImZpc2hcIiwgXCJibG93ZmlzaFwiLCBcImFuZ2VsZmlzaFwiXG4gICAgL21lYXNsZXMkL2ksXG4gICAgL29baXVdcyQvaSwgLy8gXCJjYXJuaXZvcm91c1wiXG4gICAgL3BveCQvaSwgLy8gXCJjaGlja3BveFwiLCBcInNtYWxscG94XCJcbiAgICAvc2hlZXAkL2lcbiAgXS5mb3JFYWNoKHBsdXJhbGl6ZS5hZGRVbmNvdW50YWJsZVJ1bGUpO1xuXG4gIHJldHVybiBwbHVyYWxpemU7XG59KTtcbiIsImV4cG9ydCBjb25zdCBzY29yZVRvQWdlT2JqID0ge1xuICAwOiB7XG4gICAgZ3JhZGU6IFwiVW5kZXIgNXRoIGdyYWRlL1llYXIgNlwiLFxuICAgIGFnZTogXCJVbmRlciAxMFwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIlZlcnkgZWFzeS5cIlxuICB9LFxuICA1OiB7XG4gICAgYWdlOiBcIjEwIC0gMTFcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiVmVyeSBlYXN5IHRvIHJlYWQuIEVhc2lseSB1bmRlcnN0b29kIGJ5IGFuIGF2ZXJhZ2UgMTEgeWVhciBvbGQgc2Nob29sIHN0dWRlbnQuXCJcbiAgfSxcbiAgNjoge1xuICAgIGFnZTogXCIxMSAtIDEyXCIsXG4gICAgZGVzY3JpcHRpb246IFwiRWFzeSB0byByZWFkLiBDb252ZXJzYXRpb25hbCBFbmdsaXNoIGZvciBDb25zdW1lcnMuXCJcbiAgfSxcbiAgNzoge1xuICAgIGFnZTogXCIxMiAtIDEzXCIsXG4gICAgZGVzY3JpcHRpb246IFwiRmFpcmx5IGVhc3kgdG8gcmVhZC5cIlxuICB9LFxuICA4OiB7XG4gICAgYWdlOiBcIjEzIC0gMTRcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiUGxhaW4gRW5nbGlzaC4gRWFzaWx5IHVuZGVyc3Rvb2QgYnkgMTMgdG8gMTUgeWVhciBvbGQgc3R1ZGVudHMuXCJcbiAgfSxcbiAgOToge1xuICAgIGFnZTogXCIxNCAtIDE1XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlBsYWluIEVuZ2xpc2guIEVhc2lseSB1bmRlcnN0b29kIGJ5IDEzIHRvIDE1IHllYXIgb2xkIHN0dWRlbnRzLlwiXG4gIH0sXG4gIDEwOiB7IGFnZTogXCIxNSAtIDE2XCIsIGRlc2NyaXB0aW9uOiBcIkZhaXJseSBkaWZmaWN1bHQgdG8gcmVhZC5cIiB9LFxuICAxMTogeyBhZ2U6IFwiMTYgLSAxN1wiLCBkZXNjcmlwdGlvbjogXCJGYWlybHkgZGlmZmljdWx0IHRvIHJlYWQuXCIgfSxcbiAgMTI6IHsgYWdlOiBcIjE3IC0gMThcIiwgZGVzY3JpcHRpb246IFwiRmFpcmx5IGRpZmZpY3VsdCB0byByZWFkLlwiIH0sXG4gIDEzOiB7IGFnZTogXCJPdmVyIDE4XCIsIGRlc2NyaXB0aW9uOiBcIkRpZmZpY3VsdCB0byByZWFkLlwiIH0sXG4gIDE0OiB7IGFnZTogXCJPdmVyIDE4XCIsIGRlc2NyaXB0aW9uOiBcIkRpZmZpY3VsdCB0byByZWFkLlwiIH0sXG4gIDE1OiB7XG4gICAgYWdlOiBcIk92ZXIgMThcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiVmVyeSBkaWZmaWN1bHQgdG8gcmVhZC4gQmVzdCB1bmRlcnN0b29kIGJ5IHVuaXZlcnNpdHkgZ3JhZHVhdGVzLlwiXG4gIH0sXG4gIDE2OiB7XG4gICAgYWdlOiBcIk92ZXIgMThcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiVmVyeSBkaWZmaWN1bHQgdG8gcmVhZC4gQmVzdCB1bmRlcnN0b29kIGJ5IHVuaXZlcnNpdHkgZ3JhZHVhdGVzLlwiXG4gIH0sXG4gIDE3OiB7XG4gICAgYWdlOiBcIk92ZXIgMThcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiVmVyeSBkaWZmaWN1bHQgdG8gcmVhZC4gQmVzdCB1bmRlcnN0b29kIGJ5IHVuaXZlcnNpdHkgZ3JhZHVhdGVzLlwiXG4gIH0sXG4gIDE4OiB7XG4gICAgYWdlOiBcIk92ZXIgMThcIixcbiAgICBkZXNjcmlwdGlvbjpcbiAgICAgIFwiRXh0cmVtZWx5IGRpZmZpY3VsdCB0byByZWFkLiBCZXN0IHVuZGVyc3Rvb2QgYnkgdW5pdmVyc2l0eSBncmFkdWF0ZXMuXCJcbiAgfSxcbiAgaXNOdW1iZXI6IHtcbiAgICBhZ2U6IFN0cmluZy5mcm9tQ29kZVBvaW50KDB4MWY2MmMpLFxuICAgIGRlc2NyaXB0aW9uOiBcIkkgY2FuJ3QgZG8gbnVtYmVycyA6KFwiXG4gIH1cbn07XG4iLCJpbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcbi8vIEB0cy1pZ25vcmUgcmVtb3ZlIHdoZW4gdHlwZWQuXG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ25vcm1hbGl6ZS1zdHJpbmdzJ1xuaW1wb3J0IHtwcm9ibGVtYXRpY30gZnJvbSAnLi9wcm9ibGVtYXRpYy5qcydcblxudmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5XG5cbi8vIFR3byBleHByZXNzaW9ucyBvZiBvY2N1cnJlbmNlcyB3aGljaCBub3JtYWxseSB3b3VsZCBiZSBjb3VudGVkIGFzIHR3b1xuLy8gc3lsbGFibGVzLCBidXQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgb25lLlxudmFyIEVYUFJFU1NJT05fTU9OT1NZTExBQklDX09ORSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnYXdlKCR8ZHxzbyknLFxuICAgICdjaWEoPzpsfCQpJyxcbiAgICAndGlhJyxcbiAgICAnY2l1cycsXG4gICAgJ2Npb3VzJyxcbiAgICAnW15hZWlvdV1naXUnLFxuICAgICdbYWVpb3V5XVteYWVpb3V5XWlvbicsXG4gICAgJ2lvdScsXG4gICAgJ3NpYSQnLFxuICAgICdlb3VzJCcsXG4gICAgJ1tvYV1ndWUkJyxcbiAgICAnLlteYWVpdW95Y2dsdGRiXXsyLH1lZCQnLFxuICAgICcuZWx5JCcsXG4gICAgJ15qdWEnLFxuICAgICd1YWknLFxuICAgICdlYXUnLFxuICAgICdeYnVzaSQnLFxuICAgICcoPzpbYWVpb3V5XSg/OicgK1xuICAgICAgW1xuICAgICAgICAnW2JjZmdrbG1ucHJzdnd4eXpdJyxcbiAgICAgICAgJ2NoJyxcbiAgICAgICAgJ2RnJyxcbiAgICAgICAgJ2dbaG5dJyxcbiAgICAgICAgJ2xjaCcsXG4gICAgICAgICdsW2x2XScsXG4gICAgICAgICdtbScsXG4gICAgICAgICduY2gnLFxuICAgICAgICAnbltjZ25dJyxcbiAgICAgICAgJ3JbYmNuc3ZdJyxcbiAgICAgICAgJ3NxdScsXG4gICAgICAgICdzW2Noa2xzXScsXG4gICAgICAgICd0aCdcbiAgICAgIF0uam9pbignfCcpICtcbiAgICAgICcpZWQkKScsXG4gICAgJyg/OlthZWlvdXldKD86JyArXG4gICAgICBbXG4gICAgICAgICdbYmRma2xtbnByc3R2eV0nLFxuICAgICAgICAnY2gnLFxuICAgICAgICAnZ1tobl0nLFxuICAgICAgICAnbGNoJyxcbiAgICAgICAgJ2xbbHZdJyxcbiAgICAgICAgJ21tJyxcbiAgICAgICAgJ25jaCcsXG4gICAgICAgICdubicsXG4gICAgICAgICdyW25zdl0nLFxuICAgICAgICAnc3F1JyxcbiAgICAgICAgJ3NbY2tsc3RdJyxcbiAgICAgICAgJ3RoJ1xuICAgICAgXS5qb2luKCd8JykgK1xuICAgICAgJyllcyQpJ1xuICBdLmpvaW4oJ3wnKSxcbiAgJ2cnXG4pXG5cbnZhciBFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19UV08gPSBuZXcgUmVnRXhwKFxuICAnW2FlaW91eV0oPzonICtcbiAgICBbXG4gICAgICAnW2JjZGZna2xtbnByc3R2eXpdJyxcbiAgICAgICdjaCcsXG4gICAgICAnZGcnLFxuICAgICAgJ2dbaG5dJyxcbiAgICAgICdsW2x2XScsXG4gICAgICAnbW0nLFxuICAgICAgJ25bY2duc10nLFxuICAgICAgJ3JbY25zdl0nLFxuICAgICAgJ3NxdScsXG4gICAgICAnc1tja2xzdF0nLFxuICAgICAgJ3RoJ1xuICAgIF0uam9pbignfCcpICtcbiAgICAnKWUkJyxcbiAgJ2cnXG4pXG5cbi8vIEZvdXIgZXhwcmVzc2lvbiBvZiBvY2N1cnJlbmNlcyB3aGljaCBub3JtYWxseSB3b3VsZCBiZSBjb3VudGVkIGFzIG9uZVxuLy8gc3lsbGFibGUsIGJ1dCBzaG91bGQgYmUgY291bnRlZCBhcyB0d28uXG52YXIgRVhQUkVTU0lPTl9ET1VCTEVfU1lMTEFCSUNfT05FID0gbmV3IFJlZ0V4cChcbiAgJyg/OicgK1xuICAgIFtcbiAgICAgICcoW15hZWlvdXldKVxcXFwxbCcsXG4gICAgICAnW15hZWlvdXldaWUoPzpyfHM/dCknLFxuICAgICAgJ1thZWlvdXltXWJsJyxcbiAgICAgICdlbycsXG4gICAgICAnaXNtJyxcbiAgICAgICdhc20nLFxuICAgICAgJ3RobScsXG4gICAgICAnZG50JyxcbiAgICAgICdzbnQnLFxuICAgICAgJ3VpdHknLFxuICAgICAgJ2RlYScsXG4gICAgICAnZ2VhbicsXG4gICAgICAnb2EnLFxuICAgICAgJ3VhJyxcbiAgICAgICdyZWFjdD8nLFxuICAgICAgJ29yYmVkJywgLy8gQ2FuY2VsIGAnLlteYWVpdW95Y2dsdGRiXXsyLH1lZCQnLGBcbiAgICAgICdzaHJlZCcsIC8vIENhbmNlbCBgJy5bXmFlaXVveWNnbHRkYl17Mix9ZWQkJyxgXG4gICAgICAnZWluZ3M/JyxcbiAgICAgICdbYWVpb3V5XXNoP2VbcnNdJ1xuICAgIF0uam9pbignfCcpICtcbiAgICAnKSQnLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX1RXTyA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnY3JlYXQoPyF1KScsXG4gICAgJ1teZ3FddWFbXmF1aWVvXScsXG4gICAgJ1thZWlvdV17M30nLFxuICAgICdeKD86aWF8bWN8Y29hW2RnbHhdLiknLFxuICAgICdecmUoYXBwfGVzfGltfHVzKScsXG4gICAgJyh0aHxkKWVpc3QnXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX1RIUkVFID0gbmV3IFJlZ0V4cChcbiAgW1xuICAgICdbXmFlaW91XXlbYWVdJyxcbiAgICAnW15sXWxpZW4nLFxuICAgICdyaWV0JyxcbiAgICAnZGllbicsXG4gICAgJ2l1JyxcbiAgICAnaW8nLFxuICAgICdpaScsXG4gICAgJ3VlbicsXG4gICAgJ1thZWlsb3R1XXJlYWwnLFxuICAgICdyZWFsW2FlaWxvdHVdJyxcbiAgICAnaWVsbCcsXG4gICAgJ2VvW15hZWlvdV0nLFxuICAgICdbYWVpb3VdeVthZWlvdV0nXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX0ZPVVIgPSAvW15zXWlhL1xuXG4vLyBFeHByZXNzaW9uIHRvIG1hdGNoIHNpbmdsZSBzeWxsYWJsZSBwcmUtIGFuZCBzdWZmaXhlcy5cbnZhciBFWFBSRVNTSU9OX1NJTkdMRSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnXig/OicgK1xuICAgICAgW1xuICAgICAgICAndW4nLFxuICAgICAgICAnZm9yZScsXG4gICAgICAgICd3YXJlJyxcbiAgICAgICAgJ25vbmU/JyxcbiAgICAgICAgJ291dCcsXG4gICAgICAgICdwb3N0JyxcbiAgICAgICAgJ3N1YicsXG4gICAgICAgICdwcmUnLFxuICAgICAgICAncHJvJyxcbiAgICAgICAgJ2RpcycsXG4gICAgICAgICdzaWRlJyxcbiAgICAgICAgJ3NvbWUnXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKScsXG4gICAgJyg/OicgK1xuICAgICAgW1xuICAgICAgICAnbHknLFxuICAgICAgICAnbGVzcycsXG4gICAgICAgICdzb21lJyxcbiAgICAgICAgJ2Z1bCcsXG4gICAgICAgICdlcnM/JyxcbiAgICAgICAgJ25lc3MnLFxuICAgICAgICAnY2lhbnM/JyxcbiAgICAgICAgJ21lbnRzPycsXG4gICAgICAgICdldHRlcz8nLFxuICAgICAgICAndmlsbGVzPycsXG4gICAgICAgICdzaGlwcz8nLFxuICAgICAgICAnc2lkZXM/JyxcbiAgICAgICAgJ3BvcnRzPycsXG4gICAgICAgICdzaGlyZXM/JyxcbiAgICAgICAgJ1tnbnN0XWlvbig/OmVkfHMpPydcbiAgICAgIF0uam9pbignfCcpICtcbiAgICAgICcpJCdcbiAgXS5qb2luKCd8JyksXG4gICdnJ1xuKVxuXG4vLyBFeHByZXNzaW9uIHRvIG1hdGNoIGRvdWJsZSBzeWxsYWJsZSBwcmUtIGFuZCBzdWZmaXhlcy5cbnZhciBFWFBSRVNTSU9OX0RPVUJMRSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnXicgK1xuICAgICAgJyg/OicgK1xuICAgICAgW1xuICAgICAgICAnYWJvdmUnLFxuICAgICAgICAnYW50aScsXG4gICAgICAgICdhbnRlJyxcbiAgICAgICAgJ2NvdW50ZXInLFxuICAgICAgICAnaHlwZXInLFxuICAgICAgICAnYWZvcmUnLFxuICAgICAgICAnYWdyaScsXG4gICAgICAgICdpbmZyYScsXG4gICAgICAgICdpbnRyYScsXG4gICAgICAgICdpbnRlcicsXG4gICAgICAgICdvdmVyJyxcbiAgICAgICAgJ3NlbWknLFxuICAgICAgICAndWx0cmEnLFxuICAgICAgICAndW5kZXInLFxuICAgICAgICAnZXh0cmEnLFxuICAgICAgICAnZGlhJyxcbiAgICAgICAgJ21pY3JvJyxcbiAgICAgICAgJ21lZ2EnLFxuICAgICAgICAna2lsbycsXG4gICAgICAgICdwaWNvJyxcbiAgICAgICAgJ25hbm8nLFxuICAgICAgICAnbWFjcm8nLFxuICAgICAgICAnc29tZXInXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKScsXG4gICAgJyg/OmZ1bGx5fGJlcnJ5fHdvbWFufHdvbWVufGVkbHl8dW5pb258KCg/OltiY2RmZ2hqa2xtbnBxcnN0dnd4el0pfFthZWlvdV0peWU/aW5nKSQnXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxuLy8gRXhwcmVzc2lvbiB0byBtYXRjaCB0cmlwbGUgc3lsbGFibGUgc3VmZml4ZXMuXG52YXIgRVhQUkVTU0lPTl9UUklQTEUgPSAvKGNyZWF0aW9ucz98b2xvZ3l8b2xvZ2lzdHxvbm9teXxvbm9taXN0KSQvZ1xuXG4vLyBXcmFwcGVyIHRvIHN1cHBvcnQgbXVsdGlwbGUgd29yZC1wYXJ0cyAoR0gtMTEpLlxuLyoqXG4gKiBTeWxsYWJsZSBjb3VudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bGxhYmxlKHZhbHVlKSB7XG4gIHZhciB2YWx1ZXMgPSBub3JtYWxpemUoU3RyaW5nKHZhbHVlKSlcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC8vIFJlbW92ZSBhcG9zdHJvcGhlcy5cbiAgICAucmVwbGFjZSgvWyfigJldL2csICcnKVxuICAgIC8vIFNwbGl0IG9uIHdvcmQgYm91bmRhcmllcy5cbiAgICAuc3BsaXQoL1xcYi9nKVxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgc3VtID0gMFxuXG4gIHdoaWxlICgrK2luZGV4IDwgdmFsdWVzLmxlbmd0aCkge1xuICAgIC8vIFJlbW92ZSBub24tYWxwaGFiZXRpYyBjaGFyYWN0ZXJzIGZyb20gYSBnaXZlbiB2YWx1ZS5cbiAgICBzdW0gKz0gb25lKHZhbHVlc1tpbmRleF0ucmVwbGFjZSgvW15hLXpdL2csICcnKSlcbiAgfVxuXG4gIHJldHVybiBzdW1cbn1cblxuLyoqXG4gKiBHZXQgc3lsbGFibGVzIGluIGEgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBvbmUodmFsdWUpIHtcbiAgdmFyIGNvdW50ID0gMFxuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgdmFyIGluZGV4XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB2YXIgc2luZ3VsYXJcbiAgLyoqIEB0eXBlIHtBcnJheS48c3RyaW5nPn0gKi9cbiAgdmFyIHBhcnRzXG4gIC8qKiBAdHlwZSB7UmV0dXJuVHlwZS48cmV0dXJuRmFjdG9yeT59ICovXG4gIHZhciBhZGRPbmVcbiAgLyoqIEB0eXBlIHtSZXR1cm5UeXBlLjxyZXR1cm5GYWN0b3J5Pn0gKi9cbiAgdmFyIHN1YnRyYWN0T25lXG5cbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjb3VudFxuICB9XG5cbiAgLy8gUmV0dXJuIGVhcmx5IHdoZW4gcG9zc2libGUuXG4gIGlmICh2YWx1ZS5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIC8vIElmIGB2YWx1ZWAgaXMgYSBoYXJkIHRvIGNvdW50LCBpdCBtaWdodCBiZSBpbiBgcHJvYmxlbWF0aWNgLlxuICBpZiAob3duLmNhbGwocHJvYmxlbWF0aWMsIHZhbHVlKSkge1xuICAgIHJldHVybiBwcm9ibGVtYXRpY1t2YWx1ZV1cbiAgfVxuXG4gIC8vIEFkZGl0aW9uYWxseSwgdGhlIHNpbmd1bGFyIHdvcmQgbWlnaHQgYmUgaW4gYHByb2JsZW1hdGljYC5cbiAgc2luZ3VsYXIgPSBwbHVyYWxpemUodmFsdWUsIDEpXG5cbiAgaWYgKG93bi5jYWxsKHByb2JsZW1hdGljLCBzaW5ndWxhcikpIHtcbiAgICByZXR1cm4gcHJvYmxlbWF0aWNbc2luZ3VsYXJdXG4gIH1cblxuICBhZGRPbmUgPSByZXR1cm5GYWN0b3J5KDEpXG4gIHN1YnRyYWN0T25lID0gcmV0dXJuRmFjdG9yeSgtMSlcblxuICAvLyBDb3VudCBzb21lIHByZWZpeGVzIGFuZCBzdWZmaXhlcywgYW5kIHJlbW92ZSB0aGVpciBtYXRjaGVkIHJhbmdlcy5cbiAgdmFsdWUgPSB2YWx1ZVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fVFJJUExFLCBjb3VudEZhY3RvcnkoMykpXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9ET1VCTEUsIGNvdW50RmFjdG9yeSgyKSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX1NJTkdMRSwgY291bnRGYWN0b3J5KDEpKVxuXG4gIC8vIENvdW50IG11bHRpcGxlIGNvbnNvbmFudHMuXG4gIHBhcnRzID0gdmFsdWUuc3BsaXQoL1teYWVpb3V5XSsvKVxuICBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCBwYXJ0cy5sZW5ndGgpIHtcbiAgICBpZiAocGFydHNbaW5kZXhdICE9PSAnJykge1xuICAgICAgY291bnQrK1xuICAgIH1cbiAgfVxuXG4gIC8vIFN1YnRyYWN0IG9uZSBmb3Igb2NjdXJyZW5jZXMgd2hpY2ggc2hvdWxkIGJlIGNvdW50ZWQgYXMgb25lIChidXQgYXJlXG4gIC8vIGNvdW50ZWQgYXMgdHdvKS5cbiAgdmFsdWVcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19PTkUsIHN1YnRyYWN0T25lKVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fTU9OT1NZTExBQklDX1RXTywgc3VidHJhY3RPbmUpXG5cbiAgLy8gQWRkIG9uZSBmb3Igb2NjdXJyZW5jZXMgd2hpY2ggc2hvdWxkIGJlIGNvdW50ZWQgYXMgdHdvIChidXQgYXJlIGNvdW50ZWQgYXNcbiAgLy8gb25lKS5cbiAgdmFsdWVcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19PTkUsIGFkZE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19UV08sIGFkZE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19USFJFRSwgYWRkT25lKVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX0ZPVVIsIGFkZE9uZSlcblxuICAvLyBNYWtlIHN1cmUgYXQgbGVhc3Qgb24gaXMgcmV0dXJuZWQuXG4gIHJldHVybiBjb3VudCB8fCAxXG5cbiAgLyoqXG4gICAqIERlZmluZSBzY29wZWQgY291bnRlcnMsIHRvIGJlIHVzZWQgaW4gYFN0cmluZyNyZXBsYWNlKClgIGNhbGxzLlxuICAgKiBUaGUgc2NvcGVkIGNvdW50ZXIgcmVtb3ZlcyB0aGUgbWF0Y2hlZCB2YWx1ZSBmcm9tIHRoZSBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFkZGl0aW9uXG4gICAqL1xuICBmdW5jdGlvbiBjb3VudEZhY3RvcnkoYWRkaXRpb24pIHtcbiAgICByZXR1cm4gY291bnRlclxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gY291bnRlcigpIHtcbiAgICAgIGNvdW50ICs9IGFkZGl0aW9uXG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBzY29wZWQgY291bnRlciBkb2VzIG5vdCByZW1vdmUgdGhlIG1hdGNoZWQgdmFsdWUgZnJvbSB0aGUgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRpdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gcmV0dXJuRmFjdG9yeShhZGRpdGlvbikge1xuICAgIHJldHVybiByZXR1cm5lclxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAkMFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmV0dXJuZXIoJDApIHtcbiAgICAgIGNvdW50ICs9IGFkZGl0aW9uXG4gICAgICByZXR1cm4gJDBcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCB2YXIgcHJvYmxlbWF0aWMgPSB7XG4gIGFiYWxvbmU6IDQsXG4gIGFiYXJlOiAzLFxuICBhYmJydXp6ZXNlOiA0LFxuICBhYmVkOiAyLFxuICBhYm9yaWdpbmU6IDUsXG4gIGFicnV6emVzZTogNCxcbiAgYWNyZWFnZTogMyxcbiAgYWRhbWU6IDMsXG4gIGFkaWV1OiAyLFxuICBhZG9iZTogMyxcbiAgYW5lbW9uZTogNCxcbiAgYW55b25lOiAzLFxuICBhcGFjaGU6IDMsXG4gIGFwaHJvZGl0ZTogNCxcbiAgYXBvc3Ryb3BoZTogNCxcbiAgYXJpYWRuZTogNCxcbiAgY2FmZTogMixcbiAgY2FsbGlvcGU6IDQsXG4gIGNhdGFzdHJvcGhlOiA0LFxuICBjaGlsZTogMixcbiAgY2hsb2U6IDIsXG4gIGNpcmNlOiAyLFxuICBjb3lvdGU6IDMsXG4gIGRhcGhuZTogMixcbiAgZXBpdG9tZTogNCxcbiAgZXVyeWRpY2U6IDQsXG4gIGV1dGVycGU6IDMsXG4gIGV2ZXJ5OiAyLFxuICBldmVyeXdoZXJlOiAzLFxuICBmb3JldmVyOiAzLFxuICBnZXRoc2VtYW5lOiA0LFxuICBndWFjYW1vbGU6IDQsXG4gIGhlcm1pb25lOiA0LFxuICBoeXBlcmJvbGU6IDQsXG4gIGplc3NlOiAyLFxuICBqdWtlYm94OiAyLFxuICBrYXJhdGU6IDMsXG4gIG1hY2hldGU6IDMsXG4gIG1heWJlOiAyLFxuICBuYWl2ZTogMixcbiAgbmV3bHl3ZWQ6IDMsXG4gIHBlbmVsb3BlOiA0LFxuICBwZW9wbGU6IDIsXG4gIHBlcnNlcGhvbmU6IDQsXG4gIHBob2ViZTogMixcbiAgcHVsc2U6IDEsXG4gIHF1ZXVlOiAxLFxuICByZWNpcGU6IDMsXG4gIHJpdmVyYmVkOiAzLFxuICBzZXNhbWU6IDMsXG4gIHNob3JlbGluZTogMixcbiAgc2ltaWxlOiAzLFxuICBzbnVmZmxldXBhZ3VzOiA1LFxuICBzb21ldGltZXM6IDIsXG4gIHN5bmNvcGU6IDMsXG4gIHRhbWFsZTogMyxcbiAgd2F0ZXJiZWQ6IDMsXG4gIHdlZG5lc2RheTogMixcbiAgeW9zZW1pdGU6IDQsXG4gIHpvZTogMlxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzeWxsYWJsZSB9IGZyb20gXCJzeWxsYWJsZVwiO1xuaW1wb3J0IHsgc2NvcmVUb0FnZU9iaiB9IGZyb20gXCIuL2dyYWRpbmdcIjtcblxudmFyIHNlbnRlbmNlV2VpZ2h0ID0gMS4wMTU7XG52YXIgd29yZFdlaWdodCA9IDg0LjY7XG52YXIgYmFzZSA9IDIwNi44MzU7XG5cbmNvbnN0IGZsZXNjaCA9IChjb3VudHMpID0+IHtcbiAgaWYgKCFjb3VudHMgfHwgIWNvdW50cy5zZW50ZW5jZSB8fCAhY291bnRzLndvcmQgfHwgIWNvdW50cy5zeWxsYWJsZSkge1xuICAgIHJldHVybiBOdW1iZXIuTmFOIHx8IHNjb3JlVG9BZ2VPYmpbXCJpc051bWJlclwiXS5hZ2U7XG4gIH1cblxuICBjb25zdCB0b3RhbCA9IE51bWJlcihcbiAgICAoXG4gICAgICBiYXNlIC1cbiAgICAgIHNlbnRlbmNlV2VpZ2h0ICogKGNvdW50cy53b3JkIC8gY291bnRzLnNlbnRlbmNlKSAtXG4gICAgICB3b3JkV2VpZ2h0ICogKGNvdW50cy5zeWxsYWJsZSAvIGNvdW50cy53b3JkKVxuICAgICkudG9QcmVjaXNpb24oMilcbiAgKTtcblxuICBpZiAodG90YWwgPCAwKSByZXR1cm4gMDtcbiAgaWYgKHRvdGFsID4gMTAwKSByZXR1cm4gMTAwO1xuXG4gIHJldHVybiB0b3RhbDtcbn07XG5cbmNvbnN0IGdyYWRlID0gKGNvdW50cykgPT4ge1xuICBpZiAoIWNvdW50cyB8fCAhY291bnRzLnNlbnRlbmNlIHx8ICFjb3VudHMud29yZCB8fCAhY291bnRzLnN5bGxhYmxlKSB7XG4gICAgcmV0dXJuIE51bWJlci5OYU47XG4gIH1cblxuICBjb25zdCB0b3RhbCA9IE1hdGgucm91bmQoXG4gICAgMC4zOSAqIChjb3VudHMud29yZCAvIGNvdW50cy5zZW50ZW5jZSkgK1xuICAgICAgMTEuOCAqIChjb3VudHMuc3lsbGFibGUgLyBjb3VudHMud29yZCkgLVxuICAgICAgMTUuNTlcbiAgKTtcblxuICBpZiAodG90YWwgPCA1KSByZXR1cm4gMDtcbiAgaWYgKHRvdGFsID4gMTgpIHJldHVybiAxODtcblxuICByZXR1cm4gdG90YWw7XG59O1xuXG5jb25zdCB3b3JkcyA9IChzdHJpbmcpID0+IHtcbiAgY29uc3QgZ2V0V29yZHMgPSBzdHJpbmdcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC8vICAgLnJlcGxhY2VBbGwoLyheXFx3KydcXHcrKXwsfFxcIXxcXD98XFwuL2csICcnKVxuICAgIC5yZXBsYWNlQWxsKC8nXFxCfFteYS16JyBdL2csIFwiXCIpXG4gICAgLnNwbGl0KFwiIFwiKVxuICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcmV0dXJuIGdldFdvcmRzLmxlbmd0aDtcbn07XG5cbmNvbnN0IHNlbnRlbmNlcyA9IChzdHJpbmcpID0+IHtcbiAgY29uc3QgZ2V0UHVuY3R1YXRpb24gPSBzdHJpbmcubWF0Y2goL1xcIXxcXD98XFwuL2cpO1xuXG4gIHJldHVybiBnZXRQdW5jdHVhdGlvblxuICAgID8gc3RyaW5nXG4gICAgICAgIC5zcGxpdChnZXRQdW5jdHVhdGlvbilcbiAgICAgICAgLm1hcCgoeCkgPT4geC50cmltKCkpXG4gICAgICAgIC5maWx0ZXIoQm9vbGVhbikubGVuZ3RoXG4gICAgOiAxO1xufTtcblxuY29uc3Qgc2NvcmVUb0FnZSA9IChzY29yZSkgPT4ge1xuICByZXR1cm4gc2NvcmUgPCA1XG4gICAgPyBzY29yZVRvQWdlT2JqWzBdXG4gICAgOiBzY29yZSA+IDE4XG4gICAgPyBzY29yZVRvQWdlT2JqWzE4XVxuICAgIDogaXNOYU4oc2NvcmUpXG4gICAgPyBzY29yZVRvQWdlT2JqW1wiaXNOdW1iZXJcIl1cbiAgICA6IHNjb3JlVG9BZ2VPYmpbc2NvcmVdO1xufTtcblxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7XG4gIHdpZHRoOiAzMDAsXG4gIGhlaWdodDogMjUwLFxuICB0aXRsZTogXCJGbGVzY2gtS2luY2FpZCBTY29yZVwiXG59KTtcblxuLy8gZmlnbWEub24oJ3J1bicsIGFzeW5jICgpID0+IHtcbi8vIFx0Ly8gY29uc3QgY3VycmVudFRoZW1lID0gYXdhaXQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygndGhlbWUnKTtcbi8vIFx0Ly8gZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAndGhlbWUnLCB0aGVtZTogY3VycmVudFRoZW1lIH0pO1xuLy8gfSk7XG5cbi8vIGZpZ21hLnVpLm9ubWVzc2FnZSA9IG1zZyA9PiB7XG4vLyBcdC8vIHNldHRpbmcgdGhlbWUgdHlwZSBpbiBmaWdtYSBjbGllbnRTdG9yYWdlXG4vLyAgIGlmIChtc2cudHlwZSA9PT0gJ3RoZW1lLWNoYW5nZScpIHtcbi8vICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCd0aGVtZScsIG1zZy50aGVtZSk7XG4vLyAgIH1cbi8vIH07XG5cbi8vIEhhbmRsZXMgc2VuZGluZyBmbGVzY2ggcmVzdWx0cyB0byB0aGUgVUlcbmZpZ21hLm9uKFwic2VsZWN0aW9uY2hhbmdlXCIsIChlKSA9PiB7XG4gIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcblxuICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi50eXBlICE9PSBcIlRFWFRcIikge1xuICAgIGNvbnN0IHJlc3VsdCA9IFwiTm8gVGV4dFwiO1xuICAgIGNvbnN0IHJlc3VsdHMgPSB7XG4gICAgICB0eXBlOiBcInNlbGVjdGlvblwiLFxuICAgICAgc2NvcmU6IHJlc3VsdCxcbiAgICAgIGFnZTogcmVzdWx0LFxuICAgICAgZGVzY3JpcHRpb246IFwiXCJcbiAgICB9O1xuXG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UocmVzdWx0cyk7XG4gIH1cblxuICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi50eXBlID09PSBcIlRFWFRcIiAmJiBzZWxlY3Rpb24uY2hhcmFjdGVycy5sZW5ndGgpIHtcbiAgICBjb25zdCBudW1iZXJPZlN5bGxhYmxlcyA9IHN5bGxhYmxlKHNlbGVjdGlvbi5jaGFyYWN0ZXJzKTtcbiAgICBjb25zb2xlLmxvZyhcIiMgU3lsbGFibGVzOiBcIiwgbnVtYmVyT2ZTeWxsYWJsZXMpO1xuICAgIGNvbnN0IG51bWJlck9mV29yZHMgPSB3b3JkcyhzZWxlY3Rpb24uY2hhcmFjdGVycyk7XG4gICAgY29uc29sZS5sb2coXCIjIFdvcmRzOiBcIiwgbnVtYmVyT2ZXb3Jkcyk7XG4gICAgY29uc3QgbnVtYmVyT2ZTZW50ZW5jZXMgPSBzZW50ZW5jZXMoc2VsZWN0aW9uLmNoYXJhY3RlcnMpO1xuICAgIGNvbnNvbGUubG9nKFwiIyBTZW50ZW5jZXNcIiwgbnVtYmVyT2ZTZW50ZW5jZXMpO1xuXG4gICAgY29uc3QgcmVhZGluZ1Njb3JlID0gZmxlc2NoKHtcbiAgICAgIHdvcmQ6IG51bWJlck9mV29yZHMsXG4gICAgICBzeWxsYWJsZTogbnVtYmVyT2ZTeWxsYWJsZXMsXG4gICAgICBzZW50ZW5jZTogbnVtYmVyT2ZTZW50ZW5jZXNcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlYWRpbmdHcmFkZSA9IGdyYWRlKHtcbiAgICAgIHdvcmQ6IG51bWJlck9mV29yZHMsXG4gICAgICBzeWxsYWJsZTogbnVtYmVyT2ZTeWxsYWJsZXMsXG4gICAgICBzZW50ZW5jZTogbnVtYmVyT2ZTZW50ZW5jZXNcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlYWRpbmdBZ2UgPSBzY29yZVRvQWdlKHJlYWRpbmdHcmFkZSk7XG5cbiAgICBjb25zdCByZXN1bHRzID0ge1xuICAgICAgdHlwZTogXCJzZWxlY3Rpb25cIixcbiAgICAgIHNjb3JlOiByZWFkaW5nU2NvcmUsXG4gICAgICBhZ2U6IHJlYWRpbmdBZ2UuYWdlLFxuICAgICAgZGVzY3JpcHRpb246IHJlYWRpbmdBZ2UuZGVzY3JpcHRpb25cbiAgICB9O1xuXG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UocmVzdWx0cyk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9