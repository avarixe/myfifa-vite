import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export class Goal extends Model {
  static entity = 'Goal'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(null),
      assistId: this.number(null),

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

  get timelineType() {
    return 'Goal'
  }
}
