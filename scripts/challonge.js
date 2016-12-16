console.log(process.argv)

// check for db connection string
if (!process.argv[2]) {
  console.log('No DB')
  process.exit(0)
}

// check for challonge api keu
if (!process.argv[3]) {
  console.log('No Challonge API Key')
  process.exit(0)
}

const challongeApiUrl = `https://api.challonge.com/v1/`

const url = require('url')
const async = require('async')
const mongojs = require('mongojs')
const request = require('request')
const _ = require('lodash')
const readlineSync = require('readline-sync')
const db = mongojs(process.argv[2], ['tournaments', 'players', 'matches'])

let tournaments = []
let players = []

let promises = []

promises.push(new Promise((resolve, reject) => {
  db
    .tournaments
    .find((err, tournaments) => {
      if (err) return reject(err)

      return resolve(tournaments)
    })
}))

promises.push(new Promise((resolve, reject) => {
  db
    .players
    .find((err, players) => {
      if (err) return reject(err)

      return resolve(players)
    })
}))

Promise
  .all(promises)
  .then(values => {
    tournaments = values[0]
    players = values[1]

    return getTournamentsFromChallonge()
  })
  .catch(err => { throw err })

const getTournamentsFromChallonge = () => {
  let asyncTasks = []

  tournaments.forEach(elem => {
    asyncTasks.push(callback => {
      let results = elem
      let bracketUrl = url.parse(results.bracket_url)
      let apiUrl = `${challongeApiUrl}tournaments/${bracketUrl.host.split('.').length === 3 ? bracketUrl.host.split('.')[0] + '-' : ''}${bracketUrl.pathname.replace('/', '')}.json?api_key=${process.argv[3]}&include_participants=1&include_matches=1`

      request.get(apiUrl, (err, res, body) => {
        if (err) throw err

        let tournament = JSON.parse(body).tournament
        console.log(tournament.id)
        if (tournament.state === 'complete' && tournament.id !== 2092572 && tournament.id !== 2770116) {
          return sortParticipantsAndMatches(tournament, results, callback)
        } else {
          return callback()
        }
      })
    })
  })

  async
    .series(asyncTasks, () => {
      console.log('all tounaments done')
      process.exit(0)
    })
}

const sortParticipantsAndMatches = (tournament, results, callback) => {
  let dbMatches = []
  let matches = tournament.matches
  let participants = tournament.participants
  delete tournament.participants
  delete tournament.matches

  let participantIdMap = new Map()

  participants.forEach(elem => {
    participantIdMap.set(elem.participant.id, getParticipantToPlayer(elem.participant))
  })

  matches.forEach(m => {
    dbMatches.push({
      _tournamentId: results._id,
      _player1Id: participantIdMap.get(m.match.player1_id),
      _player2Id: participantIdMap.get(m.match.player2_id),
      _winnerId: participantIdMap.get(m.match.winner_id),
      _loserId: participantIdMap.get(m.match.loser_id),
      score: calcScore(m.match.scores_csv),
      round: m.match.round,
      challonge_match_obj: m.match
    })
  })

  return final(results, dbMatches, callback)
}

const final = (results, matches, callback) => {
  let matchproms = []

  matches.forEach(match => {
    matchproms.push(new Promise((resolve, reject) => {
      // resolve(true)
      db.matches.update({ 'challonge_match_obj.id': match.challonge_match_obj.id, 'challonge_match_obj.tournament_id': match.challonge_match_obj.tournament_id }, {
        $set: match
      }, {
        upsert: true
      }, err => {
        if (err) return reject(err)
        resolve(true)
      })
    }))
  })

  Promise
    .all(matchproms)
    .then(values => {
      // return process.exit(0)
      console.log(matches[0].challonge_match_obj.tournament_id, 'done')
      callback()
    })
    .catch(err => { throw err })
}

const getParticipantToPlayer = (participant) => {
  let p
  // find by challonge username
  if (participant.username) {
    p = _.find(players, o => o.challonge_username.toLowerCase() === participant.username.toLowerCase())
  } else if (participant.display_name) {
    players.forEach(player => {
      if (player.challonge_name[0] !== '') {
        player.challonge_name.forEach(name => {
          if (name.toLowerCase() === participant.display_name.toLowerCase()) {
            p = player
          }
        })
      }
    })
  }

  if (p) {
    return p._id
  } else {
    console.log(participant)
    p = readlineSync.question(`${participant.display_name} db id please: `)
    return mongojs.ObjectId(p)
  }
}

const calcScore = scores => {
  let tmpscr = []
  scores = scores.split(',')
  scores.forEach(score => {
    let scr = score.split('-')
    tmpscr.push({
      p1: scr[0],
      p2: scr[1]
    })
  })
  return tmpscr
}
