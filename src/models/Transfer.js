import { Model } from 'pinia-orm'
import { NumberCast } from 'pinia-orm/casts'
import Player from './Player'

export default class Transfer extends Model {
  static entity = 'Transfer'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      playerId: this.number(0),

      // Database fields
      signedOn: this.string(''),
      movedOn: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      fee: this.number(null),
      tradedPlayer: this.string(null),
      addonClause: this.number(null),
      createdAt: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id')
    }
  }

  static casts () {
    return {
      id: NumberCast,
      playerId: NumberCast
    }
  }
}
