import angular from 'angular'
import uiRouter from 'angular-ui-router'
import routing from './main.routes'

export class MainController {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
  }

  $onInit () {

  }
}

export default angular.module('fgcApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name
