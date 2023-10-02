<script setup lang="ts">
  import { Match, Cap } from '~/models'

  const props = defineProps<{
    match: Match
    readonly?: boolean
  }>()

  const { minute, activeCaps } = useMatchState(toRef(() => props.match))

  const formationCells = computed(() => {
    return matchPositions.reduce((map, pos) => {
      return {
        ...map,
        [pos]: activeCaps.value.find(cap => cap.pos === pos)
      }
    }, {}) as Record<string, Cap>
  })

  const benchCaps = computed(() => {
    const otherCaps = props.match.caps.filter(cap =>
      activeCaps.value.every(activeCap => activeCap.playerId !== cap.playerId)
    )

    const capsByPlayer = _groupBy(otherCaps, 'playerId')
    return (Object.values(capsByPlayer) as Cap[][]).map(
      caps => caps.find(cap => !cap.nextId) || caps[0]
    )
  })
  const benchRowLength = 4
  const firstBenchRow = computed(() => benchCaps.value.slice(0, benchRowLength))
  const firstRowPadding = computed(
    () => benchRowLength - benchCaps.value.length
  )
  const numExtrabenchCapsRows = computed(() =>
    Math.floor(benchCaps.value.length / benchRowLength)
  )

  function benchCapsRow(i: number) {
    return benchCaps.value.slice(i * benchRowLength, (i + 1) * benchRowLength)
  }

  const changeMinutes = computed(() => [
    ...new Set(props.match.caps.map(cap => cap.start).sort())
  ])
  watch(
    changeMinutes,
    () => {
      minute.value = changeMinutes.value[changeMinutes.value.length - 1]
    },
    { immediate: true }
  )
</script>

<template>
  <v-stepper
    v-if="changeMinutes.length > 1"
    v-model="minute"
    alt-labels
    class="bg-transparent elevation-0"
  >
    <v-stepper-header>
      <template v-for="(min, i) in changeMinutes" :key="min">
        <v-stepper-item
          :title="`${min}'`"
          :value="min"
          editable
          edit-icon="mdi-timer"
          :color="min === minute ? 'primary' : undefined"
        />
        <v-divider v-if="i < changeMinutes.length - 1" />
      </template>
    </v-stepper-header>
  </v-stepper>

  <v-divider class="mb-4" />

  <formation-grid :cells="formationCells" hide-empty-cells>
    <template #filled-pos="{ cell }">
      <match-formation-cap
        :cap="cell"
        :match="match"
        :readonly="props.readonly"
      />
    </template>
  </formation-grid>

  <v-row dense>
    <v-col cols="10" class="px-0">
      <div class="text-caption text-grey lighten-2">Bench</div>
    </v-col>
    <v-col v-if="!props.readonly" cols="2" class="px-0">
      <div class="text-caption text-grey lighten-2">vs</div>
    </v-col>
  </v-row>
  <v-row align="stretch" justify="space-around" dense>
    <v-col
      v-for="cap in firstBenchRow"
      :key="cap.id"
      cols="2"
      class="text-center"
    >
      <match-formation-cap
        :cap="cap"
        :match="match"
        :readonly="props.readonly"
      />
    </v-col>
    <template v-if="benchCaps.length < benchRowLength">
      <v-col
        v-for="index in firstRowPadding"
        :key="`blank-${index}`"
        cols="2"
      />
    </template>
    <v-col v-if="!props.readonly" cols="2" class="text-center">
      <match-formation-side :match="match" />
    </v-col>
  </v-row>
  <v-row
    v-for="row in numExtrabenchCapsRows"
    :key="row"
    align="stretch"
    justify="space-around"
    dense
  >
    <v-col
      v-for="cap in benchCapsRow(row)"
      :key="cap.id"
      cols="2"
      class="text-center"
    >
      <match-formation-cap
        :cap="cap"
        :match="match"
        :readonly="props.readonly"
      />
    </v-col>
    <v-col
      v-for="index in 5 - benchCapsRow(row).length"
      :key="`blank-${index}`"
      cols="2"
    />
  </v-row>
</template>
