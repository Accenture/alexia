'use strict';
const expect = require('chai').expect;
const app = require('./test-apps/basic-app');
const assetsMock = require('./mock/assets');

describe('generateSpeechAssets', () => {
  const assets = app.speechAssets();

  it('should generate intentSchema', () => {
    expect(JSON.parse(assets.intentSchema)).to.deep.equal(assetsMock.intentSchema);
  });

  it('should generate utterances', () => {
    expect(assets.utterances.split('\n')).to.deep.equal(assetsMock.utterances);
  });

  it('should generate customSlots', () => {
    expect(assets.customSlots).to.deep.equal({
      Name: assetsMock.customSlot
    });
  });

  it('should generate stringified speechAssets', () => {
    const stringifiedAssets = assets.toString();

    expect(typeof stringifiedAssets).to.equal('string');
    expect(stringifiedAssets.split('\n\n').length).to.equal(4);
  });

});
