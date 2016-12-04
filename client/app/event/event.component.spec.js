'use strict';

describe('Component: EventComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.event'));

  var EventComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    EventComponent = $componentController('event', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
