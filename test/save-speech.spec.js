'use strict';
const expect = require('chai').expect;
const fs = require('fs');
const rimraf = require('rimraf');
const app = require('./test-apps/basic-app');
const assetsMock = require('./mock/assets');

describe('saveSpeechAssets', () => {

  describe('defaultDirectory', () => {

    before(() => {
      rimraf.sync('speechAssets');
      fs.mkdirSync('speechAssets');
      fs.mkdirSync('speechAssets/customSlots');
      fs.writeFileSync('speechAssets/customSlots/testCustomSlot.txt', 'test');
      app.saveSpeechAssets();
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
      expect(customSlot.split('\n')).to.deep.equal(assetsMock.nameCustomSlot);
    });

    it('should not contain previously created file testCustomSlot', () => {
      expect(fs.existsSync('speechAssets/customSlots/testCustomSlot.txt')).to.equal(false);
    });

    after(() => {
      rimraf.sync('speechAssets');
    });
  });

  describe('customSpeechAssetsDirectory', () => {

    const mySpeechAssetsDirectory = 'mySpeechAssetsDirectory';

    before(done => {
      rimraf.sync(mySpeechAssetsDirectory);
      app.saveSpeechAssets(mySpeechAssetsDirectory, done);
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
