'use strict';

describe('Component: TournamentComponent', function() {
  // load the controller's module
  beforeEach(module('fgcApp.tournament'));

  var TournamentComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TournamentComponent = $componentController('tournament', {});
  }));

  it('should ...', function() {
    1.should.equal(1);
  });
});
