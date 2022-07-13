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
  <div>
    <router-link :to="`/teams/${team.id}`">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/matches/new`">New</router-link>
  </div>

  <h1>Matches</h1>

  <table>
    <thead>
      <th>Match</th>
      <th>Competition</th>
      <th>Date Played</th>
      <th>Link</th>
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
          <router-link :to="`/teams/${team.id}/matches/${match.id}`">
            Link
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>
