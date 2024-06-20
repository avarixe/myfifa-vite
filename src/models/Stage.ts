import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import {
  Attr,
  BelongsTo,
  Bool,
  Cast,
  HasMany,
  Num,
  Str
} from 'pinia-orm/dist/decorators'

import Competition from './Competition'
import Fixture from './Fixture'
import TableRow from './TableRow'

export default class Stage extends Model {
  static entity = 'Stage'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare competitionId: number

  // Database fields
  @Str('') declare name: string
  @Num(0) declare numTeams: number
  @Num(0) declare numFixtures: number
  @Bool(false) declare table: boolean

  // Associations
  @BelongsTo(() => Competition, 'competitionId')
  declare competition: Competition
  @HasMany(() => Fixture, 'stageId') declare fixtures: Fixture[]
  @HasMany(() => TableRow, 'stageId') declare tableRows: TableRow[]
}
