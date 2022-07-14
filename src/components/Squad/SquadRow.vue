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

  const emit = defineEmits()
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
    <td>
      <input
        v-model="attributes.name"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <table>
        <tbody>
          <tr
            v-for="squadPlayer in attributes.squadPlayersAttributes"
            :key="squadPlayer.id"
          >
            <td>
              <select
                v-model="squadPlayer.pos"
                :disabled="!inEditMode"
              >
                <option
                  v-for="pos in Object.keys(matchPositions)"
                  :key="pos"
                >{{ pos }}</option>
              </select>
            </td>
            <td>
              <select
                v-model="squadPlayer.playerId"
                :disabled="!inEditMode"
              >
                <option
                  v-for="player in players"
                  :key="player.id"
                  :value="player.id"
                >
                  {{ player.pos }} - {{ player.name }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
    <td>
      <template v-if="inEditMode">
        <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
        &nbsp;
        <button v-if="!!props.record" @click="inEditMode = false">Cancel</button>
        <button v-else @click="$emit('click:remove')">Remove</button>
      </template>
      <template v-else>
        <button @click="inEditMode = true">Edit</button>
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
