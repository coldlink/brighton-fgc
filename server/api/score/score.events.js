/**
 * Score model events
 */

'use strict';

import {EventEmitter} from 'events';
import Score from './score.model';
var ScoreEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ScoreEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Score.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ScoreEvents.emit(event + ':' + doc._id, doc);
    ScoreEvents.emit(event, doc);
  };
}

export default ScoreEvents;
