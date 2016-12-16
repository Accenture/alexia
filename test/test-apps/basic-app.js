'use strict';
const alexia = require('../..');
const app = alexia.createApp('MyApp', {
  version: '1.2.3',
  shouldEndSessionByDefault: true,
  ids: ['appId1', 'appId2']
});

app.intent('FirstIntent', 'utterance', () => {
  return 'All good';
});

app.intent('NamedIntent', ['utteranceB', 'utteranceC'], () => {
  return 'All good';
});

app.intent(null, 'utterance for intent without name', () => {
  return 'All good sir';
});

app.intent(null, ['multiple', 'utterances'], () => {
  return {
    text: 'All good sir again'
  };
});

app.intent(null, 'I am {age:Number} years old', (slots) => {
  return `okay sir you are ${slots.age} years old`;
});

app.customSlot('Name', ['Borimir', 'Vlasto']);
app.intent(null, 'My name is {name:Name}', (slots) => {
  return `okay sir your name is ${slots.name}`;
});

app.builtInIntent('stop', 'one utterance', () => {
  return 'okay';
});

app.builtInIntent('help', ['two utterances', 'yup'], () => {
  return 'nok';
});

app.builtInIntent('cancel', () => {
  return 'cancel';
});

app.intent('IntentA', 'another utterance', () => {
  return {
    text: '<speak>Hi</speak>',
    reprompt: '<speak>Sup</speak>',
    ssml: true,
    attrs: {
      yes: true
    },
    card: {
      title: 'Hello',
      content: 'Once upon a time ...'
    },
    end: false
  };
});

app.intent('IntentB', 'another utterance', (slots, attrs) => {
  return `attribute value is ${attrs.yes}`;
});

app.intent('IntentC', 'another utterance', (slots, attrs) => {
  return {
    text: '<speak>Hi</speak>'
  };
});

app.intent(null, 'async response', (slots, attrs, data, done) => {
  setTimeout(() => {
    done('I just did stuff asynchronously. Thank you for this opportunity');
  }, 120);
});

app.intent('AnotherCardIntentSample', 'card intent', () => {
  return {
    text: 'Hey',
    card: {
      type: 'Standard',
      title: 'Hello',
      content: 'Once upon a time ...'
    },
    end: false
  };
});

app.intent('IntentWithoutUtterances', () => {
  return 'All good.';
});

module.exports = app;
