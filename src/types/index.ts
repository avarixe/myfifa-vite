declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ApexCharts: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CalHeatmap: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    XLSX: any
  }
}

export interface TableHeader {
  key: string
  title: string
  align?: 'start' | 'end' | 'center'
  sortable?: boolean
  width?: number
  fixed?: boolean
}

export interface TableSortItem {
  key: string
  order: boolean | 'asc' | 'desc'
}

export interface CapAttributes {
  pos?: string | null
  playerId?: number | null
}

export interface GoalAttributes {
  home?: boolean | null
  playerId?: number | null
  playerName?: string | null
  assistId?: number | null
  assistedBy?: string | null
  ownGoal?: boolean | null
  penalty?: boolean | null
}

export interface MatchFilters {
  season?: number | null
  competition?: string | null
  stage?: string | null
  team?: string | null
  result: Array<'win' | 'draw' | 'loss'>
}

export interface StageAttributes {
  name?: string | null
  fixturesAttributes?: {
    id?: number
    homeTeam?: string | null
    awayTeam?: string | null
    legsAttributes?: {
      id?: number
      homeScore?: string | null
      awayScore?: string | null
      _destroy?: boolean
    }[]
    _destroy?: boolean
  }[]
  tableRowsAttributes?: {
    id?: number
    name?: string | null
    wins?: number | null
    draws?: number | null
    losses?: number | null
    goalsFor?: number | null
    goalsAgainst?: number | null
    _destroy?: boolean
  }[]
}
