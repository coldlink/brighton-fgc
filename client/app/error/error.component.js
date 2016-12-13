'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './error.routes'

export class ErrorComponent {
  /* @ngInject */
  constructor ($stateParams, $state) {
    this.$stateParams = $stateParams
    this.$state = $state
  }

  $onInit () {
    if (!this.$stateParams.error) {
      return this.$state.go('main')
    }

    this.error = this.$stateParams.error
  }
}

export default angular.module('fgcApp.error', [uiRouter])
  .config(routes)
  .component('error', {
    template: require('./error.pug'),
    controller: ErrorComponent,
    controllerAs: 'errorCtrl'
  })
  .name
