'use strict'

import mongoose from 'mongoose'

let StripeSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.Mixed,
  type: String,
  amount: Number,
  charge: mongoose.Schema.Types.Mixed
})

export default mongoose.model('Stripe', StripeSchema, 'stripe')
