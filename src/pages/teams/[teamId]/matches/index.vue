<script setup>
  import { format, parseISO } from 'date-fns'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, matchFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = useTeamQuery({
    include: 'matches',
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
</script>

<template>
  <template v-if="team">
    <router-link :to="`/teams/${team.id}`">Team</router-link>

    <table :style="{ width: '100%' }">
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
          v-for="match in team.matches"
          :key="match.id"
          :style="{ textAlign: 'center' }"
        >
          <td>
            <div>{{ match.home }} v {{ match.away }}</div>
            <div>{{ match.score }}</div>
          </td>
          <td>
            <div>{{ match.competition }}</div>
            <i v-if="match.stage">{{ match.stage }}</i>
          </td>
          <td>{{ format(parseISO(match.playedOn), 'MMM dd, yyyy') }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
