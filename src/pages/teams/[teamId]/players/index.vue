<script setup>
  import { formatDate } from '~/filters'
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, contractFragment } from '~/fragments'
  import { Player, Contract } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team, data } = await useTeamQuery({
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

  const contractRepo = useRepo(Contract)
  const contracts = data.value.team.players
    .map(player => player.currentContract)
    .filter(contract => contract)
  contractRepo.save(contracts)

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` },
    { label: 'Players', to: `/teams/${props.teamId}/players` }
  ])

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo.where('teamId', team.value.id).get()
  )

  const columns = [
    { name: 'name', field: 'name', label: 'Name', sortable: true, align: 'left' },
    { name: 'status', field: 'status', label: 'Status', sortable: true, align: 'center' },
    { name: 'age', field: 'age', label: 'Age', sortable: true, align: 'center' },
    { name: 'pos', field: 'pos', label: 'Pos', sortable: true, align: 'center' },
    { name: 'secPos', field: 'secPos', label: '2nd Pos', sortable: true, align: 'center' },
    { name: 'kitNo', field: 'kitNo', label: 'Kit No', sortable: true, align: 'center' },
    { name: 'ovr', field: 'ovr', label: 'OVR', sortable: true, align: 'center' },
    { name: 'value', field: 'value', label: 'Value', sortable: true },
    { name: 'wage', field: 'wage', label: 'Wage', sortable: true },
    { name: 'endDate', field: 'endDate', label: 'Contract Ends', sortable: true },
  ]

  const currentContractsByPlayerId = computed(() => {
    const playerIds = players.value.map(player => player.id)
    return keyBy(
      contractRepo
        .where('playerId', id => playerIds.includes(id))
        .where('startedOn', date => date <= team.value.currentlyOn)
        .where('endedOn', date => team.value.currentlyOn < date)
        .get(),
      contract => contract.playerId
    )
  })

  const rows = computed(() => {
    return players.value.map(player => {
      return {
        ...player,
        wage: currentContractsByPlayerId.value[player.id]?.wage,
        endDate: currentContractsByPlayerId.value[player.id]?.endedOn
      }
    })
  })
</script>

<template>
  <q-table
    title="Players"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :pagination="{ rowsPerPage: 0 }"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-btn
          :to="`/teams/${team.id}/players/${props.row.id}`"
          :label="props.value"
          color="primary"
          flat
          no-caps
        />
      </q-td>
    </template>
    <template #body-cell-secPos="props">
      <q-td :props="props">
        {{ props.value.join(', ') }}
      </q-td>
    </template>
    <template #body-cell-endDate="props">
      <q-td :props="props">
        {{ formatDate(props.value) }}
      </q-td>
    </template>
  </q-table>
</template>
