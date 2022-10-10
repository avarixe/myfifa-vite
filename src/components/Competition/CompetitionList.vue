<script setup>
  import { Competition } from '~/models'

  const props = defineProps({
    season: { type: Number, required: true }
  })

  const { currentSeason, seasonLabel, team } = useTeam()

  const competitionRepo = useRepo(Competition)
  const competitions = computed(() =>
    competitionRepo
      .with('team')
      .where('teamId', team.value.id)
      .where('season', props.season)
      .get()
  )
</script>

<template>
  <v-list>
    <v-list-subheader>
      <v-btn
        :to="`/teams/${team.id}/seasons/${season}`"
        size="x-large"
        color="primary"
        variant="text"
        class="text-h4"
        v-text="seasonLabel(season)"
      />
    </v-list-subheader>
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
      v-for="competition in competitions"
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
</template>
