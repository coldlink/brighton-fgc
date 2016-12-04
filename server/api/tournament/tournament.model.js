'use strict';

import mongoose from 'mongoose';

var TournamentSchema = new mongoose.Schema({
  name: String,
  type: String,
  game: mongoose.Schema.Types.ObjectId,
  date_time: Date,
  date_time_end: Date,
  players: [mongoose.Schema.Types.ObjectId],
  event: mongoose.Schema.Types.ObjectId,
  bracket_url: String,
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Tournament', TournamentSchema);
