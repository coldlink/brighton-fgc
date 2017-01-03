'use strict'

const stripe = require('stripe')(process.env.STRIPE)
import Stripe from './stripe.model'

export function charge (req, res) {
  let token = req.body.stripeToken
  let user = req.body.user
  let amount = Number(req.body.amount) * 100
  let type = req.body.type

  if (!token || !user || !amount || !type) {
    return res.status(422).send('Validation Error')
  }

  stripe.charges.create({
    amount,
    currency: 'gbp',
    source: token,
    description: `${type}: ${user.email} - charge`,
    metadata: {
      email: user.email,
      name: user.name
    },
    receipt_email: user.email
  }, (err, charge) => {
    if (err) {
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          console.log(err.message) // => e.g. "Your card's expiration year is invalid."
          return res.status(400).json(err)
        default:
          console.log(err.type)
          console.log(err.message)
          // Handle any other types of unexpected errors
          return res.status(500).json(err)
      }
    }

    let newcharge = new Stripe({
      user,
      amount,
      type,
      charge
    })

    newcharge.save(err => {
      if (err) {
        console.log(err)
        return res.status(500).json(err)
      } else {
        return res.status(200).json(charge)
      }
    })
  })
}
