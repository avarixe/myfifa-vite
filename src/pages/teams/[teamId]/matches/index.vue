<script setup>
  import { Match } from '~/models'

  const { team, data } = await useTeamQuery({
    query: gql`
      query fetchMatchesPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          matches { ...MatchData }
        }
      }
      ${teamFragment}
      ${matchFragment}
    `
  })

  const matchRepo = useRepo(Match)
  const matches = computed(() =>
    matchRepo.where('teamId', team.value.id).get()
  )

  const headers = [
    { value: 'name', text: 'Match', sortable: false },
    { value: 'competition', text: 'Competition' },
    { value: 'playedOn', text: 'Date Played' },
    { value: 'link', text: 'Link', sortable: false }
  ]
</script>

<template>
  <h1>Matches</h1>

  <v-btn :to="`/teams/${team.id}/matches/new`">
    <v-icon left>mdi-plus</v-icon>
    Match
  </v-btn>

  <data-table
    :headers="headers"
    :items="matches"
    sort-by="playedOn"
    sort-desc
  >
    <template #item="{ item: match }">
      <td :style="{ textAlign: 'center' }">
        <div>{{ match.home }} v {{ match.away }}</div>
        <div>{{ match.score }}</div>
      </td>
      <td>
        <div>{{ match.competition }}</div>
        <i v-if="match.stage">{{ match.stage }}</i>
      </td>
      <td>{{ formatDate(match.playedOn) }}</td>
      <td>
        <v-btn
          variant="text"
          color="primary"
          icon="mdi-play"
          :to="`/teams/${team.id}/matches/${match.id}`"
        />
      </td>
    </template>
  </data-table>
</template>
