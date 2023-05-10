<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      player: {
        name: string
        nationality: string
        pos: string
        secPos: string[]
        age: number
        ovr: number
        value: number
        kitNo: number
        contractsAttributes: {
          signedOn: string
          startedOn: string
          endedOn: string
          wage: number
          signingBonus: number
          releaseClause: number
          performanceBonus: number
          bonusReq: string
          bonusReqType: string
        }[]
      }
      submitted?: number
      cleared?: number
    }>(),
    {
      submitted: 0,
      cleared: 0
    }
  )

  const attributes = reactive({
    ..._omit(props.player, 'rowId'),
    contractsAttributes: [...props.player.contractsAttributes]
  })

  const saved = ref(false)
  const { team } = useTeam()
  const {
    submitForm: savePlayer,
    formIsLoading: loading,
    formError: error,
    dismissError
  } = useForm({
    mutation: gql`
      mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
        addPlayer(teamId: $teamId, attributes: $attributes) {
          player {
            ...PlayerData
          }
        }
      }
      ${playerFragment}
    `,
    variables: () => ({
      teamId: team.value.id,
      attributes
    }),
    onSuccess() {
      saved.value = true
    },
    broadcastErrors: false
  })

  watch(
    () => props.submitted,
    () => {
      if (!loading.value && !saved.value) {
        savePlayer()
      }
    }
  )

  const emit = defineEmits(['remove'])
  watch(
    () => props.cleared,
    () => {
      if (saved.value) {
        emit('remove', props.player)
      }
    }
  )
</script>

<template>
  <tr>
    <td class="sticky">
      <v-sheet class="mx-n4 px-4">
        <v-btn
          v-if="saved"
          icon="mdi-check-circle"
          color="success"
          variant="text"
          @click="emit('remove', player)"
        />
        <v-btn
          v-else-if="error.length > 0"
          color="red"
          icon
          variant="text"
          @click="dismissError"
        >
          <v-icon>mdi-alert</v-icon>
          <v-tooltip color="red" activator="parent" location="right">
            <v-icon start>mdi-alert</v-icon>
            {{ error }}
          </v-tooltip>
        </v-btn>
        <v-btn
          v-else
          variant="text"
          icon="mdi-close"
          :loading="loading"
          @click="emit('remove', player)"
        />
      </v-sheet>
    </td>
    <td>
      <v-text-field
        v-model="attributes.name"
        label="Name"
        :rules="[isRequired('Name')]"
        density="compact"
        variant="outlined"
        hide-details
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </td>
    <td>
      <nationality-field
        v-model="attributes.nationality"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="attributes.pos"
        label="Position"
        :items="positions"
        :rules="[isRequired('Position')]"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <v-select
        v-model="attributes.secPos"
        label="2nd Position(s)"
        :items="positions"
        multiple
        chips
        small-chips
        deletable-chips
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model.number="attributes.age"
        label="Age"
        :rules="[isRequired('Age'), isNumber('Age')]"
        density="compact"
        variant="outlined"
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-text-field
        v-model.number="attributes.ovr"
        label="OVR"
        :rules="[
          isRequired('OVR Rating'),
          isNumber('OVR Rating'),
          inRange('OVR Rating', [40, 100])
        ]"
        density="compact"
        variant="outlined"
        hide-details
        input="numeric"
      />
    </td>
    <td>
      <money-field
        v-model.number="attributes.value"
        label="Value"
        :prefix="team.currency"
        required
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-model.number="attributes.kitNo"
        label="Kit Number"
        :rules="[isNumber('Kit No'), inRange('Kit No', [1, 99])]"
        density="compact"
        variant="outlined"
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <date-field
        v-model="attributes.contractsAttributes[0].endedOn"
        label="Contract Ends"
        :min="attributes.contractsAttributes[0].startedOn"
        required
        density="compact"
        variant="outlined"
        hide-details
        start-with-year
      />
    </td>
    <td>
      <money-field
        v-model.number="attributes.contractsAttributes[0].wage"
        label="Wage"
        :prefix="team.currency"
        required
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <money-field
        v-model.number="attributes.contractsAttributes[0].signingBonus"
        label="Signing Bonus"
        :prefix="team.currency"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <money-field
        v-model.number="attributes.contractsAttributes[0].releaseClause"
        label="Release Clause"
        :prefix="team.currency"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <money-field
        v-model.number="attributes.contractsAttributes[0].performanceBonus"
        label="Perf. Bonus"
        :prefix="team.currency"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
    <td>
      <v-text-field
        v-if="attributes.contractsAttributes[0].performanceBonus"
        v-model.number="attributes.contractsAttributes[0].bonusReq"
        label="Bonus Req."
        prefix="if"
        :rules="[isRequired('Bonus Req.'), isNumber('Bonus Req.')]"
        density="compact"
        variant="outlined"
        hide-details
        inputmode="numeric"
      />
    </td>
    <td>
      <v-select
        v-if="attributes.contractsAttributes[0].performanceBonus"
        v-model="attributes.contractsAttributes[0].bonusReqType"
        label="Bonus Req. Type"
        :items="bonusRequirementTypes"
        :rules="[isRequired('Bonus Req. Type')]"
        density="compact"
        variant="outlined"
        hide-details
      />
    </td>
  </tr>
</template>

<style scoped>
  td:not(:first-child) {
    padding: 4px;
  }

  td :deep(.v-input) {
    width: 150px;
  }
</style>
