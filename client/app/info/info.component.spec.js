'use strict';

describe('Component: InfoComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.info'));

  var InfoComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    InfoComponent = $componentController('info', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
