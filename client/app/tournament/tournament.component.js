'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './tournament.routes'

export class TournamentComponent {
  /* @ngInject */
  constructor ($http, $window, $timeout) {
    this.$http = $http
    this.$window = $window
    this.$timeout = $timeout
    this.pastTournaments = []
    this.pastTournamentsChunk = []
    this.upcomingTournaments = []
    this.upcomingTournamentsChunk = []
  }

  $onInit () {
    this.$http.get('/api/tournaments')
      .then(response => {
        console.log(response.data)
        this.sortTournaments(response.data)
      })
  }

  sortTournaments (tournaments) {
    this.tournaments = tournaments || this.tournaments

    _.each(this.tournaments, (v, i) => {
      if (new Date(v.date_time).getTime() < Date.now()) {
        this.pastTournaments.push(v)
      } else {
        this.upcomingTournaments.push(v)
      }
    })

    this.pastTournaments = _.reverse(_.sortBy(this.pastTournaments, o => new Date(o.date_time)))
    this.upcomingTournaments = _.sortBy(this.upcomingTournaments, o => new Date(o.date_time))
    this.pastTournamentsChunk = _.chunk(this.pastTournaments, 3)
    this.upcomingTournamentsChunk = _.chunk(this.upcomingTournaments, 3)

    this.$timeout(() => {
      this.$window.$('.match-height').matchHeight()
      this.$window.$('.match-height-1').matchHeight()
    }, 250)
  }
}

export class TournamentSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams, Util) {
    this.$http = $http
    this.$stateParams = $stateParams
    this.Util = Util
  }

  $onInit () {
    console.log(this.$stateParams)
    this.$http.get(`/api/tournaments/${this.$stateParams.id}`)
      .then(response => {
        console.log(response.data)
        this.tournament = response.data
      })
  }

  getDateTime (dateTime) {
    return new Date(dateTime).getTime()
  }
}

export default angular.module('fgcApp.tournament', [uiRouter])
  .config(routes)
  .component('tournament', {
    template: require('./tournament.pug'),
    controller: TournamentComponent,
    controllerAs: 'tournamentCtrl'
  })
  .component('tournamentSingle', {
    template: require('./tournament.single.pug'),
    controller: TournamentSingleComponent,
    controllerAs: 'tournamentSingleCtrl'
  })
  .name
