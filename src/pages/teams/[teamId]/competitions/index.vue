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
  <h1>Competitions</h1>

  <v-btn :to="`/teams/${team.id}/competitions/new`">
    <v-icon left>mdi-plus</v-icon>
    Competition
  </v-btn>

  <v-table>
    <thead>
      <tr>
        <th>Season</th>
        <th>Name</th>
        <th>Champion</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="competition in competitions"
        :key="competition.id"
      >
        <td>{{ competition.season }}</td>
        <td>
          <v-btn
            variant="text"
            color="primary"
            class="text-capitalize"
            :to="`/teams/${team.id}/competitions/${competition.id}`"
            v-text="competition.name"
          />
        </td>
        <td>{{ competition.champion }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
