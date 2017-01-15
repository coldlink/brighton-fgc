'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './series.routes'

export class SeriesComponent {
  /* @ngInject */
  constructor ($http, $state, $log) {
    this.$http = $http
    this.$state = $state
    this.$log = $log
    this.series = []
    this.currentSeries = []
    this.pastSeries = []
  }

  $onInit () {
    this.$http.get('/api/series')
      .then(response => {
        // this.$log.debug(response.data)
        this.sortSeries(response.data)
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  sortSeries (series) {
    this.series = series || this.series

    _.each(this.series, v => {
      if (v.isCurrent) {
        this.currentSeries.push(v)
      } else {
        this.pastSeries.push(v)
      }
    })

    // this.$log.debug(this.currentSeries)
    // this.$log.debug(this.pastSeries)
  }

  errorHandler (err) {
    return this.$state.go('error', { error: err })
  }
}

export class SeriesTopPlayerComponent {
  /* @ngInject */
  constructor ($http, $state, $log) {
    this.$http = $http
    this.$state = $state
    this.$log = $log
  }

  $onInit () {
    // this.$log.debug(this.series)
    // this.$log.debug(this.type)

    if (this.type === 'all') this.limit = 16

    this.$http.get(`/api/scores/series/${this.type}/${this.series}`)
      .then(response => {
        // this.$log.debug(response)
        this.top = response.data
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  showAll () {
    this.limit = this.top.length
  }

  showLess () {
    this.limit = 16
  }

  goToSeriesPlayer (player_id) {
    this.$state
      .go('seriesPlayer', {
        player_id,
        series_id: this.series
      })
  }

  getRank (playerId) {
    let pi = _.findIndex(this.top, o => o._id === playerId)
    let si = _.findIndex(this.top, o => o.score === this.top[pi].score)
    return si + 1
  }

  errorHandler (err) {
    return this.$state.go('error', { error: err })
  }
}

export class SeriesSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams, $state, $log) {
    this.$http = $http
    this.$stateParams = $stateParams
    this.$state = $state
    this.$log = $log
  }

  $onInit () {
    // this.$log.debug(this.series)
    this.$http.get(`/api/series/${this.$stateParams.id}`)
      .then(response => {
        // this.$log.debug(response)
        this.series = response.data
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  errorHandler (err) {
    return this.$state.go('error', { error: err })
  }
}

export class SeriesPlayerComponent {
  /* @ngInject */
  constructor ($http, $stateParams, $state, $log) {
    this.$http = $http
    this.$stateParams = $stateParams
    this.$state = $state
    this.$log = $log
    this.limit = 5
  }

  $onInit () {
    // this.$log.debug(this.$stateParams)
    this.$http.get(`/api/series/${this.$stateParams.series_id}/player/${this.$stateParams.player_id}`)
      .then(response => {
        // this.$log.debug(response)
        this.series = response.data[0]
        this.player = response.data[1]
        this.tournaments = response.data[2]
        this.score = response.data[3]
      })
      .catch(err => {
        this.errorHandler(err)
      })

    this.$http.get(`/api/players/${this.$stateParams.player_id}/statistics/series/${this.$stateParams.series_id}`)
      .then(response => {
        this.$log.debug(response)
        this.statistics = response.data
      })
      .catch(err => {
        this.errorHandler(err)
      })
  }

  showAll () {
    this.limit = this.tournaments.length
  }

  showLess () {
    this.limit = 5
  }

  goToTournament (id) {
    this.$state.go('tournamentSingle', { id })
  }

  errorHandler (err) {
    return this.$state.go('error', { error: err })
  }
}

export default angular.module('fgcApp.series', [uiRouter])
  .config(routes)
  .component('series', {
    template: require('./series.pug'),
    controller: SeriesComponent,
    controllerAs: 'seriesCtrl'
  })
  .component('topPlayers', {
    template: require('./series.top.pug'),
    controller: SeriesTopPlayerComponent,
    controllerAs: 'seriesTopPlayersCtrl',
    bindings: {
      series: '@',
      type: '@'
    }
  })
  .component('seriesSingle', {
    template: require('./series.single.pug'),
    controller: SeriesSingleComponent,
    controllerAs: 'seriesSingleCtrl'
  })
  .component('seriesPlayer', {
    template: require('./series.player.pug'),
    controller: SeriesPlayerComponent,
    controllerAs: 'seriesPlayerCtrl'
  })
  .name
