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
  <q-list>
    <q-item-label header>
      <q-btn
        :to="`/teams/${team.id}/seasons/${season}`"
        size="x-large"
        color="primary"
        flat
        class="text-h4"
        :label="seasonLabel(season)"
      />
    </q-item-label>
    <q-item
      v-if="season === currentSeason"
      v-ripple
      clickable
      title="New Competition"
      :to="`/teams/${team.id}/competitions/new`"
    >
      <q-item-section avatar>
        <q-icon color="positive" name="mdi-plus-circle" />
      </q-item-section>
      <q-item-section>New Competition</q-item-section>
    </q-item>
    <q-item
      v-for="competition in competitions"
      :key="competition.id"
      v-ripple
      clickable
      :to="`/teams/${team.id}/competitions/${competition.id}`"
    >
      <q-item-section avatar>
        <q-icon
          :name="competition.statusIcon"
          :color="competition.statusColor"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ competition.name }}</q-item-label>
        <q-item-label caption>{{ competition.champion }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
