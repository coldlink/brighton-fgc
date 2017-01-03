'use strict'
const angular = require('angular')

const uiRouter = require('angular-ui-router')

import routes from './donate.routes'

export class DonateComponent {
  /* @ngInject */
  constructor (stripe, $http) {
    this.stripe = stripe
    this.$http = $http
    this.card = {}
    this.user = {}
  }

  submitPaymentForm (form) {
    // console.log(form)
    this.invalidForm = false
    this.errmsg = ''
    this.sucmsg = ''
    this.frmdisable = true

    if (form.$valid) {
      return this.stripe.card.createToken(this.card)
        .then(response => {
          // console.log(response)
          return this.$http.post(`/api/stripe`, {
            stripeToken: response.id,
            user: this.user,
            amount: this.amount,
            type: 'donation'
          })
        })
        .then(payment => {
          // console.log(payment)
          this.sucmsg = `Payment successful! Receipt sent to ${this.user.email}.
          If you have any issues or questions then please email contact@mkn.sh.
          `
          this.user = {}
          this.amount = null
          this.card = {}
          this.frmdisable = false
          form.$setPristine()
          form.$setUntouched()
        })
        .catch(err => {
          this.frmdisable = false
          if (err.data.type) {
            // console.log('Stripe error: ', err.data.message)
            this.errmsg = `Payment error: ${err.data.message}
            If you have continuous issues or other questions then please email contact@mkn.sh.`
          } else {
            // console.log('Other error occurred, possibly with your API', err.data.message)
            this.errmsg = `Other error occurred, possibly with the API: ${err.data.message}
            If you have continuous issues or other questions then please email contact@mkn.sh.`
          }
        })
    } else {
      this.invalidForm = true
    }
  }
}

export default angular.module('fgcApp.donate', [uiRouter, require('angular-stripe'), require('angular-credit-cards')])
  .config(routes)
  .config(function (stripeProvider) {
    if (window.location.host === 'fgc.mkn.sh') {
      stripeProvider.setPublishableKey('pk_live_JMtwFhRuQ0zNXydnEjAynz8a')
    } else {
      stripeProvider.setPublishableKey('pk_test_PqoXye3evGZ9CZ5vG3Byeeh0')
    }
  })
  .component('donate', {
    template: require('./donate.pug'),
    controller: DonateComponent,
    controllerAs: 'donateCtrl'
  })
  .name
