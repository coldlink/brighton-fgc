'use strict'

import mongoose from 'mongoose'

var PlayerSchema = new mongoose.Schema({
  name: String,
  handle: String,
  challonge_username: String,
  image_url: String,
  twitter: String,
  team: String,
  isStaff: Boolean,
  meta: {type: mongoose.Schema.Types.Mixed, default: {}}
})

export default mongoose.model('Player', PlayerSchema)
