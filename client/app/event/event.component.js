'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

const _ = require('lodash')

import routes from './event.routes'

export class EventComponent {
  /* @ngInject */
  constructor ($http) {
    this.$http = $http
    this.pastEvents = []
    this.pastEventsChunk = []
    this.upcomingEvents = []
    this.upcomingEventsChunk = []
  }

  $onInit () {
    this.$http.get('/api/events')
      .then(response => {
        console.log(response.data)
        this.sortEvents(response.data)
      })
  }

  sortEvents (events) {
    events = events || this.events

    _.each(events, (v, i) => {
      if (new Date(v.date_time).getTime() < Date.now()) {
        this.pastEvents.push(v)
      } else {
        this.upcomingEvents.push(v)
      }
    })

    this.pastEvents = _.reverse(_.sortBy(this.pastEvents, o => new Date(o.date_time)))
    this.upcomingEvents = _.sortBy(this.upcomingEvents, o => new Date(o.date_time))
    this.pastEventsChunk = _.chunk(this.pastEvents, 3)
    this.upcomingEventsChunk = _.chunk(this.upcomingEvents, 3)
  }
}

export default angular.module('fgcApp.event', [uiRouter])
  .config(routes)
  .component('event', {
    template: require('./event.pug'),
    controller: EventComponent,
    controllerAs: 'eventCtrl'
  })
  .name
