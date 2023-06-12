import { Model } from 'pinia-orm'
import { Attr, Str, Bool, Cast } from 'pinia-orm/dist/decorators'
import { NumberCast } from 'pinia-orm/dist/casts'

export default class User extends Model {
  static entity = 'User'

  // Primary/Foreign keys
  @Cast(() => NumberCast) @Attr(0) declare id: number

  // Database fields
  @Str('') declare fullName: string
  @Str('') declare username: string
  @Str('') declare email: string
  @Bool(false) declare admin: boolean
}
