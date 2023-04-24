import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Transfer extends Model {
  static entity = 'Transfer'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      playerId: this.attr(0),

      // Database fields
      signedOn: this.string(''),
      movedOn: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      fee: this.number(null),
      tradedPlayer: this.string(null),
      addonClause: this.number(null),
      createdAt: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      playerId: NumberCast
    }
  }

  get timelineType(): string {
    return 'Transfer'
  }

  get startedOn(): string {
    return this.movedOn
  }
}
