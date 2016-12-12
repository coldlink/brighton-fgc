'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

import routes from './stream.routes'

export class StreamComponent {
  /* @ngInject */
  constructor () {
    this.message = 'Hello'
  }
}

export default angular.module('fgcApp.stream', [uiRouter])
  .config(routes)
  .component('stream', {
    template: require('./stream.pug'),
    controller: StreamComponent,
    controllerAs: 'streamCtrl'
  })
  .name
