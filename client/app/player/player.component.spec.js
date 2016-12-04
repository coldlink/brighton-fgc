'use strict';

describe('Component: PlayerComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.player'));

  var PlayerComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PlayerComponent = $componentController('player', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
