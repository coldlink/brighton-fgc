'use strict'

export default class AdminPlayerController {
  /* @ngInject */
  constructor (Player) {
    // Use the User $resource to fetch all users
    this.players = Player.query()
    console.log(this.players)
  }

  // delete (user) {
  //   user.$remove()
  //   this.users.splice(this.users.indexOf(user), 1)
  // }
  setPlayer (selectedPlayer) {
    console.log(selectedPlayer)
    if (typeof selectedPlayer === 'object') {
      this.player = selectedPlayer
    }
  }
}
