var fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , EventEmitter = require('events').EventEmitter;

var generator = new EventEmitter()
  , pwd = process.env.PWD
  , join = path.join
  , _appname
  , _files = []
  , _len
  , _tracker = 0;

generator.build = function (appname) {
  console.log(('\nGenerating new voyager application "' + appname + '"').blue);
  _appname = appname;
  _files = [
    join(pwd, appname, 'app.js'),
    join(pwd, appname, 'package.json'),
    join(pwd, appname, 'README.md'),
    join(pwd, appname, 'Procfile'),
    join(pwd, appname, '.gitignore'),
    join(pwd, appname, '.npmignore'),
    join(pwd, appname, 'db'),
    join(pwd, appname, 'spec'),
    join(pwd, appname, 'app', 'server.js'),
    join(pwd, appname, 'app', 'controllers', 'home_controller.js'),
    join(pwd, appname, 'app', 'models'),
    join(pwd, appname, 'app', 'views'),
    join(pwd, appname, 'app', 'views', 'home', 'index.ejs'),
    join(pwd, appname, 'public', 'stylesheets'),
    join(pwd, appname, 'public', 'stylesheets', 'style.css'),
    join(pwd, appname, 'public', 'javascripts'),
    join(pwd, appname, 'public', 'javascripts', 'main.js'),
    join(pwd, appname, 'public', 'images'),
    join(pwd, appname, 'config', 'routes.js'),
    join(pwd, appname, 'config', 'application.js')
  ];
  _len = _files.length;
  for (var i = 0; i < _len; i += 1) {
    this.write(_files[i]);
  }
};

generator.write = function (dest) {
  var isFile = dest.match(/\./) || dest.match(/Procfile/)
    , filename = path.basename(dest)
    , dir = isFile ? path.dirname(dest) : dest;

  mkdirp(dir, 0755, function (err) {
    if (err) throw err;
    if (isFile) {
      var read = new fs.ReadStream(join(__dirname, 'generators', filename))
        , write = new fs.WriteStream(dest);
      read.pipe(write);
      write.on('error', function (err) {
        console.error(err);
      });
      write.on('finish', function () {
        console.log('created:'.grey, dir + "/" + filename);
        _tracker += 1;
        if (_tracker === _len) {
          generator.emit('complete', _appname);
        }
      });
    } else {
      console.log('created:'.grey, dir + "/");
      _tracker += 1;
      if (_tracker === _len) {
        generator.emit('complete', _appname);
      }
    }
  });
};

exports = module.exports = generator;
