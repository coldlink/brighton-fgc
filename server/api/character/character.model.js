'use strict';

import mongoose from 'mongoose';

var CharacterSchema = new mongoose.Schema({
  name: String,
  games: [mongoose.Schema.Types.ObjectId],
  meta: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Character', CharacterSchema);
