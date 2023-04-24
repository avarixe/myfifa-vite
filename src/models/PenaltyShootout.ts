import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class PenaltyShootout extends Model {
  static entity = 'PenaltyShootout'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      matchId: this.attr(0),

      // Database fields
      homeScore: this.number(0),
      awayScore: this.number(0)
    }
  }

  static casts() {
    return {
      id: NumberCast,
      matchId: NumberCast
    }
  }
}
