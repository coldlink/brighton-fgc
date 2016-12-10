'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './series.routes'

export class SeriesComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
    this.series = []
    this.currentSeries = []
    this.pastSeries = []
  }

  $onInit () {
    this.$http.get('/api/series')
      .then(response => {
        console.log(response.data)
        this.sortSeries(response.data)
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

    console.log(this.currentSeries)
    console.log(this.pastSeries)
  }
}

export class SeriesTopPlayerComponent {
  /* @ngInject */
  constructor ($http, $state) {
    this.$http = $http
    this.$state = $state
  }

  $onInit () {
    console.log(this.series)
    console.log(this.type)

    if (this.type === 'all') this.limit = 16

    this.$http.get(`/api/scores/series/${this.type}/${this.series}`)
      .then(response => {
        console.log(response)
        this.top = response.data
      })
      .catch(err => {
        console.log(err)
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
}

export class SeriesSingleComponent {
  /* @ngInject */
  constructor ($http, $stateParams) {
    this.$http = $http
    this.$stateParams = $stateParams
  }

  $onInit () {
    console.log(this.series)
    this.$http.get(`/api/series/${this.$stateParams.id}`)
      .then(response => {
        console.log(response)
        this.series = response.data
      })
  }
}

export class SeriesPlayerComponent {
  /* @ngInject */
  constructor ($http, $stateParams) {
    this.$http = $http
    this.$stateParams = $stateParams
  }

  $onInit () {
    console.log(this.$stateParams)
    this.$http.get(`/api/series/${this.$stateParams.series_id}/player/${this.$stateParams.player_id}`)
      .then(response => {
        console.log(response)
        this.scores = response.data
      })
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
