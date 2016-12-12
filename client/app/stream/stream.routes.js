'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('stream', {
      url: '/stream',
      template: '<stream></stream>'
    })
}
