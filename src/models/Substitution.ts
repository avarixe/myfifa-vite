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

export default class Substitution extends Model {
  static entity = 'Substitution'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number
  @Cast(() => NumberCast) @Attr(0) declare replacementId: number

  // Database fields
  @Str('') declare playerName: string
  @Str('') declare replacedBy: string
  @Num(0) declare minute: number
  @Bool(false) declare injury: boolean
  @Str('') declare createdAt: string

  // Calculated fields
  @Bool(true) declare home: boolean

  // Static fields
  @Str('Substitution') declare timelineType: string

  // Associations
  @BelongsTo(() => Player, 'replacementId') declare replacement: Player
}
