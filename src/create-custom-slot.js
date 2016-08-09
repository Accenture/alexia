'use strict';
const _ = require('lodash');
const error = require('debug')('alexia:error');
const builtInSlotsMap = require('./built-in-slots-map');
const validator = require('./validator');
const builtInSlotsValues = _.values(builtInSlotsMap);

/**
 * Creates custom slot. Checks if custom slot name is not conflicting with amazon built in slots
 * @param {Object} customSlots - Map of custom slot names to custom slots
 * @param {string} name - Name of the custom slot
 * @param {string[]} samples - Array of custom slot samples
 */
module.exports = (customSlots, name, samples) => {

    if(customSlots[name]) {
        error(`Slot with name "${name}" is already defined`);
        throw new Error(`Slot with name ${name} is already defined`);
    }

    if(builtInSlotsMap[name] || builtInSlotsValues.indexOf(name) !== -1) {
        error(`Slot with name "${name}" is already defined in built-in slots`);
        throw new Error(`Slot with name ${name} is already defined in built-in slots`);
    }

    if(!validator.isNameValid(name)) {
        error(`Custom slot name "${name}" is invalid.`);
        throw new Error(`Custom slot name ${name} is invalid. Only lowercase and uppercase letters are allowed`);
    }

    samples.forEach(sample => {
        if(!validator.isUtteranceValid(sample)) {
            error(`Custom slot with name "${name}" contains invalid sample utterance: '${sample}'`);
            throw new Error(`Custom slot with name ${name} contains invalid sample utterance: ${sample}`);
        }
    });

    return {
        name,
        samples
    };
};
