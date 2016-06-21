'use strict';
const alexia = require('..');
const app = alexia.createApp('MoreUtterancesExample');

app.intent('MoreUtterancesIntent', ['hello sir', 'good evening sir', 'whats up'], () => {
    return 'Hello yourself';
});

module.exports = app;
