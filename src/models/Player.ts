import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import {
  Attr,
  BelongsTo,
  BelongsToMany,
  Bool,
  Cast,
  HasMany,
  Num,
  Str
} from 'pinia-orm/dist/decorators'

import Booking from './Booking'
import Cap from './Cap'
import Contract from './Contract'
import Goal from './Goal'
import Injury from './Injury'
import Loan from './Loan'
import Match from './Match'
import PlayerHistory from './PlayerHistory'
import Team from './Team'
import Transfer from './Transfer'

export default class Player extends Model {
  static entity = 'Player'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare teamId: number

  // Database fields
  @Str('') declare name: string
  @Str('') declare nationality: string
  @Str('') declare pos: string
  @Attr([]) declare secPos: string[]
  @Num(60) declare ovr: number
  @Num(0) declare value: number
  @Str(null) declare status: string | null
  @Bool(false) declare youth: boolean
  @Num(null) declare kitNo: number | null
  @Attr({}) declare coverage: Record<string, number | null>

  // Calculated fields
  @Num(16) declare age: number

  // Associations
  @BelongsTo(() => Team, 'teamId') declare team: Team
  @HasMany(() => PlayerHistory, 'playerId') declare histories: PlayerHistory[]
  @HasMany(() => Injury, 'playerId') declare injuries: Injury[]
  @HasMany(() => Loan, 'playerId') declare loans: Loan[]
  @HasMany(() => Contract, 'playerId') declare contracts: Contract[]
  @HasMany(() => Transfer, 'playerId') declare transfers: Transfer[]
  @HasMany(() => Cap, 'playerId') declare caps: Cap[]
  @BelongsToMany(() => Match, () => Cap, 'playerId', 'matchId')
  declare matches: Match[]
  @HasMany(() => Goal, 'playerId') declare goals: Goal[]
  @HasMany(() => Goal, 'assistId') declare assists: Goal[]
  @HasMany(() => Booking, 'playerId') declare bookings: Booking[]

  get isActive() {
    return this.status === null
  }

  get statusColor() {
    switch (this.status) {
      case 'Active':
        return 'light-green'
      case 'Loaned':
        return 'deep-orange'
      case 'Injured':
        return 'pink'
      case 'Pending':
        return 'orange'
      default:
        return ''
    }
  }

  get statusIcon() {
    switch (this.status) {
      case 'Active':
        return 'account-check'
      case 'Loaned':
        return 'transit-transfer'
      case 'Injured':
        return 'hospital'
      case 'Pending':
        return 'lock-clock'
      default:
        return 'minus'
    }
  }

  get posIdx(): number {
    return positions.indexOf(this.pos)
  }

  get flag(): string {
    return nationalities[this.nationality]
  }
}
