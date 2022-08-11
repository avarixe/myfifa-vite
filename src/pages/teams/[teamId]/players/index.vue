<script setup>
  import { formatDate } from '~/filters'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, contractFragment } from '~/fragments'
  import { Player, Contract } from '~/models'

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

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo.where('teamId', team.value.id).get()
  )

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

  const headers = [
    { value: 'name', text: 'Name' },
    { value: 'status', text: 'Status' },
    { value: 'age', text: 'Age' },
    { value: 'pos', text: 'Pos' },
    { value: 'secPos', text: '2nd Pos' },
    { value: 'kitNo', text: 'Kit No' },
    { value: 'ovr', text: 'OVR' },
    { value: 'value', text: 'Value' },
    { value: 'wage', text: 'Wage' },
    { value: 'endDate', text: 'Contract Ends' }
  ]
</script>

<template>
  <h1>Players</h1>

  <v-btn :to="`/teams/${team.id}/players/new`">
    <v-icon left>mdi-plus</v-icon>
    Player
  </v-btn>

  <data-table
    :headers="headers"
    :items="players"
  >
    <template #item-name="{ item: player }">
      <v-btn
        variant="text"
        color="primary"
        class="text-capitalize"
        :to="`/teams/${team.id}/players/${player.id}`"
        v-text="player.name"
      />
    </template>
    <template #item-secPos="{ item: player }">
      {{ player.secPos.join(', ') }}
    </template>
    <template #item-value="{ item: player }">
      {{ team.currency }}{{ player.value.toLocaleString() }}
    </template>
    <template #item-wage="{ item: player }">
      <span v-if="player.wage">
        {{ team.currency }}{{ player.wage.toLocaleString() }}
      </span>
    </template>
    <template #item-endDate="{ item: player }">
      {{ formatDate(player.endDate) }}
    </template>
  </data-table>
</template>
