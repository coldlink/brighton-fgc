/**
 * Tournament model events
 */

'use strict'

import {EventEmitter} from 'events'
import Tournament from './tournament.model'
var TournamentEvents = new EventEmitter()

// Set max event listeners (0 == unlimited)
TournamentEvents.setMaxListeners(0)

// Model events
var events = {
  save: 'save',
  remove: 'remove'
}

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e]
  Tournament.schema.post(e, emitEvent(event))
}

function emitEvent (event) {
  return function (doc) {
    TournamentEvents.emit(event + ':' + doc._id, doc)
    TournamentEvents.emit(event, doc)
  }
}

export default TournamentEvents
