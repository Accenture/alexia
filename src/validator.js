'use strict';
module.exports = {
    /**
     * @returns {boolean} whether given name is correct or not.
     * Each name must consist only of lowercase and uppercase letters
     */
    isNameValid: (name) => /^[a-zA-Z]+$/.test(name),

    /**
     * @returns {boolean} whether given utterance is correct or not.
     * Each sample utterance must consist only of alphabets, white-spaces and valid
     * punctuation marks. Valid punctuation marks are periods for abbreviations,
     * possesive apostrophes, hyphens and brackets for slots.
     * @see https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface
     */
    isUtteranceValid: (utterance) => /^[a-z\s\.'\-\{\}]*$/gmi.test(utterance),

    /**
     * @returns {boolean} whether given custom slot name is correct or not.
     * Each custom slot name must consist only of lowercase, uppercase letters and underscores
     */
    isCustomSlotNameValid: (name) => /^[a-zA-Z_]+$/.test(name),

    /**
     * @returns {boolean} whether given custom slot value is correct or not.
     * Each custom slot value must not include special characters as ~, ^, *, (, ), [, ], §, !, ?, ;, :, " and |
     * @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#h2_custom_syntax
     */
    isCustomSlotValueValid: (value) => /[~\^*\(\)\[\]§!?;:"|]+$/gmi.test(value)
};
