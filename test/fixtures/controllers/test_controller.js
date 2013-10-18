var voyager = require('../../../voyager')
  , test_controller = new voyager.Controller();

test_controller.handle(function index() {
  this.render('DOMO.');
});

exports = module.exports = test_controller;