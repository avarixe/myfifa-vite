import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import {
  Attr,
  BelongsToMany,
  Cast,
  HasMany,
  Str
} from 'pinia-orm/dist/decorators'

import Player from './Player'
import SquadPlayer from './SquadPlayer'

export default class Squad extends Model {
  static entity = 'Squad'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare teamId: number

  // Database fields
  @Str('') declare name: string

  // Associations
  @HasMany(() => SquadPlayer, 'squadId') declare squadPlayers: SquadPlayer[]
  @BelongsToMany(() => Player, () => SquadPlayer, 'squadId', 'playerId')
  declare players: Player[]
}
