'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './statistics.routes'

export class StatisticsComponent {
  /* @ngInject */
  constructor ($http, $state) {
    this.$http = $http
    this.$state = $state
  }

  $onInit () {
    this.$http.get(`/api/players/min`)
      .then(response => {
        this.players = _.sortBy(response.data, 'handle')
      })
      .catch(err => {
        this.errorHandler(err)
      })

    this.$http.get(`/api/games/min`)
      .then(response => {
        this.games = _.sortBy(response.data, 'name')
      })
      .catch(err => {
        this.errorHandler(err)
      })

    this.$http.get(`/api/statistics`)
      .then(response => {
        this.statistics = response.data
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  errorHandler (err) {
    return this.$state.go('error', { error: err })
  }

  changeHeadToHead () {
    this.headToHeadErr = false
    if (!this.game || !this.player1 || !this.player2) {
      this.headToHead = false
      return
    }

    this.$http.get(`/api/players/${this.player1}/vs/${this.player2}/game/${this.game}`)
      .then(response => {
        // console.log(response.data)
        this.headToHead = response.data
      })
      .catch(err => {
        this.headToHead = false
        if (err.status === 404) {
          this.headToHeadErr = err
        } else {
          this.errorHandler(err)
        }
      })
  }
}

export default angular.module('fgcApp.statistics', [uiRouter])
  .config(routes)
  .component('statistics', {
    template: require('./statistics.pug'),
    controller: StatisticsComponent,
    controllerAs: 'statisticsCtrl'
  })
  .name
