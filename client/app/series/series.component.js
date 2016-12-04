'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './series.routes';

export class SeriesComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('fgcApp.series', [uiRouter])
  .config(routes)
  .component('series', {
    template: require('./series.pug'),
    controller: SeriesComponent,
    controllerAs: 'seriesCtrl'
  })
  .name;
