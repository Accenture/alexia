'use strict';
const _ = require('lodash');
const expect = require('chai').expect;
const app = require('./test-apps/basic-app');

describe('generateSpeechAssets', () => {
    const assets = app.generateSpeechAssets();

    it('should generate intentSchema', () => {
         expect(JSON.parse(assets.intentSchema)).to.deep.equal({
             intents: [
                {intent: 'FirstIntent'},
                {intent: 'NamedIntent'},
                {intent: 'a'},
                {intent: 'b'},
                {
                    intent: 'c',
                    slots: [{name: 'age', type: 'AMAZON.NUMBER'}]
                },
                {
                    intent: 'd',
                    slots: [{name: 'name', type: 'Name'}]
                },
                {intent: 'AMAZON.StopIntent'},
                {intent: 'AMAZON.HelpIntent'},
                {intent: 'AMAZON.CancelIntent'},
                {intent: 'IntentA'},
                {intent: 'IntentB'},
                {intent: 'e'},
             ]
         });
    });

    it('should generate sampleUtterances', () => {
        expect(assets.sampleUtterances.split('\n')).to.deep.equal([
            'FirstIntent utterance',
            'NamedIntent utteranceB',
            'NamedIntent utteranceC',
            'a utterance for intent without name',
            'b multiple',
            'b utterances',
            'c I am {age} years old',
            'd My name is {name}',
            'AMAZON.StopIntent one utterance',
            'AMAZON.HelpIntent two utterances',
            'AMAZON.HelpIntent yup',
            'IntentA another utterance',
            'IntentB another utterance',
            'e async response'
        ]);
    });

    it('should generate customSlotSamples', () => {
        expect(assets.customSlotSamples).to.deep.equal({
            Name: ['Borimir', 'Vlasto'].join('\n')
        });
    });

});