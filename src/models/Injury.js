import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export default class Injury extends Model {
  static entity = 'Injury'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      startedOn: this.string(''),
      endedOn: this.string(''),
      description: this.string(''),
      createdAt: this.string('')
    }
  }

  static casts () {
    return {
      id: NumberCast,
      playerId: NumberCast
    }
  }

  get timelineType () {
    return 'Injury'
  }
}
