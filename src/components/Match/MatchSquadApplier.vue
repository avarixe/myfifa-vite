<script setup>
  import { Squad } from '~/models'

  const props = defineProps({
    match: { type: Object, required: true }
  })

  const { team } = useTeam()

  const squadRepo = useRepo(Squad)
  const squads = computed(() => squadRepo.where('teamId', team.value.id).get())

  const { submitForm: onClick } = useForm({
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
    variables: () => ({ matchId: props.match.id, squadId })
  })
</script>

<template>
  <v-menu offset-y offset-overflow activator="parent">
    <v-list>
      <v-list-item
        v-for="squad in squads"
        :key="squad.id"
        :title="squad.name"
        @click="onClick(squad.id)"
      />
    </v-list>
  </v-menu>
</template>
