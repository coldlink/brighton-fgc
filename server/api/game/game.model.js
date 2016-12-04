'use strict';

import mongoose from 'mongoose';

var GameSchema = new mongoose.Schema({
  name: String,
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Game', GameSchema);
