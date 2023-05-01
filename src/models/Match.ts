import { Model } from 'pinia-orm'
import {
  Attr,
  Str,
  Num,
  Bool,
  BelongsTo,
  HasOne,
  HasMany,
  BelongsToMany,
  Cast
} from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Team from './Team'
import PenaltyShootout from './PenaltyShootout'
import Goal from './Goal'
import Substitution from './Substitution'
import Booking from './Booking'
import Cap from './Cap'
import Player from './Player'

export default class Match extends Model {
  static entity = 'Match'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare teamId: number

  // Database fields
  @Str('') declare home: string
  @Str('') declare away: string
  @Str('') declare competition: string
  @Str('') declare stage: string
  @Str('') declare playedOn: string
  @Bool(false) declare extraTime: boolean
  @Num(0) declare homeScore: number
  @Num(0) declare awayScore: number

  // Calculated fields
  @Str('') declare score: string
  @Attr(null) declare teamResult: string | null
  @Num(0) declare season: number

  // Associations
  @BelongsTo(() => Team, 'teamId') declare team: Team
  @HasOne(() => PenaltyShootout, 'matchId')
  declare penaltyShootout: PenaltyShootout | null
  @HasMany(() => Goal, 'matchId') declare goals: Goal[]
  @HasMany(() => Substitution, 'matchId') declare substitutions: Substitution[]
  @HasMany(() => Booking, 'matchId') declare bookings: Booking[]
  @HasMany(() => Cap, 'matchId') declare caps: Cap[]
  @BelongsToMany(() => Player, () => Cap, 'matchId', 'playerId')
  declare players: Player[]

  get opponent(): string {
    return this.home === this.team.name ? this.away : this.home
  }

  get resultColor(): string {
    switch (this.teamResult) {
      case 'win':
        return 'success'
      case 'draw':
        return 'warning'
      case 'loss':
        return 'red'
      default:
        return ''
    }
  }
}
