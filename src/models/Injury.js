import { Model } from 'pinia-orm'

export default class Injury extends Model {
  static entity = 'Injury'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      endedOn: this.string('').nullable(),
      description: this.string(''),
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
