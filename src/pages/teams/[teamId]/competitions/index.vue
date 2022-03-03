<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment, competitionFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = useTeamQuery({
    include: 'competitions',
    query: gql`
      query fetchCompetitionsPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions { ...CompetitionData }
        }
      }
      ${teamFragment}
      ${competitionFragment}
    `
  })
</script>

<template>
  <template v-if="team">
    <router-link :to="`/teams/${team.id}`">Team</router-link>

    <table :style="{ width: '100%' }">
      <thead>
        <tr>
          <th>Season</th>
          <th>Name</th>
          <th>Champion</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="competition in team.competitions"
          :key="competition.id"
          :style="{ textAlign: 'center' }"
        >
          <td>{{ competition.season }}</td>
          <td>{{ competition.name }}</td>
          <td>{{ competition.champion }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
