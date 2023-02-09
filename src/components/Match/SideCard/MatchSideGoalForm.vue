<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    side: { type: String, required: true }
  })

  const attributes = reactive({
    home: props.side === 'home',
    minute: null,
    playerName: '',
    assistedBy: '',
    ownGoal: false,
    penalty: false
  })

  watchEffect(() => {
    attributes.home = props.side === 'home'

    if (attributes.ownGoal || attributes.penalty) {
      attributes.assistedBy = null
    }
  })

  function resetAttributes() {
    attributes.ownGoal = false
    attributes.penalty = false
  }

  const { executeMutation: createGoal } = useMutation(gql`
    mutation createGoal($matchId: ID!, $attributes: GoalAttributes!) {
      addGoal(matchId: $matchId, attributes: $attributes) {
        goal {
          ...GoalData
        }
        errors {
          fullMessages
        }
      }
    }
    ${goalFragment}
  `)

  const emit = defineEmits(['submitted'])
  async function onSubmit() {
    const {
      data: {
        addGoal: { errors }
      }
    } = await createGoal({ matchId: props.match.id, attributes })
    if (errors) {
      alert(errors.fullMessages[0])
    } else {
      emit('submitted')
    }
  }
</script>

<template>
  <base-form :submit="onSubmit" @reset="resetAttributes">
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">Add Goal</div>
        <v-text-field
          v-model.number="attributes.minute"
          label="Minute"
          type="number"
        />
        <v-text-field
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="[isRequired('Goal Scorer')]"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-text-field
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          hide-details
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
        />
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            color="primary"
            variant="text"
            :loading="loading"
          >
            Save
          </v-btn>
        </div>
      </div>
    </template>
  </base-form>
</template>
