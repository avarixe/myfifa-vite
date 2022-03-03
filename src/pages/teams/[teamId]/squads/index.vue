<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, squadFragment } from '~/fragments'
  import { Squad } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players { ...PlayerData }
          squads { ...SquadData }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${squadFragment}
    `
  })

  const squadRepo = useRepo(Squad)
  const squads = computed(() =>
    squadRepo
      .with('squadPlayers', query => query.with('player'))
      .where('teamId', team.value?.id)
      .get()
  )
</script>

<template>
  <template v-if="team">
    <router-link :to="`/teams/${team.id}`">Team</router-link>

    <div
      v-for="squad in squads"
      :key="squad.id"
    >
      {{ squad.name }}

      <table>
        <tbody>
          <tr
            v-for="squadPlayer in squad.squadPlayers"
            :key="squadPlayer.id"
          >
            <td>{{ squadPlayer.pos }}</td>
            <td>{{ squadPlayer.player.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>
