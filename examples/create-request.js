'use strict';
const alexia = require('alexia');

const launchRequest = alexia.createLaunchRequest();
const sessionEndedRequest = alexia.createSessionEndedRequest();
const intentRequest = alexia.createIntentRequest('MyIntent');

console.log(launchRequest);
console.log(sessionEndedRequest);
console.log(intentRequest);