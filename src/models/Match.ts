import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import {
  Attr,
  BelongsTo,
  BelongsToMany,
  Bool,
  Cast,
  HasMany,
  HasOne,
  Num,
  Str
} from 'pinia-orm/dist/decorators'

import Booking from './Booking'
import Cap from './Cap'
import Goal from './Goal'
import PenaltyShootout from './PenaltyShootout'
import Player from './Player'
import Team from './Team'

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
  @Num(null) declare homeXg: number | null
  @Num(null) declare awayXg: number | null
  @Num(50) declare homePossession: number
  @Num(50) declare awayPossession: number

  // Calculated fields
  @Str('') declare score: string
  @Attr(null) declare teamResult: string | null
  @Num(0) declare season: number

  // Associations
  @BelongsTo(() => Team, 'teamId') declare team: Team
  @HasOne(() => PenaltyShootout, 'matchId')
  declare penaltyShootout: PenaltyShootout | null
  @HasMany(() => Goal, 'matchId') declare goals: Goal[]
  @HasMany(() => Booking, 'matchId') declare bookings: Booking[]
  @HasMany(() => Cap, 'matchId') declare caps: Cap[]
  @BelongsToMany(() => Player, () => Cap, 'matchId', 'playerId')
  declare players: Player[]

  get opponent() {
    return this.home === this.team.name ? this.away : this.home
  }

  get endOfMatch() {
    return this.extraTime ? 120 : 90
  }

  get resultColor() {
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
