<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      player: {
        rowId: number
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
    ...props.player,
    contractsAttributes: { ...props.player.contractsAttributes }
  })

  const loading = ref(false)
  const saved = ref(false)
  const error = ref('')

  const { team } = useTeam()

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

  async function savePlayer() {
    try {
      loading.value = true

      delete attributes.rowId
      // TODO:
      // await createPlayer({ teamId: team.value.id, attributes })
      this.saved = true
    } catch (e) {
      this.error = e.message
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <tr>
    <td class="sticky">
      <v-sheet class="mx-n4 px-4">
        <v-btn v-if="saved" variant="text" @click="emit('remove', player)">
          <v-icon color="success">mdi-check-circle</v-icon>
        </v-btn>
        <v-tooltip v-else-if="error.length > 0" color="red" right>
          <template #activator="{ on }">
            <v-btn variant="text" v-on="on" @click="error = ''">
              <v-icon color="red">mdi-alert</v-icon>
            </v-btn>
          </template>
          <v-icon left dark> mdi-alert </v-icon>
          {{ error }}
        </v-tooltip>
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
