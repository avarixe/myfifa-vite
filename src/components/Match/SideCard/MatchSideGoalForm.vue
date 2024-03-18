<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
    side: 'home' | 'away'
  }>()

  const attributes = reactive({
    home: props.side === 'home',
    minute: null,
    playerName: '',
    assistedBy: null,
    ownGoal: false,
    setPiece: null
  })

  const setPieceOptions = Object.entries(setPieces).map(([value, title]) => ({
    value,
    title
  }))

  watchEffect(() => {
    attributes.home = props.side === 'home'

    if (attributes.setPiece === 'PK') {
      attributes.ownGoal = false
      attributes.assistedBy = null
    } else if (attributes.ownGoal) {
      attributes.assistedBy = null
    }
  })

  const emit = defineEmits(['submitted'])
  const { form, formKey, formIsLoading, formIsValid, submitForm } = useForm({
    mutation: gql`
      mutation ($matchId: ID!, $attributes: GoalAttributes!) {
        addGoal(matchId: $matchId, attributes: $attributes) {
          goal {
            ...GoalData
          }
        }
      }
      ${goalFragment}
    `,
    variables: () => ({ matchId: props.match.id, attributes }),
    onSuccess() {
      emit('submitted')
    },
    onReset() {
      attributes.ownGoal = false
    }
  })
</script>

<template>
  <v-form
    ref="form"
    :key="formKey"
    v-model="formIsValid"
    @submit.prevent="submitForm"
  >
    <div class="pa-2">
      <div class="text-subtitle-2 pb-2">Add Goal</div>
      <minute-field v-model="attributes.minute" :match="match" />
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
        :disabled="attributes.setPiece === 'PK' || attributes.ownGoal"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
      <v-select
        v-model="attributes.setPiece"
        :items="setPieceOptions"
        label="Set Piece"
        prepend-icon="mdi-strategy"
        clearable
        hide-details
      />
      <v-checkbox
        v-model="attributes.ownGoal"
        label="Own Goal"
        :disabled="attributes.setPiece === 'PK'"
        hide-details
      />
      <div class="d-flex">
        <v-spacer />
        <v-btn
          type="submit"
          text="Save"
          :disabled="!formIsValid"
          color="primary"
          variant="text"
          :loading="formIsLoading"
        />
      </div>
    </div>
  </v-form>
</template>
