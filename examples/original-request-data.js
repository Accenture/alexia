'use strict';
const alexia = require('..');
const app = alexia.createApp('OriginalRequestDataExample');

app.intent('OriginalRequestData', 'read original request data', (slots, attrs, data) => {
    console.log('userId', data.session.user.userId);
    return 'Hi';
});

module.exports = app;
