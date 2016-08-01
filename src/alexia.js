'use strict';
const createApp = require('./create-app');
const createRequest = require('./create-request');
const createServer = require('./create-server');

module.exports = {
    createApp: createApp,
    createServer: createServer,
    createLaunchRequest: createRequest.launchRequest,
    createSessionEndedRequest: createRequest.sessionEndedRequest,
    createIntentRequest: createRequest.intentRequest,
};
