import { Model } from 'pinia-orm'
import {
  Attr,
  Str,
  HasMany,
  BelongsToMany,
  Cast
} from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import SquadPlayer from './SquadPlayer'
import Player from './Player'

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
