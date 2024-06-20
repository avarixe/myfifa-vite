import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'
import { Attr, Bool, Cast, Str } from 'pinia-orm/dist/decorators'

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
