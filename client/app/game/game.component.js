'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './game.routes';

export class GameComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('fgcApp.game', [uiRouter])
  .config(routes)
  .component('game', {
    template: require('./game.pug'),
    controller: GameComponent,
    controllerAs: 'gameCtrl'
  })
  .name;
