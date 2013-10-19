var app = require('../app')
  , port = process.env.PORT || 3000;

app.listen(port);
console.log('voyager is listening on port ' + port);
