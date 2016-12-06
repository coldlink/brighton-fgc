'use strict'

import mongoose from 'mongoose'

var TournamentSchema = new mongoose.Schema({
  name: String,
  type: String,
  game: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
  date_time: Date,
  date_time_end: Date,
  players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
  event: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  series: [{type: mongoose.Schema.Types.ObjectId, ref: 'Series'}],
  bracket_url: String,
  meta: mongoose.Schema.Types.Mixed
})

export default mongoose.model('Tournament', TournamentSchema)
