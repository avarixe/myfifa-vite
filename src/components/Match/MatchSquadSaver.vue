<script setup>
  import { Squad } from '~/models'
  import { squadFragment } from '../../fragments'

  const props = defineProps({
    match: { type: Object, required: true }
  })

  const { team } = useTeam()

  const squadRepo = useRepo(Squad)
  const squads = computed(() => squadRepo.where('teamId', team.value.id).get())

  const menu = ref(false)
  const squadName = ref(null)
  const starters = computed(() => props.match.caps.filter(c => c.start === 0))

  const squadId = ref(null)
  watch(squadId, () => {
    if (squadId.value) {
      storeLineup()
    }
  })

  const { submitForm: storeLineup, formIsLoading } = useForm({
    mutation: gql`
      mutation storeMatchLineupToSquad($matchId: ID!, $squadId: ID!) {
        storeMatchLineupToSquad(matchId: $matchId, squadId: $squadId) {
          squad {
            ...SquadData
          }
        }
      }
      ${squadFragment}
    `,
    variables: () => ({ matchId: props.match.id, squadId: squadId.value }),
    onSuccess() {
      menu.value = false
    }
  })

  const { submitForm: createSquad } = useForm({
    mutation: gql`
      mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
        addSquad(teamId: $teamId, attributes: $attributes) {
          squad {
            ...SquadData
          }
        }
      }
      ${squadFragment}
    `,
    variables: () => ({
      teamId: team.value.id,
      attributes: {
        name: squadName.value,
        squadPlayersAttributes: starters.value.map(cap =>
          pick(cap, ['playerId', 'pos'])
        )
      }
    }),
    onSuccess() {
      squadName.value = null
      menu.value = false
    }
  })
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    offset-overflow
    activator="parent"
  >
    <v-list>
      <v-list-item>
        <v-text-field
          v-model="squadName"
          label="New Squad"
          :loading="formIsLoading"
          :disabled="formIsLoading"
          hint="Press Enter to Save"
          @keypress.enter.prevent="createSquad"
        />
      </v-list-item>
      <v-list-item
        v-for="squad in squads"
        :key="squad.id"
        :title="squad.name"
        @click="squadId = squad.id"
      />
    </v-list>
  </v-menu>
</template>
