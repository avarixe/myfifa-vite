import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Goal extends Model {
  static entity = 'Goal'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      matchId: this.attr(0),
      playerId: this.attr(null),
      assistId: this.attr(null),

      // Database fields
      playerName: this.string(''),
      assistedBy: this.string(''),
      minute: this.number(0),
      home: this.boolean(true),
      ownGoal: this.boolean(false),
      penalty: this.boolean(false),
      createdAt: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id'),
      assistingPlayer: this.belongsTo(Player, 'assistId', 'id')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      matchId: NumberCast,
      playerId: NumberCast,
      assistId: NumberCast
    }
  }

  get timelineType(): string {
    return 'Goal'
  }
}
