'use strict'

import mongoose from 'mongoose'

var MatchSchema = new mongoose.Schema({
  _tournamentId: {type: mongoose.Schema.Types.ObjectId, ref: 'tournament'},
  _player1Id: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  _player2Id: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  _winnerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  _loserId: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
  score: [{
    p1: {type: Number, default: 0},
    p2: {type: Number, default: 0}
  }],
  round: Number,
  challonge_match_obj: mongoose.Schema.Types.Mixed
})

export default mongoose.model('Match', MatchSchema)
