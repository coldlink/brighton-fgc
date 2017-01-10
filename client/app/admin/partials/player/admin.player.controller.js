'use strict'

import _ from 'lodash'

export default class AdminPlayerController {
  /* @ngInject */
  constructor (Player, $log) {
    this.Player = Player
    this.$log = $log
    // Use the User $resource to fetch all users
    this.players = Player.query()
    this.$log.debug(this.players)
  }

  delete (player) {
    player.$remove()
      .then(res => {
        this.$log.debug(res)
      })
      .catch(err => {
        this.$log.debug(err)
      })
    this.players.splice(this.players.indexOf(player), 1)
  }

  editPlayer (selectedPlayer) {
    if (selectedPlayer._id) {
      selectedPlayer.$update()
        .then(res => {
          this.$log.debug(res)
        })
        .catch(err => {
          this.$log.debug(err)
        })
    } else {
      let player = new this.Player()
      player = _.merge(player, selectedPlayer)
      player.$save()
        .then(res => {
          this.$log.debug(res)
        })
        .catch(err => {
          this.$log.debug(err)
        })
    }
  }
}
