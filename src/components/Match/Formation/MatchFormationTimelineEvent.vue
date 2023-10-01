<script setup lang="ts">
  import { Match, Cap } from '~/models'

  const props = defineProps<{
    match: Match
    minute: number
    readonly?: boolean
  }>()

  const { team } = useTeam()
  const teamIsHome = computed(() => team.value.name === props.match.home)

  const itemColor = computed(() => (teamIsHome.value ? 'teal' : 'blue-grey'))

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    teamIsHome.value && mdAndUp.value ? 'opposite' : 'default'
  )

  const capRepo = useRepo(Cap)
  const caps = computed(
    () =>
      capRepo
        .with('previous', query => {
          query.with('player')
        })
        .with('player')
        .where('start', props.minute)
        .get() as Cap[]
  )
</script>

<template>
  <v-timeline-item :dot-color="itemColor">
    <template #icon>
      <small>{{ minute }}'</small>
    </template>
    <template #[slotName]>
      <div
        v-if="!mdAndUp"
        :class="`font-weight-light text-caption text-truncate mx-1 text-${itemColor} my-0`"
        v-text="team.name"
      />

      <div v-for="cap in caps" :key="cap.id">
        <div>
          <template v-if="cap.playerId !== cap.previous.playerId">
            <v-icon
              :color="cap.previous.injured ? 'pink' : 'red'"
              size="small"
              start
              :icon="`mdi-${
                cap.previous.injured ? 'ambulance' : 'subdirectory-arrow-left'
              }`"
            />
            {{ cap.previous.player.name }}
            <b class="ml-2">{{ cap.previous.pos }}</b>
            <v-icon
              color="green"
              size="small"
              end
              icon="mdi-subdirectory-arrow-right"
            />
            {{ cap.player.name }}
            <b class="ml-2">{{ cap.pos }}</b>
          </template>
          <template v-else>
            <v-icon
              color="orange"
              size="small"
              start
              icon="mdi-vector-polyline"
            />
            {{ cap.player.name }}
            <b class="ml-2">{{ cap.previous.pos }}</b>
            <v-icon size="small" icon="mdi-arrow-right-thin" />
            <b>{{ cap.pos }}</b>
          </template>

          <div v-if="!props.readonly">
            <v-btn variant="text" size="small" color="warning">
              Edit
              <cap-form :match="match" :record="cap" />
            </v-btn>
            <remove-button
              :record="cap"
              store="Cap"
              label="Cap"
              variant="text"
              size="small"
            />
          </div>
        </div>
      </div>

      <!-- <div v-if="!props.readonly">
        <v-btn variant="text" color="warning">
          Edit
          <booking-form
            v-if="event instanceof Booking"
            :match="match"
            :record="event"
          />
          <goal-form
            v-else-if="event instanceof Goal"
            :match="match"
            :record="event"
          />
          <cap-form
            v-else-if="event instanceof Cap"
            :match="match"
            :record="event"
          />
        </v-btn>
        <remove-button
          :record="event"
          :store="timelineType"
          :label="timelineType"
          variant="text"
        />
      </div> -->
    </template>
  </v-timeline-item>
</template>
