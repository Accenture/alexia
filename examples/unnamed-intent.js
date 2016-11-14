'use strict';
const alexia = require('..');
const app = alexia.createApp('UnnamedIntentExample');

// You can ommit the intent name to have it automatically generated
app.intent(null, 'Thank you', () => {
  return 'You are welcome';
});

module.exports = app;
