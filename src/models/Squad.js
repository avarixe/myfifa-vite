import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'
import SquadPlayer from './SquadPlayer'
import Player from './Player'

export default class Squad extends Model {
  static entity = 'Squad'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      name: this.string(''),

      // Associations
      squadPlayers: this.hasMany(SquadPlayer, 'squadId'),
      players: this.belongsToMany(Player, SquadPlayer, 'squadId', 'playerId')
    }
  }

  static casts () {
    return {
      id: NumberCast,
      teamId: NumberCast
    }
  }
}