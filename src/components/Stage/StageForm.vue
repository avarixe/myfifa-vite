<script setup lang="ts">
  const props = defineProps<{
    competitionId: number
  }>()

  const attributes = reactive({
    name: '',
    numTeams: null,
    numFixtures: null,
    table: false
  })

  watchEffect(() => {
    if (attributes.table) {
      attributes.numFixtures = null
    }
  })

  const mutation = gql`
    mutation ($competitionId: ID!, $attributes: StageAttributes!) {
      addStage(competitionId: $competitionId, attributes: $attributes) {
        stage {
          ...StageData
        }
      }
    }
    ${stageFragment}
  `
  function variables() {
    return { competitionId: props.competitionId, attributes }
  }
</script>

<template>
  <dialog-form
    title="New Stage"
    :mutation="mutation"
    :variables="variables"
    width="100%"
    @open="attributes.table = false"
  >
    <v-col cols="12">
      <v-text-field
        v-model="attributes.name"
        label="Name"
        prepend-icon="mdi-table"
        :rules="[isRequired('Name')]"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </v-col>
    <v-col cols="12">
      <v-radio-group v-model="attributes.table" inline hide-details>
        <v-radio label="Group" :value="true" />
        <v-radio label="Knockout" :value="false" />
      </v-radio-group>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model.number="attributes.numTeams"
        label="Number of Teams"
        prepend-icon="mdi-account-group"
        :rules="[isRequired('Number of Teams'), isNumber('Number of Teams')]"
        inputmode="numeric"
      />
    </v-col>
    <v-scroll-y-transition mode="out-in">
      <v-col v-if="!attributes.table" cols="12">
        <v-text-field
          v-model.number="attributes.numFixtures"
          label="Number of Fixtures"
          prepend-icon="mdi-sword-cross"
          :rules="[
            isRequired('Number of Fixtures'),
            isNumber('Number of Fixtures')
          ]"
          inputmode="numeric"
        />
      </v-col>
    </v-scroll-y-transition>
  </dialog-form>
</template>
