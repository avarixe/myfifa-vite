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

  const emit = defineEmits(['created', 'click:remove'])
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
    <td :style="{ minWidth: '8em' }">
      <v-text-field
        v-model="attributes.minute"
        type="number"
        min="1"
        :max="match.extraTime ? 120 : 90"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-checkbox
        v-model="attributes.home"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td :style="{ minWidth: '15em' }">
      <v-text-field
        v-model="attributes.playerName"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-checkbox
        v-model="attributes.redCard"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn
          icon="mdi-content-save"
          variant="text"
          @click="onSubmit"
        />
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
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="inEditMode = true"
        />
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Booking"
          label="Booking"
          icon="mdi-delete"
        />
      </template>
    </td>
  </tr>
</template>
