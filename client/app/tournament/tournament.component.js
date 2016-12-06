'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './tournament.routes'

export class TournamentComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
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
    tournaments = tournaments || this.tournaments

    _.each(tournaments, (v, i) => {
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
  }
}

export default angular.module('fgcApp.tournament', [uiRouter])
  .config(routes)
  .component('tournament', {
    template: require('./tournament.pug'),
    controller: TournamentComponent,
    controllerAs: 'tournamentCtrl'
  })
  .name
