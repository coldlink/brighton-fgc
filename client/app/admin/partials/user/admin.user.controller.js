'use strict'

import _ from 'lodash'

export default class AdminUserController {
  /* @ngInject */
  constructor (User, $log) {
    this.User = User
    this.$log = $log
    // Use the User $resource to fetch all users
    this.users = User.query()
    this.$log.debug(this.users)
  }

  delete (user) {
    user.$remove()
      .then(res => {
        this.$log.debug(res)
      })
      .catch(err => {
        this.$log.debug(err)
      })
    this.users.splice(this.users.indexOf(user), 1)
  }

  editUser (selectedUser) {
    if (selectedUser._id) {
      selectedUser.$update()
        .then(res => {
          this.$log.debug(res)
        })
        .catch(err => {
          this.$log.debug(err)
        })
    } else {
      let user = new this.User()
      user = _.merge(user, selectedUser)
      user.$save()
        .then(res => {
          this.$log.debug(res)
        })
        .catch(err => {
          this.$log.debug(err)
        })
    }
  }
}
