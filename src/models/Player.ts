import { Model } from 'pinia-orm'
import {
  Attr,
  Str,
  Num,
  Bool,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Cast
} from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Team from './Team'
import PlayerHistory from './PlayerHistory'
import Injury from './Injury'
import Loan from './Loan'
import Contract from './Contract'
import Transfer from './Transfer'
import Cap from './Cap'
import Match from './Match'
import Goal from './Goal'
import Booking from './Booking'

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
  @Attr({}) declare coverage: { [key: string]: number | null }

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

  get isActive(): boolean {
    return this.status && this.status.length > 0
  }

  get statusColor(): string {
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
        return null
    }
  }

  get statusIcon(): string {
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
