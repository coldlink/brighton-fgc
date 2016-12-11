'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('info', {
      url: '/info',
      template: '<info></info>'
    });
}
