<script setup lang="ts">
  import { Match, Booking } from '~/models'

  const props = defineProps<{
    match: Match
    record?: Booking
  }>()

  const { team } = useTeam()
  const { minute, unsubbedPlayers } = useMatch(props.match)

  interface BookingAttributes {
    home?: boolean
    capId?: number | null
    playerName?: string | null
    redCard?: boolean
  }

  const attributes: BookingAttributes = reactive({})
  function onOpen() {
    attributes.home = props.record?.home ?? true
    attributes.capId = props.record?.capId
    attributes.playerName = props.record?.playerName
    attributes.redCard = props.record?.redCard ?? false
    minute.value = props.record?.minute ?? null
  }

  const rulesFor = {
    playerName: [isRequired('Player')]
  }

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Booking`)

  watch(minute, () => {
    if (
      attributes.capId &&
      unsubbedPlayers.value.every(cap => cap.id !== attributes.capId)
    ) {
      attributes.capId = null
    }
  })

  function clearNames() {
    attributes.capId = null
    attributes.playerName = null
  }

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: BookingAttributes!) {
          updateBooking(id: $id, attributes: $attributes) {
            booking {
              ...BookingData
            }
          }
        }
        ${bookingFragment}
      `
    : gql`
        mutation ($matchId: ID!, $attributes: BookingAttributes!) {
          addBooking(matchId: $matchId, attributes: $attributes) {
            booking {
              ...BookingData
            }
          }
        }
        ${bookingFragment}
      `
  function variables() {
    if (props.record) {
      return {
        id: props.record.id,
        attributes: { ...attributes, minute: minute.value }
      }
    } else {
      return {
        matchId: props.match.id,
        attributes: { ...attributes, minute: minute.value }
      }
    }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-book"
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.home"
          inline
          hide-details
          @change="clearNames"
        >
          <v-radio :label="match.home" :value="true" color="teal" />
          <v-radio :label="match.away" :value="false" color="blue-grey" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model.number="minute" label="Minute" type="number" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="!attributes.home !== (match.home === team.name)"
          v-model="attributes.capId"
          label="Player"
          prepend-icon="mdi-account"
          :caps="unsubbedPlayers"
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group v-model="attributes.redCard" inline hide-details>
          <v-radio label="Yellow Card" :value="false" color="orange darken-2" />
          <v-radio label="Red Card" :value="true" color="red darken-2" />
        </v-radio-group>
      </v-col>
    </template>
  </dialog-form>
</template>
