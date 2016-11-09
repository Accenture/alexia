'use strict';
const createApp = require('./create-app');
const createRequest = require('./create-request');

module.exports = {
  createApp: createApp,
  createLaunchRequest: createRequest.launchRequest,
  createSessionEndedRequest: createRequest.sessionEndedRequest,
  createIntentRequest: createRequest.intentRequest
};
