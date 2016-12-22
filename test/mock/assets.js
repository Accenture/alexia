'use strict';

exports.intentSchema = {
  intents: [
    {intent: 'FirstIntent'},
    {intent: 'NamedIntent'},
    {intent: 'Multiple'},
    {
      intent: 'Age',
      slots: [{name: 'age', type: 'AMAZON.NUMBER'}]
    },
    {
      intent: 'Name',
      slots: [{name: 'name', type: 'Name'}]
    },
    {intent: 'AMAZON.StopIntent'},
    {intent: 'AMAZON.HelpIntent'},
    {intent: 'AMAZON.CancelIntent'},
    {intent: 'IntentA'},
    {intent: 'IntentB'},
    {intent: 'IntentC'},
    {intent: 'Async'},
    {intent: 'AnotherCardIntentSample'},
    {intent: 'IntentWithoutUtterances'}
  ]
};

exports.utterances = [
  'FirstIntent utterance',
  'NamedIntent utteranceB',
  'NamedIntent utteranceC',
  'Multiple multiple',
  'Multiple utterances',
  'Age I am {age} years old',
  'Name My name is {name}',
  'AMAZON.StopIntent one utterance',
  'AMAZON.HelpIntent two utterances',
  'AMAZON.HelpIntent yup',
  'IntentA another utterance',
  'IntentB another utterance',
  'IntentC another utterance',
  'Async async response',
  'AnotherCardIntentSample card intent'
];

exports.nameCustomSlot = ['Borimir', 'Vlasto'];
