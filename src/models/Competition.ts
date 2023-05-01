import { Model } from 'pinia-orm'
import {
  Attr,
  Str,
  Num,
  BelongsTo,
  HasMany,
  Cast
} from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Team from './Team'
import Stage from './Stage'

export default class Competition extends Model {
  static entity = 'Competition'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare teamId: number

  // Database fields
  @Num(0) declare season: number
  @Str('') declare name: string
  @Str(null) declare champion: string | null

  // Associations
  @BelongsTo(() => Team, 'teamId') declare team: Team
  @HasMany(() => Stage, 'competitionId') declare stages: Stage[]

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
