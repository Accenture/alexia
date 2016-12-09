'use strict';
const expect = require('chai').expect;
const app = require('./test-apps/actions-app');
const alexia = require('..');

describe('action app handler', () => {
  let attrs;

  it('should handle IntentA and remember previousIntent', (done) => {
    const request = alexia.createIntentRequest('IntentA', null, null, true);
    app.handle(request, (response) => {
      attrs = response.sessionAttributes;
      expect(response).to.be.defined;
      expect(response.sessionAttributes.previousIntent).to.equal('IntentA');
      done();
    });
  });

  it('should handle IntentB and remember previousIntent', (done) => {
    // console.log(attrs)
    const request = alexia.createIntentRequest('IntentB', null, attrs);
    app.handle(request, (response) => {
      expect(response).to.be.defined;
      expect(response.sessionAttributes.previousIntent).to.equal('IntentB');
      done();
    });
  });

  it('should not handle nonexistent intent and throw error', () => {
    const request = alexia.createIntentRequest('IntentZ', null, attrs);
    try {
      app.handle(request);
    } catch (e) {
      expect(e).to.include('Nonexistent intent: \'IntentZ\'');
    }
  });

  it('should not handle IntentB again', (done) => {
    const request = alexia.createIntentRequest('IntentB', null, attrs);
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Sorry, your command is invalid');
      done();
    });
  });

  it('should not handle IntentB again with defaultActionFail', (done) => {
    const request = alexia.createIntentRequest('IntentB', null, attrs);
    app.defaultActionFail(() => 'Sry bye');
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Sry bye');
      done();
    });
  });

  it('should not handle IntentB -> IntentC', (done) => {
    const request = alexia.createIntentRequest('IntentC', null, attrs);
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Could not handle request');
      done();
    });
  });

  it('should not handle IntentB -> IntentD', (done) => {
    const request = alexia.createIntentRequest('IntentD', null, attrs);
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Sry bye');
      done();
    });
  });

  it('should handle async IntentE with session attributes', (done) => {
    const request = alexia.createIntentRequest('IntentE', null, attrs);
    app.handle(request, (response) => {
      expect(response.sessionAttributes).to.deep.equal({
        previousIntent: 'IntentE',
        foo: true
      });
      done();
    });
  });

  it('should handle Intent and not update previousIntent if responseObject.error is true', (done) => {
    const app2 = alexia.createApp();
    app2.intent('Intent', () => {
      return {
        text: 'Some error occured',
        error: true
      };
    });
    const anotherAttrs = {
      previousIntent: 'SomeIntent'
    };
    const request = alexia.createIntentRequest('Intent', null, anotherAttrs);
    app2.handle(request, (response) => {
      expect(response.sessionAttributes.previousIntent).to.equal('SomeIntent');
      done();
    });
  });

  it('should handle Intent and override previousIntent', (done) => {
    const app2 = alexia.createApp();
    app2.intent('Intent', () => {
      return {
        text: 'Hello, World',
        attrs: {
          previousIntent: 'MyCustomValue'
        }
      };
    });
    const request = alexia.createIntentRequest('Intent');
    app2.handle(request, (response) => {
      expect(response.sessionAttributes.previousIntent).to.equal('MyCustomValue');
      done();
    });
  });
});
