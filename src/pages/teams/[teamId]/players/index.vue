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
</script>

<template>
  <h1>Players</h1>

  <v-btn :to="`/teams/${team.id}/players/new`">
    <v-icon left>mdi-plus</v-icon>
    Player
  </v-btn>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Status</th>
        <th class="text-left">Age</th>
        <th class="text-left">Pos</th>
        <th class="text-left">2nd Pos</th>
        <th class="text-left">Kit No</th>
        <th class="text-left">OVR</th>
        <th class="text-left">Value</th>
        <th class="text-left">Wage</th>
        <th class="text-left">Contract Ends</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="player in rows"
        :key="player.id"
      >
        <td>
          <v-btn
            variant="text"
            color="primary"
            class="text-capitalize"
            :to="`/teams/${team.id}/players/${player.id}`"
            v-text="player.name"
          />
        </td>
        <td>{{ player.status }}</td>
        <td>{{ player.age }}</td>
        <td>{{ player.pos }}</td>
        <td>{{ player.secPos.join(', ') }}</td>
        <td>{{ player.kitNo }}</td>
        <td>{{ player.ovr }}</td>
        <td>{{ team.currency }}{{ player.value.toLocaleString() }}</td>
        <td>
          <template v-if="player.wage">
            {{ team.currency }}{{ player.wage.toLocaleString() }}
          </template>
        </td>
        <td>{{ formatDate(player.endDate) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
