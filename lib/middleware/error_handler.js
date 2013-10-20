var debug = require('debug')('voyager:middleware:error_handler')
  , _ = require('../_');

function ErrorHandler(options) {
  this.options = options || {};
  return this.handle.bind(this);
}

ErrorHandler.prototype.handle = function error_handler(err, req, res, next) {
  if (res.statusCode < 400) {
    res.statusCode = 500;
  }
  res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
  res.end(err.stack);
  _.log(err.stack, { date: ['red', 'inverse'] });
};

exports = module.exports = ErrorHandler;