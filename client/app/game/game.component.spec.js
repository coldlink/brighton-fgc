'use strict';

describe('Component: GameComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.game'));

  var GameComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    GameComponent = $componentController('game', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
