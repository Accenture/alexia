'use strict';

const builtInSlotsMap = require('./built-in-slots-map');
const validator = require('./validator');
const parseError = require('./error-handler').parseError;
const _ = require('lodash');

module.exports = (richUtterances, slots, utterances) => {
  // Iterate over each rich utterance and transform it by removing slots description
  _.each(richUtterances, function (utterance) {
    var matches = findUtteranceMatches(utterance);

    _.each(matches, function (match) {
      const slotName = match[1];
      const slotType = match[2];

      // Prevent duplicate slot definition
      if (!_.find(slots, {name: slotName})) {

        // Remember slot type
        slots.push({
          name: slotName,
          type: transformSlotType(slotType)
        });
      }

      // Replace utterance slot type (there could be multiple slots in utterance)
      utterance = utterance.replace(match[0], '{' + slotName + '}');
    });

    if (validator.isUtteranceValid(utterance)) {
      // Remember utterance
      utterances.push(utterance);
    } else {
      const e = parseError(new Error(`Sample utterance: '${utterance}' is not valid. Each sample utterance must consist only of alphabet characters, spaces, dots, hyphens, brackets and single quotes`));
      throw e;
    }

  });
};

const transformSlotType = (type) => {
  const transformedType = builtInSlotsMap[type];
  return transformedType || type;
};

const findUtteranceMatches = (utterance) => {
  // Example: for 'move forward by {value:Number}' we get:
  // [[ '{value:Number}', 'value', 'Number', index: 16, input: 'move forward by {value:Number}' ]]
  const myregex = /{(.*?):(.*?)\}/gmi;
  let result;
  let allMatches = [];

  while ((result = myregex.exec(utterance)) != null) {
    allMatches.push(result);
  }

  return allMatches;
};
