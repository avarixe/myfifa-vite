<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const { formIsLoading: loading, submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: MatchAttributes!) {
        updateMatch(id: $id, attributes: $attributes) {
          match {
            ...MatchData
          }
        }
      }
      ${matchFragment}
    `,
    variables: () => ({
      id: props.match.id,
      attributes: {
        extraTime: !props.match.extraTime
      }
    })
  })
</script>

<template>
  <v-switch
    :loading="loading"
    :model-value="match.extraTime"
    @update:model-value="submitForm"
  />
</template>
