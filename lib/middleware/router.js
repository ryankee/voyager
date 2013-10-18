/**
 * Module dependencies
 */
var path = require('path')
  , voyager = require('../voyager')
  , app;

function Router(options) {
  this.options = options || {};
  return this.handle.bind(this);
}

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