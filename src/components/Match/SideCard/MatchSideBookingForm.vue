<script setup lang="ts">
  const props = defineProps({
    match: { type: Object, required: true },
    side: { type: String, required: true }
  })

  const attributes = reactive({
    minute: null,
    home: props.side === 'home',
    playerName: '',
    redCard: false
  })

  watchEffect(() => {
    attributes.home = props.side === 'home'
  })

  const emit = defineEmits(['submitted'])
  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    mutation: gql`
      mutation ($matchId: ID!, $attributes: BookingAttributes!) {
        addBooking(matchId: $matchId, attributes: $attributes) {
          booking {
            ...BookingData
          }
        }
      }
      ${bookingFragment}
    `,
    variables: () => ({ matchId: props.match.id, attributes }),
    onSuccess() {
      emit('submitted')
    },
    onReset() {
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
      <v-text-field
        v-model="attributes.playerName"
        label="Player"
        prepend-icon="mdi-account"
        :rules="[isRequired('Player')]"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
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
