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
import Player from './Player'

export default class Goal extends Model {
  static entity = 'Goal'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number
  @Cast(() => NumberCast) @Attr(0) declare capId: number | null
  @Cast(() => NumberCast) @Attr(null) declare playerId: number | null
  @Cast(() => NumberCast) @Attr(0) declare assistCapId: number | null
  @Cast(() => NumberCast) @Attr(null) declare assistId: number | null

  // Database fields
  @Str('') declare playerName: string
  @Str('') declare assistedBy: string
  @Num(0) declare minute: number
  @Bool(true) declare home: boolean
  @Bool(false) declare ownGoal: boolean
  @Bool(false) declare penalty: boolean
  @Str('') declare createdAt: string

  // Associations
  @BelongsTo(() => Player, 'playerId') declare player: Player
  @BelongsTo(() => Player, 'assistId') declare assistingPlayer: Player
}
