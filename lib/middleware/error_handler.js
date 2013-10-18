function ErrorHandler(options) {
  this.options = options || {};
  return this.handle.bind(this);
}

ErrorHandler.prototype.handle = function error_handler(err, req, res, next) {
  if (err) console.error(err);
  next();
};

exports = module.exports = ErrorHandler;