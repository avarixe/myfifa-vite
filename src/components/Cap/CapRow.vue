<script setup>
  import { Player } from '~/models'

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
        cap {
          ...CapData
        }
        errors {
          fullMessages
        }
      }
    }
    ${capFragment}
  `)

  const { executeMutation: updateCap } = useMutation(gql`
    mutation ($id: ID!, $attributes: CapAttributes!) {
      updateCap(id: $id, attributes: $attributes) {
        cap {
          ...CapData
        }
        errors {
          fullMessages
        }
      }
    }
    ${capFragment}
  `)

  const emit = defineEmits(['created', 'click:remove'])
  async function onSubmit() {
    if (props.record) {
      const {
        data: {
          updateCap: { errors, cap }
        }
      } = await updateCap({ id: props.record.id, attributes })
      if (cap) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const {
        data: {
          addCap: { errors, cap }
        }
      } = await createCap({ matchId: props.matchId, attributes })
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
        density="compact"
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
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode || record?.start > 0"
      />
    </td>
    <td>
      <v-rating
        v-model="attributes.rating"
        density="compact"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn icon="mdi-content-save" variant="text" @click="onSubmit" />
        &nbsp;
        <v-btn
          v-if="!!props.record"
          icon="mdi-close"
          variant="text"
          @click="inEditMode = false"
        />
        <v-btn
          v-else
          icon="mdi-delete"
          variant="text"
          @click="emit('click:remove')"
        />
      </template>
      <template v-else>
        <v-btn icon="mdi-pencil" variant="text" @click="inEditMode = true" />
        &nbsp;
        <remove-button
          v-if="!!props.record && props.record.start === 0"
          :record="props.record"
          store="Contract"
          label="Contract"
          icon="mdi-delete"
        />
      </template>
    </td>
  </tr>
</template>
