'use strict';

import mongoose from 'mongoose';

var ScoreSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Score', ScoreSchema);
