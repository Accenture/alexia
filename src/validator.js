'use strict';
module.exports = {
    isNameValid: (name) => /^[a-zA-Z]+$/.test(name),

    /**
     * @returns {boolean} whether given utterance is correct or not.
     * Each sample utterance must consist only of alphabets, white-spaces and valid
     * punctuation marks. Valid punctuation marks are periods for abbreviations,
     * possesive apostrophes, hyphens and brackets for slots.
     * @see https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface
     */
    isUtteranceValid: (utterance) => {
        return /^[a-z\s\.'\-\{\}]*$/gmi.test(utterance);
    }
};