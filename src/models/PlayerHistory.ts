import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, Num, Str } from 'pinia-orm/dist/decorators'

export default class PlayerHistory extends Model {
  static entity = 'PlayerHistory'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str('') declare recordedOn: string
  @Num(60) declare ovr: number
  @Num(0) declare value: number
  @Num(0) declare kitNo: number
}
