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
  constructor ($http) {
    this.$http = $http
  }

  $onInit () {
    console.log(this.series)
    this.$http.get(`/api/scores/series/top/${this.series}`)
      .then(response => {
        console.log(response)
        this.top = response.data
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
      series: '@'
    }
  })
  .name
