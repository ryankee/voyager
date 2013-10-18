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