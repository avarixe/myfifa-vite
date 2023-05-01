<script setup lang="ts">
  const props = defineProps<{
    match: MatchRecord
    side: 'home' | 'away'
  }>()

  const menu = ref(false)

  const { team } = useTeam()

  const sideTeam = computed(() => props.match[props.side])
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" activator="parent">
    <v-card width="400">
      <v-card-title class="text-subtitle-1 pa-2 d-flex">
        <small class="mr-2 text-overline">
          {{ [match.home, match.away].includes(team.name) ? 'vs' : side }}
        </small>
        <span class="font-weight-light">{{ sideTeam }}</span>
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
          :side="side"
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
