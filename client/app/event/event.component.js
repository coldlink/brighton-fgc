'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

const _ = require('lodash');

import routes from './event.routes';

export class EventComponent {
  pastEvents = [];
  pastEventsChunk = [];
  upcomingEvents = [];
  upcomingEventsChunk = [];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/events')
      .then(response => {
        console.log(response.data);
        this.sortEvents(response.data);
      });
  }

  sortEvents(events) {
    events = events || this.events;

    _.each(events, v => {
      if(new Date(v.date_time).getTime() < Date.now()) {
        this.pastEvents.unshift(v);
      } else {
        this.upcomingEvents.push(v);
      }
    });

    this.pastEventsChunk = _.chunk(this.pastEvents, 3);
    this.upcomingEventsChunk = _.chunk(this.upcomingEvents, 3);
  }
}

export default angular.module('fgcApp.event', [uiRouter])
  .config(routes)
  .component('event', {
    template: require('./event.pug'),
    controller: EventComponent,
    controllerAs: 'eventCtrl'
  })
  .name;
