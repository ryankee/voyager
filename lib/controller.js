/**
 * Module dependencies
 */

var url = require('url')
  , path = require('path')
  , voyager;

var Controller = function Controller() {
  voyager = require('./voyager');
  this.engine = voyager('view_engine');
  this.request = null;
  this.response = null;
};

Controller.prototype.handle = function(func) {
  this[func.name] = function () {
    var args = Array.prototype.slice.call(arguments)
      , len = args.length
      , _params
      , _param = len > 2 ? args[0] : null;

    this.request = args[len - 2];
    this.response = args[len - 1];
    this.params = url.parse(this.request.url, true).query;

    func.call(this, _param);
  };
};

Controller.prototype.render = function (view, payload) {
  payload = payload || {};
  view = path.join(voyager('root'), voyager('paths views'), view);
  this.engine.renderFile(view, payload, function (err, content) {
    this.response.write(content);
  }.bind(this));
};

exports = module.exports = Controller;