<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, contractFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = useTeamQuery({
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
</script>

<template>
  <template v-if="team">
    <router-link :to="`/teams/${team.id}`">Team</router-link>

    <table :style="{ width: '100%' }">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>OVR</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="player in team.players"
          :key="player.id"
          :style="{ textAlign: 'center' }"
        >
          <td>{{ player.name }}</td>
          <td>{{ player.pos }}</td>
          <td>{{ player.ovr }}</td>
          <td>{{ player.value }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
