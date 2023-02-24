<script setup>
  const { team } = useTeam()

  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const attributes = reactive({})
  const numSeasonsOn = ref(true)
  function onOpen() {
    attributes.signedOn = props.record?.signedOn
    attributes.startedOn = props.record?.startedOn
    attributes.endedOn = props.record?.endedOn
    attributes.wage = props.record?.wage
    attributes.signingBonus = props.record?.signingBonus
    attributes.releaseClause = props.record?.releaseClause
    attributes.performanceBonus = props.record?.performanceBonus
    attributes.bonusReq = props.record?.bonusReq
    attributes.bonusReqType = props.record?.bonusReqType
    numSeasonsOn.value = !props.record
    if (numSeasonsOn) {
      attributes.numSeasons = props.record?.numSeasons
    }
  }

  const rulesFor = {
    numSeasons: [
      isRequired('Number of Seasons'),
      isNumber('Number of Seasons')
    ],
    bonusReq: [isRequired('Bonus Req.')],
    bonusReqType: [isRequired('Bonus Req. Type')]
  }

  const bonusRequirementTypes = [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]

  const title = computed(() =>
    props.record ? 'Edit Contract' : 'Sign New Contract'
  )

  watchEffect(() => {
    if (!attributes.performanceBonus) {
      attributes.bonusReq = null
      attributes.bonusReqType = null
    }

    if (numSeasonsOn.value) {
      attributes.numSeasons = null
    } else {
      delete attributes.numSeasons
    }
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: ContractAttributes!) {
          updateContract(id: $id, attributes: $attributes) {
            contract {
              ...ContractData
            }
          }
        }
        ${contractFragment}
      `
    : gql`
        mutation ($playerId: ID!, $attributes: ContractAttributes!) {
          addContract(playerId: $playerId, attributes: $attributes) {
            contract {
              ...ContractData
            }
          }
        }
        ${contractFragment}
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
    <template #form>
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
          v-model="attributes.startedOn"
          label="Effective Date"
          prepend-icon="mdi-calendar-today"
          :min="attributes.signedOn"
          :max="attributes.endedOn"
          :prefill="team.currentlyOn"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-if="numSeasonsOn"
          v-model.number="attributes.numSeasons"
          label="Number of Seasons"
          prepend-icon="mdi-pound"
          append-outer-icon="mdi-calendar"
          :rules="rulesFor.numSeasons"
          inputmode="numeric"
          @click:append-outer="numSeasonsOn = false"
        />
        <date-field
          v-else
          v-model="attributes.endedOn"
          label="End Date"
          prepend-icon="mdi-calendar"
          :append-outer-icon="record ? null : 'mdi-pound'"
          :min="attributes.startedOn"
          :max="maxEndDate"
          required
          start-with-year
          @click:append-outer="numSeasonsOn = true"
        />
      </v-col>
      <v-col cols="12">
        <money-field v-model="attributes.wage" label="Wage" required />
      </v-col>
      <v-col cols="12">
        <money-field v-model="attributes.signingBonus" label="Signing Bonus" />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model="attributes.releaseClause"
          label="Release Clause"
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model="attributes.performanceBonus"
          label="Performance Bonus"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row v-if="attributes.performanceBonus" dense>
          <v-col cols="6">
            <v-text-field
              v-model.number="attributes.bonusReq"
              label="Bonus Req."
              prefix="if"
              :rules="rulesFor.bonusReq"
              inputmode="numeric"
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="attributes.bonusReqType"
              label="Bonus Req. Type"
              :items="bonusRequirementTypes"
              :rules="rulesFor.bonusReqType"
            />
          </v-col>
        </v-row>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>
