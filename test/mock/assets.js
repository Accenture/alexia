'use strict';

exports.intentSchema = {
  intents: [
    {intent: 'FirstIntent'},
    {intent: 'NamedIntent'},
    {intent: 'a'},
    {intent: 'b'},
    {
      intent: 'c',
      slots: [{name: 'age', type: 'AMAZON.NUMBER'}]
    },
    {
      intent: 'd',
      slots: [{name: 'name', type: 'Name'}]
    },
    {intent: 'AMAZON.StopIntent'},
    {intent: 'AMAZON.HelpIntent'},
    {intent: 'AMAZON.CancelIntent'},
    {intent: 'IntentA'},
    {intent: 'IntentB'},
    {intent: 'IntentC'},
    {intent: 'e'},
    {intent: 'AnotherCardIntentSample'},
    {intent: 'IntentWithoutUtterances'}
  ]
};

exports.utterances = [
  'FirstIntent utterance',
  'NamedIntent utteranceB',
  'NamedIntent utteranceC',
  'a utterance for intent without name',
  'b multiple',
  'b utterances',
  'c I am {age} years old',
  'd My name is {name}',
  'AMAZON.StopIntent one utterance',
  'AMAZON.HelpIntent two utterances',
  'AMAZON.HelpIntent yup',
  'IntentA another utterance',
  'IntentB another utterance',
  'IntentC another utterance',
  'e async response',
  'AnotherCardIntentSample card intent'
];

exports.nameCustomSlot = ['Borimir', 'Vlasto'];
