'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('player', {
      url: '/player',
      template: '<player></player>'
    })
}
