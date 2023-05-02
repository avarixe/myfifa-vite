import { Model } from 'pinia-orm'
import { Attr, Num, Cast } from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'

export default class PenaltyShootout extends Model {
  static entity = 'PenaltyShootout'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare matchId: number

  // Database fields
  @Num(0) declare homeScore: number
  @Num(0) declare awayScore: number
}
