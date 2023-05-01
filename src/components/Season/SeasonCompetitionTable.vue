<script setup lang="ts">
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

  const headers = [
    {
      text: 'Competition',
      value: 'name',
      class: 'sticky',
      cellClass: 'sticky'
    },
    { text: 'Status', value: 'status', class: 'text-center' },
    { text: 'GP', value: 'matchesPlayed', class: 'text-right' },
    { text: 'W', value: 'wins', class: 'text-right' },
    { text: 'D', value: 'draws', class: 'text-right' },
    { text: 'L', value: 'losses', class: 'text-right' },
    { text: 'GF', value: 'goalsFor', class: 'text-right' },
    { text: 'GA', value: 'goalsAgainst', class: 'text-right' },
    { text: 'GD', value: 'goalDifference', class: 'text-right' }
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
  <data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    :items-per-page="-1"
    :show-pagination-options="false"
    class="mt-2"
  >
    <template #item="{ item, rowColor }">
      <td class="sticky">
        <v-sheet :class="`mx-n4 px-4 ${rowColor}`">
          <v-btn
            :to="`/teams/${team.id}/competitions/${item.id}`"
            :text="item.name"
            size="small"
            variant="text"
            color="primary"
            class="text-capitalize"
          />
        </v-sheet>
      </td>
      <td class="text-center">
        <v-icon
          :color="item.statusColor"
          size="small"
          :icon="item.statusIcon"
        />
      </td>
      <td class="text-right">{{ item.matchesPlayed }}</td>
      <td class="text-right">{{ item.wins }}</td>
      <td class="text-right">{{ item.draws }}</td>
      <td class="text-right">{{ item.losses }}</td>
      <td class="text-right">{{ item.goalsFor }}</td>
      <td class="text-right">{{ item.goalsAgainst }}</td>
      <td class="text-right">{{ item.goalDifference }}</td>
    </template>
  </data-table>
</template>
