'use strict';
const createApp = require('./create-app');
const createRequest = require('./create-request');

module.exports = {
  createApp,
  createRequest,

  createLaunchRequest: (attrs, appId) => {
    return createRequest({type: 'LaunchRequest', new: true, attrs, appId});
  },

  createSessionEndedRequest: (attrs, appId) => {
    return createRequest({type: 'SessionEndedRequest', new: false, attrs, appId});
  },

  createIntentRequest: (name, slots, attrs, isNew, appId) => {
    return createRequest({
      type: 'IntentRequest',
      name,
      slots,
      new: isNew,
      attrs,
      appId
    });
  }
};
