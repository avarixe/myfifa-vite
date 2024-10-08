<script setup lang="ts">
  import { Injury, Player } from '~/models'

  const props = defineProps<{
    player: Player
    record?: Injury
  }>()

  interface InjuryAttributes {
    startedOn?: string
    endedOn?: string
    description?: string
    duration?: {
      length: number | null
      timespan: string | null
    }
  }

  const attributes: InjuryAttributes = reactive({})
  const { team } = useTeam()
  const durationOn = ref(false)
  function onOpen() {
    attributes.startedOn = props.record?.startedOn ?? team.value.currentlyOn
    attributes.endedOn = props.record?.endedOn ?? team.value.currentlyOn
    attributes.description = props.record?.description
    durationOn.value = !props.record
    if (durationOn.value) {
      attributes.duration = {
        length: null,
        timespan: null
      }
    }
  }

  const timespans = ['Days', 'Weeks', 'Months', 'Years']

  const title = computed(
    () => `${props.record ? 'Update' : 'Record New'} Injury`
  )

  watch(durationOn, () => {
    if (durationOn.value) {
      attributes.duration = {
        length: null,
        timespan: null
      }
    } else {
      delete attributes.duration
    }
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: InjuryAttributes!) {
          updateInjury(id: $id, attributes: $attributes) {
            injury {
              ...InjuryData
            }
          }
        }
        ${injuryFragment}
      `
    : gql`
        mutation ($playerId: ID!, $attributes: InjuryAttributes!) {
          addInjury(playerId: $playerId, attributes: $attributes) {
            injury {
              ...InjuryData
            }
          }
        }
        ${injuryFragment}
      `

  function variables() {
    return props.record
      ? { id: props.record.id, attributes }
      : { playerId: props.player.id, attributes }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <v-col cols="12">
      <date-field
        v-model="attributes.startedOn"
        label="Injury Date"
        prepend-icon="mdi-calendar-today"
        required
      />
    </v-col>
    <template v-if="durationOn && attributes.duration">
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.duration['length']"
          label="Length of Duration"
          prepend-icon="mdi-ruler"
          :rules="[
            isRequired('Length of Duration'),
            isNumber('Length of Duration')
          ]"
          inputmode="numeric"
        />
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="attributes.duration.timespan"
          :items="timespans"
          label="Timespan"
          append-icon="mdi-calendar"
          :rules="[isRequired('Timespan')]"
          @click:append="durationOn = false"
        />
      </v-col>
    </template>
    <v-col v-else cols="12">
      <date-field
        v-model="attributes.endedOn"
        label="Recovery Date"
        prepend-icon="mdi-calendar"
        :append-icon="record ? null : 'mdi-ruler'"
        :min="attributes.startedOn"
        :prefill="team.currentlyOn"
        required
        @click:append="durationOn = true"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="attributes.description"
        label="Description"
        prepend-icon="mdi-ambulance"
        :rules="[isRequired('Description')]"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </v-col>
  </dialog-form>
</template>
