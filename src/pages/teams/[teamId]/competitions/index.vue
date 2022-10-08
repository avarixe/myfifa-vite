<script setup>
  import { Competition } from '~/models'

  const { team, seasonLabel, currentSeason } = await useTeamQuery({
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
    competitionRepo.with('team').where('teamId', team.value.id).get()
  )

  const competitionsBySeason = computed(() => {
    return competitions.value.reduce((hash, competition) => ({
      ...hash,
      [competition.season]: [
        ...hash[competition.season] || [],
        competition
      ]
    }), {})
  })

  const headers = [
    { value: 'season', text: 'Season' },
    { value: 'name', text: 'Name' },
    { value: 'champion', text: 'Champion' }
  ]

  const { smAndDown } = useDisplay()
</script>

<template>
  <h1>Competitions</h1>

  <v-timeline :side="smAndDown ? 'end' : null">
    <v-timeline-item
      v-for="season in [...Array(currentSeason + 1).keys()].reverse()"
      :key="season"
      dot-color="primary"
    >
      <template #icon>
        {{ season + 1 }}
      </template>
      <v-list>
        <v-list-subheader class="text-h4 text-primary">{{ seasonLabel(season) }}</v-list-subheader>
        <v-list-item
          v-if="season === currentSeason"
          title="New Competition"
          :to="`/teams/${team.id}/competitions/new`"
        >
          <template #prepend>
            <v-icon
              icon="mdi-plus-circle"
              color="success"
            />
          </template>
        </v-list-item>
        <v-list-item
          v-for="competition in competitionsBySeason[season]"
          :key="competition.id"
          :title="competition.name"
          :subtitle="competition.champion"
          :to="`/teams/${team.id}/competitions/${competition.id}`"
        >
          <template #prepend>
            <v-icon
              :icon="competition.statusIcon"
              :color="competition.statusColor"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-timeline-item>
  </v-timeline>
</template>
