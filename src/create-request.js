'use strict';
const _ = require('lodash');

/**
 * Creates simple Alexa request
 */
const requestBuilder = (requestType, intent, isNew, attrs, appId) => {

    var request = {
        session: {
            attributes: attrs || {},
            sessionId: 'SessionId.357a6s7',
            application: {
                applicationId: appId || 'amzn1.echo-sdk-123456'
            },
            user: {
                userId: 'amzn1.account.abc123'
            },
            new: isNew || false
        },
        request: {
            type: requestType,
            requestId: 'EdwRequestId.abc123456',
            timestamp: '2016-06-16T14:38:46Z',
            intent: intent
        }
    };

    return request;
};


module.exports = {
    /**
     * Creates LaunchRequest
     * @param {Object} attrs - Session attributes
     * @param {String} [appId] - Application id
     */
    launchRequest: (attrs, appId) => {
        return requestBuilder('LaunchRequest', null, true, attrs, appId);
    },

    /**
     * Creates SessionEndedRequest
     * @param {Object} attrs - Session attributes
     * @param {String} [appId] - Application id
     */
    sessionEndedRequest: (attrs, appId) => {
        return requestBuilder('SessionEndedRequest', null, false, attrs, appId);
    },

    /**
     * Creates IntentRequest
     * @param {String} name - Name of the intent to be invoked
     * @param {Object} [slots] - Slots in simplified key:value schema. Defaults to {}
     * @param {Object} [attrs] - Session attributes. Defaults to {}
     * @param {boolean} [isNew] - Whether session is new. Defaults to false
     * @param {String} [appId] - Application id
     */
    intentRequest: (name, slots, attrs, isNew, appId) => {

        // Transform slots from minimal schema into slot schema sent by Amazon
        let transformedSlots = _.transform(slots, (result, key, value) => {
            result[key] = {
                name: value,
                value: key
            };
        }, {});

        return requestBuilder('IntentRequest', {
            name: name,
            slots: slots ? transformedSlots : undefined
        }, isNew, attrs, appId);
    }
};
