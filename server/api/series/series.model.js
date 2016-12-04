'use strict';

import mongoose from 'mongoose';

var SeriesSchema = new mongoose.Schema({
  name: String,
  tournaments: [mongoose.Schema.Types.ObjectId],
  game: mongoose.Schema.Types.ObjectId,
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Series', SeriesSchema);
