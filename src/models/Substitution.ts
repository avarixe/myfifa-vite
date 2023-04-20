import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Substitution extends Model {
  static entity = 'Substitution'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      matchId: this.attr(0),
      playerId: this.attr(0),
      replacementId: this.attr(0),

      // Database fields
      playerName: this.string(''),
      replacedBy: this.string(''),
      minute: this.number(0),
      injury: this.boolean(false),
      createdAt: this.string(''),

      // Calculated fields
      home: this.boolean(true),

      // Associations
      replacement: this.belongsTo(Player, 'replacementId', 'id')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      matchId: NumberCast,
      playerId: NumberCast,
      replacementId: NumberCast
    }
  }

  get timelineType(): string {
    return 'Substitution'
  }
}
