'use strict';
const _ = require('lodash');

module.exports = (app) => {
   return {
       intentSchema: generateIntentSchema(app.intents),
       sampleUtterances: generateSampleUtterances(app.intents),
       customSlotSamples: generateCustomSlotSamples(app.customSlots)
   };
}

/**
 * Generates intent schema JSON string 
 * @return {string} strigified intent schema object generated from intents
 */
const generateIntentSchema = (intents) => {
    var intentSchema = {
        intents: []
    };

    _.forOwn(intents, intent => {
        var currentSchema = {
            intent: intent.name
        };

        // Property slots is optional
        if(intent.slots && intent.slots.length > 0) {
            currentSchema.slots = intent.slots;
        }

        intentSchema.intents.push(currentSchema);
    });

    return JSON.stringify(intentSchema, null, 2);
};

/**
 * Generates sample utterances tied to intent name
 * @return {string} interpretation of all sample utterances
 */
const generateSampleUtterances = (intents) => {
    let sampleUtterances = [];

    _.forOwn(intents, intent => {
        intent.utterances.forEach(utterance => {
            if(utterance) {
                sampleUtterances.push(`${intent.name} ${utterance}`);
            }
        });
    });

    return sampleUtterances.join('\n');
};

/**
 * @return {object} where key = slot type and value is string interpretation of
 * custom slot type samples
 */
const generateCustomSlotSamples = (customSlots) => {
    var allCustomSlotSamples = {};

    _.forOwn(customSlots, (customSlot) => {
        allCustomSlotSamples[customSlot.name] = customSlot.samples.join('\n');
    });

    return allCustomSlotSamples;
};