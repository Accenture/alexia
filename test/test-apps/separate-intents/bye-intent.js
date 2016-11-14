'use strict';
module.exports = app => app.intent('ByeIntent', 'bye', () => {
  return 'Bye';
});
