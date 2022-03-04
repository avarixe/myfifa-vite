<script setup>
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, contractFragment } from '~/fragments'
  import { Player } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = await useTeamQuery({
    include: 'players',
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
            currentContract { ...ContractData }
          }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${contractFragment}
    `
  })

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${team.value.id}` },
    { label: 'Players', to: `/teams/${team.value.id}/players` }
  ])

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo.where('teamId', team.value.id).get()
  )

  const columns = [
    { name: 'name', field: 'name', label: 'Name', sortable: true, align: 'left' },
    { name: 'pos', field: 'pos', label: 'Position', sortable: true, align: 'center' },
    { name: 'ovr', field: 'ovr', label: 'OVR', sortable: true, align: 'center' },
    { name: 'value', field: 'value', label: 'Value', sortable: true }
  ]
</script>

<template>
  <q-table
    title="Players"
    :rows="players"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 0 }"
  />
</template>
