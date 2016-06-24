![Alexia](alexia-logo.png "Alexia")

A Framework for creating Amazon Echo (Alexa) skills using Node.js

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]
  [![Coverage Status][coveralls-image]][coveralls-url]

```javascript
const alexia = require('alexia');
const app = alexia.createApp('HelloWorldApp');

app.intent('HelloIntent', 'Hello', () => {
    return 'Hello from Alexia app';
});
```

## Installation

`npm install alexia --save`

## Overview

Alexia helps you to write Amazon Echo skills using Node.js. This framework handles Amazon Echo requests and automatically calls intents in your application. See the [Features and Samples](#features-and-samples)

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
const app = alexia.createApp('MyApp')
```

### Create Intents

You have multiple options for creating intents. You can create named intents, intents with automatically generated name or intents with multiple sample utterances.

```javascript
// Named intent
app.intent('MyIntent', 'Hello Alexa my name is Michael', () => 'Hi Michael');

// Generated intent name
app.intent(null, 'Hello Alexa what is in my calendar for today', () => 'Your calendar is empty. Enjoy');

// Intent with more utterances
app.intent('AnotherIntent', ['Hello', 'Hi', 'Whats up'], () => 'Hello yourself');
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

Intent can be resolved using simple string (a text response) or more complex `responseObject`. Its attribute `attrs` will override current sessionAttributes. If you wish to extend current session attributes you can use for example `Object.assign` method. Make sure you set `end` attribute to `false` to keep the session open (default: `true`). See [Session Attributes example](examples/session-attributes.js)

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
        text: 'Your shopping card contains Amazon Echo Device and 2 more items. To see the full list check out your Alexa app',
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
app.intent('RepromptIntent', 'Send emai to Mom', () => {
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

### Asynch Intent Handling

For asynchronous intent handling add third parameter to your handler callback and call it when your response is ready. The response structure is identical to responseObject

```javascript
app.intent('AsyncIntent', 'Search for something in database', (slots, attrs, done) => {
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

### Handling Amazon Requests

To handle Amazon requests you need to create HTTP server with POST route. See below example with [Hapi](http://hapijs.com/) server

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

    const speechAssets = app.speechAssets();
    console.log(speechAssets.toString());
});
```

### Actions

Feature of Alexia that helps you to control flow of the intents. To understand it easier see the code below.

By defining the action you enable transition from one intent to another. When no actions are specified, every intent transition is allowed.

Each action could have condition to check whether the transition should be handled or the fail method should be invoked. If no fail method is defined `app.defaultActionFail()` is invoked when condition of handling is not met or the action (transition) is not defined.

```javascript
// Allow transition from any intent to `intent1`.
app.action({
    from: '*',
    to: 'intent1'
});

// Allow transition from start intent to `intent2`.
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

// Set default fail handler
app.defaultActionFail(() => 'Sorry, your request is invalid');
```

## Testing

### Deploy

- Implement server handler on POST endpoint. See [Handling Amazon Requests](#handling-amazon-requests)
- Deploy application on public secured endpoint. For example:
    - [Heroku](https://www.heroku.com)
    - [AWS](https://aws.amazon.com)

### Create skill

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
    - Use our generator `assets = app.generateSpeechAssets()` to generate speech assets
    - Custom Slot Types: Click `Add Slot Type`
        - Type: name of custom slot type
        - Values: contents assets.customSlots.myCustomSlot or enter custom slot samples manually
        - Do this for each custom slot
    - Intent Schema: enter value of `assets.intentSchema`
    - Sample Utterances: enter value of `assets.sampleUtterances`

  **Configuration**
    - Endpoint: select HTTPS and enter url or your publicly accesible server

  **SSL Certificate**
    - Select what applies to your SSL certificate
    - Could remain unselected when no certificate is required

  **Test**
    - Enable skill testing on this account
    - Enter one of your utterances and click `Ask MyApp`

### Device Testing

- Connect to your Amazon Echo device using the same developer account where you created skill
- Enable application for testing
- Say `Alexa, start <myApp>`

### Echoism.io (Online Simulator)

- Open [Echoism.io](https://echosim.io/)
- Login with your Amazon developer account
- Interact with Alexa simulator

### Unit Testing

Each application should be unit-tested. We are exposing simple API helping you to create sample Alexa requests for testing and debugging

```javascript
const app = require('./path-to-your-app');

// Create sample requests
const launchRequest = alexia.createLaunchRequest();
const sessionEndedRequest = alexia.createSessionEndedRequest();
const intentRequest = alexia.createIntentRequest('MyIntent');

// Simulate request handling
app.handle(launchRequest, (response) => {

    // Test the response
    expect(response).to.be.defined;
});
```

## Next Plan

- Generate API documentation
- Add API to save speechAssets to file
- Add more cards options (images etc.)
- Merge session attributes automatically
- Advanced error handling
- Logging
- Add more sophisticated request creator for unit testing

## Scripts

- `npm test` - run unit tests
- `npm test:dev` - run unit tests in development mode using nodemon as watcher
- `npm run lint` - run eslint
- `npm run lint:fix` - run eslint and automatically fix problems

## Contributing

Alexia is an open source project and we encourage contributions. Please make sure to cover your code with unit tests

For more information refer to general guide [Contributing to Open Source](https://guides.github.com/activities/contributing-to-open-source/)

## License

[MIT](LICENSE)

  [npm-image]: https://img.shields.io/npm/v/alexia.svg
  [npm-url]: https://npmjs.org/package/alexia
  [travis-image]: https://img.shields.io/travis/Accenture/alexia/master.svg
  [travis-url]: https://travis-ci.org/Accenture/alexia
  [coveralls-image]: https://coveralls.io/repos/github/Accenture/alexia/badge.svg?branch=master
  [coveralls-url]: https://coveralls.io/github/Accenture/alexia?branch=master
