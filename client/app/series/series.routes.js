'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('series', {
      url: '/series',
      template: '<series></series>'
    });
}
