<script setup>
  import { Competition } from '~/models'

  const props = defineProps({
    season: { type: Number, required: true },
    competitionStats: { type: Array, required: true }
  })

  const headers = [
    { label: 'Competition', name: 'name', field: 'name', headerClasses: 'stick-left', classes: 'stick-left', sortable: true },
    { label: 'Status', name: 'status', field: 'status', align: 'center' },
    { label: 'GP', name: 'matchesPlayed', field: 'matchesPlayed', align: 'right', sortable: true },
    { label: 'W', name: 'wins', field: 'wins', align: 'right', sortable: true },
    { label: 'D', name: 'draws', field: 'draws', align: 'right', sortable: true },
    { label: 'L', name: 'losses', field: 'losses', align: 'right', sortable: true },
    { label: 'GF', name: 'goalsFor', field: 'goalsFor', align: 'right', sortable: true },
    { label: 'GA', name: 'goalsAgainst', field: 'goalsAgainst', align: 'right', sortable: true },
    { label: 'GD', name: 'goalDifference', field: 'goalDifference', align: 'right', sortable: true }
  ]

  const { team } = useTeam()

  const competitionRepo = useRepo(Competition)
  const competitions = computed(() =>
    competitionRepo
      .with('team')
      .where('teamId', team.value.id)
      .where('season', props.season)
      .get()
  )

  const results = computed(() =>
    props.competitionStats.reduce((obj, stats) => ({
      ...obj,
      [stats.competition]: stats
    }), {})
  )

  const rows = computed(() => competitions.value.map(competition => {
    const {
      wins = 0,
      draws = 0,
      losses = 0,
      goalsFor = 0,
      goalsAgainst = 0
    } = results.value[competition.name] || {}

    return {
      ...pick(competition, ['id', 'name', 'statusIcon', 'statusColor']),
      matchesPlayed: wins + draws + losses,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst
    }
  }))
</script>

<template>
  <q-table
    :columns="headers"
    :rows="rows"
    :pagination="{ rowsPerPage: 0 }"
    :rows-per-page-options="[0]"
    virtual-scroll
    hide-bottom
    class="mt-2"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-btn
          :to="`/teams/${team.id}/competitions/${props.row.id}`"
          size="small"
          flat
          color="primary"
          class="text-capitalize"
          :label="props.value"
        />
      </q-td>
    </template>
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-icon
          :color="props.row.statusColor"
          :name="props.row.statusIcon"
        />
      </q-td>
    </template>
  </q-table>
</template>
