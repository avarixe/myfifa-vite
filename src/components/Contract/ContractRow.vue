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
        v-if="inEditMode"
        v-model="attributes.signedOn"
        type="date"
      />
      <template v-else>{{ record.signedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.startedOn"
        type="date"
      />
      <template v-else>{{ record.startedOn }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.endedOn"
        type="date"
      />
      <template v-else>{{ record.endedOn }}</template>
    </td>
    <!-- <td>
        v-if="inEditMode"
      <input v-model="attributes.numSeasons" />
    </td> -->
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.wage"
        type="number"
      />
      <template v-else>{{ record.wage }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.signingBonus"
        type="number"
      />
      <template v-else>{{ record.signingBonus }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.releaseClause"
        type="number"
      />
      <template v-else>{{ record.releaseClause }}</template>
    </td>
    <td>
      <input
        v-if="inEditMode"
        v-model="attributes.performanceBonus"
        type="number"
      />
      <template v-else>{{ record.performanceBonus }}</template>
    </td>
    <td>
      <template v-if="attributes.performanceBonus">
        <input
          v-if="inEditMode"
          v-model="attributes.bonusReq"
          type="number"
        />
        <template v-else>{{ record.bonusReq }}</template>
      </template>
    </td>
    <td>
      <template v-if="attributes.performanceBonus">
        <select
          v-if="inEditMode"
          v-model="attributes.bonusReqType"
        >
          <option
            v-for="(bonusReqType, i) in bonusRequirementTypes"
            :key="i"
          >{{ bonusReqType }}</option>
        </select>
        <template v-else>{{ record.bonusReqType }}</template>
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
