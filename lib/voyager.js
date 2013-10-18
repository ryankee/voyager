var voyager = function voyager() {

  var _settings = {}
    , _set = false;

  var self = function (key) {
    var keys = key.split(' ')
      , len = keys.length
      , i = 1
      , setting = _settings[keys[0]];

    if (typeof setting === 'undefined') return null;

    for (i; i < len; i += 1) {
      setting = setting[keys[i]];
      if (typeof setting === 'undefined') return null;
    }
    
    return setting;
  };

  self.application = require('./application');
  self.Controller = require('./controller');
  self.router = require('./router');
  self.View = require('./view');
  self._ = require('./_');

  self.bootConfig = function (config) {
    if (_set) return false;
    _set = true;
    _settings = config;
  };

  return self;
}();

exports = module.exports = voyager;
