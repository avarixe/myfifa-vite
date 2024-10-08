import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, BelongsTo, Cast, Num, Str } from 'pinia-orm/dist/decorators'

import Player from './Player'

export default class Contract extends Model {
  static entity = 'Contract'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str('') declare signedOn: string
  @Num(null) declare wage: number | null
  @Num(null) declare signingBonus: number | null
  @Num(null) declare releaseClause: number | null
  @Num(null) declare performanceBonus: number | null
  @Num(null) declare bonusReq: number | null
  @Str(null) declare bonusReqType: string | null
  @Str('') declare endedOn: string
  @Str('') declare startedOn: string
  @Str(null) declare conclusion: string | null
  @Str('') declare createdAt: string

  @Str('Contract') declare type: string

  // Associations
  @BelongsTo(() => Player, 'playerId') declare player: Player
}
