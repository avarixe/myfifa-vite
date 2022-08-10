<script setup>
  import { useTeam } from '~/composables'
  import { contractFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    playerId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    signedOn: props.record?.signedOn,
    startedOn: props.record?.startedOn,
    endedOn: props.record?.endedOn,
    numSeasons: props.record?.numSeasons,
    wage: props.record?.wage,
    signingBonus: props.record?.signingBonus,
    releaseClause: props.record?.releaseClause,
    performanceBonus: props.record?.performanceBonus,
    bonusReq: props.record?.bonusReq,
    bonusReqType: props.record?.bonusReqType
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

  const emit = defineEmits()
  async function onSubmit () {
    if (props.record) {
      const { data: { updateContract: { errors, contract} } } =
        await updateContract({ id: props.record.id, attributes })
      if (contract) {
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addContract: { errors, contract } } } =
        await createContract({ playerId: props.playerId, attributes })
      if (contract) {
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }

  const bonusRequirementTypes = [
    'Appearances',
    'Goals',
    'Assists',
    'Clean Sheets'
  ]
</script>

<template>
  <tr>
    <td>
      <v-text-field
        v-model="attributes.signedOn"
        type="date"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.startedOn"
        type="date"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.endedOn"
        type="date"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.wage"
        type="number"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.signingBonus"
        type="number"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.releaseClause"
        type="number"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-model="attributes.performanceBonus"
        type="number"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-text-field
        v-if="attributes.performanceBonus"
        v-model="attributes.bonusReq"
        type="number"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <v-select
        v-if="attributes.performanceBonus"
        v-model="attributes.bonusReqType"
        :items="bonusRequirementTypes"
        density="comfortable"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="inEditMode">
        <v-btn @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</v-btn>
        &nbsp;
        <v-btn v-if="!!props.record" @click="inEditMode = false">Cancel</v-btn>
        <v-btn v-else @click="$emit('click:remove')">Remove</v-btn>
      </template>
      <template v-else>
        <v-btn @click="inEditMode = true">Edit</v-btn>
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Contract"
          label="Contract"
        />
      </template>
    </td>
  </tr>
</template>
