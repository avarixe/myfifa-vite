<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    playerId: null,
    replacementId: null,
    injury: false
  })

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Substitution`)

  const { activePlayers } = useActivePlayers()
  const { minute, sortedCaps } = useMatch(props.match)

  const availablePlayers = computed(() => {
    const selectedIds = sortedCaps.value.map(cap => cap.playerId)
    return activePlayers.value.filter(player => {
      if (selectedIds.indexOf(player.id) < 0) {
        return true
      } else if (props.record) {
        return player.id === props.record.replacementId
      }
    })
  })

  const unsubbedPlayers = computed(() =>
    sortedCaps.value.filter(cap =>
      (cap.playerId !== attributes.replacementId && !cap.subbedOut) ||
      (props.record && cap.playerId === props.record.playerId)
    )
  )

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'playerId',
        'replacementId',
        'injury'
      ]))
      minute.value = props.record.minute
    } else {
      attributes.injury = false
    }
  }

  function onSubmit () {
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-repeat"
    :title="title"
    :submit="onSubmit"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <v-text-field
          v-model="minute"
          label="Minute"
          type="number"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-model="attributes.playerId"
          :caps="unsubbedPlayers"
          label="Player"
          icon="mdi-subdirectory-arrow-left"
        />
      </v-col>
      <v-col cols="12">
        <player-select
          v-model="attributes.replacementId"
          :players="availablePlayers"
          label="Replaced By"
          icon="mdi-subdirectory-arrow-right"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.injury"
          label="Injury"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
