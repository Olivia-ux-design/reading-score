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
  // Readable seems to count : and  ; in its logic for sentences,
  // but doesn't display that score in the UI. It displays a sentence score
  // that doesn't include them. This is a WIP.
  const sentenceRegex = /\!|\?|\.|\;|\:|\n/g;
  const getPunctuation = string.match(sentenceRegex);
  const getSentences = string
    .split(sentenceRegex)
    .map((x) => x.trim())
    .filter(Boolean);

  return getPunctuation ? getSentences.length : 1;
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
    // console.log("# Syllables: ", numberOfSyllables);
    const numberOfWords = words(selection.characters);
    // console.log("# Words: ", numberOfWords);
    const numberOfSentences = sentences(selection.characters);
    // console.log("# Sentences", numberOfSentences);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Zk07QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsMERBQTBEO0FBQ2xFLFFBQVEsbURBQW1EO0FBQzNELFFBQVEsbURBQW1EO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxRGlDO0FBQ2pDO0FBQ3lDO0FBQ0c7O0FBRTVDLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLEdBQUc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxHQUFHO0FBQy9DLDRDQUE0QyxHQUFHO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0sc0RBQWdCO0FBQ3RCO0FBQ0EsTUFBTSx1REFBaUI7QUFDdkI7QUFDQSxNQUFNLDREQUF5QjtBQUMvQixNQUFNLG1EQUFhO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsOEJBQThCLG9DQUFvQztBQUNsRSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLGtEQUFRO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS1zdHJpbmdzL2luZGV4LmpzIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvLi9ub2RlX21vZHVsZXMvcGx1cmFsaXplL3BsdXJhbGl6ZS5qcyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vc3JjL2dyYWRpbmcuanMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS8uL25vZGVfbW9kdWxlcy9zeWxsYWJsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vbm9kZV9tb2R1bGVzL3N5bGxhYmxlL3Byb2JsZW1hdGljLmpzIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vc3JjL2NvZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoZ2xvYmFsLCBnbG9iYWwuZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbC5ub3JtYWxpemUgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgfVxufSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICB2YXIgY2hhcm1hcCA9IHJlcXVpcmUoJy4vY2hhcm1hcC5qc29uJyk7XG4gIHZhciByZWdleCA9IG51bGw7XG4gIHZhciBjdXJyZW50X2NoYXJtYXA7XG4gIHZhciBvbGRfY2hhcm1hcDtcblxuICBmdW5jdGlvbiBub3JtYWxpemUoc3RyLCBjdXN0b21fY2hhcm1hcCkge1xuICAgIG9sZF9jaGFybWFwID0gY3VycmVudF9jaGFybWFwO1xuICAgIGN1cnJlbnRfY2hhcm1hcCA9IGN1c3RvbV9jaGFybWFwIHx8IGNoYXJtYXA7XG5cbiAgICByZWdleCA9IChyZWdleCAmJiBvbGRfY2hhcm1hcCA9PT0gY3VycmVudF9jaGFybWFwKSA/IHJlZ2V4IDogYnVpbGRSZWdFeHAoY3VycmVudF9jaGFybWFwKTtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleCwgZnVuY3Rpb24oY2hhclRvUmVwbGFjZSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRfY2hhcm1hcFtjaGFyVG9SZXBsYWNlLmNoYXJDb2RlQXQoMCldIHx8IGNoYXJUb1JlcGxhY2U7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFJlZ0V4cChjaGFybWFwKXtcbiAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ1snICsgT2JqZWN0LmtleXMoY2hhcm1hcCkubWFwKGZ1bmN0aW9uKGNvZGUpIHtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTsgfSkuam9pbignICcpICsgJ10nLCAnZycpO1xuICAgfVxuXG4gIHJldHVybiBub3JtYWxpemU7XG59KSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAocm9vdCwgcGx1cmFsaXplKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gcGx1cmFsaXplKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELCByZWdpc3RlcnMgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBsdXJhbGl6ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsLlxuICAgIHJvb3QucGx1cmFsaXplID0gcGx1cmFsaXplKCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgLy8gUnVsZSBzdG9yYWdlIC0gcGx1cmFsaXplIGFuZCBzaW5ndWxhcml6ZSBuZWVkIHRvIGJlIHJ1biBzZXF1ZW50aWFsbHksXG4gIC8vIHdoaWxlIG90aGVyIHJ1bGVzIGNhbiBiZSBvcHRpbWl6ZWQgdXNpbmcgYW4gb2JqZWN0IGZvciBpbnN0YW50IGxvb2t1cHMuXG4gIHZhciBwbHVyYWxSdWxlcyA9IFtdO1xuICB2YXIgc2luZ3VsYXJSdWxlcyA9IFtdO1xuICB2YXIgdW5jb3VudGFibGVzID0ge307XG4gIHZhciBpcnJlZ3VsYXJQbHVyYWxzID0ge307XG4gIHZhciBpcnJlZ3VsYXJTaW5nbGVzID0ge307XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIGEgdXNhYmxlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtICB7KFJlZ0V4cHxzdHJpbmcpfSBydWxlXG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUnVsZSAocnVsZSkge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBpbiBhIHdvcmQgdG9rZW4gdG8gcHJvZHVjZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJlcGxpY2F0ZSB0aGUgY2FzZSBvblxuICAgKiBhbm90aGVyIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB0b2tlblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc3RvcmVDYXNlICh3b3JkLCB0b2tlbikge1xuICAgIC8vIFRva2VucyBhcmUgYW4gZXhhY3QgbWF0Y2guXG4gICAgaWYgKHdvcmQgPT09IHRva2VuKSByZXR1cm4gdG9rZW47XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcImhlbGxvXCIuXG4gICAgaWYgKHdvcmQgPT09IHdvcmQudG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRva2VuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBVcHBlciBjYXNlZCB3b3Jkcy4gRS5nLiBcIldISVNLWVwiLlxuICAgIGlmICh3b3JkID09PSB3b3JkLnRvVXBwZXJDYXNlKCkpIHJldHVybiB0b2tlbi50b1VwcGVyQ2FzZSgpO1xuXG4gICAgLy8gVGl0bGUgY2FzZWQgd29yZHMuIEUuZy4gXCJUaXRsZVwiLlxuICAgIGlmICh3b3JkWzBdID09PSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHJldHVybiB0b2tlbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRva2VuLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIExvd2VyIGNhc2VkIHdvcmRzLiBFLmcuIFwidGVzdFwiLlxuICAgIHJldHVybiB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVycG9sYXRlIGEgcmVnZXhwIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAgICogQHBhcmFtICB7QXJyYXl9ICBhcmdzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlIChzdHIsIGFyZ3MpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcJChcXGR7MSwyfSkvZywgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGFyZ3NbaW5kZXhdIHx8ICcnO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHVzaW5nIGEgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgcnVsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlICh3b3JkLCBydWxlKSB7XG4gICAgcmV0dXJuIHdvcmQucmVwbGFjZShydWxlWzBdLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gaW50ZXJwb2xhdGUocnVsZVsxXSwgYXJndW1lbnRzKTtcblxuICAgICAgaWYgKG1hdGNoID09PSAnJykge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZFtpbmRleCAtIDFdLCByZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdG9yZUNhc2UobWF0Y2gsIHJlc3VsdCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSB3b3JkIGJ5IHBhc3NpbmcgaW4gdGhlIHdvcmQgYW5kIHNhbml0aXphdGlvbiBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVdvcmQgKHRva2VuLCB3b3JkLCBydWxlcykge1xuICAgIC8vIEVtcHR5IHN0cmluZyBvciBkb2Vzbid0IG5lZWQgZml4aW5nLlxuICAgIGlmICghdG9rZW4ubGVuZ3RoIHx8IHVuY291bnRhYmxlcy5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH1cblxuICAgIHZhciBsZW4gPSBydWxlcy5sZW5ndGg7XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHNhbml0aXphdGlvbiBydWxlcyBhbmQgdXNlIHRoZSBmaXJzdCBvbmUgdG8gbWF0Y2guXG4gICAgd2hpbGUgKGxlbi0tKSB7XG4gICAgICB2YXIgcnVsZSA9IHJ1bGVzW2xlbl07XG5cbiAgICAgIGlmIChydWxlWzBdLnRlc3Qod29yZCkpIHJldHVybiByZXBsYWNlKHdvcmQsIHJ1bGUpO1xuICAgIH1cblxuICAgIHJldHVybiB3b3JkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHdpdGggdGhlIHVwZGF0ZWQgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIHJlcGxhY2VNYXBcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGtlZXBNYXBcbiAgICogQHBhcmFtICB7QXJyYXl9ICAgIHJ1bGVzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcmVwbGFjZVdvcmQgKHJlcGxhY2VNYXAsIGtlZXBNYXAsIHJ1bGVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAvLyBHZXQgdGhlIGNvcnJlY3QgdG9rZW4gYW5kIGNhc2UgcmVzdG9yYXRpb24gZnVuY3Rpb25zLlxuICAgICAgdmFyIHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSBrZWVwIG9iamVjdCBtYXAuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHRva2VuKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUgcmVwbGFjZW1lbnQgbWFwIGZvciBhIGRpcmVjdCB3b3JkIHJlcGxhY2VtZW50LlxuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkLCByZXBsYWNlTWFwW3Rva2VuXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgdGhlIHJ1bGVzIGFnYWluc3QgdGhlIHdvcmQuXG4gICAgICByZXR1cm4gc2FuaXRpemVXb3JkKHRva2VuLCB3b3JkLCBydWxlcyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHdvcmQgaXMgcGFydCBvZiB0aGUgbWFwLlxuICAgKi9cbiAgZnVuY3Rpb24gY2hlY2tXb3JkIChyZXBsYWNlTWFwLCBrZWVwTWFwLCBydWxlcywgYm9vbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAod29yZCkge1xuICAgICAgdmFyIHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiBzYW5pdGl6ZVdvcmQodG9rZW4sIHRva2VuLCBydWxlcykgPT09IHRva2VuO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIG9yIHNpbmd1bGFyaXplIGEgd29yZCBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvdW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB3b3JkICAgICAgVGhlIHdvcmQgdG8gcGx1cmFsaXplXG4gICAqIEBwYXJhbSAge251bWJlcn0gIGNvdW50ICAgICBIb3cgbWFueSBvZiB0aGUgd29yZCBleGlzdFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdXNpdmUgV2hldGhlciB0byBwcmVmaXggd2l0aCB0aGUgbnVtYmVyIChlLmcuIDMgZHVja3MpXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHBsdXJhbGl6ZSAod29yZCwgY291bnQsIGluY2x1c2l2ZSkge1xuICAgIHZhciBwbHVyYWxpemVkID0gY291bnQgPT09IDFcbiAgICAgID8gcGx1cmFsaXplLnNpbmd1bGFyKHdvcmQpIDogcGx1cmFsaXplLnBsdXJhbCh3b3JkKTtcblxuICAgIHJldHVybiAoaW5jbHVzaXZlID8gY291bnQgKyAnICcgOiAnJykgKyBwbHVyYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5wbHVyYWwgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJTaW5nbGVzLCBpcnJlZ3VsYXJQbHVyYWxzLCBwbHVyYWxSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHdvcmQgaXMgcGx1cmFsLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuaXNQbHVyYWwgPSBjaGVja1dvcmQoXG4gICAgaXJyZWd1bGFyU2luZ2xlcywgaXJyZWd1bGFyUGx1cmFscywgcGx1cmFsUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuc2luZ3VsYXIgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJQbHVyYWxzLCBpcnJlZ3VsYXJTaW5nbGVzLCBzaW5ndWxhclJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBzaW5ndWxhci5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcGx1cmFsaXplLmlzU2luZ3VsYXIgPSBjaGVja1dvcmQoXG4gICAgaXJyZWd1bGFyUGx1cmFscywgaXJyZWd1bGFyU2luZ2xlcywgc2luZ3VsYXJSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBwbHVyYWxpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBwbHVyYWxSdWxlcy5wdXNoKFtzYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpbmd1bGFyaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBzaW5ndWxhclJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIHVuY291bnRhYmxlIHdvcmQgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHdvcmRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRVbmNvdW50YWJsZVJ1bGUgPSBmdW5jdGlvbiAod29yZCkge1xuICAgIGlmICh0eXBlb2Ygd29yZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHVuY291bnRhYmxlc1t3b3JkLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZXQgc2luZ3VsYXIgYW5kIHBsdXJhbCByZWZlcmVuY2VzIGZvciB0aGUgd29yZC5cbiAgICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSh3b3JkLCAnJDAnKTtcbiAgICBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHdvcmQsICckMCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXJyZWd1bGFyIHdvcmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNpbmdsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGx1cmFsXG4gICAqL1xuICBwbHVyYWxpemUuYWRkSXJyZWd1bGFyUnVsZSA9IGZ1bmN0aW9uIChzaW5nbGUsIHBsdXJhbCkge1xuICAgIHBsdXJhbCA9IHBsdXJhbC50b0xvd2VyQ2FzZSgpO1xuICAgIHNpbmdsZSA9IHNpbmdsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaXJyZWd1bGFyU2luZ2xlc1tzaW5nbGVdID0gcGx1cmFsO1xuICAgIGlycmVndWxhclBsdXJhbHNbcGx1cmFsXSA9IHNpbmdsZTtcbiAgfTtcblxuICAvKipcbiAgICogSXJyZWd1bGFyIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIC8vIFByb25vdW5zLlxuICAgIFsnSScsICd3ZSddLFxuICAgIFsnbWUnLCAndXMnXSxcbiAgICBbJ2hlJywgJ3RoZXknXSxcbiAgICBbJ3NoZScsICd0aGV5J10sXG4gICAgWyd0aGVtJywgJ3RoZW0nXSxcbiAgICBbJ215c2VsZicsICdvdXJzZWx2ZXMnXSxcbiAgICBbJ3lvdXJzZWxmJywgJ3lvdXJzZWx2ZXMnXSxcbiAgICBbJ2l0c2VsZicsICd0aGVtc2VsdmVzJ10sXG4gICAgWydoZXJzZWxmJywgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hpbXNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsndGhlbXNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsnaXMnLCAnYXJlJ10sXG4gICAgWyd3YXMnLCAnd2VyZSddLFxuICAgIFsnaGFzJywgJ2hhdmUnXSxcbiAgICBbJ3RoaXMnLCAndGhlc2UnXSxcbiAgICBbJ3RoYXQnLCAndGhvc2UnXSxcbiAgICAvLyBXb3JkcyBlbmRpbmcgaW4gd2l0aCBhIGNvbnNvbmFudCBhbmQgYG9gLlxuICAgIFsnZWNobycsICdlY2hvZXMnXSxcbiAgICBbJ2RpbmdvJywgJ2RpbmdvZXMnXSxcbiAgICBbJ3ZvbGNhbm8nLCAndm9sY2Fub2VzJ10sXG4gICAgWyd0b3JuYWRvJywgJ3Rvcm5hZG9lcyddLFxuICAgIFsndG9ycGVkbycsICd0b3JwZWRvZXMnXSxcbiAgICAvLyBFbmRzIHdpdGggYHVzYC5cbiAgICBbJ2dlbnVzJywgJ2dlbmVyYSddLFxuICAgIFsndmlzY3VzJywgJ3Zpc2NlcmEnXSxcbiAgICAvLyBFbmRzIHdpdGggYG1hYC5cbiAgICBbJ3N0aWdtYScsICdzdGlnbWF0YSddLFxuICAgIFsnc3RvbWEnLCAnc3RvbWF0YSddLFxuICAgIFsnZG9nbWEnLCAnZG9nbWF0YSddLFxuICAgIFsnbGVtbWEnLCAnbGVtbWF0YSddLFxuICAgIFsnc2NoZW1hJywgJ3NjaGVtYXRhJ10sXG4gICAgWydhbmF0aGVtYScsICdhbmF0aGVtYXRhJ10sXG4gICAgLy8gT3RoZXIgaXJyZWd1bGFyIHJ1bGVzLlxuICAgIFsnb3gnLCAnb3hlbiddLFxuICAgIFsnYXhlJywgJ2F4ZXMnXSxcbiAgICBbJ2RpZScsICdkaWNlJ10sXG4gICAgWyd5ZXMnLCAneWVzZXMnXSxcbiAgICBbJ2Zvb3QnLCAnZmVldCddLFxuICAgIFsnZWF2ZScsICdlYXZlcyddLFxuICAgIFsnZ29vc2UnLCAnZ2Vlc2UnXSxcbiAgICBbJ3Rvb3RoJywgJ3RlZXRoJ10sXG4gICAgWydxdWl6JywgJ3F1aXp6ZXMnXSxcbiAgICBbJ2h1bWFuJywgJ2h1bWFucyddLFxuICAgIFsncHJvb2YnLCAncHJvb2ZzJ10sXG4gICAgWydjYXJ2ZScsICdjYXJ2ZXMnXSxcbiAgICBbJ3ZhbHZlJywgJ3ZhbHZlcyddLFxuICAgIFsnbG9vZXknLCAnbG9vaWVzJ10sXG4gICAgWyd0aGllZicsICd0aGlldmVzJ10sXG4gICAgWydncm9vdmUnLCAnZ3Jvb3ZlcyddLFxuICAgIFsncGlja2F4ZScsICdwaWNrYXhlcyddLFxuICAgIFsncGFzc2VyYnknLCAncGFzc2Vyc2J5J11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogUGx1cmFsaXphdGlvbiBydWxlcy5cbiAgICovXG4gIFtcbiAgICBbL3M/JC9pLCAncyddLFxuICAgIFsvW15cXHUwMDAwLVxcdTAwN0ZdJC9pLCAnJDAnXSxcbiAgICBbLyhbXmFlaW91XWVzZSkkL2ksICckMSddLFxuICAgIFsvKGF4fHRlc3QpaXMkL2ksICckMWVzJ10sXG4gICAgWy8oYWxpYXN8W15hb3VddXN8dFtsbV1hc3xnYXN8cmlzKSQvaSwgJyQxZXMnXSxcbiAgICBbLyhlW21uXXUpcz8kL2ksICckMXMnXSxcbiAgICBbLyhbXmxdaWFzfFthZWlvdV1sYXN8W2VqenJdYXN8W2l1XWFtKSQvaSwgJyQxJ10sXG4gICAgWy8oYWx1bW58c3lsbGFifHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMWknXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicikoPzphfGFlKSQvaSwgJyQxYWUnXSxcbiAgICBbLyhzZXJhcGh8Y2hlcnViKSg/OmltKT8kL2ksICckMWltJ10sXG4gICAgWy8oaGVyfGF0fGdyKW8kL2ksICckMW9lcyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcikoPzphfHVtKSQvaSwgJyQxYSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58aGVkcnxhdXRvbWF0KSg/OmF8b24pJC9pLCAnJDFhJ10sXG4gICAgWy9zaXMkL2ksICdzZXMnXSxcbiAgICBbLyg/Oihrbml8d2l8bGkpZmV8KGFyfGx8ZWF8ZW98b2F8aG9vKWYpJC9pLCAnJDEkMnZlcyddLFxuICAgIFsvKFteYWVpb3V5XXxxdSl5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyhbXmNoXVtpZW9dW2xuXSlleSQvaSwgJyQxaWVzJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6eikkL2ksICckMWVzJ10sXG4gICAgWy8obWF0cnxjb2R8bXVyfHNpbHx2ZXJ0fGluZHxhcHBlbmQpKD86aXh8ZXgpJC9pLCAnJDFpY2VzJ10sXG4gICAgWy9cXGIoKD86dGl0KT9tfGwpKD86aWNlfG91c2UpJC9pLCAnJDFpY2UnXSxcbiAgICBbLyhwZSkoPzpyc29ufG9wbGUpJC9pLCAnJDFvcGxlJ10sXG4gICAgWy8oY2hpbGQpKD86cmVuKT8kL2ksICckMXJlbiddLFxuICAgIFsvZWF1eCQvaSwgJyQwJ10sXG4gICAgWy9tW2FlXW4kL2ksICdtZW4nXSxcbiAgICBbJ3Rob3UnLCAneW91J11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcyQvaSwgJyddLFxuICAgIFsvKHNzKSQvaSwgJyQxJ10sXG4gICAgWy8od2l8a25pfCg/OmFmdGVyfGhhbGZ8aGlnaHxsb3d8bWlkfG5vbnxuaWdodHxbXlxcd118XilsaSl2ZXMkL2ksICckMWZlJ10sXG4gICAgWy8oYXJ8KD86d298W2FlXSlsfFtlb11bYW9dKXZlcyQvaSwgJyQxZiddLFxuICAgIFsvaWVzJC9pLCAneSddLFxuICAgIFsvXFxiKFtwbF18em9tYnwoPzpuZWNrfGNyb3NzKT90fGNvbGx8ZmFlcnxmb29kfGdlbnxnb29ufGdyb3VwfGxhc3N8dGFsa3xnb2FsfGN1dClpZXMkL2ksICckMWllJ10sXG4gICAgWy9cXGIobW9ufHNtaWwpaWVzJC9pLCAnJDFleSddLFxuICAgIFsvXFxiKCg/OnRpdCk/bXxsKWljZSQvaSwgJyQxb3VzZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpaW0kL2ksICckMSddLFxuICAgIFsvKHh8Y2h8c3N8c2h8enp8dHRvfGdvfGNob3xhbGlhc3xbXmFvdV11c3x0W2xtXWFzfGdhc3woPzpoZXJ8YXR8Z3Ipb3xbYWVpb3VdcmlzKSg/OmVzKT8kL2ksICckMSddLFxuICAgIFsvKGFuYWx5fGRpYWdub3xwYXJlbnRoZXxwcm9nbm98c3lub3B8dGhlfGVtcGhhfGNyaXxuZSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gICAgWy8obW92aWV8dHdlbHZlfGFidXNlfGVbbW5ddSlzJC9pLCAnJDEnXSxcbiAgICBbLyh0ZXN0KSg/OmlzfGVzKSQvaSwgJyQxaXMnXSxcbiAgICBbLyhhbHVtbnxzeWxsYWJ8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxdXMnXSxcbiAgICBbLyhhZ2VuZHxhZGRlbmR8bWlsbGVubml8ZGF0fGV4dHJlbXxiYWN0ZXJpfGRlc2lkZXJhdHxzdHJhdHxjYW5kZWxhYnJ8ZXJyYXR8b3Z8c3ltcG9zaXxjdXJyaWN1bHxxdW9yKWEkL2ksICckMXVtJ10sXG4gICAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxoZWRyfGF1dG9tYXQpYSQvaSwgJyQxb24nXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicilhZSQvaSwgJyQxYSddLFxuICAgIFsvKGNvZHxtdXJ8c2lsfHZlcnR8aW5kKWljZXMkL2ksICckMWV4J10sXG4gICAgWy8obWF0cnxhcHBlbmQpaWNlcyQvaSwgJyQxaXgnXSxcbiAgICBbLyhwZSkocnNvbnxvcGxlKSQvaSwgJyQxcnNvbiddLFxuICAgIFsvKGNoaWxkKXJlbiQvaSwgJyQxJ10sXG4gICAgWy8oZWF1KXg/JC9pLCAnJDEnXSxcbiAgICBbL21lbiQvaSwgJ21hbiddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogVW5jb3VudGFibGUgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gU2luZ3VsYXIgd29yZHMgd2l0aCBubyBwbHVyYWxzLlxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZpY2UnLFxuICAgICdhZ2VuZGEnLFxuICAgICdhaWQnLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbW1vJyxcbiAgICAnYW5hbHl0aWNzJyxcbiAgICAnYW5pbWUnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgICdhdWRpbycsXG4gICAgJ2Jpc29uJyxcbiAgICAnYmxvb2QnLFxuICAgICdicmVhbScsXG4gICAgJ2J1ZmZhbG8nLFxuICAgICdidXR0ZXInLFxuICAgICdjYXJwJyxcbiAgICAnY2FzaCcsXG4gICAgJ2NoYXNzaXMnLFxuICAgICdjaGVzcycsXG4gICAgJ2Nsb3RoaW5nJyxcbiAgICAnY29kJyxcbiAgICAnY29tbWVyY2UnLFxuICAgICdjb29wZXJhdGlvbicsXG4gICAgJ2NvcnBzJyxcbiAgICAnZGVicmlzJyxcbiAgICAnZGlhYmV0ZXMnLFxuICAgICdkaWdlc3Rpb24nLFxuICAgICdlbGsnLFxuICAgICdlbmVyZ3knLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdleGNyZXRpb24nLFxuICAgICdleHBlcnRpc2UnLFxuICAgICdmaXJtd2FyZScsXG4gICAgJ2Zsb3VuZGVyJyxcbiAgICAnZnVuJyxcbiAgICAnZ2FsbG93cycsXG4gICAgJ2dhcmJhZ2UnLFxuICAgICdncmFmZml0aScsXG4gICAgJ2hhcmR3YXJlJyxcbiAgICAnaGVhZHF1YXJ0ZXJzJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVycGVzJyxcbiAgICAnaGlnaGppbmtzJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob3VzZXdvcmsnLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgJ2plYW5zJyxcbiAgICAnanVzdGljZScsXG4gICAgJ2t1ZG9zJyxcbiAgICAnbGFib3VyJyxcbiAgICAnbGl0ZXJhdHVyZScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hY2tlcmVsJyxcbiAgICAnbWFpbCcsXG4gICAgJ21lZGlhJyxcbiAgICAnbWV3cycsXG4gICAgJ21vb3NlJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdWQnLFxuICAgICdtYW5nYScsXG4gICAgJ25ld3MnLFxuICAgICdvbmx5JyxcbiAgICAncGVyc29ubmVsJyxcbiAgICAncGlrZScsXG4gICAgJ3BsYW5rdG9uJyxcbiAgICAncGxpZXJzJyxcbiAgICAncG9saWNlJyxcbiAgICAncG9sbHV0aW9uJyxcbiAgICAncHJlbWlzZXMnLFxuICAgICdyYWluJyxcbiAgICAncmVzZWFyY2gnLFxuICAgICdyaWNlJyxcbiAgICAnc2FsbW9uJyxcbiAgICAnc2Npc3NvcnMnLFxuICAgICdzZXJpZXMnLFxuICAgICdzZXdhZ2UnLFxuICAgICdzaGFtYmxlcycsXG4gICAgJ3NocmltcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc3BlY2llcycsXG4gICAgJ3N0YWZmJyxcbiAgICAnc3dpbmUnLFxuICAgICd0ZW5uaXMnLFxuICAgICd0cmFmZmljJyxcbiAgICAndHJhbnNwb3J0YXRpb24nLFxuICAgICd0cm91dCcsXG4gICAgJ3R1bmEnLFxuICAgICd3ZWFsdGgnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hpdGluZycsXG4gICAgJ3dpbGRlYmVlc3QnLFxuICAgICd3aWxkbGlmZScsXG4gICAgJ3lvdScsXG4gICAgL3Bva1tlw6ldbW9uJC9pLFxuICAgIC8vIFJlZ2V4ZXMuXG4gICAgL1teYWVpb3VdZXNlJC9pLCAvLyBcImNoaW5lc2VcIiwgXCJqYXBhbmVzZVwiXG4gICAgL2RlZXIkL2ksIC8vIFwiZGVlclwiLCBcInJlaW5kZWVyXCJcbiAgICAvZmlzaCQvaSwgLy8gXCJmaXNoXCIsIFwiYmxvd2Zpc2hcIiwgXCJhbmdlbGZpc2hcIlxuICAgIC9tZWFzbGVzJC9pLFxuICAgIC9vW2l1XXMkL2ksIC8vIFwiY2Fybml2b3JvdXNcIlxuICAgIC9wb3gkL2ksIC8vIFwiY2hpY2twb3hcIiwgXCJzbWFsbHBveFwiXG4gICAgL3NoZWVwJC9pXG4gIF0uZm9yRWFjaChwbHVyYWxpemUuYWRkVW5jb3VudGFibGVSdWxlKTtcblxuICByZXR1cm4gcGx1cmFsaXplO1xufSk7XG4iLCJleHBvcnQgY29uc3Qgc2NvcmVUb0FnZU9iaiA9IHtcbiAgMDoge1xuICAgIGdyYWRlOiBcIlVuZGVyIDV0aCBncmFkZS9ZZWFyIDZcIixcbiAgICBhZ2U6IFwiVW5kZXIgMTBcIixcbiAgICBkZXNjcmlwdGlvbjogXCJWZXJ5IGVhc3kuXCJcbiAgfSxcbiAgNToge1xuICAgIGFnZTogXCIxMCAtIDExXCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlZlcnkgZWFzeSB0byByZWFkLiBFYXNpbHkgdW5kZXJzdG9vZCBieSBhbiBhdmVyYWdlIDExIHllYXIgb2xkIHNjaG9vbCBzdHVkZW50LlwiXG4gIH0sXG4gIDY6IHtcbiAgICBhZ2U6IFwiMTEgLSAxMlwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkVhc3kgdG8gcmVhZC4gQ29udmVyc2F0aW9uYWwgRW5nbGlzaCBmb3IgQ29uc3VtZXJzLlwiXG4gIH0sXG4gIDc6IHtcbiAgICBhZ2U6IFwiMTIgLSAxM1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIkZhaXJseSBlYXN5IHRvIHJlYWQuXCJcbiAgfSxcbiAgODoge1xuICAgIGFnZTogXCIxMyAtIDE0XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlBsYWluIEVuZ2xpc2guIEVhc2lseSB1bmRlcnN0b29kIGJ5IDEzIHRvIDE1IHllYXIgb2xkIHN0dWRlbnRzLlwiXG4gIH0sXG4gIDk6IHtcbiAgICBhZ2U6IFwiMTQgLSAxNVwiLFxuICAgIGRlc2NyaXB0aW9uOlxuICAgICAgXCJQbGFpbiBFbmdsaXNoLiBFYXNpbHkgdW5kZXJzdG9vZCBieSAxMyB0byAxNSB5ZWFyIG9sZCBzdHVkZW50cy5cIlxuICB9LFxuICAxMDogeyBhZ2U6IFwiMTUgLSAxNlwiLCBkZXNjcmlwdGlvbjogXCJGYWlybHkgZGlmZmljdWx0IHRvIHJlYWQuXCIgfSxcbiAgMTE6IHsgYWdlOiBcIjE2IC0gMTdcIiwgZGVzY3JpcHRpb246IFwiRmFpcmx5IGRpZmZpY3VsdCB0byByZWFkLlwiIH0sXG4gIDEyOiB7IGFnZTogXCIxNyAtIDE4XCIsIGRlc2NyaXB0aW9uOiBcIkZhaXJseSBkaWZmaWN1bHQgdG8gcmVhZC5cIiB9LFxuICAxMzogeyBhZ2U6IFwiT3ZlciAxOFwiLCBkZXNjcmlwdGlvbjogXCJEaWZmaWN1bHQgdG8gcmVhZC5cIiB9LFxuICAxNDogeyBhZ2U6IFwiT3ZlciAxOFwiLCBkZXNjcmlwdGlvbjogXCJEaWZmaWN1bHQgdG8gcmVhZC5cIiB9LFxuICAxNToge1xuICAgIGFnZTogXCJPdmVyIDE4XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlZlcnkgZGlmZmljdWx0IHRvIHJlYWQuIEJlc3QgdW5kZXJzdG9vZCBieSB1bml2ZXJzaXR5IGdyYWR1YXRlcy5cIlxuICB9LFxuICAxNjoge1xuICAgIGFnZTogXCJPdmVyIDE4XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlZlcnkgZGlmZmljdWx0IHRvIHJlYWQuIEJlc3QgdW5kZXJzdG9vZCBieSB1bml2ZXJzaXR5IGdyYWR1YXRlcy5cIlxuICB9LFxuICAxNzoge1xuICAgIGFnZTogXCJPdmVyIDE4XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIlZlcnkgZGlmZmljdWx0IHRvIHJlYWQuIEJlc3QgdW5kZXJzdG9vZCBieSB1bml2ZXJzaXR5IGdyYWR1YXRlcy5cIlxuICB9LFxuICAxODoge1xuICAgIGFnZTogXCJPdmVyIDE4XCIsXG4gICAgZGVzY3JpcHRpb246XG4gICAgICBcIkV4dHJlbWVseSBkaWZmaWN1bHQgdG8gcmVhZC4gQmVzdCB1bmRlcnN0b29kIGJ5IHVuaXZlcnNpdHkgZ3JhZHVhdGVzLlwiXG4gIH0sXG4gIGlzTnVtYmVyOiB7XG4gICAgYWdlOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDFmNjJjKSxcbiAgICBkZXNjcmlwdGlvbjogXCJJIGNhbid0IGRvIG51bWJlcnMgOihcIlxuICB9XG59O1xuIiwiaW1wb3J0IHBsdXJhbGl6ZSBmcm9tICdwbHVyYWxpemUnXG4vLyBAdHMtaWdub3JlIHJlbW92ZSB3aGVuIHR5cGVkLlxuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdub3JtYWxpemUtc3RyaW5ncydcbmltcG9ydCB7cHJvYmxlbWF0aWN9IGZyb20gJy4vcHJvYmxlbWF0aWMuanMnXG5cbnZhciBvd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxuXG4vLyBUd28gZXhwcmVzc2lvbnMgb2Ygb2NjdXJyZW5jZXMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmUgY291bnRlZCBhcyB0d29cbi8vIHN5bGxhYmxlcywgYnV0IHNob3VsZCBiZSBjb3VudGVkIGFzIG9uZS5cbnZhciBFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19PTkUgPSBuZXcgUmVnRXhwKFxuICBbXG4gICAgJ2F3ZSgkfGR8c28pJyxcbiAgICAnY2lhKD86bHwkKScsXG4gICAgJ3RpYScsXG4gICAgJ2NpdXMnLFxuICAgICdjaW91cycsXG4gICAgJ1teYWVpb3VdZ2l1JyxcbiAgICAnW2FlaW91eV1bXmFlaW91eV1pb24nLFxuICAgICdpb3UnLFxuICAgICdzaWEkJyxcbiAgICAnZW91cyQnLFxuICAgICdbb2FdZ3VlJCcsXG4gICAgJy5bXmFlaXVveWNnbHRkYl17Mix9ZWQkJyxcbiAgICAnLmVseSQnLFxuICAgICdeanVhJyxcbiAgICAndWFpJyxcbiAgICAnZWF1JyxcbiAgICAnXmJ1c2kkJyxcbiAgICAnKD86W2FlaW91eV0oPzonICtcbiAgICAgIFtcbiAgICAgICAgJ1tiY2Zna2xtbnByc3Z3eHl6XScsXG4gICAgICAgICdjaCcsXG4gICAgICAgICdkZycsXG4gICAgICAgICdnW2huXScsXG4gICAgICAgICdsY2gnLFxuICAgICAgICAnbFtsdl0nLFxuICAgICAgICAnbW0nLFxuICAgICAgICAnbmNoJyxcbiAgICAgICAgJ25bY2duXScsXG4gICAgICAgICdyW2JjbnN2XScsXG4gICAgICAgICdzcXUnLFxuICAgICAgICAnc1tjaGtsc10nLFxuICAgICAgICAndGgnXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKWVkJCknLFxuICAgICcoPzpbYWVpb3V5XSg/OicgK1xuICAgICAgW1xuICAgICAgICAnW2JkZmtsbW5wcnN0dnldJyxcbiAgICAgICAgJ2NoJyxcbiAgICAgICAgJ2dbaG5dJyxcbiAgICAgICAgJ2xjaCcsXG4gICAgICAgICdsW2x2XScsXG4gICAgICAgICdtbScsXG4gICAgICAgICduY2gnLFxuICAgICAgICAnbm4nLFxuICAgICAgICAncltuc3ZdJyxcbiAgICAgICAgJ3NxdScsXG4gICAgICAgICdzW2NrbHN0XScsXG4gICAgICAgICd0aCdcbiAgICAgIF0uam9pbignfCcpICtcbiAgICAgICcpZXMkKSdcbiAgXS5qb2luKCd8JyksXG4gICdnJ1xuKVxuXG52YXIgRVhQUkVTU0lPTl9NT05PU1lMTEFCSUNfVFdPID0gbmV3IFJlZ0V4cChcbiAgJ1thZWlvdXldKD86JyArXG4gICAgW1xuICAgICAgJ1tiY2RmZ2tsbW5wcnN0dnl6XScsXG4gICAgICAnY2gnLFxuICAgICAgJ2RnJyxcbiAgICAgICdnW2huXScsXG4gICAgICAnbFtsdl0nLFxuICAgICAgJ21tJyxcbiAgICAgICduW2NnbnNdJyxcbiAgICAgICdyW2Nuc3ZdJyxcbiAgICAgICdzcXUnLFxuICAgICAgJ3NbY2tsc3RdJyxcbiAgICAgICd0aCdcbiAgICBdLmpvaW4oJ3wnKSArXG4gICAgJyllJCcsXG4gICdnJ1xuKVxuXG4vLyBGb3VyIGV4cHJlc3Npb24gb2Ygb2NjdXJyZW5jZXMgd2hpY2ggbm9ybWFsbHkgd291bGQgYmUgY291bnRlZCBhcyBvbmVcbi8vIHN5bGxhYmxlLCBidXQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgdHdvLlxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX09ORSA9IG5ldyBSZWdFeHAoXG4gICcoPzonICtcbiAgICBbXG4gICAgICAnKFteYWVpb3V5XSlcXFxcMWwnLFxuICAgICAgJ1teYWVpb3V5XWllKD86cnxzP3QpJyxcbiAgICAgICdbYWVpb3V5bV1ibCcsXG4gICAgICAnZW8nLFxuICAgICAgJ2lzbScsXG4gICAgICAnYXNtJyxcbiAgICAgICd0aG0nLFxuICAgICAgJ2RudCcsXG4gICAgICAnc250JyxcbiAgICAgICd1aXR5JyxcbiAgICAgICdkZWEnLFxuICAgICAgJ2dlYW4nLFxuICAgICAgJ29hJyxcbiAgICAgICd1YScsXG4gICAgICAncmVhY3Q/JyxcbiAgICAgICdvcmJlZCcsIC8vIENhbmNlbCBgJy5bXmFlaXVveWNnbHRkYl17Mix9ZWQkJyxgXG4gICAgICAnc2hyZWQnLCAvLyBDYW5jZWwgYCcuW15hZWl1b3ljZ2x0ZGJdezIsfWVkJCcsYFxuICAgICAgJ2VpbmdzPycsXG4gICAgICAnW2FlaW91eV1zaD9lW3JzXSdcbiAgICBdLmpvaW4oJ3wnKSArXG4gICAgJykkJyxcbiAgJ2cnXG4pXG5cbnZhciBFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19UV08gPSBuZXcgUmVnRXhwKFxuICBbXG4gICAgJ2NyZWF0KD8hdSknLFxuICAgICdbXmdxXXVhW15hdWllb10nLFxuICAgICdbYWVpb3VdezN9JyxcbiAgICAnXig/OmlhfG1jfGNvYVtkZ2x4XS4pJyxcbiAgICAnXnJlKGFwcHxlc3xpbXx1cyknLFxuICAgICcodGh8ZCllaXN0J1xuICBdLmpvaW4oJ3wnKSxcbiAgJ2cnXG4pXG5cbnZhciBFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19USFJFRSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnW15hZWlvdV15W2FlXScsXG4gICAgJ1tebF1saWVuJyxcbiAgICAncmlldCcsXG4gICAgJ2RpZW4nLFxuICAgICdpdScsXG4gICAgJ2lvJyxcbiAgICAnaWknLFxuICAgICd1ZW4nLFxuICAgICdbYWVpbG90dV1yZWFsJyxcbiAgICAncmVhbFthZWlsb3R1XScsXG4gICAgJ2llbGwnLFxuICAgICdlb1teYWVpb3VdJyxcbiAgICAnW2FlaW91XXlbYWVpb3VdJ1xuICBdLmpvaW4oJ3wnKSxcbiAgJ2cnXG4pXG5cbnZhciBFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19GT1VSID0gL1tec11pYS9cblxuLy8gRXhwcmVzc2lvbiB0byBtYXRjaCBzaW5nbGUgc3lsbGFibGUgcHJlLSBhbmQgc3VmZml4ZXMuXG52YXIgRVhQUkVTU0lPTl9TSU5HTEUgPSBuZXcgUmVnRXhwKFxuICBbXG4gICAgJ14oPzonICtcbiAgICAgIFtcbiAgICAgICAgJ3VuJyxcbiAgICAgICAgJ2ZvcmUnLFxuICAgICAgICAnd2FyZScsXG4gICAgICAgICdub25lPycsXG4gICAgICAgICdvdXQnLFxuICAgICAgICAncG9zdCcsXG4gICAgICAgICdzdWInLFxuICAgICAgICAncHJlJyxcbiAgICAgICAgJ3BybycsXG4gICAgICAgICdkaXMnLFxuICAgICAgICAnc2lkZScsXG4gICAgICAgICdzb21lJ1xuICAgICAgXS5qb2luKCd8JykgK1xuICAgICAgJyknLFxuICAgICcoPzonICtcbiAgICAgIFtcbiAgICAgICAgJ2x5JyxcbiAgICAgICAgJ2xlc3MnLFxuICAgICAgICAnc29tZScsXG4gICAgICAgICdmdWwnLFxuICAgICAgICAnZXJzPycsXG4gICAgICAgICduZXNzJyxcbiAgICAgICAgJ2NpYW5zPycsXG4gICAgICAgICdtZW50cz8nLFxuICAgICAgICAnZXR0ZXM/JyxcbiAgICAgICAgJ3ZpbGxlcz8nLFxuICAgICAgICAnc2hpcHM/JyxcbiAgICAgICAgJ3NpZGVzPycsXG4gICAgICAgICdwb3J0cz8nLFxuICAgICAgICAnc2hpcmVzPycsXG4gICAgICAgICdbZ25zdF1pb24oPzplZHxzKT8nXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKSQnXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxuLy8gRXhwcmVzc2lvbiB0byBtYXRjaCBkb3VibGUgc3lsbGFibGUgcHJlLSBhbmQgc3VmZml4ZXMuXG52YXIgRVhQUkVTU0lPTl9ET1VCTEUgPSBuZXcgUmVnRXhwKFxuICBbXG4gICAgJ14nICtcbiAgICAgICcoPzonICtcbiAgICAgIFtcbiAgICAgICAgJ2Fib3ZlJyxcbiAgICAgICAgJ2FudGknLFxuICAgICAgICAnYW50ZScsXG4gICAgICAgICdjb3VudGVyJyxcbiAgICAgICAgJ2h5cGVyJyxcbiAgICAgICAgJ2Fmb3JlJyxcbiAgICAgICAgJ2FncmknLFxuICAgICAgICAnaW5mcmEnLFxuICAgICAgICAnaW50cmEnLFxuICAgICAgICAnaW50ZXInLFxuICAgICAgICAnb3ZlcicsXG4gICAgICAgICdzZW1pJyxcbiAgICAgICAgJ3VsdHJhJyxcbiAgICAgICAgJ3VuZGVyJyxcbiAgICAgICAgJ2V4dHJhJyxcbiAgICAgICAgJ2RpYScsXG4gICAgICAgICdtaWNybycsXG4gICAgICAgICdtZWdhJyxcbiAgICAgICAgJ2tpbG8nLFxuICAgICAgICAncGljbycsXG4gICAgICAgICduYW5vJyxcbiAgICAgICAgJ21hY3JvJyxcbiAgICAgICAgJ3NvbWVyJ1xuICAgICAgXS5qb2luKCd8JykgK1xuICAgICAgJyknLFxuICAgICcoPzpmdWxseXxiZXJyeXx3b21hbnx3b21lbnxlZGx5fHVuaW9ufCgoPzpbYmNkZmdoamtsbW5wcXJzdHZ3eHpdKXxbYWVpb3VdKXllP2luZykkJ1xuICBdLmpvaW4oJ3wnKSxcbiAgJ2cnXG4pXG5cbi8vIEV4cHJlc3Npb24gdG8gbWF0Y2ggdHJpcGxlIHN5bGxhYmxlIHN1ZmZpeGVzLlxudmFyIEVYUFJFU1NJT05fVFJJUExFID0gLyhjcmVhdGlvbnM/fG9sb2d5fG9sb2dpc3R8b25vbXl8b25vbWlzdCkkL2dcblxuLy8gV3JhcHBlciB0byBzdXBwb3J0IG11bHRpcGxlIHdvcmQtcGFydHMgKEdILTExKS5cbi8qKlxuICogU3lsbGFibGUgY291bnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzeWxsYWJsZSh2YWx1ZSkge1xuICB2YXIgdmFsdWVzID0gbm9ybWFsaXplKFN0cmluZyh2YWx1ZSkpXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAvLyBSZW1vdmUgYXBvc3Ryb3BoZXMuXG4gICAgLnJlcGxhY2UoL1sn4oCZXS9nLCAnJylcbiAgICAvLyBTcGxpdCBvbiB3b3JkIGJvdW5kYXJpZXMuXG4gICAgLnNwbGl0KC9cXGIvZylcbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIHN1bSA9IDBcblxuICB3aGlsZSAoKytpbmRleCA8IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAvLyBSZW1vdmUgbm9uLWFscGhhYmV0aWMgY2hhcmFjdGVycyBmcm9tIGEgZ2l2ZW4gdmFsdWUuXG4gICAgc3VtICs9IG9uZSh2YWx1ZXNbaW5kZXhdLnJlcGxhY2UoL1teYS16XS9nLCAnJykpXG4gIH1cblxuICByZXR1cm4gc3VtXG59XG5cbi8qKlxuICogR2V0IHN5bGxhYmxlcyBpbiBhIGdpdmVuIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gb25lKHZhbHVlKSB7XG4gIHZhciBjb3VudCA9IDBcbiAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gIHZhciBpbmRleFxuICAvKiogQHR5cGUge3N0cmluZ30gKi9cbiAgdmFyIHNpbmd1bGFyXG4gIC8qKiBAdHlwZSB7QXJyYXkuPHN0cmluZz59ICovXG4gIHZhciBwYXJ0c1xuICAvKiogQHR5cGUge1JldHVyblR5cGUuPHJldHVybkZhY3Rvcnk+fSAqL1xuICB2YXIgYWRkT25lXG4gIC8qKiBAdHlwZSB7UmV0dXJuVHlwZS48cmV0dXJuRmFjdG9yeT59ICovXG4gIHZhciBzdWJ0cmFjdE9uZVxuXG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gY291bnRcbiAgfVxuXG4gIC8vIFJldHVybiBlYXJseSB3aGVuIHBvc3NpYmxlLlxuICBpZiAodmFsdWUubGVuZ3RoIDwgMykge1xuICAgIHJldHVybiAxXG4gIH1cblxuICAvLyBJZiBgdmFsdWVgIGlzIGEgaGFyZCB0byBjb3VudCwgaXQgbWlnaHQgYmUgaW4gYHByb2JsZW1hdGljYC5cbiAgaWYgKG93bi5jYWxsKHByb2JsZW1hdGljLCB2YWx1ZSkpIHtcbiAgICByZXR1cm4gcHJvYmxlbWF0aWNbdmFsdWVdXG4gIH1cblxuICAvLyBBZGRpdGlvbmFsbHksIHRoZSBzaW5ndWxhciB3b3JkIG1pZ2h0IGJlIGluIGBwcm9ibGVtYXRpY2AuXG4gIHNpbmd1bGFyID0gcGx1cmFsaXplKHZhbHVlLCAxKVxuXG4gIGlmIChvd24uY2FsbChwcm9ibGVtYXRpYywgc2luZ3VsYXIpKSB7XG4gICAgcmV0dXJuIHByb2JsZW1hdGljW3Npbmd1bGFyXVxuICB9XG5cbiAgYWRkT25lID0gcmV0dXJuRmFjdG9yeSgxKVxuICBzdWJ0cmFjdE9uZSA9IHJldHVybkZhY3RvcnkoLTEpXG5cbiAgLy8gQ291bnQgc29tZSBwcmVmaXhlcyBhbmQgc3VmZml4ZXMsIGFuZCByZW1vdmUgdGhlaXIgbWF0Y2hlZCByYW5nZXMuXG4gIHZhbHVlID0gdmFsdWVcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX1RSSVBMRSwgY291bnRGYWN0b3J5KDMpKVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fRE9VQkxFLCBjb3VudEZhY3RvcnkoMikpXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9TSU5HTEUsIGNvdW50RmFjdG9yeSgxKSlcblxuICAvLyBDb3VudCBtdWx0aXBsZSBjb25zb25hbnRzLlxuICBwYXJ0cyA9IHZhbHVlLnNwbGl0KC9bXmFlaW91eV0rLylcbiAgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgcGFydHMubGVuZ3RoKSB7XG4gICAgaWYgKHBhcnRzW2luZGV4XSAhPT0gJycpIHtcbiAgICAgIGNvdW50KytcbiAgICB9XG4gIH1cblxuICAvLyBTdWJ0cmFjdCBvbmUgZm9yIG9jY3VycmVuY2VzIHdoaWNoIHNob3VsZCBiZSBjb3VudGVkIGFzIG9uZSAoYnV0IGFyZVxuICAvLyBjb3VudGVkIGFzIHR3bykuXG4gIHZhbHVlXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9NT05PU1lMTEFCSUNfT05FLCBzdWJ0cmFjdE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19UV08sIHN1YnRyYWN0T25lKVxuXG4gIC8vIEFkZCBvbmUgZm9yIG9jY3VycmVuY2VzIHdoaWNoIHNob3VsZCBiZSBjb3VudGVkIGFzIHR3byAoYnV0IGFyZSBjb3VudGVkIGFzXG4gIC8vIG9uZSkuXG4gIHZhbHVlXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9ET1VCTEVfU1lMTEFCSUNfT05FLCBhZGRPbmUpXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9ET1VCTEVfU1lMTEFCSUNfVFdPLCBhZGRPbmUpXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9ET1VCTEVfU1lMTEFCSUNfVEhSRUUsIGFkZE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19GT1VSLCBhZGRPbmUpXG5cbiAgLy8gTWFrZSBzdXJlIGF0IGxlYXN0IG9uIGlzIHJldHVybmVkLlxuICByZXR1cm4gY291bnQgfHwgMVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgc2NvcGVkIGNvdW50ZXJzLCB0byBiZSB1c2VkIGluIGBTdHJpbmcjcmVwbGFjZSgpYCBjYWxscy5cbiAgICogVGhlIHNjb3BlZCBjb3VudGVyIHJlbW92ZXMgdGhlIG1hdGNoZWQgdmFsdWUgZnJvbSB0aGUgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRpdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gY291bnRGYWN0b3J5KGFkZGl0aW9uKSB7XG4gICAgcmV0dXJuIGNvdW50ZXJcbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvdW50ZXIoKSB7XG4gICAgICBjb3VudCArPSBhZGRpdGlvblxuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgc2NvcGVkIGNvdW50ZXIgZG9lcyBub3QgcmVtb3ZlIHRoZSBtYXRjaGVkIHZhbHVlIGZyb20gdGhlIGlucHV0LlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gYWRkaXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIHJldHVybkZhY3RvcnkoYWRkaXRpb24pIHtcbiAgICByZXR1cm4gcmV0dXJuZXJcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gJDBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJldHVybmVyKCQwKSB7XG4gICAgICBjb3VudCArPSBhZGRpdGlvblxuICAgICAgcmV0dXJuICQwXG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgdmFyIHByb2JsZW1hdGljID0ge1xuICBhYmFsb25lOiA0LFxuICBhYmFyZTogMyxcbiAgYWJicnV6emVzZTogNCxcbiAgYWJlZDogMixcbiAgYWJvcmlnaW5lOiA1LFxuICBhYnJ1enplc2U6IDQsXG4gIGFjcmVhZ2U6IDMsXG4gIGFkYW1lOiAzLFxuICBhZGlldTogMixcbiAgYWRvYmU6IDMsXG4gIGFuZW1vbmU6IDQsXG4gIGFueW9uZTogMyxcbiAgYXBhY2hlOiAzLFxuICBhcGhyb2RpdGU6IDQsXG4gIGFwb3N0cm9waGU6IDQsXG4gIGFyaWFkbmU6IDQsXG4gIGNhZmU6IDIsXG4gIGNhbGxpb3BlOiA0LFxuICBjYXRhc3Ryb3BoZTogNCxcbiAgY2hpbGU6IDIsXG4gIGNobG9lOiAyLFxuICBjaXJjZTogMixcbiAgY295b3RlOiAzLFxuICBkYXBobmU6IDIsXG4gIGVwaXRvbWU6IDQsXG4gIGV1cnlkaWNlOiA0LFxuICBldXRlcnBlOiAzLFxuICBldmVyeTogMixcbiAgZXZlcnl3aGVyZTogMyxcbiAgZm9yZXZlcjogMyxcbiAgZ2V0aHNlbWFuZTogNCxcbiAgZ3VhY2Ftb2xlOiA0LFxuICBoZXJtaW9uZTogNCxcbiAgaHlwZXJib2xlOiA0LFxuICBqZXNzZTogMixcbiAganVrZWJveDogMixcbiAga2FyYXRlOiAzLFxuICBtYWNoZXRlOiAzLFxuICBtYXliZTogMixcbiAgbmFpdmU6IDIsXG4gIG5ld2x5d2VkOiAzLFxuICBwZW5lbG9wZTogNCxcbiAgcGVvcGxlOiAyLFxuICBwZXJzZXBob25lOiA0LFxuICBwaG9lYmU6IDIsXG4gIHB1bHNlOiAxLFxuICBxdWV1ZTogMSxcbiAgcmVjaXBlOiAzLFxuICByaXZlcmJlZDogMyxcbiAgc2VzYW1lOiAzLFxuICBzaG9yZWxpbmU6IDIsXG4gIHNpbWlsZTogMyxcbiAgc251ZmZsZXVwYWd1czogNSxcbiAgc29tZXRpbWVzOiAyLFxuICBzeW5jb3BlOiAzLFxuICB0YW1hbGU6IDMsXG4gIHdhdGVyYmVkOiAzLFxuICB3ZWRuZXNkYXk6IDIsXG4gIHlvc2VtaXRlOiA0LFxuICB6b2U6IDJcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgc3lsbGFibGUgfSBmcm9tIFwic3lsbGFibGVcIjtcbmltcG9ydCB7IHNjb3JlVG9BZ2VPYmogfSBmcm9tIFwiLi9ncmFkaW5nXCI7XG5cbnZhciBzZW50ZW5jZVdlaWdodCA9IDEuMDE1O1xudmFyIHdvcmRXZWlnaHQgPSA4NC42O1xudmFyIGJhc2UgPSAyMDYuODM1O1xuXG5jb25zdCBmbGVzY2ggPSAoY291bnRzKSA9PiB7XG4gIGlmICghY291bnRzIHx8ICFjb3VudHMuc2VudGVuY2UgfHwgIWNvdW50cy53b3JkIHx8ICFjb3VudHMuc3lsbGFibGUpIHtcbiAgICByZXR1cm4gTnVtYmVyLk5hTiB8fCBzY29yZVRvQWdlT2JqW1wiaXNOdW1iZXJcIl0uYWdlO1xuICB9XG5cbiAgY29uc3QgdG90YWwgPSBOdW1iZXIoXG4gICAgKFxuICAgICAgYmFzZSAtXG4gICAgICBzZW50ZW5jZVdlaWdodCAqIChjb3VudHMud29yZCAvIGNvdW50cy5zZW50ZW5jZSkgLVxuICAgICAgd29yZFdlaWdodCAqIChjb3VudHMuc3lsbGFibGUgLyBjb3VudHMud29yZClcbiAgICApLnRvUHJlY2lzaW9uKDIpXG4gICk7XG5cbiAgaWYgKHRvdGFsIDwgMCkgcmV0dXJuIDA7XG4gIGlmICh0b3RhbCA+IDEwMCkgcmV0dXJuIDEwMDtcblxuICByZXR1cm4gdG90YWw7XG59O1xuXG5jb25zdCBncmFkZSA9IChjb3VudHMpID0+IHtcbiAgaWYgKCFjb3VudHMgfHwgIWNvdW50cy5zZW50ZW5jZSB8fCAhY291bnRzLndvcmQgfHwgIWNvdW50cy5zeWxsYWJsZSkge1xuICAgIHJldHVybiBOdW1iZXIuTmFOO1xuICB9XG5cbiAgY29uc3QgdG90YWwgPSBNYXRoLnJvdW5kKFxuICAgIDAuMzkgKiAoY291bnRzLndvcmQgLyBjb3VudHMuc2VudGVuY2UpICtcbiAgICAgIDExLjggKiAoY291bnRzLnN5bGxhYmxlIC8gY291bnRzLndvcmQpIC1cbiAgICAgIDE1LjU5XG4gICk7XG5cbiAgaWYgKHRvdGFsIDwgNSkgcmV0dXJuIDA7XG4gIGlmICh0b3RhbCA+IDE4KSByZXR1cm4gMTg7XG5cbiAgcmV0dXJuIHRvdGFsO1xufTtcblxuY29uc3Qgd29yZHMgPSAoc3RyaW5nKSA9PiB7XG4gIGNvbnN0IGdldFdvcmRzID0gc3RyaW5nXG4gICAgLnRvTG93ZXJDYXNlKClcbiAgICAvLyAgIC5yZXBsYWNlQWxsKC8oXlxcdysnXFx3Kyl8LHxcXCF8XFw/fFxcLi9nLCAnJylcbiAgICAucmVwbGFjZUFsbCgvJ1xcQnxbXmEteicgXS9nLCBcIlwiKVxuICAgIC5zcGxpdChcIiBcIilcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiBnZXRXb3Jkcy5sZW5ndGg7XG59O1xuXG5jb25zdCBzZW50ZW5jZXMgPSAoc3RyaW5nKSA9PiB7XG4gIC8vIFJlYWRhYmxlIHNlZW1zIHRvIGNvdW50IDogYW5kICA7IGluIGl0cyBsb2dpYyBmb3Igc2VudGVuY2VzLFxuICAvLyBidXQgZG9lc24ndCBkaXNwbGF5IHRoYXQgc2NvcmUgaW4gdGhlIFVJLiBJdCBkaXNwbGF5cyBhIHNlbnRlbmNlIHNjb3JlXG4gIC8vIHRoYXQgZG9lc24ndCBpbmNsdWRlIHRoZW0uIFRoaXMgaXMgYSBXSVAuXG4gIGNvbnN0IHNlbnRlbmNlUmVnZXggPSAvXFwhfFxcP3xcXC58XFw7fFxcOnxcXG4vZztcbiAgY29uc3QgZ2V0UHVuY3R1YXRpb24gPSBzdHJpbmcubWF0Y2goc2VudGVuY2VSZWdleCk7XG4gIGNvbnN0IGdldFNlbnRlbmNlcyA9IHN0cmluZ1xuICAgIC5zcGxpdChzZW50ZW5jZVJlZ2V4KVxuICAgIC5tYXAoKHgpID0+IHgudHJpbSgpKVxuICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcmV0dXJuIGdldFB1bmN0dWF0aW9uID8gZ2V0U2VudGVuY2VzLmxlbmd0aCA6IDE7XG59O1xuXG5jb25zdCBzY29yZVRvQWdlID0gKHNjb3JlKSA9PiB7XG4gIHJldHVybiBzY29yZSA8IDVcbiAgICA/IHNjb3JlVG9BZ2VPYmpbMF1cbiAgICA6IHNjb3JlID4gMThcbiAgICA/IHNjb3JlVG9BZ2VPYmpbMThdXG4gICAgOiBpc05hTihzY29yZSlcbiAgICA/IHNjb3JlVG9BZ2VPYmpbXCJpc051bWJlclwiXVxuICAgIDogc2NvcmVUb0FnZU9ialtzY29yZV07XG59O1xuXG5maWdtYS5zaG93VUkoX19odG1sX18sIHtcbiAgd2lkdGg6IDMwMCxcbiAgaGVpZ2h0OiAyNTAsXG4gIHRpdGxlOiBcIkZsZXNjaC1LaW5jYWlkIFNjb3JlXCJcbn0pO1xuXG4vLyBmaWdtYS5vbigncnVuJywgYXN5bmMgKCkgPT4ge1xuLy8gXHQvLyBjb25zdCBjdXJyZW50VGhlbWUgPSBhd2FpdCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCd0aGVtZScpO1xuLy8gXHQvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICd0aGVtZScsIHRoZW1lOiBjdXJyZW50VGhlbWUgfSk7XG4vLyB9KTtcblxuLy8gZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbi8vIFx0Ly8gc2V0dGluZyB0aGVtZSB0eXBlIGluIGZpZ21hIGNsaWVudFN0b3JhZ2Vcbi8vICAgaWYgKG1zZy50eXBlID09PSAndGhlbWUtY2hhbmdlJykge1xuLy8gICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3RoZW1lJywgbXNnLnRoZW1lKTtcbi8vICAgfVxuLy8gfTtcblxuLy8gSGFuZGxlcyBzZW5kaW5nIGZsZXNjaCByZXN1bHRzIHRvIHRoZSBVSVxuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKGUpID0+IHtcbiAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuXG4gIGlmIChzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLnR5cGUgIT09IFwiVEVYVFwiKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gXCJObyBUZXh0XCI7XG4gICAgY29uc3QgcmVzdWx0cyA9IHtcbiAgICAgIHR5cGU6IFwic2VsZWN0aW9uXCIsXG4gICAgICBzY29yZTogcmVzdWx0LFxuICAgICAgYWdlOiByZXN1bHQsXG4gICAgICBkZXNjcmlwdGlvbjogXCJcIlxuICAgIH07XG5cbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShyZXN1bHRzKTtcbiAgfVxuXG4gIGlmIChzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLnR5cGUgPT09IFwiVEVYVFwiICYmIHNlbGVjdGlvbi5jaGFyYWN0ZXJzLmxlbmd0aCkge1xuICAgIGNvbnN0IG51bWJlck9mU3lsbGFibGVzID0gc3lsbGFibGUoc2VsZWN0aW9uLmNoYXJhY3RlcnMpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiIyBTeWxsYWJsZXM6IFwiLCBudW1iZXJPZlN5bGxhYmxlcyk7XG4gICAgY29uc3QgbnVtYmVyT2ZXb3JkcyA9IHdvcmRzKHNlbGVjdGlvbi5jaGFyYWN0ZXJzKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIiMgV29yZHM6IFwiLCBudW1iZXJPZldvcmRzKTtcbiAgICBjb25zdCBudW1iZXJPZlNlbnRlbmNlcyA9IHNlbnRlbmNlcyhzZWxlY3Rpb24uY2hhcmFjdGVycyk7XG4gICAgLy8gY29uc29sZS5sb2coXCIjIFNlbnRlbmNlc1wiLCBudW1iZXJPZlNlbnRlbmNlcyk7XG5cbiAgICBjb25zdCByZWFkaW5nU2NvcmUgPSBmbGVzY2goe1xuICAgICAgd29yZDogbnVtYmVyT2ZXb3JkcyxcbiAgICAgIHN5bGxhYmxlOiBudW1iZXJPZlN5bGxhYmxlcyxcbiAgICAgIHNlbnRlbmNlOiBudW1iZXJPZlNlbnRlbmNlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVhZGluZ0dyYWRlID0gZ3JhZGUoe1xuICAgICAgd29yZDogbnVtYmVyT2ZXb3JkcyxcbiAgICAgIHN5bGxhYmxlOiBudW1iZXJPZlN5bGxhYmxlcyxcbiAgICAgIHNlbnRlbmNlOiBudW1iZXJPZlNlbnRlbmNlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVhZGluZ0FnZSA9IHNjb3JlVG9BZ2UocmVhZGluZ0dyYWRlKTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSB7XG4gICAgICB0eXBlOiBcInNlbGVjdGlvblwiLFxuICAgICAgc2NvcmU6IHJlYWRpbmdTY29yZSxcbiAgICAgIGFnZTogcmVhZGluZ0FnZS5hZ2UsXG4gICAgICBkZXNjcmlwdGlvbjogcmVhZGluZ0FnZS5kZXNjcmlwdGlvblxuICAgIH07XG5cbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShyZXN1bHRzKTtcbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=