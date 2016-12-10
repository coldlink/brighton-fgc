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
    .state('seriesPlayer', {
      url: '/series/:series_id/player/:player_id',
      template: '<series-player></series-player>'
    })
}
