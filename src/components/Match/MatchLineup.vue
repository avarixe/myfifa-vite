<script setup lang="ts">
  const props = defineProps({
    match: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  })

  const { team } = useTeam()

  const teamPlayed = computed(() =>
    [props.match.home, props.match.away].includes(team.value.name)
  )

  const matchPosKeys = Object.keys(matchPositions)
  const sortedCaps = computed(() =>
    [...props.match.caps].sort((a, b) => {
      if (a.start !== b.start) {
        return a.start - b.start
      } else {
        return matchPosKeys.indexOf(a.pos) - matchPosKeys.indexOf(b.pos)
      }
    })
  )

  const nonTeamSides = computed(() => {
    const nonTeamSides = []
    const sides = ['home', 'away']
    sides.forEach(side => {
      if (props.match[side] !== team.value.name) {
        nonTeamSides.push(side)
      }
    })
    return nonTeamSides
  })
</script>

<template>
  <v-list density="compact">
    <template v-if="teamPlayed">
      <v-list-subheader>Players</v-list-subheader>
      <v-list-item v-for="cap in sortedCaps" :key="cap.id" v-ripple>
        <template #prepend>
          <span
            class="font-weight-black text-uppercase"
            :style="{ width: '40px' }"
            v-text="cap.pos"
          />
        </template>
        <v-list-item-title>{{ cap.player?.name }}</v-list-item-title>
        <cap-events :cap="cap" :match="match" />

        <template #append>
          <cap-rating :cap="cap" :readonly="readonly" />
        </template>

        <cap-card v-if="!readonly" :cap="cap" :match="match" />
      </v-list-item>
    </template>
    <template v-if="!readonly">
      <v-list-subheader>Teams</v-list-subheader>
      <v-list-item v-for="side in nonTeamSides" :key="side" v-ripple>
        <template #prepend>
          <span
            class="font-weight-black text-uppercase"
            :style="{ width: '40px' }"
            v-text="teamPlayed ? 'vs' : side"
          />
        </template>
        <v-list-item-title>{{ match[side] }}</v-list-item-title>

        <match-side-card :match="match" :side="side" />
      </v-list-item>
    </template>
  </v-list>
</template>

<style scoped>
  .v-list-item:hover {
    cursor: pointer;
  }
</style>
