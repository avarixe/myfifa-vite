<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
    readonly?: boolean
  }>()

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
  const firstRowPadding = computed(
    () => substitutesRowLength.value - substitutes.value.length
  )
  const numExtraSubstitutesRows = computed(() =>
    Math.floor(substitutes.value.length / substitutesRowLength.value)
  )

  function substitutesRow(i) {
    return substitutes.value.slice(
      i * substitutesRowLength.value,
      (i + 1) * substitutesRowLength.value
    )
  }
</script>

<template>
  <formation-grid :cells="formationCells" hide-empty-cells>
    <template #filled-pos="{ cell }">
      <match-formation-cap :cap="cell" :match="match" :readonly="readonly" />
    </template>
  </formation-grid>

  <v-row dense>
    <v-col cols="10" class="px-0">
      <div class="text-caption text-grey lighten-2">Substitutes</div>
    </v-col>
    <v-col v-if="!readonly" cols="2" class="px-0">
      <div class="text-caption text-grey lighten-2">vs</div>
    </v-col>
  </v-row>
  <v-row align="stretch" justify="space-around" dense>
    <v-col
      v-for="cap in firstSubstitutesRow"
      :key="cap.id"
      cols="2"
      class="text-center"
    >
      <match-formation-cap :cap="cap" :match="match" :readonly="readonly" />
    </v-col>
    <template v-if="substitutes.length < substitutesRowLength">
      <v-col
        v-for="index in firstRowPadding"
        :key="`blank-${index}`"
        cols="2"
      />
    </template>
    <v-col v-if="!readonly" cols="2" class="text-center">
      <match-formation-side :match="match" />
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
      <match-formation-cap :cap="cap" :match="match" :readonly="readonly" />
    </v-col>
    <v-col
      v-for="index in 5 - substitutesRow(row).length"
      :key="`blank-${index}`"
      cols="2"
    />
  </v-row>
</template>
