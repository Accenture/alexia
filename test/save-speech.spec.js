'use strict';
const expect = require('chai').expect;
const fs = require('fs');
const rimraf = require('rimraf');
const app = require('./test-apps/basic-app');
const assetsMock = require('./mock/assets');

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
        expect(JSON.parse(intentSchema)).to.deep.equal(assetsMock.intentSchema);
    });

    it('should save utterances to txt file', () => {
        const utterances = fs.readFileSync('speechAssets/utterances.txt', 'utf8');
        expect(utterances.split('\n')).to.deep.equal(assetsMock.utterances);
    });

    it('should save customSlots to separate files', () => {
        const customSlot = fs.readFileSync('speechAssets/customSlots/customSlotName.txt', 'utf8');
        expect(customSlot.split('\n')).to.deep.equal(assetsMock.customSlot);
    });

});
