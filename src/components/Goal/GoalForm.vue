<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    home: true,
    playerId: null,
    playerName: '',
    assistId: null,
    assistedBy: '',
    ownGoal: false,
    penalty: false
  })

  const rulesFor = {
    playerName: [isRequired('Goal Scorer')]
  }

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Goal`)

  const { minute, unsubbedPlayers } = useMatch(props.match)

  const scorerOptions = computed(() =>
    unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.assistId)
  )

  const assistOptions = computed(() =>
    unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.playerId)
  )

  const { team } = useTeam()
  const teamGoal = computed(() =>
    !attributes.home ^ props.match.home === team.value.name
  )

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'home',
        'playerId',
        'playerName',
        'assistedBy',
        'assistId',
        'ownGoal',
        'penalty'
      ]))
      minute.value = props.record.minute
    } else {
      attributes.ownGoal = false
      attributes.penalty = false
    }
  }

  watchEffect(() => {
    if (!attributes.assistId && teamGoal.value) {
      attributes.assistedBy = ''
    }

    if (attributes.penalty || attributes.ownGoal) {
      attributes.assistId = null
      attributes.assistedBy = null
    }
  })

  function clearNames () {
    attributes.playerId = null
    attributes.playerName = null
    attributes.assistId = null
    attributes.assistedBy = null
  }

  function onSubmit () {
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-soccer"
    :title="title"
    :submit="onSubmit"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.home"
          inline
          hide-details
          @change="clearNames"
        >
          <v-radio
            :label="match.home"
            :value="true"
            color="teal"
          />
          <v-radio
            :label="match.away"
            :value="false"
            color="pink"
          />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="minute"
          label="Minute"
          type="number"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.playerId"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :caps="scorerOptions"
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          hide-details
          :disabled="attributes.penalty || attributes.ownGoal"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
