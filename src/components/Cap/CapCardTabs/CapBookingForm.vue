<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    cap: { type: Object, required: true }
  })

  const { team } = useTeam()

  const attributes = reactive({
    home: props.match.home === team.value.name,
    minute: null,
    playerId: props.cap.playerId,
    playerName: props.cap.name,
    redCard: false
  })

  watchEffect(() => {
    attributes.playerId = props.cap.playerId
    attributes.playerName = props.cap.name
    attributes.home = props.match.home === team.value.name
  })

  function onSubmit () {
  }
</script>

<template>
  <base-form
    :submit="onSubmit"
    @reset="attributes.redCard = false"
  >
    <template #default="{ valid, loading }">
      <div class="pa-2">
        <div class="text-subtitle-2 pb-2">
          Book Player
        </div>
        <v-text-field
          v-model="attributes.minute"
          label="Minute"
          type="number"
        />
        <v-radio-group v-model="attributes.redCard" inline>
          <v-radio
            label="Yellow Card"
            color="orange darken-2"
            :value="false"
          />
          <v-radio
            label="Red Card"
            color="red darken-2"
            :value="true"
          />
        </v-radio-group>
        <div class="d-flex">
          <v-spacer />
          <v-btn
            type="submit"
            :disabled="!valid"
            color="primary"
            variant="flat"
            :loading="loading"
            v-text="'Save'"
          />
        </div>
      </div>
    </template>
  </base-form>
</template>
