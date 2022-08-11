import { Model } from 'pinia-orm'

export default class Loan extends Model {
  static entity = 'Loan'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      signedOn: this.string(''),
      endedOn: this.string('').nullable(),
      origin: this.string(''),
      destination: this.string(''),
      wagePercentage: this.number(null).nullable(),
      transferFee: this.number(null).nullable(),
      addonClause: this.number(null).nullable(),
      createdAt: this.string('')
    }
  }

  static casts () {
    return {
      id: 'number',
      playerId: 'number'
    }
  }
}
