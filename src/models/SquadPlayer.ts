import { Model } from 'pinia-orm'
import { Attr, Str, BelongsTo, Cast } from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Player from './Player'

export default class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number
  @Cast(() => NumberCast) @Attr(0) declare squadId: number

  // Database fields
  @Str('') declare pos: string

  // Associations
  @BelongsTo(() => Player, 'playerId') declare player: Player

  get positionType(): string {
    return matchPositions[this.pos]
  }
}
