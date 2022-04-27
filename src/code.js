import { syllable } from 'syllable';

var sentenceWeight = 1.015;
var wordWeight = 84.6;
var base = 206.835;

const flesch = counts => {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN || "I can't do numbers :(";
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
    return Number.NaN || "I can't do numbers :(";
  }

  const total = Math.round(
		0.39 * (counts.word / counts.sentence) +
			11.8 * (counts.syllable / counts.word) -
			15.59
	);

  if (total < 0) return 0;
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
  0: 'Under 6',
  1: '6 - 7',
  2: '7 - 8',
  3: '8 - 9',
  4: '9 - 10',
  5: '10 - 11',
  6: '11 - 12',
  7: '12 - 13',
  8: '13 - 14',
  9: '14 - 15',
  10: '15 - 16',
  11: '16 - 17',
  12: '17 - 18'
};

const scoreToAge = score => {
  return score > 12
		? 'Over 18'
		: score === "I can't do numbers :(" ? score : scoreToAgeObj[score];
};

figma.showUI(__html__);

figma.on('run', async () => {
  const currentTheme = await figma.clientStorage.getAsync('theme');

  figma.ui.postMessage({ type: 'theme', theme: currentTheme });
});

figma.ui.resize(300, 220);

figma.ui.onmessage = msg => {
	// setting theme type in figma clientStorage
  if (msg.type === 'theme-change') {
    figma.clientStorage.setAsync('theme', msg.theme);
  }
};

// Handles sending flesch results to the UI
figma.on('selectionchange', e => {
  const selection = figma.currentPage.selection[0];

  if (selection && selection.type !== 'TEXT') {
    const result = 'No Text';
    const results = { type: 'selection', score: result, grade: result };

    figma.ui.postMessage(results);
  }

  if (selection && selection.type === 'TEXT' && selection.characters.length) {
    const numberOfSyllables = syllable(selection.characters);
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
      grade: readingAge
    };

    figma.ui.postMessage(results);
  }
});
