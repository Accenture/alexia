'use strict';
const alexia = require('..');
const app = alexia.createApp('ActionsExample');

const intentA = app.intent('intentA', 'clear my calendar for {date:Date}', (slots) => {
  return {
    text: 'Are you sure you want to clear your calendar?',
    attrs: {
        date: slots.date
    },
    end: false
  };
});

// Or use built-in amazon intents. See: `examples/built-in-intents.js`
const intentB = app.intent('intentB', 'yes', (slots, attrs) => {
  // Clear calendar for date `attrs.date` here
  return 'Your calendar has been cleared';
});

app.intent('intentC', 'no', () => {
	return 'Your calendar was not modified';
});

app.action({
  from: '*', // Allow transition from any intent to `intent1`. Use '@start' to allow intent only on start
  to: 'intentA' // Refer to intent by its name or remember its reference. See below
});

app.action({
  from: intentA,
  to: intentB,
  if: (slots, attrs) => attrs.date, // Note: date should be validated here
  fail: (slots, attrs) => 'Sorry, your command is invalid'
});

app.defaultActionFail(() => 'Sorry, your request is invalid');

module.exports = app;
