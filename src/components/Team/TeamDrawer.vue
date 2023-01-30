<script setup>
  const { team, currentSeason, seasonLabel } = useTeam()

  defineProps({
    modelValue: { type: Boolean, default: false }
  })

  const { executeMutation: updateTeam } = useMutation(gql`
    mutation ($id: ID!, $attributes: TeamAttributes!) {
      updateTeam(id: $id, attributes: $attributes) {
        team { ...TeamData }
        errors { fullMessages }
      }
    }
    ${teamFragment}
  `)

  async function onDateChange (currentlyOn) {
    const { data: { updateTeam: { errors } } } =
      await updateTeam({ id: team.value.id, attributes: { currentlyOn } })
    if (errors) {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <q-drawer
    bordered
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-list nav density="compact">
      <q-item>
        <q-item-section avatar>
          <q-img :src="team.badgeUrl" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ team.name }}</q-item-label>
          <q-item-label caption>{{ seasonLabel(currentSeason) }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section avatar>
          <q-icon name="mdi-calendar-today" />
        </q-item-section>
        <date-field
          :model-value="team.currentlyOn"
          label="Current Date"
          class="w-full"
          @update:model-value="onDateChange"
        />
      </q-item>
      <q-item :to="`/teams/${team.id}/players`">
        <q-item-section avatar>
          <q-icon name="mdi-run" />
        </q-item-section>
        <q-item-section>Players</q-item-section>
      </q-item>
      <q-item :to="`/teams/${team.id}/competitions`">
        <q-item-section avatar>
          <q-icon name="mdi-trophy" />
        </q-item-section>
        <q-item-section>Competitions</q-item-section>
      </q-item>
      <q-item :to="`/teams/${team.id}/seasons/${currentSeason}`">
        <q-item-section avatar>
          <q-icon name="mdi-calendar" />
        </q-item-section>
        <q-item-section>Current Season</q-item-section>
      </q-item>
      <q-item :to="`/teams/${team.id}/matches`"
      >
        <q-item-section avatar>
          <q-icon name="mdi-soccer-field" />
        </q-item-section>
        <q-item-section>Matches</q-item-section>
      </q-item>
      <q-item :to="`/teams/${team.id}/squads`">
        <q-item-section avatar>
          <q-icon name="mdi-clipboard-text" />
        </q-item-section>
        <q-item-section>Squads</q-item-section>
      </q-item>
      <q-expansion-item
        icon="mdi-google-analytics"
        label="Analytics"
        :content-inset-level="1"
      >
        <q-list>
          <q-item :to="`/teams/${team.id}/analytics/development`">
            <q-item-section avatar>
              <q-icon name="mdi-trending-up" />
            </q-item-section>
            <q-item-section>Development</q-item-section>
          </q-item>
          <q-item :to="`/teams/${team.id}/analytics/statistics`">
            <q-item-section avatar>
              <q-icon name="mdi-numeric" />
            </q-item-section>
            <q-item-section>Statistics</q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>
  </q-drawer>
</template>
