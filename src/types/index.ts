declare global {
  interface Window {
    XLSX: any
  }
}

export interface TableHeader {
  text: string
  value: string
  sortBy?: string
  width?: number
  align?: 'start' | 'center' | 'end'
  class?: string
  style?: string
  sortable?: boolean
}

export interface CapAttributes {
  pos?: string
  playerId?: number
}

export interface MatchFilters {
  season?: number
  competition?: string
  stage?: string
  team?: string
  result: Array<'win' | 'draw' | 'loss'>
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
