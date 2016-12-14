'use strict'

import mongoose from 'mongoose'

var MatchSchema = new mongoose.Schema({
  _tournamentId: mongoose.Schema.Types.ObjectId,
  _playerId: mongoose.Schema.Types.ObjectId,
  score: mongoose.Schema.Types.ObjectId
})

export default mongoose.model('Match', MatchSchema)
