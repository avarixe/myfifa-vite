<script setup lang="ts">
  const props = defineProps<{
    cap: CapRecord
    match: MatchRecord
  }>()

  const menu = ref(false)

  const playerRepo = useRepo(Player)
  const player = computed(() => playerRepo.find(props.cap.playerId))
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" activator="parent">
    <v-card width="400">
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
      <div class="pa-2">
        <slot
          :close="
            () => {
              menu = false
            }
          "
        />
      </div>
    </v-card>
  </v-menu>
</template>
