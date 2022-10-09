<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    home: true,
    playerId: null,
    playerName: '',
    redCard: false
  })

  const rulesFor = {
    playerName: [isRequired('Player')]
  }

  const { team } = useTeam()
  const { minute, unsubbedPlayers } = useMatch(props.match)

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Booking`)

  function onOpen () {
    if (props.record) {
      Object.assign(attributes, pick(props.record, [
        'home',
        'playerId',
        'playerName',
        'redCard'
      ]))
      minute.value = props.record.minute
    } else {
      attributes.redCard = false
    }
  }

  function clearNames () {
    attributes.playerId = null
    attributes.playerName = null
  }

  function onSubmit () {
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-book"
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
            color="blue-grey"
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
          v-if="!attributes.home ^ match.home === team.name"
          v-model="attributes.playerId"
          label="Player"
          prepend-icon="mdi-account"
          :caps="unsubbedPlayers"
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.redCard"
          inline
          hide-details
        >
          <v-radio
            label="Yellow Card"
            :value="false"
            color="orange darken-2"
          />
          <v-radio
            label="Red Card"
            :value="true"
            color="red darken-2"
          />
        </v-radio-group>
      </v-col>
    </template>
  </dialog-form>
</template>
