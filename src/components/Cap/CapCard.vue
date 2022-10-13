<script setup>
  import { Player } from '~/models'

  const props = defineProps({
    cap: { type: Object, required: true },
    match: { type: Object, required: true }
  })

  const menu = ref(false)
  const tab = ref('cap')

  const playerRepo = useRepo(Player)
  const player = computed(() => playerRepo.find(props.cap.playerId))
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    activator="parent"
  >
    <v-card width="500">
      <v-card-title class="text-subtitle-1 pa-2 d-flex">
        <span class="mr-2">{{ cap.pos }}</span>
        <span class="font-weight-light">{{ player.name }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="plain"
          size="small"
          class="ml-1"
          @click="menu = false"
        />
      </v-card-title>
      <v-divider />
      <div class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical">
          <v-tab>
            <v-icon>mdi-account</v-icon>
          </v-tab>
          <v-tab>
            <v-icon>mdi-soccer</v-icon>
          </v-tab>
          <v-tab>
            <v-icon>mdi-repeat</v-icon>
          </v-tab>
          <v-tab>
            <v-icon>mdi-book</v-icon>
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="w-100">
          <v-window-item>
            <cap-editor
              :cap="cap"
              @submitted="menu = false"
            />
          </v-window-item>
          <v-window-item>
            <cap-goal-form
              :cap="cap"
              :match="match"
              @submitted="menu = false"
            />
          </v-window-item>
          <v-window-item>
            <cap-substitution-form
              :cap="cap"
              :match="match"
              @submitted="menu = false"
            />
          </v-window-item>
          <v-window-item>
            <cap-booking-form
              :cap="cap"
              :match="match"
              @submitted="menu = false"
            />
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-menu>
</template>
