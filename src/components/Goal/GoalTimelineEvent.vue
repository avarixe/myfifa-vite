<script setup lang="ts">
  import { Goal, Match } from '~/models'

  const props = defineProps<{
    match: Match
    goal: Goal
    readonly?: boolean
  }>()

  const itemColor = computed(() => (props.goal.home ? 'teal' : 'blue-grey'))

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    props.goal.home && mdAndUp.value ? 'opposite' : 'default'
  )
</script>

<template>
  <v-timeline-item :dot-color="itemColor">
    <template #icon>
      <small>{{ goal.minute }}'</small>
    </template>
    <template #[slotName]>
      <div
        v-if="!mdAndUp"
        :class="`font-weight-light text-caption text-truncate mx-1 text-${itemColor} my-0`"
        v-text="goal.home ? match.home : match.away"
      />

      <div>
        <v-icon
          :color="goal.ownGoal ? 'red-darken-4' : 'blue'"
          size="small"
          start
          icon="mdi-soccer"
        />
        {{ goal.playerName }}
        <span v-if="goal.penalty">(P)</span>
        <span v-else-if="goal.ownGoal">(OG)</span>
        <template v-if="goal.assistedBy">
          <v-icon
            color="light-blue accent-1"
            size="small"
            icon="mdi-human-greeting"
          />
          {{ goal.assistedBy }}
        </template>
      </div>

      <div v-if="!props.readonly">
        <v-btn variant="text" color="warning" size="small">
          Edit
          <goal-form :match="match" :record="goal" />
        </v-btn>
        <remove-button
          :record="goal"
          store="Goal"
          label="Goal"
          variant="text"
          size="small"
        />
      </div>
    </template>
  </v-timeline-item>
</template>
