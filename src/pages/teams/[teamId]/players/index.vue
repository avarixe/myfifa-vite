<script setup>
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
        statusColor: player.statusColor,
        statusIcon: player.statusIcon,
        wage: currentContractsByPlayerId.value[player.id]?.wage,
        endDate: currentContractsByPlayerId.value[player.id]?.endedOn
      }
    })
  })

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }
  const headers = [
    { value: 'name', text: 'Name' },
    { value: 'status', text: 'Status' },
    { value: 'age', text: 'Age' },
    { value: 'pos', text: 'Pos', sort: sortPos },
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
    :items="rows"
    item-key="id"
    sort-by="pos"
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
    <template #item-status="{ item: player }">
      <v-icon :color="player.statusColor">
        mdi-{{ player.statusIcon }}
      </v-icon>
    </template>
    <template #item-secPos="{ item: player }">
      {{ player.secPos.join(', ') }}
    </template>
    <template #item-kitNo="{ item: player }">
      <inline-select
        :record="player"
        attribute="kitNo"
        label="Kit No"
        :options="Array.from({ length: 98 }, (v, k) => k + 1)"
      />
    </template>
    <template #item-ovr="{ item: player }">
      <inline-select
        :record="player"
        attribute="ovr"
        label="OVR"
        :options="Array.from({ length: 61 }, (v, k) => k + 40)"
      />
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
