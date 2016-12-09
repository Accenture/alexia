'use strict';
const _ = require('lodash');
const debug = require('debug')('alexia:debug');
const info = require('debug')('alexia:info');
const parseError = require('./error-handler').parseError;

/**
 * Handles request and calls done when finished
 * @param {Object} app - Application object
 * @param {Object|string} data - Request JSON or JSON string to be handled
 * @param {Function} handlers - Handlers to be called. Contains onStart, onEnd, actionFail
 * @param {Function} done - Callback to be called when request is handled. Callback is called with one argument - response JSON
 */
module.exports = (app, data, handlers, done) => {
  data = typeof data === 'object' ? data : JSON.parse(data);

  const appId = data.session.application.applicationId;
  const options = app.options;

  // Application ids is specified and does not contain app id in request
  if (options && options.ids && options.ids.length > 0 && options.ids.indexOf(appId) === -1) {
    const e = parseError(new Error(`Application id: '${appId}' is not valid`));
    throw e;
  }

  if (!data.session.attributes) {
    data.session.attributes = {};
  }

  const requestType = data.request.type;

  info(`Handling request: "${requestType}"`);
  debug(`Request payload: ${JSON.stringify(data, null, 2)}`);
  switch (requestType) {

    case 'LaunchRequest':
      callHandler(handlers.onStart, null, data.session.attributes, app, data, false, done);
      break;

    case 'IntentRequest':
      const intentName = data.request.intent.name;
      const intent = app.intents[data.request.intent.name];

      info(`Handling intent: "${intentName}"`);
      if (!intent) {
        const e = parseError(new Error(`Nonexistent intent: '${intentName}'`));
        throw e;
      }

      checkActionsAndHandle(intent, data.request.intent.slots, data.session.attributes, app, handlers, data, done);
      break;

    case 'SessionEndedRequest':
      callHandler(handlers.onEnd, null, data.session.attributes, app, data, false, done);
      break;

    default:
      const e = parseError(new Error(`Unsupported request: '${requestType}'`));
      throw e;
  }

};

/**
 * @returns {String} options.attrs.previousIntent if set, otherwise returns previousIntent
 */
const getPreviousIntent = (options, previousIntent) => {
  if (options.attrs && options.attrs.previousIntent) {
    return options.attrs.previousIntent;

  } else {
    return previousIntent;
  }
};

const callHandler = (handler, slots, attrs, app, data, error, done) => {

  // Transform slots into simple key:value schema
  slots = _.transform(slots, (result, value) => {
    result[value.name] = value.value;
  }, {});

  const optionsReady = options => {
    if (data.session.new && data.request.type === 'LaunchRequest') {
      attrs.previousIntent = getPreviousIntent(options, '@start');

    } else if (!error && !options.error && data.request.type === 'IntentRequest') {
      attrs.previousIntent = getPreviousIntent(options, data.request.intent.name);
    }

    done(createResponse(options, slots, attrs, app));
  };

  // Handle intent synchronously if has < 4 arguments. 4th is `done`
  if (handler.length < 4) {
    optionsReady(handler(slots, attrs, data));

  } else {
    handler(slots, attrs, data, optionsReady);
  }
};

/**
 * Checks for `actions` presence to help us with Alexa conversation workflow configuration
 *
 *  1) no actions: just call the intent.handler method without any checks
 *  2) with actions: check if action for current intent transition is found
 *   a) action found: call its `if` function and if condition fails run `fail` function
 *   b) no action: call default `fail` function
 *
 * @param intent
 * @param slots
 * @param attrs
 * @param app
 * @param handlers
 * @param data
 * @param done
 */
const checkActionsAndHandle = (intent, slots, attrs, app, handlers, data, done) => {

  if (app.actions.length === 0) {
    // There are no actions. Just call handler on this intent
    callHandler(intent.handler, slots, attrs, app, data, false, done);

  } else {
    // If there are some actions, try to validate current transition
    let action = _.find(app.actions, {from: attrs.previousIntent, to: intent.name});

    // Try to find action with wildcards if no action was found
    if (!action) {
      action = _.find(app.actions, {from: attrs.previousIntent, to: '*'});
    }
    if (!action) {
      action = _.find(app.actions, {from: '*', to: intent.name});
    }

    if (action) {

      // Action was found. Check if this transition is valid
      if (action.if ? action.if(slots, attrs) : true) {

        // Transition is valid. Remember intentName and handle intent
        callHandler(intent.handler, slots, attrs, app, data, false, done);

      } else {
        // Transition is invalid. Call fail function
        if (action.fail) {
          callHandler(action.fail, slots, attrs, app, data, true, done);
        } else {
          callHandler(handlers.defaultActionFail, slots, attrs, app, data, true, done);
        }
      }

    } else {
      // No action found
      callHandler(handlers.defaultActionFail, slots, attrs, app, data, true, done);
    }
  }
};

/**
 * Creates card object with default card type
 * @param {Object} card - Card object from responseData options
 * @returns {Object} card - Card object or undefined if card is not specified
 */
const createCardObject = (card) => {
  if (card) {
    // Set default card type to 'Simple'
    if (!card.type) {
      card.type = 'Simple';
    }
    return card;
  }
};

/**
 * Reads options.end and returns bool indicating whether to end session
 * @param {object} [intentOptions] Options object for intent
 * @param {object} [appOptions] Options object for whole app
 * @returns bool from intentOptions.end or appOptions.shouldEndSessionByDefault, if any of them is set than returns true
 */
const getShouldEndSession = (intentOptions, appOptions) => {
  if (!intentOptions || intentOptions.end === undefined) {
    if (!appOptions || appOptions.shouldEndSessionByDefault === undefined) {
      return true;
    } else {
      return appOptions.shouldEndSessionByDefault;
    }
  }
  return intentOptions.end;
};

const createResponse = (options, slots, attrs, app) => {
  // Convert text options to object
  if (typeof (options) === 'string') {
    options = {
      text: options
    };
  }

  // Create outputSpeech object for text or ssml
  const outputSpeech = createOutputSpeechObject(options.text, options.ssml);

  let sessionAttributes;
  if (options.attrs) {
    // Use session attributes from responseObject and remember previousIntent
    sessionAttributes = options.attrs;
    sessionAttributes.previousIntent = attrs.previousIntent;

  } else {
    // No session attributes specified in user response
    sessionAttributes = attrs;
  }

  let responseObject = {
    version: (app.options && app.options.version) ? app.options.version : '0.0.1',
    sessionAttributes: sessionAttributes,
    response: {
      outputSpeech: outputSpeech,
      shouldEndSession: getShouldEndSession(options, app.options)
    }
  };

  if (options.reprompt) {
    responseObject.response.reprompt = {
      outputSpeech: createOutputSpeechObject(options.reprompt, options.ssml)
    };

  }

  let card = createCardObject(options.card);
  if (card) {
    responseObject.response.card = card;
  }

  return responseObject;
};

/**
 * Creates output speech object used for text response or reprompt
 * @param {string} text - Text or Speech Synthesis Markup (see sendResponse docs)
 * @param {bool} ssml - Whether to use ssml
 * @returns {Object} outputSpeechObject in one of text or ssml formats
 */
const createOutputSpeechObject = (text, ssml) => {
  let outputSpeech = {};
  if (!ssml) {
    outputSpeech.type = 'PlainText';
    outputSpeech.text = text;
  } else {
    outputSpeech.type = 'SSML';
    outputSpeech.ssml = text;
  }
  return outputSpeech;
};
