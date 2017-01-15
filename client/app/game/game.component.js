'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './game.routes'

export class GameComponent {
  /* @ngInject */
  constructor ($http, $window, $timeout, $state, $log) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.$state = $state
    this.$log = $log
    this.games = []
    this.gamesChunk = []
  }

  $onInit () {
    this.$http.get('/api/games')
      .then(response => {
        // $log.debug(response.data)
        this.sortGames(response.data)
      })
      .catch(err => {
        this.errorHandler(err)
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

  errorHandler (err) {
    return this.$state.go('error', {error: err})
  }
}

export class GameSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams, Util, $window, $timeout, $state, $log) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.$stateParams = $stateParams
    this.Util = Util
    this.$state = $state
    this.$log = $log
  }

  $onInit () {
    // $log.debug(this.$stateParams)
    this.$http.get(`/api/games/${this.$stateParams.id}`)
      .then(response => {
        // $log.debug(response.data)
        this.game = response.data
        this.game.tournaments = _.reverse(_.sortBy(this.game.tournaments, o => new Date(o.date_time)))

        this.$timeout(() => {
          this.$window.$('.match-height').matchHeight()
          this.$window.$('.match-height-1').matchHeight()
        }, 250)
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  getDateTime (dateTime) {
    return new Date(dateTime).getTime()
  }

  errorHandler (err) {
    return this.$state.go('error', {error: err})
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
