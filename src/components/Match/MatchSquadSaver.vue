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
  const loading = ref(false)
  const squadName = ref(null)
  const starters = computed(() => props.match.caps.filter(c => c.start === 0))

  const { executeMutation: storeLineup } = useMutation(gql`
      mutation storeMatchLineupToSquad($matchId: ID!, $squadId: ID!) {
        storeMatchLineupToSquad(matchId: $matchId, squadId: $squadId) {
          squad { ...SquadData }
        }
      }
      ${squadFragment}
  `)

  const { executeMutation: createSquad } = useMutation(gql`
    mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
      addSquad(teamId: $teamId, attributes: $attributes) {
        squad { ...SquadData }
        errors { fullMessages }
      }
    }
    ${squadFragment}
  `)

  async function onSelect (squadId) {
    loading.value = true
    if (squadId) {
      await storeLineup({ matchId: props.match.id, squadId })
      menu.value = false
    } else {
      const { data: { addSquad: { errors } } } = await createSquad({
        teamId: team.value.id,
        attributes: {
          name: squadName.value,
          squadPlayersAttributes: starters.value.map(cap => pick(cap, ['playerId', 'pos']))
        }
      })
      if (errors) {
        alert(errors.fullMessages[0])
      } else {
        squadName.value = null
        menu.value = false
      }
    }
    loading.value = false
  }
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
          :loading="loading"
          :disabled="loading"
          hint="Press Enter to Save"
          @keypress.enter.prevent="onSelect(null)"
        />
      </v-list-item>
      <v-list-item
        v-for="squad in squads"
        :key="squad.id"
        :title="squad.name"
        @click="onSelect(squad.id)"
      />
    </v-list>
  </v-menu>
</template>
