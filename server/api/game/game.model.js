'use strict'

import mongoose from 'mongoose'

var GameSchema = new mongoose.Schema({
  name: String,
  short: String,
  image_url: String,
  meta: mongoose.Schema.Types.Mixed
}, { toJSON: { virtuals: true } })

GameSchema.virtual('tournaments', {
  ref: 'Tournament',
  localField: '_id',
  foreignField: 'game'
})

export default mongoose.model('Game', GameSchema)
