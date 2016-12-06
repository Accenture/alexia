'use strict';
const _ = require('lodash');
const nodeDebug = require('debug');
const glob = require('glob');
const path = require('path');

const handleRequest = require('./handle-request');
const createIntent = require('./create-intent');
const createCustomSlot = require('./create-custom-slot');
const generateSpeechAssets = require('./generate-speech-assets');
const generateSpeechAssetsI18n = require('./generate-speech-assets-i18n');
const saveSpeechAssets = require('./save-speech-assets');
const builtInIntentsMap = require('./built-in-intents-map');
const createServer = require('./create-server');
const parseError = require('./error-handler').parseError;
const rimraf = require('rimraf');
const fs = require('fs');

const builtInIntentsList = _.keys(builtInIntentsMap).join(', ');
const debug = nodeDebug('alexia:debug');

/**
 * Create new app
 * @param {string} name - App name
 * @param {Object} [options] - Additional app options
 * @param {string} [options.version] - App version
 * @param {string[]} [options.ids] - Array of app ids. Only requests with supported app ids will be handled
 */
module.exports = (name, options) => {
  let app = {
    name: name,
    options: options || {},
    intents: {},
    customSlots: {},
    actions: [],
    i18next: undefined,
    t: key => key
  };

  let handlers = {
    onStart: () => 'Welcome',
    onEnd: () => 'Bye',
    defaultActionFail: () => 'Sorry, your command is invalid'
  };

  /**
   * Sets handler to be called on application start
   * @param {function} handler - Handler to be called when app is started without intent
   */
  app.onStart = (handler) => {
    handlers.onStart = handler;
  };

  /**
   * Sets handler to be called on application end
   * @param {function} handler - Handler to be called when application is unexpectedly terminated
   */
  app.onEnd = (handler) => {
    handlers.onEnd = handler;
  };

  /**
   * Sets handler to be called on default action fail
   * @param {function} handler - Default handler to be called when action can not be invoked
   */
  app.defaultActionFail = (handler) => {
    handlers.defaultActionFail = handler;
  };

  /**
   * Sets shouldEndSessionByDefault option that says if session should end after
   * @param {boolean} value - default value for shouldEndSession attribute
   */
  app.setShouldEndSessionByDefault = (value) => {
    app.options.shouldEndSessionByDefault = value;
  };

  /**
   * Creates intent
   * @param {string} name - Intent name. Should not be equal to built-in intent name. It is possible to use this function to create built-in intents but utterances are required argument and you need to specify full built-in intent name f.e. `AMAZON.StopIntent`. See `{@link app.builtInIntent}`. If not specified (null, undefined or empty string), automatically generated intent name is used but we recommend to name each intent
   * @param {(string|string[])} richUtterances - one or more utterances. Utterances contain utterance description with slots types. Example: `My age is {age:Number}`
   * @param {function} handler - Function to be called when intent is invoked
   */
  app.intent = (name, richUtterances, handler) => {
    // Shift ommited arguments (utternaces are optional)
    if (!handler) {
      handler = richUtterances;
      richUtterances = undefined;
    }

    const intent = createIntent(app.intents, name, richUtterances, handler);
    app.intents[intent.name] = intent;

    return intent;
  };

  /**
   * Creates built-int intent.
   * Essentialy the same as `intent` but with optional `utterances` since we need to specify each built-in intent has its own set of default utterances you are not required to extend
   * @param {string} name - Built-in Intent name. Must be one of: `cancel`, `help`, `next`, `no`, `pause`, `previous`, `repeat`, `resume`, `startOver`, `stop`, `yes`
   * @param {(string|string[]|function)} [utterances] - one or more utterances without slots. Could be ommited and handler could be 2nd parameter instead
   * @param {function} handler - Function to be called when intent is invoked
   */
  app.builtInIntent = (name, utterances, handler) => {
    // Validate built-in intent name
    if (!builtInIntentsMap[name]) {
      const e = parseError(new Error(`Built-in Intent name ${name} is invalid. Please use one of: ${builtInIntentsList}`));
      throw e;
    }

    // Shift ommited arguments (utternaces are optional)
    if (!handler) {
      handler = utterances;
      utterances = undefined;
    }

    app.intent(name, utterances, handler);
  };

  /**
   * Handles request and calls done when finished
   * @param {Object} data - Request JSON to be handled.
   * @param {Function} done - Callback to be called when request is handled. Callback is called with one argument - response JSON
   */
  app.handle = (data, done) => {
    // Internationalization is enabled and locale is specified in request
    if (app.i18next) {

      const locale = data.request.locale || 'en-US';

      // Make sure all locale resources are loaded
      app.i18next.loadResources(() => {

        // Get translation function for current locale
        const t = app.i18next.getFixedT(locale, 'translation');

        // Prefix key by using intent name or request type for launch / end requests
        let prefix;
        if (data.request.type === 'IntentRequest') {
          prefix = _.last(data.request.intent.name.split('.'));

        } else {
          // Transform f.e: AMAZON.YesIntent -> YesIntent
          prefix = data.request.type;
        }

        // Wrap translation function and prepend prefix to keys to make them shorter
        app.t = (key, options) => {
          return t(`${prefix}.${key}`, options);
        };

        // Handle request
        handleRequest(app, data, handlers, done);
      });

    } else {
      // Otherwise just handle request
      handleRequest(app, data, handlers, done);
    }
  };

  /**
   * Creates custom slot
   * @param {string} name - Name of the custom slot
   * @param {string[]} samples - Array of custom slot samples
   */
  app.customSlot = (name, samples) => {
    const customSlot = createCustomSlot(app.customSlots, name, samples);
    app.customSlots[name] = customSlot;
  };

  /**
   * Creates action
   * @param {string} action - Action object
   * @param {string} action.from - Name of the intent to allow transition from
   * @param {string} action.to - Name of the intent to allow transition to
   * @param {function} action.if - Function returning boolean whether this transition should be handled.
   * @param {function} action.fail - Handler to be called if `action.if` returned `false`
   */
  app.action = (action) => {
    if (Array.isArray(action.from)) {
      action.from.forEach(fromItem => {
        if (Array.isArray(action.to)) {
          action.to.forEach(toItem => {
            addAction(app.actions, fromItem, toItem, action.if, action.fail);
          });
        } else {
          addAction(app.actions, fromItem, action.to, action.if, action.fail);
        }
      });
    } else {
      if (Array.isArray(action.to)) {
        action.to.forEach(toItem => {
          addAction(app.actions, action.from, toItem, action.if, action.fail);
        });
      } else {
        addAction(app.actions, action.from, action.to, action.if, action.fail);
      }
    }
  };

  /**
   * Generate speech assets object: {schema, utterances, customSlots}
   * @deprecated Use `app.saveSpeechAssets()` instead
   */
  app.speechAssets = () => {
    return generateSpeechAssets(app);
  };

  /**
   * Save speech assets to their respective files: intentSchema.json, utterances.txt, customSlots.txt
   * @param {string} [directory] - directory folder name, defaults to '/speechAssets'
   * @param {function} [done] - callback to be called once assets are saved (useful for internationalized apps)
   */
  app.saveSpeechAssets = (directory, done) => {
    const dir = directory || 'speechAssets';

    rimraf.sync(dir);

    // No internationalization
    if (!app.i18next) {
      const assets = generateSpeechAssets(app);
      saveSpeechAssets(assets, dir);
      if (done) done();

    } else {
      // Internationalization is enabled
      app.i18next.loadResources(() => {
        const localizedAssets = generateSpeechAssetsI18n(app);

        fs.mkdirSync(dir);

        _.forEach(localizedAssets, (assets, locale) => {
          saveSpeechAssets(assets, `${dir}/${locale}`);
        });

        /* istanbul ignore else */
        if (done) done();
      });
    }
  };

  /**
   * Creates Hapi server with one route that handles all request for this app. Server must be started using `server.start()`
   * @param {number} [options] - Server options
   * @property {number} [options.path] - Path to run server route on. Defaults to `/`
   * @property {number} [options.port] - Port to run server on. If not specified then `process.env.PORT` is used. Defaults to `8888`
   * @returns {object} server
   */
  app.createServer = (options) => {
    return createServer(app, options);
  };

  /**
   * Registers all intents matching specified pattern
   * @param {string} pattern - Pattern used for intent matching. Must be relative to project root. Example: 'src/intents/**.js'
   */
  app.registerIntents = (pattern) => {

    const files = glob.sync(pattern);

    if (files.length === 0) {
      console.warn(`No intents found using pattern '${pattern}'`);
    }

    files.forEach(intentFile => {
      debug(`Registering intent '${intentFile}'`);
      require(path.relative(__dirname, intentFile))(app);
    });

  };

  /**
   * Sets i18next instance.
   * Use this to enable internationalization and make it available to the app
   */
  app.setI18next = i18next => {
    app.i18next = i18next;
  };

  return app;
};

/**
 * Adds action to app's actions array
 * @param {object} actions - Actions object of alexia app
 * @param {string} from - Name of the intent to allow transition from
 * @param {string} to - Name of the intent to allow transition to
 * @param {function} condition - Function returning boolean whether this transition should be handled
 * @param {function} fail - Handler to be called if `condition` returned `false`
 */
const addAction = (actions, from, to, condition, fail) => {
  actions.push({
    from: typeof (from) === 'string' ? from : from.name,
    to: typeof (to) === 'string' ? to : to.name,
    if: condition,
    fail: fail
  });
};
