'use strict';
const expect = require('chai').expect;
const app = require('./test-apps/contacts-app');
const alexia = require('..');

describe('action app handler', () => {

  it('should handle OpenContactList -> NewContact and return  correct outputSpeech', () => {
    const request = alexia.createIntentRequest('NewContact', null, {previousIntent: 'OpenContactList'});
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Please insert value for name or phone number of contact.');
    });
  });

  it('should handle NewContact -> SetName and return  correct outputSpeech', () => {
    const request = alexia.createIntentRequest('SetName', null, {previousIntent: 'NewContact'});
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Name was saved.');
    });
  });

  it('should handle SetName -> CloseContactList and return  correct outputSpeech', () => {
    const request = alexia.createIntentRequest('CloseContactList', null, {previousIntent: 'SetName'});
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('See you next time.');
    });
  });

  it('should not handle OpenContactList -> SetName and return  correct outputSpeech', () => {
    const request = alexia.createIntentRequest('SetName', null, {previousIntent: 'OpenContactList'});
    app.handle(request, (response) => {
      expect(response.response.outputSpeech.text).to.equal('Sorry, your command is invalid');
    });
  });

});