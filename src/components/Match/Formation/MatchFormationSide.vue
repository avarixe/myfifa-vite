<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{ match: Match }>()

  const { team } = useTeam()

  const side = computed(() =>
    props.match.home === team.value?.name ? 'away' : 'home'
  )
</script>

<template>
  <div
    class="pa-2 elevation-5 rounded-lg w-100"
    :style="{ background: 'rgba(0, 0, 0, 0.3)' }"
  >
    <div class="match-side-label font-weight-bold">TEAM</div>
    <div class="match-side-team">
      {{ match[side] }}
    </div>
    <div class="hidden-sm-and-down">
      <v-divider class="my-2 mx-n2" />
      <div
        class="d-flex justify-space-around align-center flex-wrap"
        :style="{ overflow: 'auto' }"
      >
        <v-btn size="x-small" icon variant="text">
          <v-icon>mdi-soccer</v-icon>
          <match-side-menu :match="match" :side="side">
            <template #default="{ close }">
              <match-side-goal-form
                :match="match"
                :side="side"
                @submitted="close"
              />
            </template>
          </match-side-menu>
        </v-btn>
        <v-btn size="x-small" icon variant="text">
          <v-icon>mdi-book</v-icon>
          <match-side-menu :match="match" :side="side">
            <template #default="{ close }">
              <match-side-booking-form
                :match="match"
                :side="side"
                @submitted="close"
              />
            </template>
          </match-side-menu>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .match-side-label {
    margin-left: -100%;
    margin-right: -100%;
    text-align: center;
  }

  .match-side-team {
    font-size: 0.8em;
    line-height: 1;
  }
</style>
