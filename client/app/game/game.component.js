'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './game.routes'

export class GameComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
    this.games = []
    this.gamesChunk = []
  }

  $onInit () {
    this.$http.get('/api/games')
      .then(response => {
        console.log(response.data)
        this.sortGames(response.data)
      })
  }

  sortGames (games) {
    games = games || this.games
    this.games = _.sortBy(games, ['name'])
    this.gamesChunk = _.chunk(this.games, 3)
  }
}

export default angular.module('fgcApp.game', [uiRouter])
  .config(routes)
  .component('game', {
    template: require('./game.pug'),
    controller: GameComponent,
    controllerAs: 'gameCtrl'
  })
  .name
