import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, HasMany, Str } from 'pinia-orm/dist/decorators'

import FixtureLeg from './FixtureLeg'

export default class Fixture extends Model {
  static entity = 'Fixture'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare stageId: number

  // Database fields
  @Str('') declare homeTeam: string
  @Str('') declare awayTeam: string

  // Associations
  @HasMany(() => FixtureLeg, 'fixtureId') declare legs: FixtureLeg[]
}
