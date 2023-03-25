<script setup lang="ts">
  import BookingForm from '~/components/Booking/BookingForm.vue'
  import GoalForm from '~/components/Goal/GoalForm.vue'
  import SubstitutionForm from '~/components/Substitution/SubstitutionForm.vue'

  const eventForm = {
    Booking: BookingForm,
    Goal: GoalForm,
    Substitution: SubstitutionForm
  }

  const props = withDefaults(
    defineProps<{
      match: MatchRecord
      event: MatchEvent
      readonly: boolean
    }>(),
    { readonly: false }
  )

  const { team } = useTeam()

  const teamIsHome = computed(() => {
    if (props.event.constructor.entity === 'Substitution') {
      return team.value.name === props.match.home
    } else {
      return props.event.home
    }
  })

  const itemColor = computed(() => (teamIsHome.value ? 'teal' : 'blue-grey'))

  const { mdAndUp } = useDisplay()
  const slotName = computed(() =>
    teamIsHome.value && mdAndUp.value ? 'opposite' : 'default'
  )
</script>

<template>
  <v-timeline-item :dot-color="itemColor">
    <template #icon>
      <small>{{ event.minute }}'</small>
    </template>
    <template #[slotName]>
      <div
        v-if="!mdAndUp"
        :class="`font-weight-light text-caption text-truncate mx-1 text-${itemColor} my-0`"
        v-text="teamIsHome ? match.home : match.away"
      />

      <slot />

      <div v-if="!readonly">
        <v-btn variant="text" color="warning">
          Edit
          <component
            :is="eventForm[event.timelineType]"
            :match="match"
            :record="event"
          />
        </v-btn>
        <remove-button
          :record="event"
          :store="event.timelineType"
          :label="capitalize(event.timelineType)"
          variant="text"
        />
      </div>
    </template>
  </v-timeline-item>
</template>
