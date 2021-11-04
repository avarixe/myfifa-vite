<script setup>
  import { computed } from 'vue'
  import { useQuery } from '@urql/vue'
  import gql from 'graphql-tag'
  import PlayerGrid from '~/components/Player/PlayerGrid.vue'
  import { teamFragment, playerFragment, contractFragment } from '~/fragments'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { data } = useQuery({
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
    `,
    variables: {
      teamId: props.teamId
    }
  })

  const team = computed(() => data.value?.team)
</script>

<template>
  <template v-if="team">
    <router-link :to="`/teams/${team.id}`">Team</router-link>
    <player-grid :players="team.players" />
  </template>
</template>
