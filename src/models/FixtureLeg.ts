import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class FixtureLeg extends Model {
  static entity = 'FixtureLeg'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      fixtureId: this.attr(0),

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

  get score(): string {
    return `${this.homeScore || ''} - ${this.awayScore || ''}`
  }
}
