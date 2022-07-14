<script setup>
  import { useTeam } from '~/composables'
  import { capFragment } from '~/fragments'
  import { Player } from '~/models'
  import { matchPositions } from '~/constants'

  const { team } = useTeam()

  const props = defineProps({
    matchId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    pos: props.record?.pos,
    playerId: props.record?.playerId,
    rating: props.record?.rating
  })

  const { executeMutation: createCap } = useMutation(gql`
    mutation createCap($matchId: ID!, $attributes: CapAttributes!) {
      addCap(matchId: $matchId, attributes: $attributes) {
        cap { ...CapData }
        errors { fullMessages }
      }
    }
    ${capFragment}
  `)

  const { executeMutation: updateCap } = useMutation(gql`
    mutation ($id: ID!, $attributes: CapAttributes!) {
      updateCap(id: $id, attributes: $attributes) {
        cap { ...CapData }
        errors { fullMessages }
      }
    }
    ${capFragment}
  `)

  const emit = defineEmits()
  async function onSubmit () {
    if (props.record) {
      const { data: { updateCap: { errors, cap} } } =
        await updateCap({ id: props.record.id, attributes })
      if (cap) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addCap: { errors, cap } } } =
        await createCap({ matchId: props.matchId, attributes })
      if (cap) {
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
      <select
        v-model="attributes.pos"
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
        v-model="attributes.playerId"
        :disabled="!inEditMode || record?.start > 0"
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
    <td>
      <input
        v-model="attributes.rating"
        type="number"
        min="1"
        max="5"
        :disabled="!inEditMode"
      />
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
          v-if="!!props.record && props.record.start === 0"
          :record="props.record"
          store="Cap"
          label="Cap"
        />
      </template>
    </td>
  </tr>
</template>
