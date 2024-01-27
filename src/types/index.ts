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
  capId?: number | null
  playerName?: string | null
  assistCapId?: number | null
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
}

export interface RoundStageAttributes extends StageAttributes {
  fixturesAttributes: FixtureAttributes[]
}

interface NestedAttributes {
  id?: number
  _destroy?: boolean
}

export interface FixtureAttributes extends NestedAttributes {
  homeTeam?: string | null
  awayTeam?: string | null
  legsAttributes: FixtureLegAttributes[]
}

export interface FixtureLegAttributes extends NestedAttributes {
  homeScore?: string | null
  awayScore?: string | null
}

export interface GroupStageAttributes extends StageAttributes {
  tableRowsAttributes: TableRowAttributes[]
}

export interface TableRowAttributes extends NestedAttributes {
  name?: string | null
  wins?: number | null
  draws?: number | null
  losses?: number | null
  goalsFor?: number | null
  goalsAgainst?: number | null
}
