<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    cap: { type: Object, required: true }
  })

  const { team } = useTeam()

  const attributes = reactive({
    home: props.match.home === team.value.name,
    playerId: props.cap.playerId,
    playerName: props.cap.name,
    assistedBy: '',
    assistId: '',
    ownGoal: false,
    penalty: false
  })

  watchEffect(() => {
    attributes.home = props.match.home === team.value.name
    attributes.playerId = props.cap.playerId
    attributes.playerName = props.cap.name

    if (attributes.penalty || attributes.ownGoal) {
      attributes.assistId = null
      attributes.assistedBy = null
    }
  })

  const { minute, unsubbedPlayers } = useMatch(props.match)
  const assistOptions = computed(() =>
    unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.playerId)
  )

  function onSubmit () {
  }

  function resetAttributes () {
    attributes.ownGoal = false
    attributes.penalty = false
  }
</script>

<template>
  <base-form
    :submit="onSubmit"
    @reset="resetAttributes"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Add Goal
        </div>
        <v-text-field
          v-model="minute"
          label="Minute"
          type="number"
        />
        <cap-select
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
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
            v-text="'Save'"
          />
        </div>
      </div>
    </template>
  </base-form>
</template>