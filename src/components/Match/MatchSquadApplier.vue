<script setup lang="ts">
  import { Squad, Match } from '~/models'

  const props = defineProps<{
    match: Match
  }>()

  const { team } = useTeam()

  const squadRepo = useRepo(Squad)
  const squads = computed(() => squadRepo.where('teamId', team.value.id).get())

  const squadId = ref(null as number | null)
  const { submitForm } = useForm({
    mutation: gql`
      mutation applySquadToMatch($matchId: ID!, $squadId: ID!) {
        applySquadToMatch(matchId: $matchId, squadId: $squadId) {
          match {
            ...MatchData
            caps {
              ...CapData
            }
          }
        }
      }
      ${matchFragment}
      ${capFragment}
    `,
    variables: () => ({ matchId: props.match.id, squadId: squadId.value })
  })
  watch(squadId, submitForm)
</script>

<template>
  <v-menu activator="parent">
    <v-list>
      <v-list-item
        v-for="squad in squads"
        :key="squad.id"
        :title="squad.name"
        @click="squadId = squad.id"
      />
    </v-list>
  </v-menu>
</template>
