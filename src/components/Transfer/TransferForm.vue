<script setup lang="ts">
  import { Player, Transfer } from '~/models'

  const props = defineProps<{
    player: Player
    record?: Transfer
  }>()

  const { team } = useTeam()
  const transferOut = computed(() =>
    props.record
      ? team.value.name === props.record.origin
      : props.player.status !== null
  )

  interface TransferAttributes {
    signedOn?: string | null
    movedOn?: string
    origin?: string
    destination?: string
    fee?: number | null
    addonClause?: number
  }

  const attributes: TransferAttributes = reactive({})
  function onOpen() {
    attributes.signedOn = props.record?.signedOn
    attributes.movedOn = props.record?.movedOn ?? team.value.currentlyOn
    attributes.origin = props.record?.origin
    attributes.destination = props.record?.destination
    attributes.fee = props.record?.fee
    attributes.addonClause = props.record?.addonClause ?? 0
    if (!props.record) {
      if (transferOut.value) {
        attributes.origin = team.value.name
      } else {
        attributes.destination = team.value.name
      }
    }
  }

  // const transferColor = computed(() => transferOut.value ? 'red' : 'green')

  watchEffect(() => {
    if (!attributes.addonClause) {
      attributes.addonClause = 0
    }
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: TransferAttributes!) {
          updateTransfer(id: $id, attributes: $attributes) {
            transfer {
              ...TransferData
            }
          }
        }
        ${transferFragment}
      `
    : gql`
        mutation ($playerId: ID!, $attributes: TransferAttributes!) {
          addTransfer(playerId: $playerId, attributes: $attributes) {
            transfer {
              ...TransferData
            }
          }
        }
        ${transferFragment}
      `
  function variables() {
    return props.record
      ? { id: props.record.id, attributes }
      : { playerId: props.player.id, attributes }
  }
</script>

<template>
  <dialog-form
    :title="`Transfer ${player.name}`"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <v-col cols="12">
      <date-field
        v-model="attributes.signedOn"
        label="Signed Date"
        prepend-icon="mdi-calendar-edit"
        :prefill="team.currentlyOn"
        clearable
      />
    </v-col>
    <v-col cols="12">
      <date-field
        v-model="attributes.movedOn"
        label="Effective Date"
        prepend-icon="mdi-calendar-today"
        :min="attributes.signedOn"
        :prefill="team.currentlyOn"
      />
    </v-col>
    <v-col cols="12">
      <team-combobox
        v-model="attributes.origin"
        label="Origin"
        prepend-icon="mdi-airplane-takeoff"
        :rules="transferOut ? [] : [isRequired('Origin')]"
        :disabled="transferOut"
      />
    </v-col>
    <v-col cols="12">
      <team-combobox
        v-model="attributes.destination"
        label="Destination"
        prepend-icon="mdi-airplane-landing"
        :rules="transferOut ? [isRequired('Destination')] : []"
        :disabled="!transferOut"
      />
    </v-col>
    <v-col cols="12">
      <money-field v-model="attributes.fee" label="Fee" />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model.number="attributes.addonClause"
        label="Add-On Clause (%)"
        :rules="
          attributes.addonClause
            ? [isNumber('Add-On Clause'), inRange('Add-On Clause', [0, 25])]
            : []
        "
        inputmode="numeric"
      />
    </v-col>
  </dialog-form>
</template>
