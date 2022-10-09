<script setup>
  const props = defineProps({
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    homeScore: null,
    awayScore: null
  })

  const rulesFor = {
    homeScore: [isRequired('Home Score')],
    awayScore: [isRequired('Away Score')]
  }

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Penalty Shootout`)

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, ['homeScore', 'awayScore']))
    }
  }

  function onSubmit () {
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
