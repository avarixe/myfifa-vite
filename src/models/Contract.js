import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export class Contract extends Model {
  static entity = 'Contract'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      signedOn: this.string(''),
      wage: this.number(null),
      signingBonus: this.number(null),
      releaseClause: this.number(null),
      performanceBonus: this.number(null),
      bonusReq: this.number(null),
      bonusReqType: this.string(null),
      endedOn: this.string(''),
      startedOn: this.string(''),
      conclusion: this.string(null),
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

  get timelineType() {
    return 'Contract'
  }
}
