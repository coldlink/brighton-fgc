'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './game.routes'

export class GameComponent {
  /* @ngInject */
  constructor ($http, $window, $timeout) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.games = []
    this.gamesChunk = []
  }

  $onInit () {
    this.$http.get('/api/games')
      .then(response => {
        // console.log(response.data)
        this.sortGames(response.data)
      })
  }

  sortGames (games) {
    games = games || this.games
    this.games = _.sortBy(games, ['name'])
    this.gamesChunk = _.chunk(this.games, 3)

    this.$timeout(() => {
      this.$window.$('.match-height').matchHeight()
    }, 250)
  }
}

export class GameSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams, Util, $window, $timeout) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.$stateParams = $stateParams
    this.Util = Util
  }

  $onInit () {
    // console.log(this.$stateParams)
    this.$http.get(`/api/games/${this.$stateParams.id}`)
      .then(response => {
        // console.log(response.data)
        this.game = response.data
        this.game.tournaments = _.reverse(_.sortBy(this.game.tournaments, o => new Date(o.date_time)))

        this.$timeout(() => {
          this.$window.$('.match-height').matchHeight()
          this.$window.$('.match-height-1').matchHeight()
        }, 250)
      })
  }

  getDateTime (dateTime) {
    return new Date(dateTime).getTime()
  }
}

export default angular.module('fgcApp.game', [uiRouter])
  .config(routes)
  .component('game', {
    template: require('./game.pug'),
    controller: GameComponent,
    controllerAs: 'gameCtrl'
  })
  .component('gameSingle', {
    template: require('./game.single.pug'),
    controller: GameSingleComponent,
    controllerAs: 'gameSingleCtrl'
  })
  .name
