'use strict'

import mongoose from 'mongoose'

var SeriesSchema = new mongoose.Schema({
  name: String,
  game: {type: mongoose.Schema.Types.ObjectId, ref: 'Game'},
  isCurrent: Boolean,
  meta: mongoose.Schema.Types.Mixed
})

export default mongoose.model('Series', SeriesSchema)
