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
      <input
        v-model="attributes.signedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.startedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.endedOn"
        type="date"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.wage"
        type="number"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.signingBonus"
        type="number"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.releaseClause"
        type="number"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <input
        v-model="attributes.performanceBonus"
        type="number"
        :disabled="!inEditMode"
      />
    </td>
    <td>
      <template v-if="attributes.performanceBonus">
        <input
          v-model="attributes.bonusReq"
          type="number"
          :disabled="!inEditMode"
        />
      </template>
    </td>
    <td>
      <template v-if="attributes.performanceBonus">
        <select
          v-model="attributes.bonusReqType"
          :disabled="!inEditMode"
        >
          <option
            v-for="(bonusReqType, i) in bonusRequirementTypes"
            :key="i"
          >{{ bonusReqType }}</option>
        </select>
      </template>
    </td>
    <td>
      <template v-if="inEditMode">
        <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
        <button v-if="!!props.record" href="#" @click="inEditMode = false">Cancel</button>
        <button v-else href="#" @click="$emit('click:remove')">Remove</button>
      </template>
      <template v-else>
        <a href="#" @click="inEditMode = true">Edit</a>
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
