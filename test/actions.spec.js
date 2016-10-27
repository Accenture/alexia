'use strict';
const expect = require('chai').expect;
const app = require('./test-apps/actions-app');
const createRequest = require('../src/create-request');

describe('action app handler', () => {
    let attrs;

    it('should handle IntentA and remember previousIntent', () => {
        const request = createRequest.intentRequest('IntentA', null, null, true);
        app.handle(request, (response) => {
            attrs = response.sessionAttributes;
            expect(response).to.be.defined;
            expect(response.sessionAttributes.previousIntent).to.equal('IntentA');
        });
    });

    it('should handle IntentB and remember previousIntent', () => {
        const request = createRequest.intentRequest('IntentB', null, attrs);
        app.handle(request, (response) => {
            expect(response).to.be.defined;
            expect(response.sessionAttributes.previousIntent).to.equal('IntentB');
        });
    });

    it('should not handle IntentB again', () => {
        const request = createRequest.intentRequest('IntentB', null, attrs);
        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).to.equal('Sorry, your command is invalid');
        });
    });

    it('should not handle IntentB again with defaultActionFail', () => {
        const request = createRequest.intentRequest('IntentB', null, attrs);
        app.defaultActionFail(() => 'Sry bye');
        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).to.equal('Sry bye');
        });
    });

    it('should not handle IntentB -> IntentC', () => {
        const request = createRequest.intentRequest('IntentC', null, attrs);
        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).to.equal('Could not handle request');
        });
    });

    it('should not handle IntentB -> IntentD', () => {
        const request = createRequest.intentRequest('IntentD', null, attrs);
        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).to.equal('Sry bye');
        });
    });

    it('should handle async IntentE with session attributes', () => {
        const request = createRequest.intentRequest('IntentE', null, attrs);
        app.handle(request, (response) => {
            expect(response.sessionAttributes).to.deep.equal({
                previousIntent: 'IntentE',
                foo: true
            });
        });
    });
});
