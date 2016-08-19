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
    const createRequestOptions = (uri) =>({
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

    it('should create working Hapi server', (done) => {
        const server = app.createServer(app);

        server.start(serverError => {
            expect(serverError).to.be.not.ok;

            // Send POST request to server
            request(createRequestOptions(server.info.uri), (requestError, response) => {
                expect(requestError).to.be.not.ok;
                expect(response.body).to.deep.equal(mockResponse);
                expect(response.statusCode === 200);

                done();
            });

        });

    });

});
