// private variables for use outside of Logger.prototype.handle
var _start, _req, _res;

/**
 * Logger middleware
 * @param= {Object} options Initialization options
 * @return {Function}       The handler method
 */
function Logger(options) {
  this.options = options || {};
  return this.handle.bind(this);
};

/**
 * The handle method returned in the Logger constructor, handles incoming
 * requests from the server.
 * @this  {Logger}
 * @param {http.ClientRequest}  req  The incoming request
 * @param {http.ServerResponse} res  The response to write to
 * @param {Function}            next Callback triggering next middleware layer
 */
Logger.prototype.handle = function logger(req, res, next) {
  _req = req; _res = res;
  _start = new Date();
  res.on('finish', log);
  res.on('close', log);
  next();
};

/**
 * Log details to process.stdout
 * @private
 */
function log() {
  var statusColor;
  if (_res.statusCode >= 500) {
    statusColor = 'red';
  } else if (_res.statusCode >= 400) {
    statusColor = 'yellow';
  } else {
    statusColor = 'green';
  }
  _res.removeListener('finish', log);
  _res.removeListener('close', log);
  process.stdout.write((_req.method + ' ').grey
                     + (_req.url + ' ')
                     + (_res.statusCode + ' ')[statusColor]
                     + ((new Date() - _start) + 'ms ').grey + '\n');
}

exports = module.exports = Logger;
