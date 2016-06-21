'use strict';
const alexia = require('..');
const app = alexia.createApp('StartEndExample');

app.onStart(() => {
    return 'Welcome to this app';
});

app.onEnd(() => {
    return 'So long';
});

app.intent('MySampleIntent', 'whatever', () => {
    return 'Hello, I guess';
});

module.exports = app;