'use strict';
const debug = require('debug')('alexia:debug');
const info = require('debug')('alexia:info');

/**
 * Creates Hapi server with one route that handles all requests with app specified in param. Server must be started using `server.start()`
 * @param {object} app - App created using alexia.createApp(...)
 * @param {number} [options] - Server options
 * @property {number} [options.path] - Path to run server route on. Defaults to `/`
 * @property {number} [options.port] - Port to run server on. If not specified then `process.env.PORT` is used. Defaults to `8888`
 * @returns {object} server
 */
module.exports = (app, options) => {
  const Hapi = require('hapi');
  const server = new Hapi.Server();

  options = Object.assign({}, options);

  server.connection({
    port: options.port || process.env.PORT || 8888
  });

  server.route({
    path: options.path || '/',
    method: 'POST',
    handler: (request, response) => {
      app.handle(request.payload, (data) => {
        response(data);
      });
    }
  });

  info(`Server created on URI: "${server.info.uri}"`);
  debug(`Server created on URI: "${server.info.uri}"`);
  return server;
};
