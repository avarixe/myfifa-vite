import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export class Fixture extends Model {
  static entity = 'Fixture'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stageId: this.number(0),

      // Database fields
      homeTeam: this.string(''),
      awayTeam: this.string(''),

      // Associations
      legs: this.hasMany(FixtureLeg, 'fixtureId', 'id')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      stageId: NumberCast
    }
  }
}
