<script setup>
  import { useTeam } from '~/composables'
  import { matchPositions } from '~/constants'
  import { squadFragment } from '~/fragments'
  import { Player } from '~/models'

  const { team } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    name: props.record?.name,
    squadPlayersAttributes: props.record?.squadPlayers?.map(squadPlayer => ({
      id: squadPlayer.id,
      playerId: squadPlayer.playerId,
      pos: squadPlayer.pos
    })) || new Array(11).fill().map((_, id) => ({
      id,
      playerId: null,
      pos: null
    }))
  })

  const { executeMutation: createSquad } = useMutation(gql`
    mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
      addSquad(teamId: $teamId, attributes: $attributes) {
        squad { ...SquadData }
        errors { fullMessages }
      }
    }
    ${squadFragment}
  `)

  const { executeMutation: updateSquad } = useMutation(gql`
    mutation ($id: ID!, $attributes: SquadAttributes!) {
      updateSquad(id: $id, attributes: $attributes) {
        squad { ...SquadData }
        errors { fullMessages }
      }
    }
    ${squadFragment}
  `)

  const emit = defineEmits(['created', 'click:remove'])
  async function onSubmit () {
    if (props.record) {
      const { data: { updateSquad: { errors, squad} } } =
        await updateSquad({ id: props.record.id, attributes })
      if (squad) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addSquad: { errors, squad } } } =
        await createSquad({ teamId: props.teamId, attributes })
      if (squad) {
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }

  const playerRepo = useRepo(Player)
  const players = computed(() => playerRepo.all())
</script>

<template>
  <tr>
    <td :style="{ minWidth: '15em' }">
      <v-text-field
        v-model="attributes.name"
        label="Name"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-table>
        <tbody>
          <tr
            v-for="squadPlayer in attributes.squadPlayersAttributes"
            :key="squadPlayer.id"
          >
            <td>
              <v-select
                v-model="squadPlayer.pos"
                label="Position"
                :items="Object.keys(matchPositions)"
                density="comfortable"
                single-line
                hide-details
                :disabled="!inEditMode"
              />
            </td>
            <td>
              <v-select
                v-model="squadPlayer.playerId"
                label="Player"
                :items="players"
                item-value="id"
                item-title="name"
                density="comfortable"
                single-line
                hide-details
                :disabled="!inEditMode"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</v-btn>
        &nbsp;
        <v-btn v-if="!!props.record" @click="inEditMode = false">Cancel</v-btn>
        <v-btn v-else @click="emit('click:remove')">Remove</v-btn>
      </template>
      <template v-else>
        <v-btn @click="inEditMode = true">Edit</v-btn>
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Goal"
          label="Goal"
        />
      </template>
    </td>
  </tr>
</template>
