var voyager = require('../voyager');

describe('voyager', function () {

  it('exists', function () {
    expect(voyager).toBeDefined();
  });

  it('exposes application', function () {
    expect(voyager.application).toBeDefined();
    expect(typeof voyager.application).toBe('function');
  });

  it('exposes the Controller class', function () {
    expect(voyager.Controller).toBeDefined();
    expect(typeof voyager.Controller).toBe('function');
  });

  it('exposes the router', function () {
    expect(voyager.router).toBeDefined();
    expect(typeof voyager.router).toBe('object');
  });

  it('exposes the View class', function () {
    expect(voyager.View).toBeDefined();
    expect(typeof voyager.View).toBe('function');
  });

  it('exposes _ (utility)', function () {
    expect(voyager._).toBeDefined();
    expect(typeof voyager._).toBe('object');
  });
});