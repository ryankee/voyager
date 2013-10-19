/*!
 * Module dependencies
 */
var http = require('http')
  , fs = require('fs')
  , path = require('path')
  , join = path.join
  , debug = require('debug')('voyager:application')
  , configure = require('./configure')
  , _ = require('./_')
  , voyager; // required in Application constructor

// private variables for use outside of Application.prototype.handle
var _index = 0, _middleware, _out, _req, _res;

/**
 * Core voyager class for creating a new Application
 * @param {String} config User configuration path
 */
function Application(config) {
  debug('Application constructor invoked.');

  var root = process.env.PWD;
  voyager = require('./voyager');

  // assign configurations to private voyager settings object
  voyager.bootConfig(configure(config));

  // collect/require/cache controllers
  this.controllers = (function () {
    var controllersPath = voyager('paths controllers')
      , controllers = fs.readdirSync(join(root, controllersPath))
      , obj = {};

    _.each(controllers, function (controller) {
      var name = path.basename(controller, '.js');
      obj[name] = require(join(root, controllersPath, controller));
    });
    return obj;
  }());

  // require/cache routes
  this.routes = (function () {
    var routes
      , routesPath = join(root, 'config', 'routes');
    if (voyager('paths routes')) {
      routesPath = join(root, voyager('paths routes'));
    }
    routes = require(routesPath);
    return routes;
  }());

  // collect/require/cache middleware
  this.middleware = _middleware = (function () {
    var stack = []
      , appware = voyager('middleware');
    _.each(appware, function (layer) {
      var name = Object.keys(layer)[0]
        , mw = require('./middleware/' + name)
        , opts = layer[name].options || {};
      stack.push({ handle: new mw(opts) });
    });
    return stack;
  }());

  // forbid direct use of `new Application()`
  if (Application.caller !== Application.getInstance) {
    throw new Error('This object cannot be instantiated.');
  }
};

/**
 * Cached singleton instance of Application
 * @type {Application}
 */
Application.instance = null;

/**
 * Checks for the cached instance of Application and returns it if found; if 
 * not found - creates and returns the instance.
 * @param  {String}      config User configuration path to be passed to the
 *                              Application constructor
 * @return {Application}        Instance of Application via Application.instance
 */
Application.getInstance = function (config) {
  if (this.instance === null || this.instance === undefined) {
    this.instance = new Application(config);
  }
  return this.instance;
};

/**
 * Incoming request handler; main entry point for all requests
 * @this   {GLOBAL}
 * @param  {http.ClientRequest}  req The incoming request
 * @param  {http.ServerResponse} res The response to write to
 * @param  {Function}            out The final callback ending the response
 */
Application.prototype.handle = function (req, res, out) {
  _index = 0; _req = req; _res = res; _out = out;
  next();
};

/**
 * Creates and opens a server for connections
 * @return {http.Server} via `.listen`
 */
Application.prototype.listen = function () {
  var server = http.createServer(this.handle);
  return server.listen.apply(server, arguments);
};

function next(err) {
  var layer = _middleware[_index]
    , arity;

  _index += 1;

  // completed middleware stack
  if (!layer) {
    if (_out) _out(err);
    if (err) {
      _res.end();
    } else if (_res.headersSent) {
      _res.end();
    } else {
      _res.statusCode = 404;
      _res.setHeader('Content-Type', 'text/html');
      _res.end('404 not found');
    }
    return;
  }

  arity = layer.handle.length;

  if (err && arity === 4) {
    layer.handle(err, _req, _res, next);
  } else if (err && arity < 4) {
    next(err);
  } else if (!err && arity < 4) {
    layer.handle(_req, _res, next);
  } else {
    next();
  }
}

exports = module.exports = Application.getInstance;
