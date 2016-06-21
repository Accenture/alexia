'use strict';
const _ = require('lodash');
const bases = require('bases');
const builtInSlotsMap = require('./built-in-slots-map');
const builtInIntentsMap = require('./built-in-intents-map');
const validator = require('./validator');

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
    if(!name) {
        name = generateIntentName(intents);

    } else if(!validator.isNameValid(name)) {
        throw Error(`Intent name ${name} is invalid. Only lowercase and uppercase letters are allowed`);

    } else if(builtInIntentsMap[name]) {
        // If built-in intent name was used map intent name to it
        name = builtInIntentsMap[name];
    }

    // Transformed slots and utterances from richUtterances
    let slots = [];
    let utterances = [];

    parseRichUtterances(richUtterances, slots, utterances)

    return {
        name: name,
        slots: slots,
        utterances: utterances,
        handler: handler
    };
}

const generateIntentName = (intents) => {
    let position = 0;
    let generatedName;

    // While generated name is not already used and generatedName is not built-in intent (just in case)
    while(intents[(generatedName = bases.toBase52(position++))] && !builtInIntentsMap[generatedName]);

    return generatedName;
};

const parseRichUtterances = (richUtterances, slots, utterances) => {
    // Iterate over each rich utterance and transform it by removing slots description
    _.each(richUtterances, function(utterance) {
        var matches = findUtteranceMatches(utterance);

        _.each(matches, function(match) {

            // Remember slot type
            slots.push({
                name: match[1],
                type: transformSlotType(match[2])
            });

            // Replace utterance slot type (there could be multiple slots in utterance)
            utterance = utterance.replace(match[0], '{' + match[1] + '}');
        });

        if(validator.isUtteranceValid(utterance)) {
            // Remember utterance
            utterances.push(utterance);
        } else {
            throw new Error(`Error: Sample utterance: '${utterance}' is not valid. Each sample utterance must consist only of alphabet characters, spaces, dots, hyphens, brackets and single quotes`);
        }
       
    });
};

const transformSlotType = (type) => {
    const transformedType = builtInSlotsMap[type];
    return transformedType ? transformedType : type;
}

const findUtteranceMatches = (utterance) => {
  // Example: for 'move forward by {value:Number}' we get:
  // [[ '{value:Number}', 'value', 'Number', index: 16, input: 'move forward by {value:Number}' ]]
  var myregex = /{(.*?):(.*?)\}/gmi;
  var result, allMatches = [];

  while((result = myregex.exec(utterance)) != null) {
      allMatches.push(result);
  }

  return allMatches;
}