declare global {
  interface Window {
    ApexCharts: any
    CalHeatmap: any
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
