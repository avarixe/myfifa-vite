export interface CapRecord {
  id: number
  pos: string
  playerId: number
  start: number
  stop: number
  subbedOut: boolean
}

export interface CapAttributes {
  pos?: string
  playerId?: number
}

export interface MatchRecord {
  home: string
  away: string
}

export interface MatchEvent {
  timelineType: string
  home: boolean
  minute: number
  constructor: {
    entity: string
  }
}

export interface BookingRecord extends MatchEvent {
  playerName: string
  redCard: boolean
}

export interface GoalRecord extends MatchEvent {
  playerName: string
  assistedBy?: string
  ownGoal: boolean
}

export interface PlayerRecord {
  id: number
  name: string
}

export interface StageAttributes {
  name?: string
  fixturesAttributes?: {
    id?: number
    homeTeam?: string
    awayTeam?: string
    legsAttributes?: {
      id?: number
      homeScore?: string
      awayScore?: string
      _destroy?: boolean
    }[]
    _destroy?: boolean
  }[]
  tableRowsAttributes?: {
    id?: number
    name?: string
    wins?: number
    draws?: number
    losses?: number
    goalsFor?: number
    goalsAgainst?: number
    _destroy?: boolean
  }[]
}

export interface StageRecord {
  id: number
  name: string
  table: boolean
}
