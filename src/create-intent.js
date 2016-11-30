'use strict';
const _ = require('lodash');
const bases = require('bases');
const builtInIntentsMap = require('./built-in-intents-map');
const validator = require('./validator');
const parseError = require('./error-handler').parseError;
const parseRichUtterances = require('./parse-rich-utterances');

/**
 * Creates intent
 * @param {Object[]} intents - Array of intents. Required for determining taken intent names
 * @param {string} name - Name of the intent. If null or undefined, automatically generated intent name is used
 * @param {(string|string[])} richUtterances - Utterance or array of rich utterances
 * @param {function} handler - Function to be called when intent is invoked
 */
module.exports = (intents, name, richUtterances, handler) => {
  // Convert utterances to array
  richUtterances = _.isArray(richUtterances) ? richUtterances : [richUtterances];

  // If intent name is not specified, try to generate unique one
  if (!name) {
    name = generateIntentName(intents);

  } else if (!validator.isNameValid(name)) {
    const e = parseError(new Error(`Intent name ${name} is invalid. Only lowercase and uppercase letters are allowed`));
    throw e;
  } else if (builtInIntentsMap[name]) {
    // If built-in intent name was used map intent name to it
    name = builtInIntentsMap[name];
  }

  // Transformed slots and utterances from richUtterances
  let slots = [];
  let utterances = [];

  parseRichUtterances(richUtterances, slots, utterances);

  return {
    name: name,
    slots: slots,
    utterances: utterances,
    handler: handler
  };
};

const generateIntentName = (intents) => {
  let position = 0;
  let generatedName;

  // While generated name is not already used and generatedName is not built-in intent (just in case)
  while (intents[(generatedName = bases.toBase52(position++))] && !builtInIntentsMap[generatedName]);

  return generatedName;
};
