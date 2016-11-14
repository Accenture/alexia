'use strict';
const alexia = require('../..');
const app = alexia.createApp('ActionsApp');

const intentA = app.intent('IntentA', 'remove stuff', () => {
  return {
    text: 'Are you sure you want to remove stuff?',
    end: false
  };
});

const intentB = app.intent('IntentB', 'yes', () => {
  return 'Your stuff has been cleared';
});

app.intent('IntentC', 'no', () => {
  return 'Testing actions1';
});

app.intent('IntentD', 'no', () => {
  return 'Testing actions2';
});

app.intent('IntentE', 'maybe', (slots, attrs, data, done) => {
  done({
    text: 'Testing async actions3 with responseObject attrs',
    attrs: {
      foo: true
    }
  });
});

app.action({from: '*', to: 'IntentA'});

app.action({
  from: intentA,
  to: intentB,
  if: () => 1 === 1 // eslint-disable-line no-self-compare
});

app.action({
  from: intentB,
  to: 'IntentC',
  if: () => 1 === 2,
  fail: () => 'Could not handle request'
});

app.action({
  from: intentB,
  to: 'IntentD',
  if: () => 1 === 2
});

app.action({from: '*', to: 'IntentE'});

module.exports = app;
