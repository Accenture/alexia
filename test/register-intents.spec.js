'use strict';
const expect = require('chai').expect;
const alexia = require('../');

describe('registerIntents', () => {

  let app;

  beforeEach(() => {
    app = alexia.createApp();
  });

  it('should register all intents maching pattern', () => {
    app.registerIntents('test/test-apps/separate-intents/*-intent.js');
    expect(Object.keys(app.intents)).to.have.length(2);
  });

  it('should register no intents if pattern is wrong', () => {
    app.registerIntents('not-found/*-intent.js');
    expect(Object.keys(app.intents)).to.have.length(0);
  });

});
