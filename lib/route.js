var Route = function Route(verb, path, responder) {
  var split = responder.split('#');
  if (split.length !== 2) {
    throw new Error('Invalid controller#action responder specified');
  }
  this.action = split[1];
  this.controller = split[0] + '_controller';
  this.keys = [];
  this.method = verb;
  this.path = path;
  this.pattern = this._compile();
};

Route.prototype._compile = function () {
  var pattern;
  if (Object.prototype.toString.call(this.path) === '[object RegExp]') {
    return this.path;
  }
  pattern = this.path
    .replace(/\/\(/g, '(?:/)')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, 
             function(_, slash, format, key, capture, optional, star) {
      this.keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    }.bind(this))
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + pattern + '$', 'i');
};

exports = module.exports = Route;