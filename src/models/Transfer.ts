import { Model } from 'pinia-orm'
import { Attr, Str, Num, BelongsTo, Cast } from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Player from './Player'

export default class Transfer extends Model {
  static entity = 'Transfer'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str(null) declare signedOn: string | null
  @Str(null) declare movedOn: string | null
  @Str('') declare origin: string
  @Str('') declare destination: string
  @Num(null) declare fee: number | null
  @Str(null) declare tradedPlayer: string | null
  @Num(null) declare addonClause: number | null
  @Str('') declare createdAt: string

  // Static fields
  @Str('Transfer') declare timelineType: 'Transfer'

  // Associations
  @BelongsTo(() => Player, 'playerId') declare player: Player

  get startedOn(): string | null {
    return this.movedOn
  }
}
