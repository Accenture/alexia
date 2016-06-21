'use strict';
const alexia = require('..');

// Create app with additional info (optional)
const app = alexia.createApp('AppInfoExample', {
    version: '1.2.3',
    ids: ['appId1', 'appId2']
});

app.intent('SampleIntent', 'sample', () => {
    return 'Hello again';
});

module.exports = app;