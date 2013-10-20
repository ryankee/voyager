/*!
 * Module dependencies
 */
var path = require('path')
  , url = require('url')
  , debug = require('debug')('voyager:middleware:static_server')
  , send = require('send')
  , voyager = require('../voyager')
  , _ = voyager._;

// private variables for use outside of StaticServer.prototype.handle
var _req, _res, _next, _pathname, _pause, _redirect;

/**
 * StaticServer middleware: serves static files such as css, javascript, images
 * @param= {Object} options Initialization options
 * @return {Function}       The handler method
 */
function StaticServer(options) {
  this.options = options || {};
  if (!this.options.root || typeof this.options.root === 'undefined') {
    throw new Error('StaticServer requires a root path');
  }
  this.options.root = path.join(voyager('root'), this.options.root);
  _redirect = this.options.redirect || false;
  return this.handle.bind(this);
}

/**
 * The handle method returned in the StaticServer constructor, handles incoming
 * requests to static files from the server.
 * @this   {StaticServer}
 * @param  {http.ClientRequest}  req  The incoming request
 * @param  {http.ServerResponse} res  The response to write to
 * @param  {Function}            next Callback triggering next middleware layer
 */
StaticServer.prototype.handle = function static_server(req, res, next) {
  debug('attempting to handle %s', req.url);
  _req = req; _res = res; _next = next;
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  _pathname = url.parse(req.url).pathname;
  _pause = _.pause(req);
  send(req, _pathname)
    .maxage(this.options.maxAge || 0)
    .root(this.options.root)
    .index(this.options.index || 'index.html')
    .hidden(this.options.hidden)
    .on('error', onError)
    .on('directory', onDirectory)
    .pipe(res);
  debug('response will end if no error.');
};

/**
 * `send` 'directory' event handler
 * @private
 */
function onDirectory() {
  if (!_redirect) return resume();
  var target = url.format(_pathname + '/');
  _res.statusCode = 303;
  _res.setHeader('Location', target);
  _res.end('Redirecting to ' + _.escape(target));
}

/**
 * `send` 'error' event handler
 * @private
 * @param  {Error} err
 */
function onError(err) {
  debug('error: %s', err.status);
  if (err.status === 404) return resume();
  _next(err);
}

/**
 * Emit default events and continue to next middleware layer
 * @private
 */
function resume() {
  _next();
  _pause.resume();
}

exports = module.exports = StaticServer;
