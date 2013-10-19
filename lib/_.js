var colors = require('colors');

var _ = {};

_.each = function (stack, iterator, context) {
  // Use Array.forEach
  if (Array.prototype.forEach && stack.forEach === Array.prototype.forEach) {
    return stack.forEach(iterator, context);
  // Loop an Object
  } else {
    var key;
    for (key in stack) {
      if (Object.prototype.hasOwnProperty.call(stack, key)) {
        if (iterator.call(context, stack[key], key, stack) === {}) {
          return;
        }
      }
    }
  }
};

_.escape = function (html) {
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

_.extend = function (targ) {
  var args = Array.prototype.slice.call(arguments, 1);
  _.each(args, function (src) {
    if (src) {
      for (var prop in src) {
        targ[prop] = src[prop];
      }
    }
  });
  return targ;
};

/**
 * [ description]
 * @param  {Array} formatting [description]
 * @return {[type]}            [description]
 */
_.logDate = function (formatting) {
  formatting = formatting || {};
  var now = new Date().toTimeString();
  for (var i = 0; i < formatting.length; i += 1) {
    now = now[formatting[i]];
  }
  return now;
};

_.logMessage = function (message, formatting) {
  message = message || ''
  formatting = formatting || [];
  for (var i = 0; i < formatting.length; i += 1) {
    message = message[formatting[i]];
  }
  return message;
};

_.log = function log(message, opts) {
  opts = _.extend({
    date: ['inverse'],
    msg: []
  }, opts);
  var now = _.logDate(opts.date)
    , msg = _.logMessage(message, opts.msg);
  return console.log(now, msg);
};

_.pause = function (obj) {
  var events = []
    , onData = function (data, encoding) {
        events.push(['data', data, encoding]);
      }
    , onEnd = function (data, encoding) {
        events.push(['end', data, encoding]);
      };
  obj.on('data', onData);
  obj.on('end', onEnd);
  return {
    end: function () {
      obj.removeListener('data', onData);
      obj.removeListener('end', onEnd);
    },
    resume: function () {
      this.end();
      _.each(events, function (e) {
        obj.emit.apply(obj, e);
      });
    }
  };
};

exports = module.exports = _;