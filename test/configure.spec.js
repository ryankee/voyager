var configure = require('../lib/configure');

xdescribe('configure', function () {

  it('exists as an object', function () {
    expect(configure).toBeDefined();
    expect(typeof configure).toBe('object');
  });

  describe('method: user', function () {

    it('is exposed', function () {
      expect(configure.user).toBeDefined();
      expect(typeof configure.user).toBe('function');
    });

    it('throws an error with an invalid configuration path', function () {
      var func = function () {
        configure.user('/a/bad/path');
      };
      expect(func).toThrow();
    });

    it('does not throw an error with a valid configuration path', function () {
      var func = function () {
        configure.user(__dirname + '/fixtures/config/application');
      };
      expect(func).not.toThrow();
    });
  });

  describe('method: config', function () {
    var confPath = __dirname + '/fixtures/config/application';

    it('is exposed', function () {
      expect(configure.config).toBeDefined();
      expect(typeof configure.config).toBe('function');
    });

    it('returns an object', function () {
      var config = configure.config();
      expect(typeof config).toBe('object');
    });

    it('extends the default config', function () {
      var config = configure.user(confPath).config();
      expect(config.paths.controllers).toBeDefined();
    });
  });
});