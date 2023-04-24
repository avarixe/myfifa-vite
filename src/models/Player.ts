import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class Player extends Model {
  static entity = 'Player'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.attr(0),
      teamId: this.attr(0),

      // Database fields
      name: this.string(''),
      nationality: this.string(''),
      pos: this.string(''),
      secPos: this.attr([]),
      ovr: this.number(60),
      value: this.number(null),
      status: this.string(null),
      youth: this.boolean(false),
      kitNo: this.number(null),

      // Calculated fields
      age: this.number(16),

      // Associations
      team: this.belongsTo(Team, 'teamId'),
      histories: this.hasMany(PlayerHistory, 'playerId'),
      injuries: this.hasMany(Injury, 'playerId'),
      loans: this.hasMany(Loan, 'playerId'),
      contracts: this.hasMany(Contract, 'playerId'),
      transfers: this.hasMany(Transfer, 'playerId'),
      caps: this.hasMany(Cap, 'playerId'),
      matches: this.belongsToMany(Match, Cap, 'playerId', 'matchId'),
      goals: this.hasMany(Goal, 'playerId'),
      assists: this.hasMany(Goal, 'assistId'),
      bookings: this.hasMany(Booking, 'playerId')
    }
  }

  static casts() {
    return {
      id: NumberCast,
      teamId: NumberCast
    }
  }

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
