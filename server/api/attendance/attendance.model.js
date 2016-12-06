'use strict'

import mongoose from 'mongoose'

var AttendanceSchema = new mongoose.Schema({
  event_id: mongoose.Schema.Types.ObjectId,
  player_id: mongoose.Schema.Types.ObjectId,
  spectator: Boolean
})

export default mongoose.model('Attendance', AttendanceSchema)
