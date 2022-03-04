<script setup>
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, competitionFragment } from '~/fragments'
  import { Competition } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

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

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` },
    { label: 'Competitions', to: `/teams/${props.teamId}/competitions` }
  ])

  const competitionRepo = useRepo(Competition)
  const competitions = computed(() =>
    competitionRepo.where('teamId', team.value.id).get()
  )

  const columns = [
    { name: 'season', field: 'season', label: 'Season', sortable: true, align: 'center' },
    { name: 'name', field: 'name', label: 'Name', sortable: true, align: 'center' },
    { name: 'champion', field: 'champion', label: 'Champion', sortable: true, align: 'center' }
  ]
</script>

<template>
  <q-table
    title="Competitions"
    :rows="competitions"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 0, sortBy: 'season', descending: true }"
  >
    <template #body-cell-season="props">
      <q-td :props="props">
        {{ seasonLabel(props.value) }}
      </q-td>
    </template>
  </q-table>
</template>
