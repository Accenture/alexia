'use strict';
const expect = require('chai').expect;
const app = require('./test-apps/basic-app');
const fs = require('fs');
const rimraf = require('rimraf');

describe('saveSpeechAssetsToDirectory', () => {

    before((done) => {
        fs.stat('speechAssets', (err, stat) => {
            if (stat) {
                rimraf.sync('speechAssets');
            }

            app.saveSpeechAssets();
            done();
        });
    });

    it('should save intentSchema to JSON file', () => {
        const intentSchema = fs.readFileSync('speechAssets/intentSchema.json', 'utf8');
        expect(JSON.parse(intentSchema)).to.deep.equal({
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

    it('should save utterances to txt file', () => {
        const utterances = fs.readFileSync('speechAssets/utterances.txt', 'utf8');
        expect(utterances.split('\n')).to.deep.equal([
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

    it('should save customSlots to separate files', () => {
        const customSlot = fs.readFileSync('speechAssets/customSlots/customSlotName.txt', 'utf8');
        expect(customSlot.split('\n')).to.deep.equal(['Borimir', 'Vlasto']);
    });

});
