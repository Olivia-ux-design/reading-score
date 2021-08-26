import { syllable } from 'syllable'

var sentenceWeight = 1.015
var wordWeight = 84.6
var base = 206.835

function flesch(counts) {
    if (!counts || !counts.sentence || !counts.word || !counts.syllable) {
        return Number.NaN
    }

    return (
        base -
        sentenceWeight * (counts.word / counts.sentence) -
        wordWeight * (counts.syllable / counts.word)
    )
}

function words(string) {
    return string.split(" ").length
}


function sentences(string) {
    return string.split(". ").length
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
    if (msg.type === 'check-text') {
        var numberOfSyllables = syllable(msg.text)
        // console.log(numberOfSyllables)
        var numberOfWords = words(msg.text)
        // console.log(numberOfWords)
        var numberOfSentences = sentences(msg.text)
        // console.log(numberOfSentences)
        var readingScore = flesch({ word: numberOfWords, syllable: numberOfSyllables, sentence: numberOfSentences })
        // console.log(readingScore)
        figma.ui.postMessage(readingScore)
    }
};
