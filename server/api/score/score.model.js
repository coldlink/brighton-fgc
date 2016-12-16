'use strict'

import mongoose from 'mongoose'

var ScoreSchema = new mongoose.Schema({
  _tournamentId: mongoose.Schema.Types.ObjectId,
  _playerId: mongoose.Schema.Types.ObjectId,
  score: {type: Number, default: 0},
  rank: Number
})

export default mongoose.model('Score', ScoreSchema)
