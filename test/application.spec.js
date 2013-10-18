var voyager = require('../voyager')
  , app;

describe('application', function () {

  it('exists', function () {
    expect(voyager.application).toBeDefined();
  });

  // app is defined here
  it('does not throw an error upon instantiation', function () {
    var func = function () {
      app = voyager.application(__dirname + '/fixtures/config/application');
    };
    expect(func).not.toThrow();
  });

  describe('method: getInstance', function () {

    it('returns the application instance', function () {
      var app2 = voyager.application();
      expect(app).toEqual(app2);
    });
  });

  xdescribe('method: handle', function () {

  });

  xdescribe('method: listen', function () {

  });
});