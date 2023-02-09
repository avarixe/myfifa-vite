import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export default class Loan extends Model {
  static entity = 'Loan'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      signedOn: this.string(''),
      endedOn: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      wagePercentage: this.number(null),
      transferFee: this.number(null),
      addonClause: this.number(null),
      createdAt: this.string('')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      playerId: NumberCast
    }
  }

  get timelineType() {
    return 'Loan'
  }
}
