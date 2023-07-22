import { syllable } from "syllable";
import { scoreToAgeObj } from "./grading";

var sentenceWeight = 1.015;
var wordWeight = 84.6;
var base = 206.835;

const flesch = (counts) => {
  if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
    return Number.NaN || scoreToAgeObj["isNumber"].age;
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
    ? scoreToAgeObj[0]
    : score > 18
    ? scoreToAgeObj[18]
    : isNaN(score)
    ? scoreToAgeObj["isNumber"]
    : scoreToAgeObj[score];
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
    const numberOfSyllables = syllable(selection.characters);
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
