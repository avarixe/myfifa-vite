import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Competition extends Model {
  static entity = 'Competition'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      season: this.number(0),
      name: this.string(''),
      champion: this.string(null),

      // Associations
      team: this.belongsTo(Team, 'teamId'),
      stages: this.hasMany(Stage, 'competitionId')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      teamId: NumberCast
    }
  }

  get statusIcon(): string {
    if (this.champion === this.team.name) {
      return 'mdi-trophy'
    } else if (this.champion) {
      return 'mdi-check'
    } else {
      return 'mdi-timelapse'
    }
  }

  get statusColor(): string {
    if (this.champion === this.team.name) {
      return 'amber'
    } else if (this.champion) {
      return 'green'
    } else {
      return 'gray'
    }
  }
}
