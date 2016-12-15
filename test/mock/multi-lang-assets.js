'use strict';

exports.intentSchema = {
  'intents': [
    {
      'intent': 'LocalizedIntent'
    },
    {
      'intent': 'IntentWithoutLocalization'
    },
    {
      'intent': 'LocalizedSlotIntent',
      'slots': [
        {
          'name': 'number',
          'type': 'AMAZON.NUMBER'
        }
      ]
    },
    {
      'intent': 'AMAZON.YesIntent'
    },
    {
      'intent': 'AMAZON.HelpIntent'
    }
  ]
};

exports.itemCustomSlot = ['Car', 'House', 'Flat'];

exports.utterancesENG = [
  'LocalizedIntent say hello',
  'LocalizedIntent say hello to me',
  'LocalizedSlotIntent my magic number is {number}',
  'AMAZON.HelpIntent Testing built in intent with utterance'
];

exports.utterancesDE = [
  'LocalizedIntent sag hallo',
  'LocalizedSlotIntent Meine magische nummer ist {number}. Testen äöüÄÖÜß',
  'AMAZON.HelpIntent Testen eingebaut intent mit utterance'
];
