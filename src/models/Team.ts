import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Team extends Model {
  static entity = 'Team'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),

      // Database fields
      name: this.string(''),
      startedOn: this.string(''),
      currentlyOn: this.string(''),
      active: this.boolean(true),
      currency: this.string('$'),

      // Calculated fields
      timePeriod: this.string(''),
      badgePath: this.string(''),

      // Associations
      players: this.hasMany(Player, 'teamId'),
      matches: this.hasMany(Match, 'teamId'),
      squads: this.hasMany(Squad, 'teamId'),
      competitions: this.hasMany(Competition, 'teamId')
    }
  }

  static casts() {
    return {
      id: NumberCast
    }
  }

  get badgeUrl(): string {
    return this.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${this.badgePath}`
      : null
  }
}
