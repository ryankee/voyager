var voyager = require('voyager')
  , home_controller = new voyager.Controller();

home_controller.handle(function index() {
  this.render('home/index.ejs');
});

exports = module.exports = home_controller;