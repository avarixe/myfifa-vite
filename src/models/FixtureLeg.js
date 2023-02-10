import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export default class FixtureLeg extends Model {
  static entity = 'FixtureLeg'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      fixtureId: this.number(0),

      // Database fields
      homeScore: this.string(''),
      awayScore: this.string('')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      fixtureId: NumberCast
    }
  }

  get score() {
    return `${this.homeScore || ''} - ${this.awayScore || ''}`
  }
}
