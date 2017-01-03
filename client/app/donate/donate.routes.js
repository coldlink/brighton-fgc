'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('donate', {
      url: '/donate',
      template: '<donate></donate>'
    })
}
