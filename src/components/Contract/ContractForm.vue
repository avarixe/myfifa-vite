<script setup>
  const { team } = useTeam()

  const props = defineProps({
    player: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const valid = ref(false)
  const attributes = reactive({
    startedOn: null,
    endedOn: null,
    numSeasons: null,
    wage: null,
    signingBonus: null,
    releaseClause: null,
    performanceBonus: null,
    bonusReq: null,
    bonusReqType: null
  })

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

  const numSeasonsOn = ref(true)

  const title = computed(() => props.record ? 'Edit Contract' : 'Sign New Contract')

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'signedOn',
        'startedOn',
        'endedOn',
        'wage',
        'signingBonus',
        'releaseClause',
        'performanceBonus',
        'bonusReq',
        'bonusReqType'
      ]))
      numSeasonsOn.value = false
    } else {
      attributes.startedOn = team.value.currentlyOn
      numSeasonsOn.value = true
    }
  }

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

  const { executeMutation: createContract } = useMutation(gql`
    mutation createContract($playerId: ID!, $attributes: ContractAttributes!) {
      addContract(playerId: $playerId, attributes: $attributes) {
        contract { ...ContractData }
        errors { fullMessages }
      }
    }
    ${contractFragment}
  `)

  const { executeMutation: updateContract } = useMutation(gql`
    mutation ($id: ID!, $attributes: ContractAttributes!) {
      updateContract(id: $id, attributes: $attributes) {
        contract { ...ContractData }
        errors { fullMessages }
      }
    }
    ${contractFragment}
  `)

  async function onSubmit () {
    if (props.record) {
      const { data: { updateContract: { errors} } } =
        await updateContract({ id: props.record.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addContract: { errors } } } =
        await createContract({ playerId: props.player.id, attributes })
      if (errors) {
        alert(errors.fullMessages[0])
      }
    }
  }
</script>

<template>
  <dialog-form
    :title="title"
    :submit="onSubmit"
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
        <money-field
          v-model.number="attributes.wage"
          label="Wage"
          :prefix="team.currency"
          required
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model.number="attributes.signingBonus"
          label="Signing Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model.number="attributes.releaseClause"
          label="Release Clause"
          :prefix="team.currency"
        />
      </v-col>
      <v-col cols="12">
        <money-field
          v-model.number="attributes.performanceBonus"
          label="Performance Bonus"
          :prefix="team.currency"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-row
          v-if="attributes.performanceBonus"
          dense
        >
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
