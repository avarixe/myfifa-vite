import { Model } from 'pinia-orm'
import {
  Attr,
  Str,
  Num,
  Bool,
  BelongsTo,
  Cast
} from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'
import Match from './Match'
import Player from './Player'

export default class Cap extends Model {
  static entity = 'Cap'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str('') declare pos: string
  @Num(0) declare start: number
  @Num(90) declare stop: number
  @Num(3) declare ovr: number
  @Num(0) declare rating: number | null
  @Bool(false) declare subbedOut: boolean

  // Associations
  @BelongsTo(() => Match, 'matchId') declare match: Match
  @BelongsTo(() => Player, 'playerId') declare player: Player
}
