import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, Num, Str } from 'pinia-orm/dist/decorators'

export default class Loan extends Model {
  static entity = 'Loan'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare playerId: number

  // Database fields
  @Str('') declare startedOn: string
  @Str('') declare signedOn: string
  @Str('') declare endedOn: string
  @Str('') declare origin: string
  @Str('') declare destination: string
  @Num(null) declare wagePercentage: number | null
  @Num(null) declare transferFee: number | null
  @Num(null) declare addonClause: number | null
  @Str('') declare createdAt: string

  @Str('Loan') declare type: string
}
