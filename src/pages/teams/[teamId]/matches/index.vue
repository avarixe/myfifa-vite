<script setup>
  import { format, parseISO } from 'date-fns'
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, matchFragment } from '~/fragments'
  import { Match } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = await useTeamQuery({
    query: gql`
      query fetchMatchesPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          matches { ...MatchData }
        }
      }
      ${teamFragment}
      ${matchFragment}
    `
  })

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` },
    { label: 'Matches', to: `/teams/${props.teamId}/matches` }
  ])

  const matchRepo = useRepo(Match)
  const matches = computed(() =>
    matchRepo.where('teamId', team.value.id).get()
  )

  const columns = [
    { name: 'id', field: 'id', label: 'Match', align: 'center' },
    { name: 'competition', field: 'competition', label: 'Competition', sortable: true, align: 'center' },
    { name: 'playedOn', field: 'playedOn', label: 'Date Played', sortable: true, align: 'center' },
    { name: 'link', field: 'link', label: 'Link', align: 'center' }
  ]
</script>

<template>
  <q-table
    title="Matches"
    :rows="matches"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 10, sortBy: 'playedOn', descending: true }"
  >
    <template #body-cell-id="props">
      <q-td :props="props">
        <div>{{ props.row.home }} v {{ props.row.away }}</div>
        <div>{{ props.row.score }}</div>
      </q-td>
    </template>
    <template #body-cell-competition="props">
      <q-td :props="props">
        <div>{{ props.row.competition }}</div>
        <i v-if="props.row.stage">{{ props.row.stage }}</i>
      </q-td>
    </template>
    <template #body-cell-playedOn="props">
      <q-td :props="props">
        {{ format(parseISO(props.value), 'MMM dd, yyyy') }}
      </q-td>
    </template>
  </q-table>
</template>
