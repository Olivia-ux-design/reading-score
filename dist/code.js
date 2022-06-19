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
/* harmony import */ var syllable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! syllable */ "./node_modules/syllable/index.js");


var sentenceWeight = 1.015;
var wordWeight = 84.6;
var base = 206.835;

const flesch = counts => {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN || scoreToAgeObj['isNumber'].age;
  }

  const total = Number(
		(base -
			sentenceWeight * (counts.word / counts.sentence) -
			wordWeight * (counts.syllable / counts.word)).toPrecision(2)
	);

  if (total < 0) return 0;
  if (total > 100) return 100;

  return total;
};

const grade = counts => {
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

const words = string => {
  return string.split(' ').length;
};

const sentences = string => {
  return string.split('. ').length;
};

const scoreToAgeObj = {
  0: {
    grade: 'Under 5th grade/Year 6',
    age: 'Under 10',
    description: 'Very easy.'
  },
  5: {
    age: '10 - 11',
    description:
			'Very easy to read. Easily understood by an average 11 year old school student.'
  },
  6: {
    age: '11 - 12',
    description: 'Easy to read. Conversational English for Consumers.'
  },
  7: {
    age: '12 - 13',
    description: 'Fairly easy to read.'
  },
  8: {
    age: '13 - 14',
    description:
			'Plain English. Easily understood by 13 to 15 year old students.'
  },
  9: {
    age: '14 - 15',
    description:
			'Plain English. Easily understood by 13 to 15 year old students.'
  },
  10: { age: '15 - 16', description: 'Fairly difficult to read.' },
  11: { age: '16 - 17', description: 'Fairly difficult to read.' },
  12: { age: '17 - 18', description: 'Fairly difficult to read.' },
  13: { age: 'Over 18', description: 'Difficult to read.' },
  14: { age: 'Over 18', description: 'Difficult to read.' },
  15: {
    age: 'Over 18',
    description:
			'Very difficult to read. Best understoof by university graduates.'
  },
  16: {
    age: 'Over 18',
    description:
			'Very difficult to read. Best understoof by university graduates.'
  },
  17: {
    age: 'Over 18',
    description:
			'Very difficult to read. Best understoof by university graduates.'
  },
  18: {
    age: 'Over 18',
    description:
			'Extremely difficult to read. Best understood by university graduates.'
  },
  isNumber: {
    age: String.fromCodePoint(0x1f62c),
    description: "I can't do numbers :("
  }
};

const scoreToAge = score => {
  return score < 5
		? scoreToAgeObj[0]
		: score > 18
			? scoreToAgeObj[18]
			: isNaN(score) ? scoreToAgeObj['isNumber'] : scoreToAgeObj[score];
};

figma.showUI(__html__, {
  width: 300,
  height: 250,
  title: 'Flesch-Kincaid Score'
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
figma.on('selectionchange', e => {
  const selection = figma.currentPage.selection[0];

  if (selection && selection.type !== 'TEXT') {
    const result = 'No Text';
    const results = { type: 'selection', score: result, grade: result };

    figma.ui.postMessage(results);
  }

  if (selection && selection.type === 'TEXT' && selection.characters.length) {
    const numberOfSyllables = (0,syllable__WEBPACK_IMPORTED_MODULE_0__.syllable)(selection.characters);
		// console.log(numberOfSyllables);
    const numberOfWords = words(selection.characters);
		// console.log(numberOfWords)
    const numberOfSentences = sentences(selection.characters);
		// console.log(numberOfSentences)
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
      type: 'selection',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0ZmdDO0FBQ2pDO0FBQ3lDO0FBQ0c7O0FBRTVDLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLEdBQUc7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxHQUFHO0FBQy9DLDRDQUE0QyxHQUFHO0FBQy9DO0FBQ0E7QUFDQTtB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QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7O0FBRXRCO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsa0RBQVE7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS8uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUtc3RyaW5ncy9pbmRleC5qcyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vbm9kZV9tb2R1bGVzL3BsdXJhbGl6ZS9wbHVyYWxpemUuanMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS8uL25vZGVfbW9kdWxlcy9zeWxsYWJsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vbm9kZV9tb2R1bGVzL3N5bGxhYmxlL3Byb2JsZW1hdGljLmpzIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcmVhZGluZy1zY29yZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3JlYWRpbmctc2NvcmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9yZWFkaW5nLXNjb3JlLy4vc3JjL2NvZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoZ2xvYmFsLCBnbG9iYWwuZG9jdW1lbnQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgfSBlbHNlIHtcbiAgICAgIGdsb2JhbC5ub3JtYWxpemUgPSBmYWN0b3J5KGdsb2JhbCwgZ2xvYmFsLmRvY3VtZW50KTtcbiAgfVxufSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICB2YXIgY2hhcm1hcCA9IHJlcXVpcmUoJy4vY2hhcm1hcC5qc29uJyk7XG4gIHZhciByZWdleCA9IG51bGw7XG4gIHZhciBjdXJyZW50X2NoYXJtYXA7XG4gIHZhciBvbGRfY2hhcm1hcDtcblxuICBmdW5jdGlvbiBub3JtYWxpemUoc3RyLCBjdXN0b21fY2hhcm1hcCkge1xuICAgIG9sZF9jaGFybWFwID0gY3VycmVudF9jaGFybWFwO1xuICAgIGN1cnJlbnRfY2hhcm1hcCA9IGN1c3RvbV9jaGFybWFwIHx8IGNoYXJtYXA7XG5cbiAgICByZWdleCA9IChyZWdleCAmJiBvbGRfY2hhcm1hcCA9PT0gY3VycmVudF9jaGFybWFwKSA/IHJlZ2V4IDogYnVpbGRSZWdFeHAoY3VycmVudF9jaGFybWFwKTtcblxuICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleCwgZnVuY3Rpb24oY2hhclRvUmVwbGFjZSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnRfY2hhcm1hcFtjaGFyVG9SZXBsYWNlLmNoYXJDb2RlQXQoMCldIHx8IGNoYXJUb1JlcGxhY2U7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFJlZ0V4cChjaGFybWFwKXtcbiAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ1snICsgT2JqZWN0LmtleXMoY2hhcm1hcCkubWFwKGZ1bmN0aW9uKGNvZGUpIHtyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTsgfSkuam9pbignICcpICsgJ10nLCAnZycpO1xuICAgfVxuXG4gIHJldHVybiBub3JtYWxpemU7XG59KSk7XG4iLCIvKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAocm9vdCwgcGx1cmFsaXplKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gcGx1cmFsaXplKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELCByZWdpc3RlcnMgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBsdXJhbGl6ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsLlxuICAgIHJvb3QucGx1cmFsaXplID0gcGx1cmFsaXplKCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgLy8gUnVsZSBzdG9yYWdlIC0gcGx1cmFsaXplIGFuZCBzaW5ndWxhcml6ZSBuZWVkIHRvIGJlIHJ1biBzZXF1ZW50aWFsbHksXG4gIC8vIHdoaWxlIG90aGVyIHJ1bGVzIGNhbiBiZSBvcHRpbWl6ZWQgdXNpbmcgYW4gb2JqZWN0IGZvciBpbnN0YW50IGxvb2t1cHMuXG4gIHZhciBwbHVyYWxSdWxlcyA9IFtdO1xuICB2YXIgc2luZ3VsYXJSdWxlcyA9IFtdO1xuICB2YXIgdW5jb3VudGFibGVzID0ge307XG4gIHZhciBpcnJlZ3VsYXJQbHVyYWxzID0ge307XG4gIHZhciBpcnJlZ3VsYXJTaW5nbGVzID0ge307XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIGEgdXNhYmxlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtICB7KFJlZ0V4cHxzdHJpbmcpfSBydWxlXG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUnVsZSAocnVsZSkge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBpbiBhIHdvcmQgdG9rZW4gdG8gcHJvZHVjZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJlcGxpY2F0ZSB0aGUgY2FzZSBvblxuICAgKiBhbm90aGVyIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB0b2tlblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc3RvcmVDYXNlICh3b3JkLCB0b2tlbikge1xuICAgIC8vIFRva2VucyBhcmUgYW4gZXhhY3QgbWF0Y2guXG4gICAgaWYgKHdvcmQgPT09IHRva2VuKSByZXR1cm4gdG9rZW47XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcImhlbGxvXCIuXG4gICAgaWYgKHdvcmQgPT09IHdvcmQudG9Mb3dlckNhc2UoKSkgcmV0dXJuIHRva2VuLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBVcHBlciBjYXNlZCB3b3Jkcy4gRS5nLiBcIldISVNLWVwiLlxuICAgIGlmICh3b3JkID09PSB3b3JkLnRvVXBwZXJDYXNlKCkpIHJldHVybiB0b2tlbi50b1VwcGVyQ2FzZSgpO1xuXG4gICAgLy8gVGl0bGUgY2FzZWQgd29yZHMuIEUuZy4gXCJUaXRsZVwiLlxuICAgIGlmICh3b3JkWzBdID09PSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHJldHVybiB0b2tlbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRva2VuLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIExvd2VyIGNhc2VkIHdvcmRzLiBFLmcuIFwidGVzdFwiLlxuICAgIHJldHVybiB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVycG9sYXRlIGEgcmVnZXhwIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAgICogQHBhcmFtICB7QXJyYXl9ICBhcmdzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlIChzdHIsIGFyZ3MpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcJChcXGR7MSwyfSkvZywgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGFyZ3NbaW5kZXhdIHx8ICcnO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHVzaW5nIGEgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgcnVsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlICh3b3JkLCBydWxlKSB7XG4gICAgcmV0dXJuIHdvcmQucmVwbGFjZShydWxlWzBdLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gaW50ZXJwb2xhdGUocnVsZVsxXSwgYXJndW1lbnRzKTtcblxuICAgICAgaWYgKG1hdGNoID09PSAnJykge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZFtpbmRleCAtIDFdLCByZXN1bHQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdG9yZUNhc2UobWF0Y2gsIHJlc3VsdCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSB3b3JkIGJ5IHBhc3NpbmcgaW4gdGhlIHdvcmQgYW5kIHNhbml0aXphdGlvbiBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVdvcmQgKHRva2VuLCB3b3JkLCBydWxlcykge1xuICAgIC8vIEVtcHR5IHN0cmluZyBvciBkb2Vzbid0IG5lZWQgZml4aW5nLlxuICAgIGlmICghdG9rZW4ubGVuZ3RoIHx8IHVuY291bnRhYmxlcy5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH1cblxuICAgIHZhciBsZW4gPSBydWxlcy5sZW5ndGg7XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHNhbml0aXphdGlvbiBydWxlcyBhbmQgdXNlIHRoZSBmaXJzdCBvbmUgdG8gbWF0Y2guXG4gICAgd2hpbGUgKGxlbi0tKSB7XG4gICAgICB2YXIgcnVsZSA9IHJ1bGVzW2xlbl07XG5cbiAgICAgIGlmIChydWxlWzBdLnRlc3Qod29yZCkpIHJldHVybiByZXBsYWNlKHdvcmQsIHJ1bGUpO1xuICAgIH1cblxuICAgIHJldHVybiB3b3JkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHdpdGggdGhlIHVwZGF0ZWQgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIHJlcGxhY2VNYXBcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGtlZXBNYXBcbiAgICogQHBhcmFtICB7QXJyYXl9ICAgIHJ1bGVzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcmVwbGFjZVdvcmQgKHJlcGxhY2VNYXAsIGtlZXBNYXAsIHJ1bGVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAvLyBHZXQgdGhlIGNvcnJlY3QgdG9rZW4gYW5kIGNhc2UgcmVzdG9yYXRpb24gZnVuY3Rpb25zLlxuICAgICAgdmFyIHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSBrZWVwIG9iamVjdCBtYXAuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHRva2VuKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUgcmVwbGFjZW1lbnQgbWFwIGZvciBhIGRpcmVjdCB3b3JkIHJlcGxhY2VtZW50LlxuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkLCByZXBsYWNlTWFwW3Rva2VuXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgdGhlIHJ1bGVzIGFnYWluc3QgdGhlIHdvcmQuXG4gICAgICByZXR1cm4gc2FuaXRpemVXb3JkKHRva2VuLCB3b3JkLCBydWxlcyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHdvcmQgaXMgcGFydCBvZiB0aGUgbWFwLlxuICAgKi9cbiAgZnVuY3Rpb24gY2hlY2tXb3JkIChyZXBsYWNlTWFwLCBrZWVwTWFwLCBydWxlcywgYm9vbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAod29yZCkge1xuICAgICAgdmFyIHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHJldHVybiBzYW5pdGl6ZVdvcmQodG9rZW4sIHRva2VuLCBydWxlcykgPT09IHRva2VuO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIG9yIHNpbmd1bGFyaXplIGEgd29yZCBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvdW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICB3b3JkICAgICAgVGhlIHdvcmQgdG8gcGx1cmFsaXplXG4gICAqIEBwYXJhbSAge251bWJlcn0gIGNvdW50ICAgICBIb3cgbWFueSBvZiB0aGUgd29yZCBleGlzdFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdXNpdmUgV2hldGhlciB0byBwcmVmaXggd2l0aCB0aGUgbnVtYmVyIChlLmcuIDMgZHVja3MpXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHBsdXJhbGl6ZSAod29yZCwgY291bnQsIGluY2x1c2l2ZSkge1xuICAgIHZhciBwbHVyYWxpemVkID0gY291bnQgPT09IDFcbiAgICAgID8gcGx1cmFsaXplLnNpbmd1bGFyKHdvcmQpIDogcGx1cmFsaXplLnBsdXJhbCh3b3JkKTtcblxuICAgIHJldHVybiAoaW5jbHVzaXZlID8gY291bnQgKyAnICcgOiAnJykgKyBwbHVyYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5wbHVyYWwgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJTaW5nbGVzLCBpcnJlZ3VsYXJQbHVyYWxzLCBwbHVyYWxSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhIHdvcmQgaXMgcGx1cmFsLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuaXNQbHVyYWwgPSBjaGVja1dvcmQoXG4gICAgaXJyZWd1bGFyU2luZ2xlcywgaXJyZWd1bGFyUGx1cmFscywgcGx1cmFsUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuc2luZ3VsYXIgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJQbHVyYWxzLCBpcnJlZ3VsYXJTaW5nbGVzLCBzaW5ndWxhclJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgd29yZCBpcyBzaW5ndWxhci5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcGx1cmFsaXplLmlzU2luZ3VsYXIgPSBjaGVja1dvcmQoXG4gICAgaXJyZWd1bGFyUGx1cmFscywgaXJyZWd1bGFyU2luZ2xlcywgc2luZ3VsYXJSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBwbHVyYWxpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBwbHVyYWxSdWxlcy5wdXNoKFtzYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpbmd1bGFyaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBzaW5ndWxhclJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIHVuY291bnRhYmxlIHdvcmQgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHdvcmRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRVbmNvdW50YWJsZVJ1bGUgPSBmdW5jdGlvbiAod29yZCkge1xuICAgIGlmICh0eXBlb2Ygd29yZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHVuY291bnRhYmxlc1t3b3JkLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTZXQgc2luZ3VsYXIgYW5kIHBsdXJhbCByZWZlcmVuY2VzIGZvciB0aGUgd29yZC5cbiAgICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSh3b3JkLCAnJDAnKTtcbiAgICBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHdvcmQsICckMCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXJyZWd1bGFyIHdvcmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNpbmdsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGx1cmFsXG4gICAqL1xuICBwbHVyYWxpemUuYWRkSXJyZWd1bGFyUnVsZSA9IGZ1bmN0aW9uIChzaW5nbGUsIHBsdXJhbCkge1xuICAgIHBsdXJhbCA9IHBsdXJhbC50b0xvd2VyQ2FzZSgpO1xuICAgIHNpbmdsZSA9IHNpbmdsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaXJyZWd1bGFyU2luZ2xlc1tzaW5nbGVdID0gcGx1cmFsO1xuICAgIGlycmVndWxhclBsdXJhbHNbcGx1cmFsXSA9IHNpbmdsZTtcbiAgfTtcblxuICAvKipcbiAgICogSXJyZWd1bGFyIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIC8vIFByb25vdW5zLlxuICAgIFsnSScsICd3ZSddLFxuICAgIFsnbWUnLCAndXMnXSxcbiAgICBbJ2hlJywgJ3RoZXknXSxcbiAgICBbJ3NoZScsICd0aGV5J10sXG4gICAgWyd0aGVtJywgJ3RoZW0nXSxcbiAgICBbJ215c2VsZicsICdvdXJzZWx2ZXMnXSxcbiAgICBbJ3lvdXJzZWxmJywgJ3lvdXJzZWx2ZXMnXSxcbiAgICBbJ2l0c2VsZicsICd0aGVtc2VsdmVzJ10sXG4gICAgWydoZXJzZWxmJywgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hpbXNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsndGhlbXNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsnaXMnLCAnYXJlJ10sXG4gICAgWyd3YXMnLCAnd2VyZSddLFxuICAgIFsnaGFzJywgJ2hhdmUnXSxcbiAgICBbJ3RoaXMnLCAndGhlc2UnXSxcbiAgICBbJ3RoYXQnLCAndGhvc2UnXSxcbiAgICAvLyBXb3JkcyBlbmRpbmcgaW4gd2l0aCBhIGNvbnNvbmFudCBhbmQgYG9gLlxuICAgIFsnZWNobycsICdlY2hvZXMnXSxcbiAgICBbJ2RpbmdvJywgJ2RpbmdvZXMnXSxcbiAgICBbJ3ZvbGNhbm8nLCAndm9sY2Fub2VzJ10sXG4gICAgWyd0b3JuYWRvJywgJ3Rvcm5hZG9lcyddLFxuICAgIFsndG9ycGVkbycsICd0b3JwZWRvZXMnXSxcbiAgICAvLyBFbmRzIHdpdGggYHVzYC5cbiAgICBbJ2dlbnVzJywgJ2dlbmVyYSddLFxuICAgIFsndmlzY3VzJywgJ3Zpc2NlcmEnXSxcbiAgICAvLyBFbmRzIHdpdGggYG1hYC5cbiAgICBbJ3N0aWdtYScsICdzdGlnbWF0YSddLFxuICAgIFsnc3RvbWEnLCAnc3RvbWF0YSddLFxuICAgIFsnZG9nbWEnLCAnZG9nbWF0YSddLFxuICAgIFsnbGVtbWEnLCAnbGVtbWF0YSddLFxuICAgIFsnc2NoZW1hJywgJ3NjaGVtYXRhJ10sXG4gICAgWydhbmF0aGVtYScsICdhbmF0aGVtYXRhJ10sXG4gICAgLy8gT3RoZXIgaXJyZWd1bGFyIHJ1bGVzLlxuICAgIFsnb3gnLCAnb3hlbiddLFxuICAgIFsnYXhlJywgJ2F4ZXMnXSxcbiAgICBbJ2RpZScsICdkaWNlJ10sXG4gICAgWyd5ZXMnLCAneWVzZXMnXSxcbiAgICBbJ2Zvb3QnLCAnZmVldCddLFxuICAgIFsnZWF2ZScsICdlYXZlcyddLFxuICAgIFsnZ29vc2UnLCAnZ2Vlc2UnXSxcbiAgICBbJ3Rvb3RoJywgJ3RlZXRoJ10sXG4gICAgWydxdWl6JywgJ3F1aXp6ZXMnXSxcbiAgICBbJ2h1bWFuJywgJ2h1bWFucyddLFxuICAgIFsncHJvb2YnLCAncHJvb2ZzJ10sXG4gICAgWydjYXJ2ZScsICdjYXJ2ZXMnXSxcbiAgICBbJ3ZhbHZlJywgJ3ZhbHZlcyddLFxuICAgIFsnbG9vZXknLCAnbG9vaWVzJ10sXG4gICAgWyd0aGllZicsICd0aGlldmVzJ10sXG4gICAgWydncm9vdmUnLCAnZ3Jvb3ZlcyddLFxuICAgIFsncGlja2F4ZScsICdwaWNrYXhlcyddLFxuICAgIFsncGFzc2VyYnknLCAncGFzc2Vyc2J5J11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogUGx1cmFsaXphdGlvbiBydWxlcy5cbiAgICovXG4gIFtcbiAgICBbL3M/JC9pLCAncyddLFxuICAgIFsvW15cXHUwMDAwLVxcdTAwN0ZdJC9pLCAnJDAnXSxcbiAgICBbLyhbXmFlaW91XWVzZSkkL2ksICckMSddLFxuICAgIFsvKGF4fHRlc3QpaXMkL2ksICckMWVzJ10sXG4gICAgWy8oYWxpYXN8W15hb3VddXN8dFtsbV1hc3xnYXN8cmlzKSQvaSwgJyQxZXMnXSxcbiAgICBbLyhlW21uXXUpcz8kL2ksICckMXMnXSxcbiAgICBbLyhbXmxdaWFzfFthZWlvdV1sYXN8W2VqenJdYXN8W2l1XWFtKSQvaSwgJyQxJ10sXG4gICAgWy8oYWx1bW58c3lsbGFifHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMWknXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicikoPzphfGFlKSQvaSwgJyQxYWUnXSxcbiAgICBbLyhzZXJhcGh8Y2hlcnViKSg/OmltKT8kL2ksICckMWltJ10sXG4gICAgWy8oaGVyfGF0fGdyKW8kL2ksICckMW9lcyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcikoPzphfHVtKSQvaSwgJyQxYSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58aGVkcnxhdXRvbWF0KSg/OmF8b24pJC9pLCAnJDFhJ10sXG4gICAgWy9zaXMkL2ksICdzZXMnXSxcbiAgICBbLyg/Oihrbml8d2l8bGkpZmV8KGFyfGx8ZWF8ZW98b2F8aG9vKWYpJC9pLCAnJDEkMnZlcyddLFxuICAgIFsvKFteYWVpb3V5XXxxdSl5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyhbXmNoXVtpZW9dW2xuXSlleSQvaSwgJyQxaWVzJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6eikkL2ksICckMWVzJ10sXG4gICAgWy8obWF0cnxjb2R8bXVyfHNpbHx2ZXJ0fGluZHxhcHBlbmQpKD86aXh8ZXgpJC9pLCAnJDFpY2VzJ10sXG4gICAgWy9cXGIoKD86dGl0KT9tfGwpKD86aWNlfG91c2UpJC9pLCAnJDFpY2UnXSxcbiAgICBbLyhwZSkoPzpyc29ufG9wbGUpJC9pLCAnJDFvcGxlJ10sXG4gICAgWy8oY2hpbGQpKD86cmVuKT8kL2ksICckMXJlbiddLFxuICAgIFsvZWF1eCQvaSwgJyQwJ10sXG4gICAgWy9tW2FlXW4kL2ksICdtZW4nXSxcbiAgICBbJ3Rob3UnLCAneW91J11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcyQvaSwgJyddLFxuICAgIFsvKHNzKSQvaSwgJyQxJ10sXG4gICAgWy8od2l8a25pfCg/OmFmdGVyfGhhbGZ8aGlnaHxsb3d8bWlkfG5vbnxuaWdodHxbXlxcd118XilsaSl2ZXMkL2ksICckMWZlJ10sXG4gICAgWy8oYXJ8KD86d298W2FlXSlsfFtlb11bYW9dKXZlcyQvaSwgJyQxZiddLFxuICAgIFsvaWVzJC9pLCAneSddLFxuICAgIFsvXFxiKFtwbF18em9tYnwoPzpuZWNrfGNyb3NzKT90fGNvbGx8ZmFlcnxmb29kfGdlbnxnb29ufGdyb3VwfGxhc3N8dGFsa3xnb2FsfGN1dClpZXMkL2ksICckMWllJ10sXG4gICAgWy9cXGIobW9ufHNtaWwpaWVzJC9pLCAnJDFleSddLFxuICAgIFsvXFxiKCg/OnRpdCk/bXxsKWljZSQvaSwgJyQxb3VzZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpaW0kL2ksICckMSddLFxuICAgIFsvKHh8Y2h8c3N8c2h8enp8dHRvfGdvfGNob3xhbGlhc3xbXmFvdV11c3x0W2xtXWFzfGdhc3woPzpoZXJ8YXR8Z3Ipb3xbYWVpb3VdcmlzKSg/OmVzKT8kL2ksICckMSddLFxuICAgIFsvKGFuYWx5fGRpYWdub3xwYXJlbnRoZXxwcm9nbm98c3lub3B8dGhlfGVtcGhhfGNyaXxuZSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gICAgWy8obW92aWV8dHdlbHZlfGFidXNlfGVbbW5ddSlzJC9pLCAnJDEnXSxcbiAgICBbLyh0ZXN0KSg/OmlzfGVzKSQvaSwgJyQxaXMnXSxcbiAgICBbLyhhbHVtbnxzeWxsYWJ8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxdXMnXSxcbiAgICBbLyhhZ2VuZHxhZGRlbmR8bWlsbGVubml8ZGF0fGV4dHJlbXxiYWN0ZXJpfGRlc2lkZXJhdHxzdHJhdHxjYW5kZWxhYnJ8ZXJyYXR8b3Z8c3ltcG9zaXxjdXJyaWN1bHxxdW9yKWEkL2ksICckMXVtJ10sXG4gICAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxoZWRyfGF1dG9tYXQpYSQvaSwgJyQxb24nXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicilhZSQvaSwgJyQxYSddLFxuICAgIFsvKGNvZHxtdXJ8c2lsfHZlcnR8aW5kKWljZXMkL2ksICckMWV4J10sXG4gICAgWy8obWF0cnxhcHBlbmQpaWNlcyQvaSwgJyQxaXgnXSxcbiAgICBbLyhwZSkocnNvbnxvcGxlKSQvaSwgJyQxcnNvbiddLFxuICAgIFsvKGNoaWxkKXJlbiQvaSwgJyQxJ10sXG4gICAgWy8oZWF1KXg/JC9pLCAnJDEnXSxcbiAgICBbL21lbiQvaSwgJ21hbiddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogVW5jb3VudGFibGUgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gU2luZ3VsYXIgd29yZHMgd2l0aCBubyBwbHVyYWxzLlxuICAgICdhZHVsdGhvb2QnLFxuICAgICdhZHZpY2UnLFxuICAgICdhZ2VuZGEnLFxuICAgICdhaWQnLFxuICAgICdhaXJjcmFmdCcsXG4gICAgJ2FsY29ob2wnLFxuICAgICdhbW1vJyxcbiAgICAnYW5hbHl0aWNzJyxcbiAgICAnYW5pbWUnLFxuICAgICdhdGhsZXRpY3MnLFxuICAgICdhdWRpbycsXG4gICAgJ2Jpc29uJyxcbiAgICAnYmxvb2QnLFxuICAgICdicmVhbScsXG4gICAgJ2J1ZmZhbG8nLFxuICAgICdidXR0ZXInLFxuICAgICdjYXJwJyxcbiAgICAnY2FzaCcsXG4gICAgJ2NoYXNzaXMnLFxuICAgICdjaGVzcycsXG4gICAgJ2Nsb3RoaW5nJyxcbiAgICAnY29kJyxcbiAgICAnY29tbWVyY2UnLFxuICAgICdjb29wZXJhdGlvbicsXG4gICAgJ2NvcnBzJyxcbiAgICAnZGVicmlzJyxcbiAgICAnZGlhYmV0ZXMnLFxuICAgICdkaWdlc3Rpb24nLFxuICAgICdlbGsnLFxuICAgICdlbmVyZ3knLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdleGNyZXRpb24nLFxuICAgICdleHBlcnRpc2UnLFxuICAgICdmaXJtd2FyZScsXG4gICAgJ2Zsb3VuZGVyJyxcbiAgICAnZnVuJyxcbiAgICAnZ2FsbG93cycsXG4gICAgJ2dhcmJhZ2UnLFxuICAgICdncmFmZml0aScsXG4gICAgJ2hhcmR3YXJlJyxcbiAgICAnaGVhZHF1YXJ0ZXJzJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVycGVzJyxcbiAgICAnaGlnaGppbmtzJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdob3VzZXdvcmsnLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgJ2plYW5zJyxcbiAgICAnanVzdGljZScsXG4gICAgJ2t1ZG9zJyxcbiAgICAnbGFib3VyJyxcbiAgICAnbGl0ZXJhdHVyZScsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hY2tlcmVsJyxcbiAgICAnbWFpbCcsXG4gICAgJ21lZGlhJyxcbiAgICAnbWV3cycsXG4gICAgJ21vb3NlJyxcbiAgICAnbXVzaWMnLFxuICAgICdtdWQnLFxuICAgICdtYW5nYScsXG4gICAgJ25ld3MnLFxuICAgICdvbmx5JyxcbiAgICAncGVyc29ubmVsJyxcbiAgICAncGlrZScsXG4gICAgJ3BsYW5rdG9uJyxcbiAgICAncGxpZXJzJyxcbiAgICAncG9saWNlJyxcbiAgICAncG9sbHV0aW9uJyxcbiAgICAncHJlbWlzZXMnLFxuICAgICdyYWluJyxcbiAgICAncmVzZWFyY2gnLFxuICAgICdyaWNlJyxcbiAgICAnc2FsbW9uJyxcbiAgICAnc2Npc3NvcnMnLFxuICAgICdzZXJpZXMnLFxuICAgICdzZXdhZ2UnLFxuICAgICdzaGFtYmxlcycsXG4gICAgJ3NocmltcCcsXG4gICAgJ3NvZnR3YXJlJyxcbiAgICAnc3BlY2llcycsXG4gICAgJ3N0YWZmJyxcbiAgICAnc3dpbmUnLFxuICAgICd0ZW5uaXMnLFxuICAgICd0cmFmZmljJyxcbiAgICAndHJhbnNwb3J0YXRpb24nLFxuICAgICd0cm91dCcsXG4gICAgJ3R1bmEnLFxuICAgICd3ZWFsdGgnLFxuICAgICd3ZWxmYXJlJyxcbiAgICAnd2hpdGluZycsXG4gICAgJ3dpbGRlYmVlc3QnLFxuICAgICd3aWxkbGlmZScsXG4gICAgJ3lvdScsXG4gICAgL3Bva1tlw6ldbW9uJC9pLFxuICAgIC8vIFJlZ2V4ZXMuXG4gICAgL1teYWVpb3VdZXNlJC9pLCAvLyBcImNoaW5lc2VcIiwgXCJqYXBhbmVzZVwiXG4gICAgL2RlZXIkL2ksIC8vIFwiZGVlclwiLCBcInJlaW5kZWVyXCJcbiAgICAvZmlzaCQvaSwgLy8gXCJmaXNoXCIsIFwiYmxvd2Zpc2hcIiwgXCJhbmdlbGZpc2hcIlxuICAgIC9tZWFzbGVzJC9pLFxuICAgIC9vW2l1XXMkL2ksIC8vIFwiY2Fybml2b3JvdXNcIlxuICAgIC9wb3gkL2ksIC8vIFwiY2hpY2twb3hcIiwgXCJzbWFsbHBveFwiXG4gICAgL3NoZWVwJC9pXG4gIF0uZm9yRWFjaChwbHVyYWxpemUuYWRkVW5jb3VudGFibGVSdWxlKTtcblxuICByZXR1cm4gcGx1cmFsaXplO1xufSk7XG4iLCJpbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSdcbi8vIEB0cy1pZ25vcmUgcmVtb3ZlIHdoZW4gdHlwZWQuXG5pbXBvcnQgbm9ybWFsaXplIGZyb20gJ25vcm1hbGl6ZS1zdHJpbmdzJ1xuaW1wb3J0IHtwcm9ibGVtYXRpY30gZnJvbSAnLi9wcm9ibGVtYXRpYy5qcydcblxudmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5XG5cbi8vIFR3byBleHByZXNzaW9ucyBvZiBvY2N1cnJlbmNlcyB3aGljaCBub3JtYWxseSB3b3VsZCBiZSBjb3VudGVkIGFzIHR3b1xuLy8gc3lsbGFibGVzLCBidXQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgb25lLlxudmFyIEVYUFJFU1NJT05fTU9OT1NZTExBQklDX09ORSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnYXdlKCR8ZHxzbyknLFxuICAgICdjaWEoPzpsfCQpJyxcbiAgICAndGlhJyxcbiAgICAnY2l1cycsXG4gICAgJ2Npb3VzJyxcbiAgICAnW15hZWlvdV1naXUnLFxuICAgICdbYWVpb3V5XVteYWVpb3V5XWlvbicsXG4gICAgJ2lvdScsXG4gICAgJ3NpYSQnLFxuICAgICdlb3VzJCcsXG4gICAgJ1tvYV1ndWUkJyxcbiAgICAnLlteYWVpdW95Y2dsdGRiXXsyLH1lZCQnLFxuICAgICcuZWx5JCcsXG4gICAgJ15qdWEnLFxuICAgICd1YWknLFxuICAgICdlYXUnLFxuICAgICdeYnVzaSQnLFxuICAgICcoPzpbYWVpb3V5XSg/OicgK1xuICAgICAgW1xuICAgICAgICAnW2JjZmdrbG1ucHJzdnd4eXpdJyxcbiAgICAgICAgJ2NoJyxcbiAgICAgICAgJ2RnJyxcbiAgICAgICAgJ2dbaG5dJyxcbiAgICAgICAgJ2xjaCcsXG4gICAgICAgICdsW2x2XScsXG4gICAgICAgICdtbScsXG4gICAgICAgICduY2gnLFxuICAgICAgICAnbltjZ25dJyxcbiAgICAgICAgJ3JbYmNuc3ZdJyxcbiAgICAgICAgJ3NxdScsXG4gICAgICAgICdzW2Noa2xzXScsXG4gICAgICAgICd0aCdcbiAgICAgIF0uam9pbignfCcpICtcbiAgICAgICcpZWQkKScsXG4gICAgJyg/OlthZWlvdXldKD86JyArXG4gICAgICBbXG4gICAgICAgICdbYmRma2xtbnByc3R2eV0nLFxuICAgICAgICAnY2gnLFxuICAgICAgICAnZ1tobl0nLFxuICAgICAgICAnbGNoJyxcbiAgICAgICAgJ2xbbHZdJyxcbiAgICAgICAgJ21tJyxcbiAgICAgICAgJ25jaCcsXG4gICAgICAgICdubicsXG4gICAgICAgICdyW25zdl0nLFxuICAgICAgICAnc3F1JyxcbiAgICAgICAgJ3NbY2tsc3RdJyxcbiAgICAgICAgJ3RoJ1xuICAgICAgXS5qb2luKCd8JykgK1xuICAgICAgJyllcyQpJ1xuICBdLmpvaW4oJ3wnKSxcbiAgJ2cnXG4pXG5cbnZhciBFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19UV08gPSBuZXcgUmVnRXhwKFxuICAnW2FlaW91eV0oPzonICtcbiAgICBbXG4gICAgICAnW2JjZGZna2xtbnByc3R2eXpdJyxcbiAgICAgICdjaCcsXG4gICAgICAnZGcnLFxuICAgICAgJ2dbaG5dJyxcbiAgICAgICdsW2x2XScsXG4gICAgICAnbW0nLFxuICAgICAgJ25bY2duc10nLFxuICAgICAgJ3JbY25zdl0nLFxuICAgICAgJ3NxdScsXG4gICAgICAnc1tja2xzdF0nLFxuICAgICAgJ3RoJ1xuICAgIF0uam9pbignfCcpICtcbiAgICAnKWUkJyxcbiAgJ2cnXG4pXG5cbi8vIEZvdXIgZXhwcmVzc2lvbiBvZiBvY2N1cnJlbmNlcyB3aGljaCBub3JtYWxseSB3b3VsZCBiZSBjb3VudGVkIGFzIG9uZVxuLy8gc3lsbGFibGUsIGJ1dCBzaG91bGQgYmUgY291bnRlZCBhcyB0d28uXG52YXIgRVhQUkVTU0lPTl9ET1VCTEVfU1lMTEFCSUNfT05FID0gbmV3IFJlZ0V4cChcbiAgJyg/OicgK1xuICAgIFtcbiAgICAgICcoW15hZWlvdXldKVxcXFwxbCcsXG4gICAgICAnW15hZWlvdXldaWUoPzpyfHM/dCknLFxuICAgICAgJ1thZWlvdXltXWJsJyxcbiAgICAgICdlbycsXG4gICAgICAnaXNtJyxcbiAgICAgICdhc20nLFxuICAgICAgJ3RobScsXG4gICAgICAnZG50JyxcbiAgICAgICdzbnQnLFxuICAgICAgJ3VpdHknLFxuICAgICAgJ2RlYScsXG4gICAgICAnZ2VhbicsXG4gICAgICAnb2EnLFxuICAgICAgJ3VhJyxcbiAgICAgICdyZWFjdD8nLFxuICAgICAgJ29yYmVkJywgLy8gQ2FuY2VsIGAnLlteYWVpdW95Y2dsdGRiXXsyLH1lZCQnLGBcbiAgICAgICdzaHJlZCcsIC8vIENhbmNlbCBgJy5bXmFlaXVveWNnbHRkYl17Mix9ZWQkJyxgXG4gICAgICAnZWluZ3M/JyxcbiAgICAgICdbYWVpb3V5XXNoP2VbcnNdJ1xuICAgIF0uam9pbignfCcpICtcbiAgICAnKSQnLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX1RXTyA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnY3JlYXQoPyF1KScsXG4gICAgJ1teZ3FddWFbXmF1aWVvXScsXG4gICAgJ1thZWlvdV17M30nLFxuICAgICdeKD86aWF8bWN8Y29hW2RnbHhdLiknLFxuICAgICdecmUoYXBwfGVzfGltfHVzKScsXG4gICAgJyh0aHxkKWVpc3QnXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX1RIUkVFID0gbmV3IFJlZ0V4cChcbiAgW1xuICAgICdbXmFlaW91XXlbYWVdJyxcbiAgICAnW15sXWxpZW4nLFxuICAgICdyaWV0JyxcbiAgICAnZGllbicsXG4gICAgJ2l1JyxcbiAgICAnaW8nLFxuICAgICdpaScsXG4gICAgJ3VlbicsXG4gICAgJ1thZWlsb3R1XXJlYWwnLFxuICAgICdyZWFsW2FlaWxvdHVdJyxcbiAgICAnaWVsbCcsXG4gICAgJ2VvW15hZWlvdV0nLFxuICAgICdbYWVpb3VdeVthZWlvdV0nXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxudmFyIEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX0ZPVVIgPSAvW15zXWlhL1xuXG4vLyBFeHByZXNzaW9uIHRvIG1hdGNoIHNpbmdsZSBzeWxsYWJsZSBwcmUtIGFuZCBzdWZmaXhlcy5cbnZhciBFWFBSRVNTSU9OX1NJTkdMRSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnXig/OicgK1xuICAgICAgW1xuICAgICAgICAndW4nLFxuICAgICAgICAnZm9yZScsXG4gICAgICAgICd3YXJlJyxcbiAgICAgICAgJ25vbmU/JyxcbiAgICAgICAgJ291dCcsXG4gICAgICAgICdwb3N0JyxcbiAgICAgICAgJ3N1YicsXG4gICAgICAgICdwcmUnLFxuICAgICAgICAncHJvJyxcbiAgICAgICAgJ2RpcycsXG4gICAgICAgICdzaWRlJyxcbiAgICAgICAgJ3NvbWUnXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKScsXG4gICAgJyg/OicgK1xuICAgICAgW1xuICAgICAgICAnbHknLFxuICAgICAgICAnbGVzcycsXG4gICAgICAgICdzb21lJyxcbiAgICAgICAgJ2Z1bCcsXG4gICAgICAgICdlcnM/JyxcbiAgICAgICAgJ25lc3MnLFxuICAgICAgICAnY2lhbnM/JyxcbiAgICAgICAgJ21lbnRzPycsXG4gICAgICAgICdldHRlcz8nLFxuICAgICAgICAndmlsbGVzPycsXG4gICAgICAgICdzaGlwcz8nLFxuICAgICAgICAnc2lkZXM/JyxcbiAgICAgICAgJ3BvcnRzPycsXG4gICAgICAgICdzaGlyZXM/JyxcbiAgICAgICAgJ1tnbnN0XWlvbig/OmVkfHMpPydcbiAgICAgIF0uam9pbignfCcpICtcbiAgICAgICcpJCdcbiAgXS5qb2luKCd8JyksXG4gICdnJ1xuKVxuXG4vLyBFeHByZXNzaW9uIHRvIG1hdGNoIGRvdWJsZSBzeWxsYWJsZSBwcmUtIGFuZCBzdWZmaXhlcy5cbnZhciBFWFBSRVNTSU9OX0RPVUJMRSA9IG5ldyBSZWdFeHAoXG4gIFtcbiAgICAnXicgK1xuICAgICAgJyg/OicgK1xuICAgICAgW1xuICAgICAgICAnYWJvdmUnLFxuICAgICAgICAnYW50aScsXG4gICAgICAgICdhbnRlJyxcbiAgICAgICAgJ2NvdW50ZXInLFxuICAgICAgICAnaHlwZXInLFxuICAgICAgICAnYWZvcmUnLFxuICAgICAgICAnYWdyaScsXG4gICAgICAgICdpbmZyYScsXG4gICAgICAgICdpbnRyYScsXG4gICAgICAgICdpbnRlcicsXG4gICAgICAgICdvdmVyJyxcbiAgICAgICAgJ3NlbWknLFxuICAgICAgICAndWx0cmEnLFxuICAgICAgICAndW5kZXInLFxuICAgICAgICAnZXh0cmEnLFxuICAgICAgICAnZGlhJyxcbiAgICAgICAgJ21pY3JvJyxcbiAgICAgICAgJ21lZ2EnLFxuICAgICAgICAna2lsbycsXG4gICAgICAgICdwaWNvJyxcbiAgICAgICAgJ25hbm8nLFxuICAgICAgICAnbWFjcm8nLFxuICAgICAgICAnc29tZXInXG4gICAgICBdLmpvaW4oJ3wnKSArXG4gICAgICAnKScsXG4gICAgJyg/OmZ1bGx5fGJlcnJ5fHdvbWFufHdvbWVufGVkbHl8dW5pb258KCg/OltiY2RmZ2hqa2xtbnBxcnN0dnd4el0pfFthZWlvdV0peWU/aW5nKSQnXG4gIF0uam9pbignfCcpLFxuICAnZydcbilcblxuLy8gRXhwcmVzc2lvbiB0byBtYXRjaCB0cmlwbGUgc3lsbGFibGUgc3VmZml4ZXMuXG52YXIgRVhQUkVTU0lPTl9UUklQTEUgPSAvKGNyZWF0aW9ucz98b2xvZ3l8b2xvZ2lzdHxvbm9teXxvbm9taXN0KSQvZ1xuXG4vLyBXcmFwcGVyIHRvIHN1cHBvcnQgbXVsdGlwbGUgd29yZC1wYXJ0cyAoR0gtMTEpLlxuLyoqXG4gKiBTeWxsYWJsZSBjb3VudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN5bGxhYmxlKHZhbHVlKSB7XG4gIHZhciB2YWx1ZXMgPSBub3JtYWxpemUoU3RyaW5nKHZhbHVlKSlcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC8vIFJlbW92ZSBhcG9zdHJvcGhlcy5cbiAgICAucmVwbGFjZSgvWyfigJldL2csICcnKVxuICAgIC8vIFNwbGl0IG9uIHdvcmQgYm91bmRhcmllcy5cbiAgICAuc3BsaXQoL1xcYi9nKVxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgc3VtID0gMFxuXG4gIHdoaWxlICgrK2luZGV4IDwgdmFsdWVzLmxlbmd0aCkge1xuICAgIC8vIFJlbW92ZSBub24tYWxwaGFiZXRpYyBjaGFyYWN0ZXJzIGZyb20gYSBnaXZlbiB2YWx1ZS5cbiAgICBzdW0gKz0gb25lKHZhbHVlc1tpbmRleF0ucmVwbGFjZSgvW15hLXpdL2csICcnKSlcbiAgfVxuXG4gIHJldHVybiBzdW1cbn1cblxuLyoqXG4gKiBHZXQgc3lsbGFibGVzIGluIGEgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBvbmUodmFsdWUpIHtcbiAgdmFyIGNvdW50ID0gMFxuICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgdmFyIGluZGV4XG4gIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICB2YXIgc2luZ3VsYXJcbiAgLyoqIEB0eXBlIHtBcnJheS48c3RyaW5nPn0gKi9cbiAgdmFyIHBhcnRzXG4gIC8qKiBAdHlwZSB7UmV0dXJuVHlwZS48cmV0dXJuRmFjdG9yeT59ICovXG4gIHZhciBhZGRPbmVcbiAgLyoqIEB0eXBlIHtSZXR1cm5UeXBlLjxyZXR1cm5GYWN0b3J5Pn0gKi9cbiAgdmFyIHN1YnRyYWN0T25lXG5cbiAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjb3VudFxuICB9XG5cbiAgLy8gUmV0dXJuIGVhcmx5IHdoZW4gcG9zc2libGUuXG4gIGlmICh2YWx1ZS5sZW5ndGggPCAzKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIC8vIElmIGB2YWx1ZWAgaXMgYSBoYXJkIHRvIGNvdW50LCBpdCBtaWdodCBiZSBpbiBgcHJvYmxlbWF0aWNgLlxuICBpZiAob3duLmNhbGwocHJvYmxlbWF0aWMsIHZhbHVlKSkge1xuICAgIHJldHVybiBwcm9ibGVtYXRpY1t2YWx1ZV1cbiAgfVxuXG4gIC8vIEFkZGl0aW9uYWxseSwgdGhlIHNpbmd1bGFyIHdvcmQgbWlnaHQgYmUgaW4gYHByb2JsZW1hdGljYC5cbiAgc2luZ3VsYXIgPSBwbHVyYWxpemUodmFsdWUsIDEpXG5cbiAgaWYgKG93bi5jYWxsKHByb2JsZW1hdGljLCBzaW5ndWxhcikpIHtcbiAgICByZXR1cm4gcHJvYmxlbWF0aWNbc2luZ3VsYXJdXG4gIH1cblxuICBhZGRPbmUgPSByZXR1cm5GYWN0b3J5KDEpXG4gIHN1YnRyYWN0T25lID0gcmV0dXJuRmFjdG9yeSgtMSlcblxuICAvLyBDb3VudCBzb21lIHByZWZpeGVzIGFuZCBzdWZmaXhlcywgYW5kIHJlbW92ZSB0aGVpciBtYXRjaGVkIHJhbmdlcy5cbiAgdmFsdWUgPSB2YWx1ZVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fVFJJUExFLCBjb3VudEZhY3RvcnkoMykpXG4gICAgLnJlcGxhY2UoRVhQUkVTU0lPTl9ET1VCTEUsIGNvdW50RmFjdG9yeSgyKSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX1NJTkdMRSwgY291bnRGYWN0b3J5KDEpKVxuXG4gIC8vIENvdW50IG11bHRpcGxlIGNvbnNvbmFudHMuXG4gIHBhcnRzID0gdmFsdWUuc3BsaXQoL1teYWVpb3V5XSsvKVxuICBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCBwYXJ0cy5sZW5ndGgpIHtcbiAgICBpZiAocGFydHNbaW5kZXhdICE9PSAnJykge1xuICAgICAgY291bnQrK1xuICAgIH1cbiAgfVxuXG4gIC8vIFN1YnRyYWN0IG9uZSBmb3Igb2NjdXJyZW5jZXMgd2hpY2ggc2hvdWxkIGJlIGNvdW50ZWQgYXMgb25lIChidXQgYXJlXG4gIC8vIGNvdW50ZWQgYXMgdHdvKS5cbiAgdmFsdWVcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX01PTk9TWUxMQUJJQ19PTkUsIHN1YnRyYWN0T25lKVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fTU9OT1NZTExBQklDX1RXTywgc3VidHJhY3RPbmUpXG5cbiAgLy8gQWRkIG9uZSBmb3Igb2NjdXJyZW5jZXMgd2hpY2ggc2hvdWxkIGJlIGNvdW50ZWQgYXMgdHdvIChidXQgYXJlIGNvdW50ZWQgYXNcbiAgLy8gb25lKS5cbiAgdmFsdWVcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19PTkUsIGFkZE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19UV08sIGFkZE9uZSlcbiAgICAucmVwbGFjZShFWFBSRVNTSU9OX0RPVUJMRV9TWUxMQUJJQ19USFJFRSwgYWRkT25lKVxuICAgIC5yZXBsYWNlKEVYUFJFU1NJT05fRE9VQkxFX1NZTExBQklDX0ZPVVIsIGFkZE9uZSlcblxuICAvLyBNYWtlIHN1cmUgYXQgbGVhc3Qgb24gaXMgcmV0dXJuZWQuXG4gIHJldHVybiBjb3VudCB8fCAxXG5cbiAgLyoqXG4gICAqIERlZmluZSBzY29wZWQgY291bnRlcnMsIHRvIGJlIHVzZWQgaW4gYFN0cmluZyNyZXBsYWNlKClgIGNhbGxzLlxuICAgKiBUaGUgc2NvcGVkIGNvdW50ZXIgcmVtb3ZlcyB0aGUgbWF0Y2hlZCB2YWx1ZSBmcm9tIHRoZSBpbnB1dC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFkZGl0aW9uXG4gICAqL1xuICBmdW5jdGlvbiBjb3VudEZhY3RvcnkoYWRkaXRpb24pIHtcbiAgICByZXR1cm4gY291bnRlclxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gY291bnRlcigpIHtcbiAgICAgIGNvdW50ICs9IGFkZGl0aW9uXG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBzY29wZWQgY291bnRlciBkb2VzIG5vdCByZW1vdmUgdGhlIG1hdGNoZWQgdmFsdWUgZnJvbSB0aGUgaW5wdXQuXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRpdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gcmV0dXJuRmFjdG9yeShhZGRpdGlvbikge1xuICAgIHJldHVybiByZXR1cm5lclxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSAkMFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcmV0dXJuZXIoJDApIHtcbiAgICAgIGNvdW50ICs9IGFkZGl0aW9uXG4gICAgICByZXR1cm4gJDBcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCB2YXIgcHJvYmxlbWF0aWMgPSB7XG4gIGFiYWxvbmU6IDQsXG4gIGFiYXJlOiAzLFxuICBhYmJydXp6ZXNlOiA0LFxuICBhYmVkOiAyLFxuICBhYm9yaWdpbmU6IDUsXG4gIGFicnV6emVzZTogNCxcbiAgYWNyZWFnZTogMyxcbiAgYWRhbWU6IDMsXG4gIGFkaWV1OiAyLFxuICBhZG9iZTogMyxcbiAgYW5lbW9uZTogNCxcbiAgYW55b25lOiAzLFxuICBhcGFjaGU6IDMsXG4gIGFwaHJvZGl0ZTogNCxcbiAgYXBvc3Ryb3BoZTogNCxcbiAgYXJpYWRuZTogNCxcbiAgY2FmZTogMixcbiAgY2FsbGlvcGU6IDQsXG4gIGNhdGFzdHJvcGhlOiA0LFxuICBjaGlsZTogMixcbiAgY2hsb2U6IDIsXG4gIGNpcmNlOiAyLFxuICBjb3lvdGU6IDMsXG4gIGRhcGhuZTogMixcbiAgZXBpdG9tZTogNCxcbiAgZXVyeWRpY2U6IDQsXG4gIGV1dGVycGU6IDMsXG4gIGV2ZXJ5OiAyLFxuICBldmVyeXdoZXJlOiAzLFxuICBmb3JldmVyOiAzLFxuICBnZXRoc2VtYW5lOiA0LFxuICBndWFjYW1vbGU6IDQsXG4gIGhlcm1pb25lOiA0LFxuICBoeXBlcmJvbGU6IDQsXG4gIGplc3NlOiAyLFxuICBqdWtlYm94OiAyLFxuICBrYXJhdGU6IDMsXG4gIG1hY2hldGU6IDMsXG4gIG1heWJlOiAyLFxuICBuYWl2ZTogMixcbiAgbmV3bHl3ZWQ6IDMsXG4gIHBlbmVsb3BlOiA0LFxuICBwZW9wbGU6IDIsXG4gIHBlcnNlcGhvbmU6IDQsXG4gIHBob2ViZTogMixcbiAgcHVsc2U6IDEsXG4gIHF1ZXVlOiAxLFxuICByZWNpcGU6IDMsXG4gIHJpdmVyYmVkOiAzLFxuICBzZXNhbWU6IDMsXG4gIHNob3JlbGluZTogMixcbiAgc2ltaWxlOiAzLFxuICBzbnVmZmxldXBhZ3VzOiA1LFxuICBzb21ldGltZXM6IDIsXG4gIHN5bmNvcGU6IDMsXG4gIHRhbWFsZTogMyxcbiAgd2F0ZXJiZWQ6IDMsXG4gIHdlZG5lc2RheTogMixcbiAgeW9zZW1pdGU6IDQsXG4gIHpvZTogMlxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzeWxsYWJsZSB9IGZyb20gJ3N5bGxhYmxlJztcblxudmFyIHNlbnRlbmNlV2VpZ2h0ID0gMS4wMTU7XG52YXIgd29yZFdlaWdodCA9IDg0LjY7XG52YXIgYmFzZSA9IDIwNi44MzU7XG5cbmNvbnN0IGZsZXNjaCA9IGNvdW50cyA9PiB7XG4gIGlmICghY291bnRzIHx8ICFjb3VudHMuc2VudGVuY2UgfHwgIWNvdW50cy53b3JkIHx8ICFjb3VudHMuc3lsbGFibGUpIHtcbiAgICByZXR1cm4gTnVtYmVyLk5hTiB8fCBzY29yZVRvQWdlT2JqWydpc051bWJlciddLmFnZTtcbiAgfVxuXG4gIGNvbnN0IHRvdGFsID0gTnVtYmVyKFxuXHRcdChiYXNlIC1cblx0XHRcdHNlbnRlbmNlV2VpZ2h0ICogKGNvdW50cy53b3JkIC8gY291bnRzLnNlbnRlbmNlKSAtXG5cdFx0XHR3b3JkV2VpZ2h0ICogKGNvdW50cy5zeWxsYWJsZSAvIGNvdW50cy53b3JkKSkudG9QcmVjaXNpb24oMilcblx0KTtcblxuICBpZiAodG90YWwgPCAwKSByZXR1cm4gMDtcbiAgaWYgKHRvdGFsID4gMTAwKSByZXR1cm4gMTAwO1xuXG4gIHJldHVybiB0b3RhbDtcbn07XG5cbmNvbnN0IGdyYWRlID0gY291bnRzID0+IHtcbiAgaWYgKCFjb3VudHMgfHwgIWNvdW50cy5zZW50ZW5jZSB8fCAhY291bnRzLndvcmQgfHwgIWNvdW50cy5zeWxsYWJsZSkge1xuICAgIHJldHVybiBOdW1iZXIuTmFOO1xuICB9XG5cbiAgY29uc3QgdG90YWwgPSBNYXRoLnJvdW5kKFxuXHRcdDAuMzkgKiAoY291bnRzLndvcmQgLyBjb3VudHMuc2VudGVuY2UpICtcblx0XHRcdDExLjggKiAoY291bnRzLnN5bGxhYmxlIC8gY291bnRzLndvcmQpIC1cblx0XHRcdDE1LjU5XG5cdCk7XG5cbiAgaWYgKHRvdGFsIDwgNSkgcmV0dXJuIDA7XG4gIGlmICh0b3RhbCA+IDE4KSByZXR1cm4gMTg7XG5cbiAgcmV0dXJuIHRvdGFsO1xufTtcblxuY29uc3Qgd29yZHMgPSBzdHJpbmcgPT4ge1xuICByZXR1cm4gc3RyaW5nLnNwbGl0KCcgJykubGVuZ3RoO1xufTtcblxuY29uc3Qgc2VudGVuY2VzID0gc3RyaW5nID0+IHtcbiAgcmV0dXJuIHN0cmluZy5zcGxpdCgnLiAnKS5sZW5ndGg7XG59O1xuXG5jb25zdCBzY29yZVRvQWdlT2JqID0ge1xuICAwOiB7XG4gICAgZ3JhZGU6ICdVbmRlciA1dGggZ3JhZGUvWWVhciA2JyxcbiAgICBhZ2U6ICdVbmRlciAxMCcsXG4gICAgZGVzY3JpcHRpb246ICdWZXJ5IGVhc3kuJ1xuICB9LFxuICA1OiB7XG4gICAgYWdlOiAnMTAgLSAxMScsXG4gICAgZGVzY3JpcHRpb246XG5cdFx0XHQnVmVyeSBlYXN5IHRvIHJlYWQuIEVhc2lseSB1bmRlcnN0b29kIGJ5IGFuIGF2ZXJhZ2UgMTEgeWVhciBvbGQgc2Nob29sIHN0dWRlbnQuJ1xuICB9LFxuICA2OiB7XG4gICAgYWdlOiAnMTEgLSAxMicsXG4gICAgZGVzY3JpcHRpb246ICdFYXN5IHRvIHJlYWQuIENvbnZlcnNhdGlvbmFsIEVuZ2xpc2ggZm9yIENvbnN1bWVycy4nXG4gIH0sXG4gIDc6IHtcbiAgICBhZ2U6ICcxMiAtIDEzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0ZhaXJseSBlYXN5IHRvIHJlYWQuJ1xuICB9LFxuICA4OiB7XG4gICAgYWdlOiAnMTMgLSAxNCcsXG4gICAgZGVzY3JpcHRpb246XG5cdFx0XHQnUGxhaW4gRW5nbGlzaC4gRWFzaWx5IHVuZGVyc3Rvb2QgYnkgMTMgdG8gMTUgeWVhciBvbGQgc3R1ZGVudHMuJ1xuICB9LFxuICA5OiB7XG4gICAgYWdlOiAnMTQgLSAxNScsXG4gICAgZGVzY3JpcHRpb246XG5cdFx0XHQnUGxhaW4gRW5nbGlzaC4gRWFzaWx5IHVuZGVyc3Rvb2QgYnkgMTMgdG8gMTUgeWVhciBvbGQgc3R1ZGVudHMuJ1xuICB9LFxuICAxMDogeyBhZ2U6ICcxNSAtIDE2JywgZGVzY3JpcHRpb246ICdGYWlybHkgZGlmZmljdWx0IHRvIHJlYWQuJyB9LFxuICAxMTogeyBhZ2U6ICcxNiAtIDE3JywgZGVzY3JpcHRpb246ICdGYWlybHkgZGlmZmljdWx0IHRvIHJlYWQuJyB9LFxuICAxMjogeyBhZ2U6ICcxNyAtIDE4JywgZGVzY3JpcHRpb246ICdGYWlybHkgZGlmZmljdWx0IHRvIHJlYWQuJyB9LFxuICAxMzogeyBhZ2U6ICdPdmVyIDE4JywgZGVzY3JpcHRpb246ICdEaWZmaWN1bHQgdG8gcmVhZC4nIH0sXG4gIDE0OiB7IGFnZTogJ092ZXIgMTgnLCBkZXNjcmlwdGlvbjogJ0RpZmZpY3VsdCB0byByZWFkLicgfSxcbiAgMTU6IHtcbiAgICBhZ2U6ICdPdmVyIDE4JyxcbiAgICBkZXNjcmlwdGlvbjpcblx0XHRcdCdWZXJ5IGRpZmZpY3VsdCB0byByZWFkLiBCZXN0IHVuZGVyc3Rvb2YgYnkgdW5pdmVyc2l0eSBncmFkdWF0ZXMuJ1xuICB9LFxuICAxNjoge1xuICAgIGFnZTogJ092ZXIgMTgnLFxuICAgIGRlc2NyaXB0aW9uOlxuXHRcdFx0J1ZlcnkgZGlmZmljdWx0IHRvIHJlYWQuIEJlc3QgdW5kZXJzdG9vZiBieSB1bml2ZXJzaXR5IGdyYWR1YXRlcy4nXG4gIH0sXG4gIDE3OiB7XG4gICAgYWdlOiAnT3ZlciAxOCcsXG4gICAgZGVzY3JpcHRpb246XG5cdFx0XHQnVmVyeSBkaWZmaWN1bHQgdG8gcmVhZC4gQmVzdCB1bmRlcnN0b29mIGJ5IHVuaXZlcnNpdHkgZ3JhZHVhdGVzLidcbiAgfSxcbiAgMTg6IHtcbiAgICBhZ2U6ICdPdmVyIDE4JyxcbiAgICBkZXNjcmlwdGlvbjpcblx0XHRcdCdFeHRyZW1lbHkgZGlmZmljdWx0IHRvIHJlYWQuIEJlc3QgdW5kZXJzdG9vZCBieSB1bml2ZXJzaXR5IGdyYWR1YXRlcy4nXG4gIH0sXG4gIGlzTnVtYmVyOiB7XG4gICAgYWdlOiBTdHJpbmcuZnJvbUNvZGVQb2ludCgweDFmNjJjKSxcbiAgICBkZXNjcmlwdGlvbjogXCJJIGNhbid0IGRvIG51bWJlcnMgOihcIlxuICB9XG59O1xuXG5jb25zdCBzY29yZVRvQWdlID0gc2NvcmUgPT4ge1xuICByZXR1cm4gc2NvcmUgPCA1XG5cdFx0PyBzY29yZVRvQWdlT2JqWzBdXG5cdFx0OiBzY29yZSA+IDE4XG5cdFx0XHQ/IHNjb3JlVG9BZ2VPYmpbMThdXG5cdFx0XHQ6IGlzTmFOKHNjb3JlKSA/IHNjb3JlVG9BZ2VPYmpbJ2lzTnVtYmVyJ10gOiBzY29yZVRvQWdlT2JqW3Njb3JlXTtcbn07XG5cbmZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICB3aWR0aDogMzAwLFxuICBoZWlnaHQ6IDI1MCxcbiAgdGl0bGU6ICdGbGVzY2gtS2luY2FpZCBTY29yZSdcbn0pO1xuXG4vLyBmaWdtYS5vbigncnVuJywgYXN5bmMgKCkgPT4ge1xuLy8gXHQvLyBjb25zdCBjdXJyZW50VGhlbWUgPSBhd2FpdCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCd0aGVtZScpO1xuLy8gXHQvLyBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICd0aGVtZScsIHRoZW1lOiBjdXJyZW50VGhlbWUgfSk7XG4vLyB9KTtcblxuLy8gZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbi8vIFx0Ly8gc2V0dGluZyB0aGVtZSB0eXBlIGluIGZpZ21hIGNsaWVudFN0b3JhZ2Vcbi8vICAgaWYgKG1zZy50eXBlID09PSAndGhlbWUtY2hhbmdlJykge1xuLy8gICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ3RoZW1lJywgbXNnLnRoZW1lKTtcbi8vICAgfVxuLy8gfTtcblxuLy8gSGFuZGxlcyBzZW5kaW5nIGZsZXNjaCByZXN1bHRzIHRvIHRoZSBVSVxuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsIGUgPT4ge1xuICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG5cbiAgaWYgKHNlbGVjdGlvbiAmJiBzZWxlY3Rpb24udHlwZSAhPT0gJ1RFWFQnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gJ05vIFRleHQnO1xuICAgIGNvbnN0IHJlc3VsdHMgPSB7IHR5cGU6ICdzZWxlY3Rpb24nLCBzY29yZTogcmVzdWx0LCBncmFkZTogcmVzdWx0IH07XG5cbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShyZXN1bHRzKTtcbiAgfVxuXG4gIGlmIChzZWxlY3Rpb24gJiYgc2VsZWN0aW9uLnR5cGUgPT09ICdURVhUJyAmJiBzZWxlY3Rpb24uY2hhcmFjdGVycy5sZW5ndGgpIHtcbiAgICBjb25zdCBudW1iZXJPZlN5bGxhYmxlcyA9IHN5bGxhYmxlKHNlbGVjdGlvbi5jaGFyYWN0ZXJzKTtcblx0XHQvLyBjb25zb2xlLmxvZyhudW1iZXJPZlN5bGxhYmxlcyk7XG4gICAgY29uc3QgbnVtYmVyT2ZXb3JkcyA9IHdvcmRzKHNlbGVjdGlvbi5jaGFyYWN0ZXJzKTtcblx0XHQvLyBjb25zb2xlLmxvZyhudW1iZXJPZldvcmRzKVxuICAgIGNvbnN0IG51bWJlck9mU2VudGVuY2VzID0gc2VudGVuY2VzKHNlbGVjdGlvbi5jaGFyYWN0ZXJzKTtcblx0XHQvLyBjb25zb2xlLmxvZyhudW1iZXJPZlNlbnRlbmNlcylcbiAgICBjb25zdCByZWFkaW5nU2NvcmUgPSBmbGVzY2goe1xuICAgICAgd29yZDogbnVtYmVyT2ZXb3JkcyxcbiAgICAgIHN5bGxhYmxlOiBudW1iZXJPZlN5bGxhYmxlcyxcbiAgICAgIHNlbnRlbmNlOiBudW1iZXJPZlNlbnRlbmNlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVhZGluZ0dyYWRlID0gZ3JhZGUoe1xuICAgICAgd29yZDogbnVtYmVyT2ZXb3JkcyxcbiAgICAgIHN5bGxhYmxlOiBudW1iZXJPZlN5bGxhYmxlcyxcbiAgICAgIHNlbnRlbmNlOiBudW1iZXJPZlNlbnRlbmNlc1xuICAgIH0pO1xuXG4gICAgY29uc3QgcmVhZGluZ0FnZSA9IHNjb3JlVG9BZ2UocmVhZGluZ0dyYWRlKTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSB7XG4gICAgICB0eXBlOiAnc2VsZWN0aW9uJyxcbiAgICAgIHNjb3JlOiByZWFkaW5nU2NvcmUsXG4gICAgICBhZ2U6IHJlYWRpbmdBZ2UuYWdlLFxuICAgICAgZGVzY3JpcHRpb246IHJlYWRpbmdBZ2UuZGVzY3JpcHRpb25cbiAgICB9O1xuXG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UocmVzdWx0cyk7XG4gIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9