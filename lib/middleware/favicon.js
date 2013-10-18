var fs = require('fs')
  , crypto = require('crypto')
  , _ = require('../_');

function Favicon(options) {
  options = options || {};
  this.options = _.extend({
    path: __dirname + '/../assets/favicon.ico',
    maxAge: 86400000
  }, options);
  this.icon = null;
  return this.handle.bind(this);
}

Favicon.prototype.handle = function (req, res, next) {
  if (req.url !== '/favicon.ico') return next();
  if (this.icon) {
    res.writeHead(200, self.icon.headers);
    res.end(self.icon.body);
  } else {
    var self = this;
    fs.readFile(this.options.path, function (err, data) {
      if (err) return next(err);
      var hash = crypto.createHash('md5').update(data, 'utf8').digest('hex');
      self.icon = {
        headers: {
          'Content-Type': 'image/x-icon',
          'Content-Length': data.length,
          'ETag': '"' + hash + '"',
          'Cache-Control': 'public, max-age=' + (self.options.maxAge / 1000)
        },
        body: data
      };
      res.writeHead(200, self.icon.headers);
      res.end(self.icon.body);
    });
  }
};

exports = module.exports = Favicon;