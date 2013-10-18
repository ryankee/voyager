var app = require('../app')

var server = {
  serve: function (port) {
    app.listen(port);
    console.log('voyager is listening on port ' + port);
  }
};

exports = module.exports = server;
