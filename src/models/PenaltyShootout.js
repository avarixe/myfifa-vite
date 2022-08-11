import { Model } from 'pinia-orm'

export default class PenaltyShootout extends Model {
  static entity = 'PenaltyShootout'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),

      // Database fields
      homeScore: this.number(0),
      awayScore: this.number(0)
    }
  }

  static casts () {
    return {
      id: 'number',
      matchId: 'number'
    }
  }
}
