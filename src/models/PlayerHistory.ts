import { Model } from 'pinia-orm'
import { Attr, Str, Num, Cast } from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'

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
