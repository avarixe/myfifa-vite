<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
    side: 'home' | 'away'
  }>()

  const menu = ref(false)
  const tab = ref('goal')

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
      <div class="d-flex flex-row">
        <v-tabs v-model="tab" direction="vertical">
          <v-tab value="goal">
            <v-icon>mdi-soccer</v-icon>
          </v-tab>
          <v-tab value="booking">
            <v-icon>mdi-book</v-icon>
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="w-100">
          <v-window-item value="goal">
            <match-side-goal-form
              :match="match"
              :side="side"
              @submitted="menu = false"
            />
          </v-window-item>
          <v-window-item value="booking">
            <match-side-booking-form
              :match="match"
              :side="side"
              @submitted="menu = false"
            />
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-menu>
</template>
