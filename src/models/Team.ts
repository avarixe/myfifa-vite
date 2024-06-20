import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Bool, Cast, HasMany, Str } from 'pinia-orm/dist/decorators'

import Competition from './Competition'
import Match from './Match'
import Player from './Player'
import Squad from './Squad'

export default class Team extends Model {
  static entity = 'Team'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(null) declare previousId: number | null

  // Database fields
  @Str('') declare name: string
  @Str('') declare managerName: string
  @Str(null) declare game: string | null
  @Str('') declare startedOn: string
  @Str('') declare currentlyOn: string
  @Bool(true) declare active: boolean
  @Str('$') declare currency: string
  @Str('') declare createdAt: string

  // Calculated fields
  @Str('') declare timePeriod: string
  @Str('') declare badgePath: string

  // Associations
  @HasMany(() => Player, 'teamId') declare players: Player[]
  @HasMany(() => Match, 'teamId') declare matches: Match[]
  @HasMany(() => Squad, 'teamId') declare squads: Squad[]
  @HasMany(() => Competition, 'teamId') declare competitions: Competition[]

  get badgeUrl() {
    return this.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${this.badgePath}`
      : undefined
  }
}
