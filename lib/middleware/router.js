/*!
 * Module dependencies
 */
var path = require('path')
  , debug = require('debug')('voyager:middleware:router')
  , voyager = require('../voyager')
  , app;

/**
 * Router middleware: matches request url to <controller#action> 
 * @param= {Object} options Initialization options
 * @return {Function}       The handler method
 */
function Router(options) {
  this.options = options || {};
  return this.handle.bind(this);
}

/**
 * The handle method returned in the Router constructor; handles incoming
 * requests and pairs them with a matched controller and action.
 * @this   {Router}
 * @param  {http.ClientRequest}   req  The incoming request
 * @param  {http.ServerResponse}  res  The response to write to
 * @param  {Function}             next Callback triggering next middleware layer
 */
Router.prototype.handle = function router(req, res, next) {
  debug('handling %s ...', req.url);
  app = require(path.join(voyager('root'), 'app'));
  var routes = app.routes[req.method || 'GET']
    , len = routes.length
    , i = 0;

  for (i; i < len; i += 1) {
    var found = routes[i].pattern.exec(req.url);
    if (found) {
      debug('found matching controller/action');
      try {
        app.controllers[routes[i].controller][routes[i].action](found[1], req, res);
      } catch (err) {
        next(err);
      }
    } else {
      debug('CONTROLLER/ACTION NOT FOUND!');
    }
  }
  next();
};

exports = module.exports = Router;