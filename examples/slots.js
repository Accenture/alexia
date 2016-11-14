'use strict';
const alexia = require('..');
const app = alexia.createApp('SlotsExample');

app.intent('SlotsIntent', 'I am {age:Number} years old', (slots) => {
  if(slots.age) {
    return `Hello person, you are ${slots.age} years old`;
  } else {
    return 'I did not catch your age';
  }
});

// See: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#Slot%20Types

module.exports = app;
