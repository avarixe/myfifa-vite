export interface CapRecord {
  id: number
  pos: string
  playerId: number
  start: number
  stop: number
  subbedOut: boolean
  player?: PlayerRecord
}

export interface MatchRecord {
  home: string
  away: string
  caps?: CapRecord[]
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

export interface TableRowRecord {
  id: number
  name: string
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
}

export interface StageRecord {
  id: number
  name: string
  table: boolean
  tableRows?: TableRowRecord[]
}

export interface CompetitionRecord {
  id: number
  name: string
  champion?: string
  season: number
  stages?: StageRecord[]
}

export interface ContractRecord {
  id: number
  signedOn: string
  startedOn: string
  endedOn: string
  wage: number
  signingBonus?: number
  releaseClause?: number
  performanceBonus?: number
  bonusReq?: number
  bonusReqType?: string
}

export interface InjuryRecord {
  id: number
  startedOn: string
  endedOn: string
  description: string
}

export interface LoanRecord {
  id: number
  signedOn?: string
  startedOn?: string
  endedOn?: string
  wage?: number
  origin: string
  destination: string
  wagePercentage?: number
  transferFee?: number
  addonClause?: number
}

export interface TransferRecord {
  id: number
  signedOn?: string
  movedOn?: string
  origin: string
  destination: string
  fee?: number
  addonClause?: number
}

export interface PenaltyShootoutRecord {
  id: number
  homeScore: number
  awayScore: number
}

export interface SquadRecord {
  id: number
  name: string
  squadPlayers?: {
    id: number
    playerId: number
    pos: string
  }[]
}

export interface SubstitutionRecord extends MatchEvent {
  playerId: number
  replacementId: number
  injury?: boolean
}

export interface TeamRecord {
  id: number
  name: string
  startedOn: string
  currentlyOn: string
}

export interface UserRecord {
  id: number
  fullName: string
  username: string
  email: string
}
