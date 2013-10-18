var path = require('path')
  , url = require('url')
  , Route = require('./route');

var router = {

  delete: function (path, responder) {
    this.register('DELETE', path, responder);
  },

  get: function (path, responder) {
    this.register('GET', path, responder);
  },

  post: function (path, responder) {
    this.register('POST', path, responder);
  },

  put: function (path, responder) {
    this.register('PUT', path, responder);
  },

  register: function (verb, path, responder) {
    verb = verb || 'GET';
    this.routes[verb].push(new Route(verb, path, responder));
  },

  routes: {
    GET: [],
    DELETE: [],
    PUT: [],
    POST: []
  }
};

exports = module.exports = router;