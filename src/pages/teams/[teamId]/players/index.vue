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
  <div>
    <router-link :to="`/teams/${team.id}`">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/players/new`">New</router-link>
  </div>

  <h1>Players</h1>

  <table>
    <thead>
      <th>Name</th>
      <th>Status</th>
      <th>Age</th>
      <th>Pos</th>
      <th>2nd Pos</th>
      <th>Kit No</th>
      <th>OVR</th>
      <th>Value</th>
      <th>Wage</th>
      <th>Contract Ends</th>
    </thead>
    <tbody>
      <tr
        v-for="player in rows"
        :key="player.id"
      >
        <td>
          <router-link :to="`/teams/${team.id}/players/${player.id}`">{{ player.name }}</router-link>
        </td>
        <td>{{ player.status }}</td>
        <td>{{ player.age }}</td>
        <td>{{ player.pos }}</td>
        <td>{{ player.secPos.join(', ') }}</td>
        <td>{{ player.kitNo }}</td>
        <td>{{ player.ovr }}</td>
        <td>{{ team.currency }}{{ player.value }}</td>
        <td>
          <template v-if="player.wage">
            {{ team.currency }}{{ player.wage }}
          </template>
        </td>
        <td>{{ formatDate(player.endDate) }}</td>
      </tr>
    </tbody>
  </table>
</template>
