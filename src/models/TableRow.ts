import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, BelongsTo, Cast, Num, Str } from 'pinia-orm/dist/decorators'

import Stage from './Stage'

export default class TableRow extends Model {
  static entity = 'TableRow'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare stageId: number

  // Database fields
  @Str('') declare name: string | null
  @Num(null) declare wins: number | null
  @Num(null) declare draws: number | null
  @Num(null) declare losses: number | null
  @Num(null) declare goalsFor: number | null
  @Num(null) declare goalsAgainst: number | null

  // Calculated fields
  @Num(null) declare goalDifference: number | null
  @Num(null) declare points: number | null

  // Associations
  @BelongsTo(() => Stage, 'stageId') declare stage: Stage
}
