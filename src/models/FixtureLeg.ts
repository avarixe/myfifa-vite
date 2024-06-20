import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Cast, Str } from 'pinia-orm/dist/decorators'

export default class FixtureLeg extends Model {
  static entity = 'FixtureLeg'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number
  @Cast(() => NumberCast) @Attr(0) declare fixtureId: number

  // Database fields
  @Str('') declare homeScore: string
  @Str('') declare awayScore: string

  get score(): string {
    return `${this.homeScore || ''} - ${this.awayScore || ''}`
  }
}
