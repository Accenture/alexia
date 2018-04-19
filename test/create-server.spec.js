'use strict';
const expect = require('chai').expect;
const alexia = require('..');
const sinon = require('sinon');
const request = require('request');

describe('server', () => {
  let app;
  const mockRequest = {
    someRequest: 1
  };
  const mockResponse = {
    someResponse: 2
  };
  const createRequestOptions = (uri) => ({
    uri: uri,
    method: 'POST',
    json: mockRequest
  });

  beforeEach(() => {
    app = alexia.createApp('MyApp');
    sinon.stub(app, 'handle', (requestObject, done) => {
      // ... responseObject in lib generated
      done(mockResponse);
    });
  });

  afterEach(() => {
    app.handle.restore();
  });

  it('should ensure expected route is defined on Hapi server', (done) => {
    const server = app.createServer({
      path: '/skill'
    });

    server.inject({
      url: '/skill',
      method: 'POST',
      payload: mockRequest
    })
    .then(response => {
      expect(response.statusCode).to.deep.equal(200);
      expect(response.headers).to.contain.keys('content-type', 'content-length');
      expect(JSON.parse(response.payload)).to.deep.equal(mockResponse);
    })
    .then(() => done())
    .catch(done);

  });

  it('should create working Hapi server', (done) => {
    const server = app.createServer();

    server.start()
      .then(() => {
        // Send POST request to server
        request(createRequestOptions(server.info.uri), (requestError, response) => {
          expect(requestError).to.be.not.ok;
          expect(response.body).to.deep.equal(mockResponse);
          expect(response.statusCode === 200);
        });
      })
      .then(() => server.stop())
      .then(() => done())
      .catch(done);
  });

});
