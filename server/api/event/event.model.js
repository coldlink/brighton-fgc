'use strict';

import mongoose from 'mongoose';

var EventSchema = new mongoose.Schema({
  number: Number,
  name: String,
  date_time: Date,
  event_url: String,
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Event', EventSchema);
