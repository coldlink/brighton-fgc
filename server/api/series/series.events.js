/**
 * Series model events
 */

'use strict'

import {EventEmitter} from 'events'
import Series from './series.model'
var SeriesEvents = new EventEmitter()

// Set max event listeners (0 == unlimited)
SeriesEvents.setMaxListeners(0)

// Model events
var events = {
  save: 'save',
  remove: 'remove'
}

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e]
  Series.schema.post(e, emitEvent(event))
}

function emitEvent (event) {
  return function (doc) {
    SeriesEvents.emit(event + ':' + doc._id, doc)
    SeriesEvents.emit(event, doc)
  }
}

export default SeriesEvents
