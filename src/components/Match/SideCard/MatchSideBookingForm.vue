<script setup>
  const props = defineProps({
    match: { type: Object, required: true },
    side: { type: String, required: true }
  })

  const attributes = reactive({
    minute: null,
    home: props.side === 'home',
    playerName: '',
    redCard: false
  })

  watchEffect(() => {
    attributes.home = props.side === 'home'
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
        <div class="text-subtitle-2 pb-2">Book Player</div>
        <v-text-field
          v-model="attributes.minute"
          label="Minute"
          type="number"
        />
        <v-text-field
          v-model="attributes.playerName"
          label="Player"
          prepend-icon="mdi-account"
          :rules="[isRequired('Player')]"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
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
            primary
            text
            :loading="loading"
            v-text="'Save'"
          />
        </div>
      </div>
    </template>
  </base-form>
</template>
