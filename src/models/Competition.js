import { Model } from 'pinia-orm'
import Stage from './Stage'
import Team from './Team'

class Competition extends Model {
  static entity = 'Competition'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      season: this.number(0),
      name: this.string(''),
      champion: this.string(null).nullable(),
      presetFormat: this.attr(null),
      numTeams: this.number(null).nullable(),
      numTeamsPerGroup: this.number(null).nullable(),
      numAdvancesFromGroup: this.number(null).nullable(),

      // Associations
      team: this.belongsTo(Team, 'teamId'),
      stages: this.hasMany(Stage, 'competitionId')
    }
  }

  static casts () {
    return {
      id: 'number',
      teamId: 'number'
    }
  }

  get statusIcon () {
    if (this.champion === this.team.name) {
      return 'mdi-trophy'
    } else if (this.champion) {
      return 'mdi-check'
    } else {
      return 'mdi-timelapse'
    }
  }

  get statusColor () {
    if (this.champion === this.team.name) {
      return 'yellow darken-2'
    } else if (this.champion) {
      return 'green'
    } else {
      return 'gray'
    }
  }
}

export default Competition
