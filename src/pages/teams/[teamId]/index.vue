<script setup>
  const { data, team, currentSeason } = await useTeamQuery({
    query: gql`
      query loadTeamDashboard($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          lastMatch { ...MatchData }
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
          competitions { ...CompetitionData }
        }
      }
      ${teamFragment}
      ${matchFragment}
      ${competitionFragment}
    `
  })

  const {
    lastMatch,
    injuredPlayers,
    loanedPlayers,
    expiringPlayers
  } = data.value.team

  const router = useRouter()
</script>

<template>
  <h3 class="text-h3">{{ team.name }}</h3>

  <div>
    <q-btn :to="`/teams/${team.id}/edit`">Edit</q-btn>
    &nbsp;
    <remove-button
      :record="team"
      store="Team"
      label="Team"
      @removed="router.push('/teams')"
    />
  </div>

  <div class="row">
    <div class="col col-12 col-md-6 pa-2">
      <q-card class="mt-4">
        <q-card-section>
          <div class="text-h6">Current Season</div>
          <competition-list :season="currentSeason" />
        </q-card-section>
      </q-card>

      <q-card v-if="lastMatch" class="mt-4">
        <q-card-section>
          <div class="text-h6">Latest Match</div>
          <div class="text-center font-weight-light">
            <div class="mb-0">
              {{ lastMatch.competition }}
              <span v-if="lastMatch.stage">· {{ lastMatch.stage }}</span>
            </div>
            <div class="text-h6 mt-0 mb-3">{{ lastMatch.home }} v {{ lastMatch.away }}</div>
            <div class="text-h6 mb-0">{{ lastMatch.score }}</div>
            <div class="mt-0 mb-2">{{ formatDate(lastMatch.playedOn) }}</div>
          </div>
        </q-card-section>
        <q-card-actions class="justify-center">
          <q-btn
            :to="`/teams/${team.id}/matches/${lastMatch.id}`"
            color="primary"
            label="Go To Match"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div class="col col-12 col-md-6 pa-2">
      <q-card class="mt-4">
        <q-card-section class="text-h6">
          <q-icon color="pink" name="mdi-hospital" />
          Injured Players
        </q-card-section>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Player</th>
              <th class="text-center">Position</th>
              <th>Injury</th>
              <th class="text-right">Recovers On</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in injuredPlayers" :key="player.id">
              <td>
                <q-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  flat
                  color="primary"
                  class="text-capitalize"
                  :label="player.name"
                />
              </td>
              <td class="text-center">{{ player.pos }}</td>
              <td>{{ player.currentInjury.description }}</td>
              <td class="text-right">{{ formatDate(player.currentInjury.endedOn) }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>

      <q-card class="mt-4">
        <q-card-section class="text-h6">
          <q-icon color="deep-orange" name="mdi-transit-transfer" />
          Loaned Players
        </q-card-section>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Player</th>
              <th class="text-center">Position</th>
              <th class="text-right">Value</th>
              <th class="text-right">Transfer Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in loanedPlayers"
              :key="player.id"
              :class="{ 'text-negative': player.currentLoan.transferFee && player.currentLoan.transferFee < player.value }"
            >
              <td>
                <q-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  flat
                  color="primary"
                  class="text-capitalize"
                  :label="player.name"
                />
              </td>
              <td class="text-center">{{ player.pos }}</td>
              <td class="text-right">
                {{ formatMoney(player.value, team.currency) }}
              </td>
              <td class="text-right">
                <span v-if="player.currentLoan.transferFee">
                  {{ formatMoney(player.currentLoan.transferFee, team.currency) }}
                </span>
                <span v-if="player.currentLoan.addonClause">
                  (+{{ player.currentLoan.addonClause }}%)
                </span>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card>

      <q-card class="mt-4">
        <q-card-section class="text-h6">
          <q-icon color="blue" name="mdi-file-document-remove" />
          Expired Contracts
        </q-card-section>
        <q-markup-table>
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
                <q-btn
                  :to="`/teams/${team.id}/players/${player.id}`"
                  flat
                  color="primary"
                  class="text-capitalize"
                  :label="player.name"
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
          </tbody>
        </q-markup-table>
      </q-card>
    </div>
  </div>
</template>
