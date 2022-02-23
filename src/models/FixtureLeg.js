import { Model } from 'pinia-orm'

export default class FixtureLeg extends Model {
  static entity = 'FixtureLeg'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      fixtureId: this.number(0),

      // Database fields
      homeScore: this.string('').nullable(),
      awayScore: this.string('').nullable()
    }
  }

  get score () {
    return `${this.homeScore || ''} - ${this.awayScore || ''}`
  }
}
