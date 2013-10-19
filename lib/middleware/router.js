/*!
 * Module dependencies
 */
var path = require('path')
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
  app = require(path.join(voyager('root'), 'app'));
  var routes = app.routes[req.method || 'GET']
    , len = routes.length
    , i = 0;

  for (i; i < len; i += 1) {
    var found = routes[i].pattern.exec(req.url);
    if (found) {
      app.controllers[routes[i].controller][routes[i].action](found[1], req, res);
    }
  }
  next();
};

exports = module.exports = Router;