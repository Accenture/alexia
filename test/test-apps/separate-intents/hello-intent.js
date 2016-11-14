'use strict';
module.exports = app => app.intent('HelloIntent', 'hello', () => {
  return 'Hello';
});
