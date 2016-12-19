'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

import routes from './info.routes'

export class InfoComponent {
  /* @ngInject */
  constructor () {
    this.message = 'Hello'
  }
}

export default angular.module('fgcApp.info', [uiRouter])
  .config(routes)
  .component('info', {
    template: require('./info.pug'),
    controller: InfoComponent,
    controllerAs: 'infoCtrl'
  })
  .name
