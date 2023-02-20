<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    cap: { type: Object, required: true }
  })

  const { team } = useTeam()

  const attributes = reactive({
    home: props.match.home === team.value.name,
    minute: null,
    playerId: props.cap.playerId,
    playerName: props.cap.name,
    redCard: false
  })

  watchEffect(() => {
    attributes.playerId = props.cap.playerId
    attributes.playerName = props.cap.name
    attributes.home = props.match.home === team.value.name
  })

  const { executeMutation: createBooking } = useMutation(gql`
    mutation createBooking($matchId: ID!, $attributes: BookingAttributes!) {
      addBooking(matchId: $matchId, attributes: $attributes) {
        booking {
          ...BookingData
        }
        errors {
          fullMessages
        }
      }
    }
    ${bookingFragment}
  `)

  const emit = defineEmits(['submitted'])
  async function onSubmit() {
    const {
      data: {
        addBooking: { errors }
      }
    } = await createBooking({ matchId: props.match.id, attributes })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      emit('submitted')
    }
  }

  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    onSubmit,
    onReset: () => {
      attributes.redCard = false
    }
  })
</script>

<template>
  <v-form
    ref="form"
    :key="formKey"
    v-model="formIsValid"
    @submit.prevent="submitForm"
  >
    <div class="pa-2">
      <div class="text-subtitle-2 pb-2">Book Player</div>
      <v-text-field
        v-model.number="attributes.minute"
        label="Minute"
        type="number"
      />
      <v-radio-group v-model="attributes.redCard" inline>
        <v-radio label="Yellow Card" color="orange darken-2" :value="false" />
        <v-radio label="Red Card" color="red darken-2" :value="true" />
      </v-radio-group>
      <div class="d-flex">
        <v-spacer />
        <v-btn
          type="submit"
          :disabled="!formIsValid"
          color="primary"
          variant="text"
          :loading="formIsLoading"
        >
          Save
        </v-btn>
      </div>
    </div>
  </v-form>
</template>
