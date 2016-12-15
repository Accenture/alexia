'use strict';
const _ = require('lodash');
const parseRichUtterances = require('./parse-rich-utterances');

module.exports = (app) => {
  let assets = {};

  const languages = app.i18next.options.preload;

  _.each(languages, locale => {
    const intentSchemaAndUtterances = genIntentSchemaAndUtterances(app, locale);

    assets[locale] = {
      intentSchema: intentSchemaAndUtterances.intentSchema,
      utterances: intentSchemaAndUtterances.utterances,
      customSlots: genCustomSlots(app, locale)
    };
  });

  return assets;
};

/**
 * Generates intent schema JSON string and utterances
 * @return {string} strigified intent schema object generated from intents
 */
const genIntentSchemaAndUtterances = (app, locale) => {
  let intentSchema = {
    intents: []
  };

  let allUtterances = [];

  // Load complete locale resource
  const localeResource = app.i18next.getResource(locale, 'translation');

  // For each intent
  _.each(app.intents, intent => {

    let currentSchema = {
      intent: intent.name
    };

    intentSchema.intents.push(currentSchema);

    // Remove AMAZON prefix for built-in intents
    const nameWithoutAmazonPrefix = _.last(intent.name.split('.'));

    // Get current intent resource
    const intentResource = localeResource[nameWithoutAmazonPrefix];

    if (!intentResource) {
      return;
    }

    let slots = [];
    let utterances = [];

    // Transform intent utterances to array if its string
    let intentUtterances = _.isArray(intentResource.utterances) ? intentResource.utterances : [intentResource.utterances];

    // Parse rich utterances to extract slot types and transform utterances to simle form
    parseRichUtterances(intentUtterances, slots, utterances);

    // Slots found
    if (slots.length > 0) {
      currentSchema.slots = slots;
    }

    // Iterate over each utterance, transform and add it to array
    _.each(utterances, utterance => {
      if (utterance) {
        allUtterances.push(`${intent.name} ${utterance}`);
      }
    });

  });

  return {
    intentSchema: JSON.stringify(intentSchema, null, 2),
    utterances: allUtterances.join('\n')
  };
};

/**
 * @return {object} where key = slot type and value is string interpretation of
 * custom slot type samples
 */
const genCustomSlots = (app, locale) => {
  return app.i18next.getResource(locale, 'custom-slots');
};
