<script setup lang="ts">
  import { Competition } from '~/models'

  interface CompetitionStats {
    name: string
    competition: string
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
  }

  const props = defineProps<{
    season: number
    competitionStats: CompetitionStats[]
  }>()

  const headers: TableHeader[] = [
    { title: 'Competition', key: 'name', fixed: true },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'GP', key: 'matchesPlayed', align: 'end' },
    { title: 'W', key: 'wins', align: 'end' },
    { title: 'D', key: 'draws', align: 'end' },
    { title: 'L', key: 'losses', align: 'end' },
    { title: 'GF', key: 'goalsFor', align: 'end' },
    { title: 'GA', key: 'goalsAgainst', align: 'end' },
    { title: 'GD', key: 'goalDifference', align: 'end' }
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
    props.competitionStats.reduce(
      (obj, stats) => ({
        ...obj,
        [stats.competition]: stats
      }),
      {}
    )
  )

  const rows = computed(() =>
    competitions.value.map(competition => {
      const {
        wins = 0,
        draws = 0,
        losses = 0,
        goalsFor = 0,
        goalsAgainst = 0
      } = results.value[competition.name] || {}

      return {
        ..._pick(competition, ['id', 'name', 'statusIcon', 'statusColor']),
        matchesPlayed: wins + draws + losses,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst
      }
    })
  )
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="-1"
    density="compact"
    class="rounded mt-2"
  >
    <template #[`item.name`]="{ item }">
      <v-btn
        :to="`/teams/${team.id}/competitions/${item.raw.id}`"
        :text="item.raw.name"
        size="small"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.status`]="{ item }">
      <v-icon
        :color="item.raw.statusColor"
        size="small"
        :icon="item.raw.statusIcon"
      />
    </template>
    <template #bottom />
  </v-data-table>
</template>
