import { Model } from 'pinia-orm'
import Player from './Player'

export default class Goal extends Model {
  static entity = 'Goal'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(null).nullable(),
      assistId: this.number(null).nullable(),

      // Database fields
      playerName: this.string(''),
      assistedBy: this.string('').nullable(),
      minute: this.number(0),
      home: this.boolean(true),
      ownGoal: this.boolean(false),
      penalty: this.boolean(false),
      createdAt: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId', 'id'),
      assistingPlayer: this.belongsTo(Player, 'assistId', 'id')
    }
  }

  static casts () {
    return {
      id: 'number',
      matchId: 'number',
      playerId: 'number',
      assistId: 'number'
    }
  }
}
