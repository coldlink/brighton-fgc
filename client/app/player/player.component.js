'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './player.routes'

export class PlayerComponent {
  /* @ngInject */
  constructor ($http, $window, $timeout, $state) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.$state = $state
    this.players = []
    this.playersChunk = []
  }

  $onInit () {
    this.$http.get('/api/players')
      .then(response => {
        // console.log(response.data)
        this.sortPlayers(response.data)
      })
      .catch(err => this.errorHandler(err))
  }

  sortPlayers (players) {
    players = players || this.players
    this.players = _.sortBy(players, ['handle'])
    this.playersChunk = _.chunk(this.players, 3)

    this.$timeout(() => {
      this.$window.$('.match-height').matchHeight()
    }, 250)
  }

  getImage (player) {
    return player.image_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y'
  }

  errorHandler (err) {
    return this.$state.go('error', {error: err})
  }
}

export default angular.module('fgcApp.player', [uiRouter])
  .config(routes)
  .component('player', {
    template: require('./player.pug'),
    controller: PlayerComponent,
    controllerAs: 'playerCtrl'
  })
  .name
