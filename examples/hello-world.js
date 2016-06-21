'use strict';
const alexia = require('..');
const app = alexia.createApp('HelloWorldExample');

app.intent('HelloIntent', 'hello', () => {
    return 'Hello World!';
});

module.exports = app;