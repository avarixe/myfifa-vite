<script setup lang="ts">
  import { Cap, Match } from '~/models'

  const props = defineProps<{
    cap: Cap
    match: Match
  }>()

  const { team } = useTeam()

  const attributes = reactive({
    home: props.match.home === team.value.name,
    minute: null,
    capId: props.cap.id,
    redCard: false
  })

  watchEffect(() => {
    attributes.capId = props.cap.id
    attributes.home = props.match.home === team.value.name
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
      <minute-field v-model="attributes.minute" :match="match" />
      <v-radio-group v-model="attributes.redCard" inline>
        <v-radio label="Yellow Card" color="orange darken-2" :value="false" />
        <v-radio label="Red Card" color="red darken-2" :value="true" />
      </v-radio-group>
      <div class="d-flex">
        <v-spacer />
        <v-btn
          type="submit"
          text="Save"
          :disabled="!formIsValid"
          color="primary"
          variant="text"
          :loading="formIsLoading"
        />
      </div>
    </div>
  </v-form>
</template>
