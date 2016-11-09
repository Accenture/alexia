'use strict';
const expect = require('chai').expect;
const fs = require('fs');
const rimraf = require('rimraf');
const app = require('./test-apps/basic-app');
const assetsMock = require('./mock/assets');

describe('saveSpeechAssets', () => {

  function saveAssets (done, actualDirectory, paramDirectory) {
    fs.stat(actualDirectory, (_err, stat) => {
      if (stat) {
        rimraf.sync(actualDirectory);
      }

      app.saveSpeechAssets(paramDirectory);
      done();
    });
  }

  describe('defaultDirectory', () => {

    before(done => {
      saveAssets(done, 'speechAssets', undefined);
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
      const customSlot = fs.readFileSync('speechAssets/customSlots/Name.txt', 'utf8');
      expect(customSlot.split('\n')).to.deep.equal(assetsMock.customSlot);
    });
  });

  describe('customSpeechAssetsDirectory', () => {

    const mySpeechAssetsDirectory = 'mySpeechAssetsDirectory';

    before(done => {
      saveAssets(done, mySpeechAssetsDirectory, mySpeechAssetsDirectory);
    });

    it('should save speechAssets to customDirectory ', () => {
      const intentSchema = fs.readFileSync(mySpeechAssetsDirectory + '/intentSchema.json', 'utf8');
      expect(JSON.parse(intentSchema)).to.deep.equal(assetsMock.intentSchema);
    });

    after(() => {
      rimraf.sync(mySpeechAssetsDirectory);
    });
  });

});
