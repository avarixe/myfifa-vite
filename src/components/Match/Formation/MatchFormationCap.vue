<script setup lang="ts">
  import { Cap, Match } from '~/models'

  const props = defineProps<{
    cap: Cap
    match: Match
    readonly?: boolean
  }>()

  const attributes: CapAttributes = reactive({})
  watchEffect(() => {
    attributes.pos = props.cap.pos
    attributes.playerId = props.cap.playerId
  })

  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: CapAttributes!) {
        updateCap(id: $id, attributes: $attributes) {
          cap {
            ...CapData
          }
        }
      }
      ${capFragment}
    `,
    variables: () => ({ id: props.cap.id, attributes }),
    onSuccess() {
      posMenu.value = false
    }
  })

  const posMenu = ref(false)
  const posLoading = ref(false)
  async function selectPos(pos) {
    try {
      posLoading.value = true
      attributes.pos = pos
      await submitForm()
      posMenu.value = false
    } catch (e) {
      console.error(e)
      attributes.pos = props.cap.pos
    } finally {
      posLoading.value = false
    }
  }

  const { activePlayers } = useActivePlayers()
  const playerMenu = ref(false)
  const playerLoading = ref(false)
  async function selectPlayerId(playerId) {
    try {
      playerLoading.value = true
      attributes.playerId = playerId
      await submitForm()
      playerMenu.value = false
    } catch (e) {
      console.error(e)
      attributes.playerId = props.cap.playerId
    } finally {
      playerLoading.value = false
    }
  }
</script>

<template>
  <div
    :class="`pa-2 elevation-${readonly ? 0 : 5} rounded-lg w-100`"
    :style="{ background: 'rgba(0, 0, 0, 0.3)' }"
  >
    <v-btn
      :loading="posLoading"
      variant="text"
      block
      density="compact"
      :ripple="!readonly"
      class="font-weight-bold"
    >
      {{ cap.pos }}

      <v-menu v-if="!readonly" v-model="posMenu" activator="parent">
        <v-list density="compact" max-height="50vh">
          <v-list-item
            v-for="pos in Object.keys(matchPositions)"
            :key="pos"
            :title="pos"
            :value="pos"
            :active="attributes.pos === pos"
            :disabled="attributes.pos === pos"
            @click="selectPos(pos)"
          />
        </v-list>
      </v-menu>
    </v-btn>

    <v-btn
      id="player-selector"
      :loading="playerLoading"
      variant="text"
      block
      density="compact"
      :ripple="!readonly"
      class="font-weight-bold px-2"
      :style="{ textTransform: 'inherit' }"
    >
      <scroll-text
        :text="cap.player.name"
        :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
      />

      <v-menu v-if="!readonly" v-model="playerMenu" activator="parent">
        <v-list density="compact" max-height="50vh">
          <v-list-item
            v-for="player in activePlayers"
            :key="player.id"
            :title="player.name"
            :value="player.id"
            :active="attributes.playerId === player.id"
            :disabled="attributes.playerId === player.id"
            @click="selectPlayerId(player.id)"
          >
            <template #prepend>
              <small class="text-disabled font-weight-bold mr-4">
                {{ player.pos }}
              </small>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <div>
      <cap-rating :cap="cap" :readonly="readonly" />
    </div>
    <cap-events :cap="cap" :match="match" />
    <div v-if="!readonly" class="hidden-sm-and-down">
      <v-divider class="my-2 mx-n2" />
      <cap-event-actions :cap="cap" :match="match" />
    </div>
  </div>
</template>

<style scoped>
  #player-selector :deep(.v-btn__content) {
    overflow: hidden;
  }
</style>
