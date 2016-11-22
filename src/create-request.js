'use strict';
const _ = require('lodash');

/**
 * Creates Alexa request
 * @param [options]
 * @param [options.type]
 * @param [options.name]
 * @param [options.slots]
 * @param [options.attrs]
 * @param [options.appId]
 * @param [options.sessionid]
 * @param [options.userId]
 * @param [options.requestId]
 * @param [options.timestamp]
 * @param [options.locale]
 * @param [options.new]
 */
module.exports = options => {

  // Assign default request options
  options = Object.assign({
    type: 'IntentRequest',
    name: 'UnknownIntent',
    slots: {},
    attrs: {},
    appId: 'amzn1.echo-sdk-123456',
    sessionId: 'SessionId.357a6s7',
    userId: 'amzn1.account.abc123',
    requestId: 'EdwRequestId.abc123456',
    timestamp: '2016-06-16T14:38:46Z',
    locale: 'en-US',
    new: false
  }, options);

  let intent;

  if (options.type === 'IntentRequest') {
    // Transform slots from minimal schema into slot schema sent by Amazon
    const transformedSlots = _.transform(options.slots, (result, key, value) => {
      result[key] = {
        name: value,
        value: key
      };
    }, {});

    intent = {
      name: options.name,
      slots: options.slots ? transformedSlots : undefined
    };
  }

  return {
    session: {
      attributes: options.attrs || {},
      sessionId: options.sessionId,
      application: {
        applicationId: options.appId
      },
      user: {
        userId: options.userId
      },
      new: options.new
    },
    request: {
      type: options.type,
      requestId: options.requestId,
      timestamp: options.timestamp,
      intent: intent,
      locale: options.locale
    }
  };
};
