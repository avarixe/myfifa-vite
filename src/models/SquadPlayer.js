import { Model } from 'pinia-orm'
import Player from './Player'

export default class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),
      squadId: this.number(0),

      // Database fields
      pos: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId')
    }
  }

  static casts () {
    return {
      id: 'number',
      playerId: 'number',
      squadId: 'number'
    }
  }

  get positionType () {
    return matchPositions[this.pos]
  }
}
