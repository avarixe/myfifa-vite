<script setup lang="ts">
  import axios from 'axios'
  import { Buffer } from 'buffer'

  const { team } = useTeam()

  const { data, executeQuery } = await useQuery({
    query: gql`
      query ($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
            contracts {
              ...ContractData
            }
            transfers {
              ...TransferData
            }
            loans {
              ...LoanData
            }
            injuries {
              ...InjuryData
            }
            histories {
              ...PlayerHistoryData
            }
          }
          matches {
            ...MatchData
            caps {
              ...CapData
            }
            goals {
              ...GoalData
            }
            bookings {
              ...BookingData
            }
            penaltyShootout {
              ...PenaltyShootoutData
            }
          }
          squads {
            ...SquadData
          }
          competitions {
            ...CompetitionData
            stages {
              ...StageData
            }
          }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${contractFragment}
      ${transferFragment}
      ${loanFragment}
      ${injuryFragment}
      ${playerHistoryFragment}
      ${matchFragment}
      ${capFragment}
      ${goalFragment}
      ${bookingFragment}
      ${penaltyShootoutFragment}
      ${squadFragment}
      ${competitionFragment}
      ${stageFragment}
    `,
    variables: { teamId: team.value.id },
    pause: true
  })

  const loading = ref(false)
  async function onClick() {
    loading.value = true
    await executeQuery()

    const teamData = data.value.team

    if (team.value.badgeUrl) {
      const image = await axios.get(team.value.badgeUrl, {
        responseType: 'arraybuffer'
      })
      teamData.badgePath = `data:image/png:base64, ${Buffer.from(image.data).toString('base64')}`
    }

    const blob = new Blob([JSON.stringify(teamData, undefined, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${team.value.name}.json`

    a.click()

    // clean up
    URL.revokeObjectURL(url)

    loading.value = false
  }
</script>

<template>
  <v-btn color="primary" :loading="loading" @click="onClick">
    Export Data
  </v-btn>
</template>
