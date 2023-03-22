import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Cap extends Model {
  static entity = 'Cap'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(0),

      // Database fields
      pos: this.string(''),
      start: this.number(0),
      stop: this.number(90),
      ovr: this.number(3),
      rating: this.number(0),
      subbedOut: this.boolean(false),

      // Associations
      match: this.belongsTo(Match, 'matchId'),
      player: this.belongsTo(Player, 'playerId')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      matchId: NumberCast,
      playerId: NumberCast
    }
  }
}
