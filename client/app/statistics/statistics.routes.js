'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('statistics', {
      url: '/statistics',
      template: '<statistics></statistics>'
    })
}
