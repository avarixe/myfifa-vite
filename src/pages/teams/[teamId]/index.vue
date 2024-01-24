<script setup lang="ts">
  const { data, team, currentSeason } = await useTeamQuery<{
    team: {
      lastMatch: {
        id: string
        home: string
        away: string
        score: string
        playedOn: string
        competition: string
        stage: string | null
      }
      injuredPlayers: {
        id: string
        name: string
        pos: string
        currentInjury: {
          description: string
          endedOn: string
        }
      }[]
      loanedPlayers: {
        id: string
        name: string
        pos: string
        value: number
        currentLoan: {
          transferFee: number | null
          addonClause: number | null
        }
      }[]
      expiringPlayers: {
        id: string
        name: string
        pos: string
        value: number
        currentContract: {
          wage: number
        }
      }[]
      coverage: Record<string, number[]>
    }
  }>({
    query: gql`
      query loadTeamDashboard($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          lastMatch {
            ...MatchData
          }
          coverage {
            ${matchPositions.join(' ')}
          }
          injuredPlayers {
            id
            name
            pos
            currentInjury {
              description
              startedOn
              endedOn
            }
          }
          loanedPlayers {
            id
            name
            pos
            value
            currentLoan {
              transferFee
              addonClause
            }
          }
          expiringPlayers {
            id
            name
            pos
            value
            currentContract {
              wage
            }
          }
          competitions {
            ...CompetitionData
          }
        }
      }
      ${teamFragment}
      ${matchFragment}
      ${competitionFragment}
    `
  })

  const { lastMatch, injuredPlayers, loanedPlayers, expiringPlayers } =
    data.value?.team || {}

  const coverageScores = computed(() => {
    const coverage = data.value?.team?.coverage || {}
    const scores: Record<string, number> = {}

    for (const pos in coverage) {
      let score = 0

      if (matchPositions.includes(pos)) {
        coverage[pos]?.forEach(cov => {
          if (cov < 500) {
            score += 0.3
          } else if (cov < 1000) {
            score += 0.7
          } else if (cov < 1500) {
            score += 1
          } else if (cov < 2000) {
            score += 1.5
          } else if (cov < 2500) {
            score += 2
          } else if (cov < 3000) {
            score += 2.5
          } else {
            score += 3
          }
        })
      }

      scores[pos] = score
    }

    return scores
  })

  const router = useRouter()
</script>

<template>
  <div class="d-flex align-center">
    <v-btn icon variant="text" class="mr-2">
      <v-avatar>
        <v-img v-if="team.badgePath" :src="team.badgeUrl" />
        <v-icon v-else>mdi-shield-off-outline</v-icon>
        <v-tooltip location="top" activator="parent">
          Click to change Badge
        </v-tooltip>
      </v-avatar>

      <team-badge-uploader :team="team" />
    </v-btn>
    <div>
      <div class="text-h4">{{ team.name }}</div>
      <div class="text-body-1">Manager: {{ team.managerName }}</div>
      <div v-if="team.game" class="text-body-1">Game: {{ team.game }}</div>
    </div>
  </div>

  <div class="mt-2">
    <v-btn :to="`/teams/${team.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="team"
      store="Team"
      label="Team"
      @removed="router.push('/teams')"
    />
  </div>

  <v-row dense>
    <v-col cols="12" md="6">
      <v-card class="mt-4">
        <v-card-title>Current Season</v-card-title>
        <v-card-text>
          <competition-list :season="currentSeason" />
        </v-card-text>
      </v-card>

      <v-card v-if="lastMatch" class="mt-4">
        <v-card-title>Latest Match</v-card-title>
        <v-card-text class="text-center font-weight-light">
          <div class="mb-0">
            {{ lastMatch.competition }}
            <span v-if="lastMatch.stage">· {{ lastMatch.stage }}</span>
          </div>
          <div class="text-h6 mt-0 mb-3">
            {{ lastMatch.home }} v {{ lastMatch.away }}
          </div>
          <div class="text-h6 mb-0">{{ lastMatch.score }}</div>
          <div class="mt-0 mb-2">{{ formatDate(lastMatch.playedOn) }}</div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            :to="`/teams/${team.id}/matches/${lastMatch.id}`"
            text="Go To Match"
            color="primary"
          />
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col v-if="coverageScores" cols="12" md="6">
      <v-card class="mt-4">
        <v-card-title>
          <v-icon start color="info" icon="mdi-vector-polygon-variant" />
          Current Coverage
        </v-card-title>
        <v-card-text>
          <team-coverage :coverage="coverageScores" />
        </v-card-text>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>
          <v-icon start color="pink" icon="mdi-hospital" />
          Injured Players
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th>Player</th>
              <th class="text-center">Position</th>
              <th>Injury</th>
              <th class="text-right">Recovers On</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in injuredPlayers" :key="player.id">
              <td>
                <v-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  :text="player.name"
                  variant="text"
                  color="primary"
                  class="text-capitalize"
                />
              </td>
              <td class="text-center">{{ player.pos }}</td>
              <td>{{ player.currentInjury.description }}</td>
              <td class="text-right">
                {{ formatDate(player.currentInjury.endedOn) }}
              </td>
            </tr>
            <tr v-if="!injuredPlayers || injuredPlayers.length === 0">
              <td colspan="4" class="text-caption text-center text-disabled">
                No Injured Players
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>
          <v-icon start color="deep-orange" icon="mdi-transit-transfer" />
          Loaned Players
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th>Player</th>
              <th class="text-center">Position</th>
              <th class="text-right">Value</th>
              <th class="text-right">Transfer Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in loanedPlayers"
              :key="player.id"
              :class="{
                'text-error':
                  player.currentLoan.transferFee &&
                  player.currentLoan.transferFee < player.value
              }"
            >
              <td>
                <v-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  :text="player.name"
                  variant="text"
                  color="primary"
                  class="text-capitalize"
                />
              </td>
              <td class="text-center">{{ player.pos }}</td>
              <td class="text-right">
                {{ formatMoney(player.value, team.currency) }}
              </td>
              <td class="text-right">
                <span v-if="player.currentLoan.transferFee">
                  {{
                    formatMoney(player.currentLoan.transferFee, team.currency)
                  }}
                </span>
                <span v-if="player.currentLoan.addonClause">
                  (+{{ player.currentLoan.addonClause }}%)
                </span>
              </td>
            </tr>
            <tr v-if="!loanedPlayers || loanedPlayers.length === 0">
              <td colspan="4" class="text-caption text-center text-disabled">
                No Loaned Players
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-card class="mt-4">
        <v-card-title>
          <v-icon start color="blue" icon="mdi-file-document-remove" />
          Expiring Contracts
        </v-card-title>
        <v-table>
          <thead>
            <tr>
              <th>Player</th>
              <th class="text-center">Position</th>
              <th class="text-right">Value</th>
              <th class="text-right">Wage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in expiringPlayers" :key="player.id">
              <td>
                <v-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  :text="player.name"
                  variant="text"
                  color="primary"
                  class="text-capitalize"
                />
              </td>
              <td class="text-center">{{ player.pos }}</td>
              <td class="text-right">
                {{ formatMoney(player.value, team.currency) }}
              </td>
              <td class="text-right">
                {{ formatMoney(player.currentContract.wage, team.currency) }}
              </td>
            </tr>
            <tr v-if="!expiringPlayers || expiringPlayers.length === 0">
              <td colspan="4" class="text-caption text-center text-disabled">
                No Expiring Contracts
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>
</template>
