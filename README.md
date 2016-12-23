![Alexia](alexia-logo.png "Alexia")

A Framework for creating Amazon Echo (Alexa) skills using Node.js

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]
  [![Coverage Status][coveralls-image]][coveralls-url]

```javascript
const alexia = require('alexia');
const app = alexia.createApp();

app.intent('HelloIntent', 'Hello', () => {
  return 'Hello from Alexia app';
});
```

**HTTPS Server**

```javascript
app.createServer().start();
```

*or*

**AWS Lamba**

```javascript
exports.handler = (event, context, callback) => {
  app.handle(event, data => {
    callback(null, data);
  });
};
```

## Installation

`npm install alexia --save`

Optional: requires [Handling Amazon Requests manually](#handling-amazon-requests-manually)

`npm install hapi --save`

## Overview

Alexia helps you to write Amazon Echo skills using Node.js. This framework handles Amazon Echo requests and automatically calls intents in your application. See the [Features and Samples](#features-and-samples)

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Terminology](#terminology)
- [Features and Samples](#features-and-samples)
  - [Create App](#create-app)
  - [Set default value for shouldEndSession](#set-default-value-for-shouldendsession)
  - [Create Intents](#create-intents)
  - [Create Welcome Message](#create-welcome-message)
  - [Built-in Intents](#built-in-intents)
  - [Slots](#slots)
  - [Custom Slots](#custom-slots)
  - [Session Attributes](#session-attributes)
  - [Cards](#cards)
  - [Reprompt](#reprompt)
  - [SSML](#ssml)
  - [Read Original Request Data](#read-original-request-data)
  - [Asynch Intent Handling](#asynch-intent-handling)
  - [Generate Speech Assets](#generate-speech-assets)
  - [Save Speech Assets To Directory](#save-speech-assets-to-directory)
  - [Register Intents using pattern matching](#register-intents-using-pattern-matching)
  - [Actions](#actions)
  - [Localization](#localization)
  - [Handling Amazon Requests](#handling-amazon-requests)
  - [Handling Amazon Requests Manually](#handling-amazon-requests-manually)
- [Deploy](#deploy)
  - [Heroku](#heroku)
  - [AWS Lambda](#aws-lambda)
- [Create Alexa skill](#create-alexa-skill)
- [Testing](#testing)
  - [Device Testing](#device-testing)
  - [Echoism.io (Online Simulator)](#echoismio-online-simulator)
  - [Unit Testing](#unit-testing)
- [Debugging](#debugging)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Terminology

Creating new skills for Amazon Echo using alexia requires you to understand some basic terms. This part should clarify the most of them.

- **Skill** - Alexa app
- **Intent** - Invoked if one of intent `utterances` is recognized
- **Utterance** - Voice input example
- **Slot** - Variable part of utterance
- **Session Attributes** - data persisted through the session
- **Cards** - visual output displayed in [Alexa app](http://alexa.amazon.com/)

## Features and Samples

### Create App

To create new app simply call `alexia.createApp()`

```javascript
const alexia = require('alexia');
const app = alexia.createApp('MyApp');
```

### Set default value for shouldEndSession

If you want to set default value of shouldEndSession response property you can do it by specifying `shouldEndSessionByDefault` property in App options.

```javascript
const app = alexia.createApp('MyApp', {shouldEndSessionByDefault: true});
```

Alternatively you can use `app.setShouldEndSessionByDefault()` method.

```javascript
app.setShouldEndSessionByDefault(true);
```

### Create Intents

You have to give a name for the intent when you are creating it. Also you can set multiple utterances for any of your intents.

```javascript
// Named intent
app.intent('MyIntent', 'Hello Alexa my name is Michael', () => 'Hi Michael');

// Intent with more utterances
app.intent('AnotherIntent', ['Hello', 'Hi', 'Whats up'], () => 'Hello yourself');
```

### Create Welcome Message

If you want more than just a generic "Welcome" from Alexa, you can use the onStart method to help you achieve that.

```javascript
app.onStart(() => {
  return 'Welcome to My Hello World App, say hello world to get started, or say help to get more instructions';
});
```

### Built-in Intents

Amazon Alexa Skills Kit provides a collection of built-in intents. These are intents for very common actions. Alexia provides convenient methods for their reusing and extending.

List of built-in intents: `cancel`, `help`, `next`, `no`, `pause`, `previous`, `repeat`, `resume`, `startOver`, `stop`, `yes`.

See official Amazon docs: [Available Built-in Intents](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/implementing-the-built-in-intents#Available Built-in Intents)

```javascript
// Use default built-in utterances
app.builtInIntent('stop', () => 'Stopping now');

// Extend built-in utterances
app.builtInIntent('stop', 'Stop now', () => 'Stopping now');
app.builtInIntent('stop', ['Stop now', 'Please stop'], () => 'Stopping now');
```

### Slots

As mentioned in [Terminology](#terminology) section - slots represent variable part of user input in utterances. To make their creation bit easier our utterances contain slot name with type. These samples are converted into common utterances recognized by Alexa and slots are included in intentSchema.

```javascript
app.intent('SlotIntent', 'My number is {num:Number}', (slots) => {
  return `Your number is ${slots.num}`;
});
```

### Custom Slots

Alexia helps you to create custom slots by specifying its `name` and `utterances`

```javascript
app.customSlot('Name', ['Arnold', 'Otto', 'Walda', 'Pete']);

app.intent('CustomSlotIntent', 'My name is {name:Name}', (slots) => {
  return `Hi ${slots.name}`;
});
```

### Session Attributes

Intent can be resolved using simple string (a text response) or more complex `responseObject`. Its attribute `attrs` will override current sessionAttributes. If you wish to extend current session attributes you can use for example `Object.assign` method. Make sure you set `end` attribute to `false` to keep the session open (default: `true`). See [Session Attributes example](examples/session-attributes.js). Session attribute `previousIntent` is reserved.

```javascript
app.intent('AttrsIntent', 'session attributes test', (slots, attrs) => {
  return {
    text: 'Alexa response text here',
    attrs: {
      attr1: 'Whatever to be remebered in this session'
    },
    end: false
  };
});
```

### Cards

To display card in Alexa app add configuration to responseObject `card` property

```javascript
app.intent('CardsIntent', 'Whats in shopping cart', () => {
  return {
    text: 'Your shopping cart contains Amazon Echo Device and 2 more items. To see the full list check out your Alexa app',
    card: {
      title: 'Shopping cart',
      content: 'You shopping cart contains: Amazon Echo, Amazon Tap, Echo Dot'
    }
  };
});
```

### Reprompt

To add reprompt text to your response add `reprompt` string value to responseObject

```javascript
app.intent('RepromptIntent', 'Send email to Mom', () => {
  return {
    text: 'What is the text of your message',
    reprompt: 'Sorry I did not catch it. What is the text of your message'
  };
});
```

### SSML

Use SSML to create more complex text responses. Just set the `ssml` parameter of responseObject to `true` and enter `SSML` into `text` property. See official Amazon docs: [Speech Synthesis Markup Language](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference)

```javascript
app.intent('SSMLIntent', 'what are the digits of number {num:Number}', (slots) => {
  return `<say-as interpret-as="digits">${number}</say-as>`
});
```

### Read Original Request Data

You can access the original Amazon request data from third parameter of handler. See example below.

```javascript
app.intent('OriginalRequestData', 'read original request data', (slots, attrs, data) => {
  console.log('userId', data.session.user.userId);
  return 'Hi';
});
```

### Asynch Intent Handling

For asynchronous intent handling add fourth parameter to your handler callback and call it when your response is ready. The response structure is identical to responseObject.

```javascript
app.intent('AsyncIntent', 'Search for something in database', (slots, attrs, data, done) => {
  setTimeout(() => {
    done('Work complete');
  }, 120);
});
```

### Generate Speech Assets

To minimize manual work needed while deploying your Alexa skills you can use our speechAssets generator. This helps you to create `intentSchema`, `sampleUtterances` and `customSlots` for your apps.

Speech assets consists of:
  - **intentSchema** - array of intents with slots
  - **utterances** - phrases that are used to invoke intents
  - **customSlots** - custom slot types with samples


 For more information see [interaction model reference](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference)

```javascript
const speechAssets = app.speechAssets(); // object
console.log(speechAssets.toString()); // stringified version - f.e. copy paste from console
```

### Save Speech Assets To Directory

If you want to use your assets (`intentSchema`, `sampleUtterances` and `customSlots`) later and have them stored, this function will do it for you. You can pass the name of your directory or leave it empty which defaults to `/speechAssets`.

Directory structure looks like this:
```
├── speechAssets
    ├── intentSchema.json
    ├── utterances.txt
    └── customSlots
        ├── Name.txt
        ├── Age.txt
        ...
```

```javascript
app.saveSpeechAssets('speechAssets'); // No argument leads to default value 'speechAssets'
```

### Register Intents using pattern matching

If your intents are located in separate files you need to register them to the app. One way how to do this is to wrap intent into function taking `app` as a parameter.

**src/intents/hello-intent.js**

```javascript
module.exports = app => app.intent('HelloIntent', 'hello', () => {
  return 'Hello';
});
```

Next you need to register it by importing it manually and supplying the `app` as a parameter.

You can also use our shorthand function for finding and registering all intents files that match pattern. See [node-glob](https://github.com/isaacs/node-glob) for more pattern matching examples.

**src/app.js**

```javascript
app.registerIntents('src/intents/*-intent.js');
```

### Actions

Feature of Alexia that helps you to control flow of the intents. To understand it easier see the code below.

By defining the action you enable transition from one intent to another. When no actions are specified, every intent transition is allowed.

Action properties `from` and `to` can be defined as `string` (one intent), `array` (multiple intents) or `'*'` (all intents).

Each action could have condition to check whether the transition should be handled or the fail method should be invoked. If no fail method is defined `app.defaultActionFail()` is invoked when condition of handling is not met or the action (transition) is not defined.

```javascript
// Allow transition from any intent to `intent1`.
app.action({
  from: '*',
  to: 'intent1'
});

// Allow transition from `@start` intent to `intent2`.
app.action({
  from: '@start',
  to: 'intent2'
});

// Allow transition from `intent1` to `intent2` if condition is met using custom fail handler
app.action({
  from: 'intent1',
  to: 'intent2',
  if: (slots, attrs) => slots.pin === 1234,
  fail: (slots, attrs) => 'Sorry, your pin is invalid'
});

// Allow transition from `intent2` to `intent3` and also `intent4`.
app.action({
  from: 'intent2',
  to: ['intent3', 'intent4']
});

// Set default fail handler
app.defaultActionFail(() => 'Sorry, your request is invalid');
```

### Localization

Alexia uses [i18next](https://github.com/i18next/i18next) for localizing response texts, utterances and custom slots.

For better understanding see localized app example: [examples/multi-language](examples/multi-language).

These are the steps required to localize your existing application:

1. Install dependencies: `npm install --save i18next i18next-node-fs-backend`
2. Initialize `i18next` instance - see [the example app](examples/multi-language/multi-language-app.js)
3. Set `i18next` instance to your app to enable localization: `app.setI18next(i18next)`
4. Create directory with all locales
5. Ommit utterances in all intents and access the translate function using `app.t('key')` 

Localized intent example:

```javascript
app.intent('LocalizedIntent', slots => {
  return app.t('text', slots);
});
```

Example `locales` directory structure:

```
locales/
├── en/                  # Directory for all en locales
│   ├── translation.js   # Translations of response texts and utterances for each intent
│   └── custom-slots.js  # Translations of custom slots
└── de/                  # Directory for all de locales ...
    ├── translation.js
    └── custom-slots.js
```

Localization notes:
- You can localize `LaunchRequest` or `SessionEndedRequest` as well. Just add the entry along the intent names in translations
- To localize built in intents, say `AMAZON.YesIntent` use entry names after the `.` suffix. So `AMAZON.YesIntent` becomes just `YesIntent`
- To access the translation use: `app.t('key')` This `key` needs to be nested in the current intent translation entry. You don't have to use the full path to the key - the prefix is automatically added depending on the current request
- Each intent translation should have `utterances` property. We support the `richUtterances` syntax f.e: `My age is {age:Number}`
- The locale to be used is decided depending on the `data.request.locale` Its value could be currently one of: `en-US`, `en-GB`, `de-DE`

### Handling Amazon Requests

To handle Amazon requests you need to create HTTP server with POST route. You can take advantage or our API to create Hapi server so you don't have to create it manually. This requires to install `hapi` as dependency:

```
npm install hapi --save
```


```javascript
const options = {
  path: '/', // defaults to: '/'
  port: 8888 // defaults to: process.env.PORT or 8888
};
const server = app.createServer(options);
```

### Handling Amazon Requests Manually

You can create your own HTTP from scratch to handle Amazon requests manually. See below example with [Hapi](http://hapijs.com/) server

```javascript
const Hapi = require('hapi');
const server = new Hapi.Server();
const app = require('./app'); // Your app

server.connection({
  port: process.env.PORT || 8888
});

server.route({
  path: '/',
  method: 'POST',
  handler: (request, response) => {
    app.handle(request.payload, (data) => {
      response(data);
    });
  }
});

server.start((err) => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
  app.saveSpeechAssets();
});
```

## Deploy

### Heroku

 1. Create free [Heroku](https://www.heroku.com) acount
 2. Install [Heroku toolbelt](https://toolbelt.heroku.com/)
 3. Be sure to have `start` script defined in `package.json`
 4. Be sure to create server handler on POST endpoint. See [Handling Amazon Requests](#handling-amazon-requests)
 5. Run `git init` if git was not yet initialized in your project
 6. Run `heroku create` in project directory
 7. Run `git push heroku master`
 8. Copy your server URL to your Alexa Skill configuration. See [Create Alexa Skill](#create-alexa-skill)

### AWS Lambda

1. Create account and login to [AWS Console](https://console.aws.amazon.com/console)
2. Create new Lambda function
3. Set function invocation to `index.handler`
4. Add Alexa Skills Kit trigger
5. Export `handler` in your index.js file
6. Upload zipped project folder into AWS Lambda
7. Copy Lambda function ARN to your Alexa Skill configuration

```javascript
exports.handler = (event, context, callback) => {
  app.handle(event, data => {
    callback(null, data);
  });
};
```

## Create Alexa skill

- Login to your [Amazon developer account](https://developer.amazon.com)
- Select Apps & Services
- Select Alexa
- Select Alexa Skills Kit
- Add a new Skill
- Set skill info required to run app:

  **Skill Information**
    - Name: Name of your app, can be whatever
    - Invocation Name: Short phrase or abbreviation of your app name. Will be used to start your app by saying: `Alexa, start MyApp` if your invocation name is `MyApp`

  **Interaction model**
    - Use our speech assets generator `app.saveSpeechAssets()` to generate and save speech assets to `speechAssets` directory
    - Custom Slot Types: Click `Add Slot Type`
        - Type: name of custom slot type
        - Values: contents of `speechAssets/customSlots/**` or enter custom slot samples manually
        - Do this for each custom slot
    - Intent Schema: enter contents of `speechAssets/intentSchema.json`
    - Sample Utterances: enter contents of `speechAssets/sampleUtterances.txt`

  **Configuration**
    - Endpoint: select HTTPS and enter url or your publicly accesible server

  **SSL Certificate**
    - Select what applies to your SSL certificate
    - Could remain unselected when no certificate is required

  **Test**
    - Enable skill testing on this account
    - Enter one of your utterances and click `Ask MyApp`

## Testing

### Device Testing

- Connect to your Amazon Echo device using the same developer account where you created skill
- Enable application for testing
- Say `Alexa, start <myApp>`

### Echoism.io (Online Simulator)

- Open [Echoism.io](https://echosim.io/)
- Login with your Amazon developer account
- Interact with Alexa simulator

### Unit Testing

Each application should be unit-tested. We are exposing simple API helping you to create sample Alexa requests for testing and debugging.

```javascript
alexia.createRequest({
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
});
```

All the properties optional and defaults to the values you see in the example above. Sample usage:

```javascript
alexia.createRequest({type: 'IntentRequest', name: 'HelloIntent', slots: ..., attrs: ...});
alexia.createIntentRequest('HelloIntent', slots, attrs, isNew, appId); // Shorter version - does not support all of the properties
```

Before writing unit tests make sure to install all the dependencies. In our example we will be using mocha and chai with expect.

```bash
npm install mocha chai expect --save-dev
```

Example below illustrates simple unit testing for intentRequest. Testing of launchRequest or sessionEndedRequest would look the same

```javascript
const expect = require('chai').expect;
const alexia = require('alexia');
const app = require('./path-to-app.js');

// Create sample requests
const launchRequest = alexia.createLaunchRequest();
const sessionEndedRequest = alexia.createSessionEndedRequest();
const intentRequest = alexia.createIntentRequest('MyIntent');

// Sample MyIntent test suite
describe('(Intent) MyIntent', () => {
  it('should handle MyIntent', done => {

    // Simulate Alexa request handling
    app.handle(intentRequest, response => {
      
      // Test the response
      expect(response).to.be.defined;
      done();
    });
  });
});
```

## Debugging

We are using [debug](https://github.com/visionmedia/debug) package to debug our alexia applications. To start application in debug mode export environment variable `DEBUG`

Examples:

- `DEBUG=alexia:info` - print only info logs
- `DEBUG=alexia:debug` - print only debug logs
- `DEBUG=alexia:*` - print all logs

To start your app with info logs run in terminal:

```bash
DEBUG=alexia:info npm start
```

## Scripts

- `npm test` - run unit tests
- `npm test:dev` - run unit tests in development mode using nodemon as watcher
- `npm run lint` - run eslint
- `npm run lint:fix` - run eslint and automatically fix problems
- `npm run toc` - update TOC in README.md

## Contributing

Alexia is an open source project and we encourage contributions. Please make sure to cover your code with unit tests.

After updating README.md please run: `npm run toc`

For more information refer to general guide [Contributing to Open Source](https://guides.github.com/activities/contributing-to-open-source/)

## License

[MIT](LICENSE)

  [npm-image]: https://img.shields.io/npm/v/alexia.svg
  [npm-url]: https://npmjs.org/package/alexia
  [travis-image]: https://img.shields.io/travis/Accenture/alexia/master.svg
  [travis-url]: https://travis-ci.org/Accenture/alexia
  [coveralls-image]: https://coveralls.io/repos/github/Accenture/alexia/badge.svg?branch=master
  [coveralls-url]: https://coveralls.io/github/Accenture/alexia?branch=master
