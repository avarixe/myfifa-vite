<script setup>
  import { useTeam } from '~/composables'
  import { bookingFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    match: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    minute: props.record?.minute,
    home: props.record?.home || false,
    playerId: props.record?.playerId,
    playerName: props.record?.playerName,
    redCard: props.record?.redCard || false
  })

  const { executeMutation: createBooking } = useMutation(gql`
    mutation createBooking($matchId: ID!, $attributes: BookingAttributes!) {
      addBooking(matchId: $matchId, attributes: $attributes) {
        booking { ...BookingData }
        errors { fullMessages }
      }
    }
    ${bookingFragment}
  `)

  const { executeMutation: updateBooking } = useMutation(gql`
    mutation ($id: ID!, $attributes: BookingAttributes!) {
      updateBooking(id: $id, attributes: $attributes) {
        booking { ...BookingData }
        errors { fullMessages }
      }
    }
    ${bookingFragment}
  `)

  const emit = defineEmits()
  async function onSubmit () {
    if (props.record) {
      const { data: { updateBooking: { errors, booking} } } =
        await updateBooking({ id: props.record.id, attributes })
      if (booking) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addBooking: { errors, booking } } } =
        await createBooking({ matchId: props.match.id, attributes })
      if (booking) {
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <tr>
    <td>
      <input
        v-model="attributes.minute"
        type="number"
        min="1"
        :max="match.extraTime ? 120 : 90"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.home"
        type="checkbox"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.playerName"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.redCard"
        type="checkbox"
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
          v-if="!!props.record"
          :record="props.record"
          store="Booking"
          label="Booking"
        />
      </template>
    </td>
  </tr>
</template>
