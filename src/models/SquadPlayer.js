import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

  static fields() {
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

  static casts() {
    return {
      id: NumberCast,
      playerId: NumberCast,
      squadId: NumberCast
    }
  }

  get positionType() {
    return matchPositions[this.pos]
  }
}
