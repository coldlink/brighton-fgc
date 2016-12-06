'use strict'

export default class SettingsController {
  /* @ngInject */
  constructor (Auth) {
    this.Auth = Auth
    this.user = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    this.errors = {
      other: undefined
    }
    this.message = ''
    this.submitted = false
  }

  changePassword (form) {
    this.submitted = true

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.'
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false)
          this.errors.other = 'Incorrect password'
          this.message = ''
        })
    }
  }
}
