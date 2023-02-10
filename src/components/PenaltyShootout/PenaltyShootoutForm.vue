<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const attributes = reactive({
    homeScore: props.match.penaltyShootout?.homeScore,
    awayScore: props.match.penaltyShootout?.awayScore
  })

  const rulesFor = {
    homeScore: [isRequired('Home Score')],
    awayScore: [isRequired('Away Score')]
  }

  const title = computed(
    () => `${props.record ? 'Edit' : 'Record'} Penalty Shootout`
  )

  function onOpen() {
    if (props.record) {
      Object.assign(attributes, pick(props.record, ['homeScore', 'awayScore']))
    }
  }

  const { executeMutation: savePenaltyShootout } = useMutation(gql`
    mutation savePenaltyShootout(
      $matchId: ID!
      $attributes: PenaltyShootoutAttributes!
    ) {
      updateMatch(
        id: $matchId
        attributes: { penaltyShootoutAttributes: $attributes }
      ) {
        match {
          ...MatchData
          penaltyShootout {
            ...PenaltyShootoutData
          }
        }
        errors {
          fullMessages
        }
      }
    }
    ${matchFragment}
    ${penaltyShootoutFragment}
  `)

  async function onSubmit() {
    const {
      data: {
        updateMatch: { errors }
      }
    } = await savePenaltyShootout({ matchId: props.match.id, attributes })
    if (errors) {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-human"
    :title="title"
    :submit="onSubmit"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.homeScore"
          label="Home Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.homeScore"
          type="number"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model.number="attributes.awayScore"
          label="Away Score"
          prepend-icon="mdi-soccer"
          :rules="rulesFor.awayScore"
          type="number"
        />
      </v-col>
    </template>
  </dialog-form>
</template>
