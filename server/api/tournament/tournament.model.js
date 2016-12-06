'use strict';

import mongoose from 'mongoose';

let Player = require('../player/player.model');
let Event = require('../event/event.model');
let Series = require('../series/series.model');
let Game = require('../game/game.model')

var TournamentSchema = new mongoose.Schema({
  name: String,
  type: String,
  game:{ type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
  date_time: Date,
  date_time_end: Date,
  players: [{type: mongoose.Schema.Types.ObjectId}],
  event: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  series: [{type: mongoose.Schema.Types.ObjectId}],
  bracket_url: String,
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Tournament', TournamentSchema);
