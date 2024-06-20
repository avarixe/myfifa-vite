import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, Str } from 'pinia-orm/dist/decorators'

export default class Injury extends Model {
  static entity = 'Injury'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str('') declare startedOn: string
  @Str('') declare endedOn: string
  @Str('') declare description: string
  @Str('') declare createdAt: string

  @Str('Injury') declare type: string
}
