<script setup lang="ts">
  import axios from 'axios'

  const { team } = useTeam()

  const { data, executeQuery } = await useQuery({
    query: gql`
      query ($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
            birthYear
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
              ...BaseCapData
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
            ...BaseSquadData
            squadPlayers {
              ...BaseSquadPlayerData
            }
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
      ${baseCapFragment}
      ${goalFragment}
      ${bookingFragment}
      ${penaltyShootoutFragment}
      ${baseSquadFragment}
      ${baseSquadPlayerFragment}
      ${competitionFragment}
      ${stageFragment}
    `,
    variables: { teamId: team.value.id },
    pause: true
  })

  async function imageUrlToBase64(url: string) {
    const { data } = await axios.get(url, {
      responseType: 'blob'
    })
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(data)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
      reader.onerror = reject
    })
  }

  const loading = ref(false)
  async function onClick() {
    loading.value = true
    await executeQuery()

    const teamData = data.value.team

    if (team.value.badgeUrl) {
      teamData.badgePath = await imageUrlToBase64(team.value.badgeUrl)
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
