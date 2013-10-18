var join = require('path').join
  , _ = require('./_');

var defaults = {

  middleware: [{
    logger: { options: {} }
  }, {
    static_server: {
      options: {
        root: '/public'
      }
    }
  }, {
    router: { options: {} }
  }, {
    error_handler: { options: {} }
  }],

  paths: {
    controllers: '/app/controllers',
    views: '/app/views'
  },

  view_engine: require('ejs')
};

var configure = function configure(appConfig) {
  if (this.configured) return;
  appConfig = appConfig || join(process.env.PWD, 'config', 'application');
  appConfig = require(appConfig);
  _.each(defaults, function (def, key) {
    if (key === 'middleware') {
      appConfig[key] = appConfig[key] || [];
      appConfig[key].unshift(def.shift());
      appConfig[key] = appConfig[key].concat(def);
  } else if (typeof def === 'object') {
      if (typeof appConfig[key] === 'undefined') {
        appConfig[key] = {};
      }
      _.each(def, function (nested, k) {
        if (typeof appConfig[key][k] === 'undefined') {
          appConfig[key][k] = nested;
        }
      });
    } else if (typeof appConfig[key] === 'undefined') {
      appConfig[key] = def;
    }
  });
  appConfig.root = process.env.PWD;
  this.configured = true;
  return appConfig;
};

configure.configured = false;

exports = module.exports = configure;