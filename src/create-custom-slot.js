'use strict';
const _ = require('lodash');
const builtInSlotsMap = require('./built-in-slots-map');
const validator = require('./validator');
const builtInSlotsValues = _.values(builtInSlotsMap);
const parseError = require('./error-handler').parseError;

/**
 * Creates custom slot. Checks if custom slot name is not conflicting with amazon built in slots
 * @param {Object} customSlots - Map of custom slot names to custom slots
 * @param {string} name - Name of the custom slot
 * @param {string[]} samples - Array of custom slot samples
 */
module.exports = (customSlots, name, samples) => {

  if (customSlots[name]) {
    const e = parseError(new Error(`Slot with name ${name} is already defined`));
    throw e;
  }

  if (builtInSlotsMap[name] || builtInSlotsValues.indexOf(name) !== -1) {
    const e = parseError(new Error(`Slot with name ${name} is already defined in built-in slots`));
    throw e;
  }

  if (!validator.isCustomSlotNameValid(name)) {
    const e = parseError(new Error(`Custom slot name ${name} is invalid. Only lowercase, uppercase letters and underscores are allowed`));
    throw e;
  }

  samples.forEach(sample => {
    if (validator.isCustomSlotValueValid(sample)) {
      const e = parseError(new Error(`Custom slot with name ${name} contains invalid special character(~, ^, *, (, ), [, ], §, !, ?, ;, :, " and |): ${sample}`));
      throw e;
    }
  });

  return {
    name,
    samples
  };
};
