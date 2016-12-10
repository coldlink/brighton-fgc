'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('series', {
      url: '/series',
      template: '<series></series>'
    })
    .state('seriesSingle', {
      url: '/series/:id',
      template: '<series-single></series-single>'
    })
}
