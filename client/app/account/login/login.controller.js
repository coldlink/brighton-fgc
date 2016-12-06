'use strict'

export default class LoginController {
  /* @ngInject */
  constructor (Auth, $state) {
    this.Auth = Auth
    this.$state = $state
    this.user = {
      name: '',
      email: '',
      password: ''
    }
    this.errors = {
      login: undefined
    }
    this.submitted = false
  }

  login (form) {
    this.submitted = true

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('main')
        })
        .catch(err => {
          this.errors.login = err.message
        })
    }
  }
}
