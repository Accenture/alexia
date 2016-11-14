'use strict';
const alexia = require('..');
const app = alexia.createApp('CustomSlotsExample');

app.slot('Name', ['Foo', 'Bar']);

app.intent('CustomSlotIntent', 'My name is {name:Name}', (slots) => {
  return `You sure your name is ${slots.name}?`;
});

module.exports = app;
