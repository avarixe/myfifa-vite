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

  const headers = [
    { text: 'Competition', value: 'name', class: 'sticky' },
    { text: 'Status', value: 'status', align: 'center' },
    { text: 'GP', value: 'matchesPlayed', align: 'end' },
    { text: 'W', value: 'wins', align: 'end' },
    { text: 'D', value: 'draws', align: 'end' },
    { text: 'L', value: 'losses', align: 'end' },
    { text: 'GF', value: 'goalsFor', align: 'end' },
    { text: 'GA', value: 'goalsAgainst', align: 'end' },
    { text: 'GD', value: 'goalDifference', align: 'end' }
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
