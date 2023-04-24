import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      playerId: this.attr(0),
      squadId: this.attr(0),

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

  get positionType(): string {
    return matchPositions[this.pos]
  }
}
