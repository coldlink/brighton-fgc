'use strict'

export default function ($stateProvider) {
  'ngInject'
  $stateProvider
    .state('game', {
      url: '/game',
      template: '<game></game>'
    })
    .state('gameSingle', {
      url: '/game/:id',
      template: '<game-single></game-single>'
    })
}
