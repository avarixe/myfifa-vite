<script setup>
  import { formatDate } from '~/filters'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, matchFragment } from '~/fragments'
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
</script>

<template>
  <h1>Matches</h1>

  <v-btn :to="`/teams/${team.id}/matches/new`">
    <v-icon left>mdi-plus</v-icon>
    Match
  </v-btn>

  <v-table>
    <thead>
      <tr>
        <th>Match</th>
        <th>Competition</th>
        <th>Date Played</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="match in matches"
        :key="match.id"
      >
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
      </tr>
    </tbody>
  </v-table>
</template>
