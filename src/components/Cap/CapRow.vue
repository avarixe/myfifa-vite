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
      <v-select
        v-model="attributes.pos"
        :items="Object.keys(matchPositions)"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td :style="{ minWidth: '15em' }">
      <v-select
        v-model="attributes.playerId"
        :items="players"
        item-value="id"
        item-title="name"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode || record?.start > 0"
      />
    </td>
    <td>
      <v-rating
        v-model="attributes.rating"
        density="comfortable"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</v-btn>
        &nbsp;
        <v-btn v-if="!!props.record" @click="inEditMode = false">Cancel</v-btn>
        <v-btn v-else @click="$emit('click:remove')">Remove</v-btn>
      </template>
      <template v-else>
        <v-btn @click="inEditMode = true">Edit</v-btn>
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
