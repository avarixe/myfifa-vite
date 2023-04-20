import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Injury extends Model {
  static entity = 'Injury'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      playerId: this.attr(0),

      // Database fields
      startedOn: this.string(''),
      endedOn: this.string(''),
      description: this.string(''),
      createdAt: this.string('')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      playerId: NumberCast
    }
  }

  get timelineType(): string {
    return 'Injury'
  }
}
