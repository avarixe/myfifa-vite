<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
    readonly?: boolean
  }>()

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
      <div
        :class="`pos-cell pa-2 elevation-${readonly ? 0 : 5} rounded-lg w-100`"
      >
        <div class="player-pos font-weight-bold">{{ cell.pos }}</div>
        <scroll-text
          :text="cell.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cell" :readonly="readonly" />
        <cap-events :cap="cell" :match="match" />
        <div v-if="!readonly" class="hidden-sm-and-down">
          <v-divider class="my-2 mx-n2" />
          <cap-event-actions :cap="cell" :match="match" />
        </div>
      </div>
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
      <div
        :class="`pos-cell pa-2 elevation-${readonly ? 0 : 5} rounded-lg w-100`"
      >
        <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
        <scroll-text
          :text="cap.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cap" />
        <cap-events :cap="cap" :match="match" />
        <div v-if="!readonly" class="hidden-sm-and-down">
          <v-divider class="my-2 mx-n2" />
          <cap-event-actions :cap="cap" :match="match" />
        </div>
      </div>
    </v-col>
    <template v-if="substitutes.length < substitutesRowLength">
      <v-col
        v-for="index in firstRowPadding"
        :key="`blank-${index}`"
        cols="2"
      />
    </template>
    <v-col v-if="!readonly" cols="2" class="text-center">
      <div class="pos-cell pa-2 elevation-5 rounded-lg w-100">
        <div class="match-side-label font-weight-bold">TEAM</div>
        <div class="match-side-team">
          {{ match[match.home === team?.name ? 'away' : 'home'] }}
        </div>
        <div class="hidden-sm-and-down">
          <v-divider class="my-2 mx-n2" />
          <div
            class="d-flex justify-space-around align-center flex-wrap"
            :style="{ overflow: 'auto' }"
          >
            <v-btn size="x-small" icon variant="text">
              <v-icon>mdi-soccer</v-icon>
              <match-side-menu
                :match="match"
                :side="match.home === team?.name ? 'away' : 'home'"
              >
                <template #default="{ side, close }">
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
              <match-side-menu
                :match="match"
                :side="match.home === team?.name ? 'away' : 'home'"
              >
                <template #default="{ side, close }">
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
      <div
        :class="`pos-cell pa-2 elevation-${readonly ? 0 : 5} rounded-lg w-100`"
      >
        <div class="player-pos font-weight-bold">{{ cap.pos }}</div>
        <scroll-text
          :text="cap.player.name"
          :style="{ fontSize: '0.8em', lineHeight: 1.5 }"
        />
        <cap-rating :cap="cap" :readon="readonly" />
        <cap-events :cap="cap" :match="match" />
        <div v-if="!readonly" class="hidden-sm-and-down">
          <v-divider class="my-2 mx-n2" />
          <cap-event-actions :cap="cap" :match="match" />
        </div>
      </div>
    </v-col>
    <v-col
      v-for="index in 5 - substitutesRow(row).length"
      :key="`blank-${index}`"
      cols="2"
    />
  </v-row>
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
