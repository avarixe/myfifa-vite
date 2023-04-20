import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Booking extends Model {
  static entity = 'Booking'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      matchId: this.attr(0),
      playerId: this.attr(null),

      // Database fields
      playerName: this.string(''),
      minute: this.number(0),
      redCard: this.boolean(false),
      createdAt: this.string(''),

      // Calculated fields
      home: this.boolean(true),

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

  get timelineType(): string {
    return 'Booking'
  }
}
