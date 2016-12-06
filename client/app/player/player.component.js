'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './player.routes'

export class PlayerComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
    this.players = []
    this.playersChunk = []
  }

  $onInit () {
    this.$http.get('/api/players')
      .then(response => {
        console.log(response.data)
        this.sortPlayers(response.data)
      })
  }

  sortPlayers (players) {
    players = players || this.players
    this.players = _.sortBy(players, ['handle'])
    this.playersChunk = _.chunk(this.players, 3)
  }

  getImage (player) {
    return player.image_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y'
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
