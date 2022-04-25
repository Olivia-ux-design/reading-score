import { syllable } from 'syllable';

var sentenceWeight = 1.015;
var wordWeight = 84.6;
var base = 206.835;

function flesch (counts) {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN;
  }

  const total = Number(
		(base -
			sentenceWeight * (counts.word / counts.sentence) -
			wordWeight * (counts.syllable / counts.word)).toPrecision(2)
	);

  if (total < 0) return 0;
  if (total > 100) return 100;

  return total;

	//   return Number(
	// 		(base -
	// 			sentenceWeight * (counts.word / counts.sentence) -
	// 			wordWeight * (counts.syllable / counts.word)).toPrecision(2)
	// 	);
}

function grade (counts) {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN;
  }

  const total = Math.round(
		0.39 * (counts.word / counts.sentence) +
			11.8 * (counts.syllable / counts.word) -
			15.59
	).toPrecision(2);

  if (total < 0) return 0;
  if (total > 18) return 18;

  return total;

	//   console.log(
	// 		'grade: ',
	// 		0.39 * (counts.word / counts.sentence) +
	// 			11.8 * (counts.syllable / counts.word) -
	// 			15.59
	// 	);
}

function words (string) {
  return string.split(' ').length;
}

function sentences (string) {
  return string.split('. ').length;
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  if (msg.type === 'check-text') {
    var numberOfSyllables = syllable(msg.text);
		// console.log(numberOfSyllables)
    var numberOfWords = words(msg.text);
		// console.log(numberOfWords)
    var numberOfSentences = sentences(msg.text);
		// console.log(numberOfSentences)
    var readingScore = flesch({
      word: numberOfWords,
      syllable: numberOfSyllables,
      sentence: numberOfSentences
    });
		// console.log(readingScore)
    figma.ui.postMessage(readingScore);
  }
};

function debounce (func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

figma.ui.resize(300, 250);

figma.on('selectionchange', e => {
  const selection = figma.currentPage.selection[0];
  const selectexTextNode = figma.currentPage.selectedTextRange;

	// Enable this if you want to do it on highlighted text
	//   let highlightedText = selection.characters.slice(
	// 		selectexTextNode.start,
	// 		selectexTextNode.end

  if (selection && selection.type === 'TEXT' && selection.characters.length) {
    var numberOfSyllables = syllable(selection.characters);
    console.log(numberOfSyllables);
    var numberOfWords = words(selection.characters);
		// console.log(numberOfWords)
    var numberOfSentences = sentences(selection.characters);
		// console.log(numberOfSentences)
    var readingScore = flesch({
      word: numberOfWords,
      syllable: numberOfSyllables,
      sentence: numberOfSentences
    });

    var readingGrade = grade({
      word: numberOfWords,
      syllable: numberOfSyllables,
      sentence: numberOfSentences
    });

    const results = { score: readingScore, grade: readingGrade };
		// console.log(readingScore)
    figma.ui.postMessage(results);
  }
});
