'use strict';
const alexia = require('..');
const app = alexia.createApp('BuiltInIntentsExample');

// You can extend built-in intent with one or more utterances
app.builtInIntent('cancel', 'Cancel it', () => 'Cancel it is');
app.builtInIntent('help', ['Help me please', 'Could you help me'], () => 'I shall help you');
app.builtInIntent('next', () => 'Your next item in basket is: Amazon Echo Device');
app.builtInIntent('no', () => 'No');
app.builtInIntent('pause', () => 'Pause');
app.builtInIntent('previous', () => 'Previous');
app.builtInIntent('repeat', () => 'Repeat');
app.builtInIntent('resume', () => 'Resume');
app.builtInIntent('startOver', () => 'Start Over');
app.builtInIntent('stop', () => 'Stop');
app.builtInIntent('yes', () => 'Yes');

module.exports = app;
