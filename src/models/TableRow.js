import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'

export class TableRow extends Model {
  static entity = 'TableRow'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      stageId: this.number(0),

      // Database fields
      name: this.string(''),
      wins: this.number(null),
      draws: this.number(null),
      losses: this.number(null),
      goalsFor: this.number(null),
      goalsAgainst: this.number(null),

      // Calculated fields
      goalDifference: this.number(null),
      points: this.number(null),

      // Associations
      stage: this.belongsTo(Stage, 'stageId')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      stageId: NumberCast
    }
  }
}
