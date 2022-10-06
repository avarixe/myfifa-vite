<script setup>
  import { Competition } from '~/models'

  const { team, seasonLabel } = await useTeamQuery({
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

  const headers = [
    { value: 'season', text: 'Season' },
    { value: 'name', text: 'Name' },
    { value: 'champion', text: 'Champion' }
  ]
</script>

<template>
  <h1>Competitions</h1>

  <v-btn :to="`/teams/${team.id}/competitions/new`">
    <v-icon left>mdi-plus</v-icon>
    Competition
  </v-btn>

  <data-table
    :headers="headers"
    :items="competitions"
    item-key="id"
    sort-by="season"
    sort-desc
  >
    <template #item-season="{ item: competition }">
      {{ seasonLabel(competition.season) }}
    </template>
    <template #item-name="{ item: competition }">
      <v-btn
        variant="text"
        color="primary"
        class="text-capitalize"
        :to="`/teams/${team.id}/competitions/${competition.id}`"
        v-text="competition.name"
      />
    </template>
  </data-table>
</template>
