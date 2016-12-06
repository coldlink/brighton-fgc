'use strict'

import mongoose from 'mongoose'

var EventSchema = new mongoose.Schema({
  number: Number,
  name: String,
  date_time: Date,
  event_url: String,
  meta: mongoose.Schema.Types.Mixed
}, { toJSON: { virtuals: true } })

EventSchema.virtual('tournaments', {
  ref: 'Tournament',
  localField: '_id',
  foreignField: 'event'
})

export default mongoose.model('Event', EventSchema)
