<script setup>
  const props = defineProps({
    competitionId: { type: Number, required: true }
  })

  const attributes = reactive({
    name: '',
    numTeams: null,
    numFixtures: null,
    table: false
  })

  const rulesFor = {
    name: [isRequired('Name')],
    numTeams: [
      isRequired('Number of Teams'),
      isNumber('Number of Teams')
    ],
    numFixtures: [
      isRequired('Number of Fixtures'),
      isNumber('Number of Fixtures')
    ]
  }

  watchEffect(() => {
    if (attributes.table) {
      attributes.numFixtures = null
    }
  })

  const { executeMutation: createStage } = useMutation(gql`
    mutation createStage($competitionId: ID!, $attributes: StageAttributes!) {
      addStage(competitionId: $competitionId, attributes: $attributes) {
        stage { ...StageData }
        errors { fullMessages }
      }
    }
    ${stageFragment}
  `)
  function onSubmit () {
    createStage({ competitionId: props.competitionId, attributes })
  }
</script>

<template>
  <dialog-form
    title="New Stage"
    :submit="onSubmit"
    @open="attributes.table = false"
  >
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          prepend-icon="mdi-table"
          :rules="rulesFor.name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.table"
          inline
          hide-details
        >
          <v-radio
            label="Group"
            :value="true"
          />
          <v-radio
            label="Knockout"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model.number="attributes.numTeams"
          label="Number of Teams"
          prepend-icon="mdi-account-group"
          :rules="rulesFor.numTeams"
          inputmode="numeric"
        />
      </v-col>
      <v-scroll-y-transition mode="out-in">
        <v-col
          v-if="!attributes.table"
          cols="12"
        >
          <v-text-field
            v-model.number="attributes.numFixtures"
            label="Number of Fixtures"
            prepend-icon="mdi-sword-cross"
            :rules="rulesFor.numFixtures"
            inputmode="numeric"
          />
        </v-col>
      </v-scroll-y-transition>
    </template>
  </dialog-form>
</template>
