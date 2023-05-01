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

export default class Booking extends Model {
  static entity = 'Booking'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number
  @Cast(() => NumberCast) @Attr(null) declare playerId: number | null

  // Database fields
  @Str('') declare playerName: string
  @Num(0) declare minute: number
  @Bool(false) declare redCard: boolean
  @Str('') declare createdAt: string

  // Calculated fields
  @Bool(true) declare home: boolean

  // Static fields
  @Str('Booking') declare timelineType: string

  // Associations
  @BelongsTo(() => Match, 'matchId') declare match: Match
  @BelongsTo(() => Player, 'playerId') declare player: Player
}
