import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/dist/casts'

export class User extends Model {
  static entity = 'User'

  static fields() {
    return {
      // Primary/Foreign keys
      id: this.number(0),

      // Database fields
      fullName: this.string(''),
      username: this.string(''),
      email: this.string(''),
      admin: this.boolean(false),
      darkMode: this.boolean(false)
    }
  }

  static casts() {
    return {
      id: NumberCast
    }
  }
}
