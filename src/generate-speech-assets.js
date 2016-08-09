'use strict';
const _ = require('lodash');
const debug = require('debug')('alexia:debug');
const info = require('debug')('alexia:info');

module.exports = (app) => {
    let assets = {
        intentSchema: genIntentSchema(app.intents),
        utterances: genUtterances(app.intents),
        customSlots: genCustomSlots(app.customSlots)
    };

    assets.toString = createStringifyAssets(assets);

    info('Assets created');
    return assets;
};

/**
 * @param {object} assets
 * @param {object} assets.intentSchema
 * @param {object} assets.utterances
 * @param {object} assets.customSlots
 * @returns {function} returning stringified version of speech assetsuseful for printing in terminal
 */
const createStringifyAssets = (assets) => () => {
    let customSlotsString = _.map(assets.customSlots, (samples, name) => {
        return `${name}:\n${samples.join('\n')}\n`;
    }).join('\n');

    return createAsset('intentSchema', assets.intentSchema) +
        createAsset('utterances', assets.utterances) +
        createAsset('customSlots', customSlotsString);
};

/**
 * Creates stringified part of speechAssets
 * @param {string} type
 * @param {object} data
 * @returns {string}
 */
const createAsset = (type, data) => {
    return `${type}:\n${data}\n\n`;
};

/**
 * Generates intent schema JSON string
 * @return {string} strigified intent schema object generated from intents
 */
const genIntentSchema = (intents) => {
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

    debug(`Generated intentSchema: "${JSON.stringify(intentSchema)}"`); // TODO
    return JSON.stringify(intentSchema, null, 2);
};

/**
 * Generates sample utterances tied to intent name
 * @return {string} interpretation of all sample utterances
 */
const genUtterances = (intents) => {
    let sampleUtterances = [];

    _.forOwn(intents, intent => {
        intent.utterances.forEach(utterance => {
            if(utterance) {
                sampleUtterances.push(`${intent.name} ${utterance}`);
            }
        });
    });

    debug(`Generated utterances: "${JSON.stringify(sampleUtterances)}"`); // TODO
    return sampleUtterances.join('\n');
};

/**
 * @return {object} where key = slot type and value is string interpretation of
 * custom slot type samples
 */
const genCustomSlots = (customSlots) => {
    var allCustomSlotSamples = {};

    _.forOwn(customSlots, (customSlot) => {
        allCustomSlotSamples[customSlot.name] = customSlot.samples;
    });

    debug(`Generated customSlots: "${JSON.stringify(allCustomSlotSamples)}"`); // TODO
    return allCustomSlotSamples;
};
