<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const { team } = useTeam()

  const starters = computed(() => props.match.caps.filter(c => c.start === 0))
  const formationCells = computed(() =>
    Object.keys(matchPositions).reduce((map, pos) => {
      return {
        ...map,
        [pos]: starters.value.find(cap => cap.pos === pos)
      }
    }, {})
  )

  const substitutes = computed(() => props.match.caps.filter(c => c.start > 0))
  const substitutesRowLength = computed(() => 4)
  const firstSubstitutesRow = computed(() =>
    substitutes.value.slice(0, substitutesRowLength.value)
  )
  const firstRowPadding = computed(() =>
    substitutesRowLength.value - substitutes.value.length
  )
  const numExtraSubstitutesRows = computed(() =>
    Math.floor(substitutes.value.length / substitutesRowLength.value)
  )

  function substitutesRow (i) {
    return substitutes.value.slice(
      i * substitutesRowLength.value,
      (i + 1) * substitutesRowLength.value
    )
  }
</script>

<template>
  <formation-grid
    :cells="formationCells"
    hide-empty-cells
  >
    <template #filled-pos="{ cell }">
      <div v-ripple class="pos-cell pa-2 elevation-5 rounded-lg w-100">
        <div class="player-pos font-weight-bold">{{ cell.pos }}</div>
        <scroll-text
          :text="cell.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cell" />
        <cap-events :cap="cell" :match="match" />
        <cap-card v-if="!cell.subbedOut" :cap="cell" :match="match" />
      </div>
    </template>
  </formation-grid>

  <v-row dense>
    <v-col cols="10" class="px-0">
      <div class="text-caption text-grey lighten-2">Substitutes</div>
    </v-col>
    <v-col cols="2" class="px-0">
      <div class="text-caption text-grey lighten-2">vs</div>
    </v-col>
  </v-row>
  <v-row
    align="stretch"
    justify="space-around"
    dense
  >
    <v-col
      v-for="cap in firstSubstitutesRow"
      :key="cap.id"
      cols="2"
      class="text-center"
    >
      <div v-ripple class="pos-cell pa-2 elevation-5 rounded-lg w-100">
        <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
        <scroll-text
          :text="cap.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cap" />
        <cap-events :cap="cap" :match="match" />
        <cap-card v-if="!cap.subbedOut" :cap="cap" :match="match" />
      </div>
    </v-col>
    <template v-if="substitutes.length < substitutesRowLength">
      <v-col
        v-for="index in firstRowPadding"
        :key="`blank-${index}`"
        cols="2"
      />
    </template>
    <v-col cols="2" class="text-center">
      <div v-ripple class="pos-cell pa-2 elevation-5 rounded-lg w-100">
        <div class="match-side-label font-weight-bold">TEAM</div>
        <div class="match-side-team">
          {{ match[match.home === team.name ? 'away' : 'home'] }}
        </div>
        <match-side-card
          :match="match"
          :side="match.home === team.name ? 'away' : 'home'"
        />
      </div>
    </v-col>
  </v-row>
  <v-row
    v-for="row in numExtraSubstitutesRows"
    :key="row"
    align="stretch"
    justify="space-around"
    dense
  >
    <v-col
      v-for="cap in substitutesRow(row)"
      :key="cap.id"
      cols="2"
      class="text-center"
    >
      <div v-ripple class="pos-cell pa-2 elevation-5 rounded-lg w-100">
        <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
        <scroll-text
          :text="cap.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cap" />
        <cap-events :cap="cap" :match="match" />
        <cap-card v-if="!cap.subbedOut" :cap="cap" :match="match" />
      </div>
    </v-col>
    <v-col
      v-for="index in (5 - substitutesRow(row).length)"
      :key="`blank-${index}`"
      cols="2"
    />
  </v-row>
</template>

<style scoped>
  .pos-cell:hover {
    cursor: pointer;
  }

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
