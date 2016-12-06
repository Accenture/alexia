'use strict';
const expect = require('chai').expect;
const alexia = require('..');
const app = require('./test-apps/multi-language/multi-language-app');

describe('multi language app', () => {
  it('should create app', () => {
    expect(app).to.be.ok;
  });

  it('should handle Localized LaunchRequest for locale: en', done => {
    const request = alexia.createRequest({
      type: 'LaunchRequest',
      locale: 'en-US'
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Welcome');
      done();
    });
  });

  it('should handle Localized LaunchRequest for locale: de', done => {
    const request = alexia.createRequest({
      type: 'LaunchRequest',
      locale: 'de-DE'
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Willkommen');
      done();
    });
  });

  it('should handle LocalizedIntent for locale: en', done => {
    const request = alexia.createRequest({
      name: 'LocalizedIntent',
      locale: 'en-US'
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Hello World');
      done();
    });
  });

  it('should handle LocalizedIntent for locale: de', done => {
    const request = alexia.createRequest({
      name: 'LocalizedIntent',
      locale: 'de-DE'
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Hallo Welt');
      done();
    });
  });

  it('should handle LocalizedIntent without locale (backwards compatibility)', done => {
    const request = alexia.createRequest({
      name: 'LocalizedIntent'
    });
    delete request.request.locale;

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Hello World');
      done();
    });
  });

  it('should have access to app.t function for all apps', (done) => {
    // This app is not localized
    const app2 = alexia.createApp();

    app2.intent('SomeIntent', () => {
      // Should be using fallback `.t` function
      return app2.t('something.is.wrong');
    });

    const request = alexia.createIntentRequest('SomeIntent');

    app2.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('something.is.wrong');
      done();
    });
  });

  it('handle LocalizedSlotIntent', (done) => {
    const request = alexia.createRequest({
      name: 'LocalizedSlotIntent',
      slots: {
        number: 7
      }
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('hello 7');
      done();
    });
  });

  it('handle localized built in intent', (done) => {
    const request = alexia.createRequest({
      name: 'AMAZON.YesIntent',
      locale: 'de-DE'
    });

    app.handle(request, data => {
      expect(data.response.outputSpeech.text).to.equal('Testen der Punktsyntax');
      done();
    });
  });

  it('should save localized speech assets', (done) => {
    // Note: the testing app is missing custom-slots definition for `de` locale on purpose
    app.saveSpeechAssets('speechAssets', done);
  });

});
