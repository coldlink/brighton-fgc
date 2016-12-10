'use strict'

import mongoose from 'mongoose'

var SeriesSchema = new mongoose.Schema({
  name: String,
  game: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
  isCurrent: Boolean,
  meta: mongoose.Schema.Types.Mixed
}, { toJSON: { virtuals: true } })

SeriesSchema.virtual('tournaments', {
  ref: 'Tournament',
  localField: '_id',
  foreignField: 'series'
})

export default mongoose.model('Series', SeriesSchema)
