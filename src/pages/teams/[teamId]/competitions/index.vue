<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment, competitionFragment } from '~/fragments'
  import { Competition } from '~/models'

  const { team, data } = await useTeamQuery({
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

  const competitionRepo = useRepo(Competition)
  const competitions = computed(() =>
    competitionRepo.where('teamId', team.value.id).get()
  )
</script>

<template>
  <div>
    <router-link :to="`/teams/${team.id}`">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/competitions/new`">New</router-link>
  </div>

  <h1>Competitions</h1>

  <table>
    <thead>
      <th>Season</th>
      <th>Name</th>
      <th>Champion</th>
    </thead>
    <tbody>
      <tr
        v-for="competition in competitions"
        :key="competition.id"
      >
        <td>{{ competition.season }}</td>
        <td>
          <router-link :to="`/teams/${team.id}/competitions/${competition.id}`">
            {{ competition.name }}
          </router-link>
        </td>
        <td>{{ competition.champion }}</td>
      </tr>
    </tbody>
  </table>
</template>
