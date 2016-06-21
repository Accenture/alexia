'use strict';
const alexia = require('../..');
const app = alexia.createApp('ActionsApp');

const intentA = app.intent('IntentA', 'remove stuff', (slots) => {
    return {
        text: 'Are you sure you want to remove stuff?',
        end: false
    }
});

const intentB = app.intent('IntentB', 'yes', (slots, attrs) => {
    return 'Your stuff has been cleared';
});

app.intent('IntentC', 'no', () => {
	return 'Testing actions1';
});

app.intent('IntentD', 'no', () => {
	return 'Testing actions2';
});

app.action({from: '*', to: 'IntentA'});

app.action({
    from: intentA,
    to: intentB,
    if: (slots, attrs) => 1 === 1
});

app.action({
    from: intentB,
    to: 'IntentC',
    if: (slots, attrs) => 1 === 2,
    fail: (slots, attrs) => 'Could not handle request'
});

app.action({
    from: intentB,
    to: 'IntentD',
    if: (slots, attrs) => 1 === 2
});

module.exports = app;