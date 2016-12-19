'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

import routes from './statistics.routes'

export class StatisticsComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
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
