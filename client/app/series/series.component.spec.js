'use strict';

describe('Component: SeriesComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.series'));

  var SeriesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    SeriesComponent = $componentController('series', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
