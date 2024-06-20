import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, Num, Str } from 'pinia-orm/dist/decorators'

export default class PenaltyShootout extends Model {
  static entity = 'PenaltyShootout'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number

  // Database fields
  @Num(0) declare homeScore: number
  @Num(0) declare awayScore: number

  @Str('PenaltyShootout') declare type: string
}
