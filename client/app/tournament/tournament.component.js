'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './tournament.routes';

export class TournamentComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('fgcApp.tournament', [uiRouter])
  .config(routes)
  .component('tournament', {
    template: require('./tournament.pug'),
    controller: TournamentComponent,
    controllerAs: 'tournamentCtrl'
  })
  .name;
