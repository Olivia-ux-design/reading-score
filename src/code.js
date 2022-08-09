import { syllable } from 'syllable';

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
			'Very difficult to read. Best understood by university graduates.'
  },
  16: {
    age: 'Over 18',
    description:
			'Very difficult to read. Best understood by university graduates.'
  },
  17: {
    age: 'Over 18',
    description:
			'Very difficult to read. Best understood by university graduates.'
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
      age: readingAge.age,
      description: readingAge.description
    };

    figma.ui.postMessage(results);
  }
});
