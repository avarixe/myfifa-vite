<script setup>
  const { team, currentSeason, seasonLabel } = useTeam()

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
  <v-navigation-drawer v-bind="$attrs">
    <v-list nav density="compact">
      <v-list-item
        :prepend-avatar="team.badgeUrl"
        :title="team.name"
        :subtitle="seasonLabel(currentSeason)"
      />
      <v-divider />
      <v-list-item prepend-icon="mdi-calendar-today">
        <v-text-field
          :model-value="team.currentlyOn"
          label="Current Date"
          density="compact"
          hide-details
          type="date"
          @update:model-value="onDateChange"
        />
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-run"
        title="Players"
        :to="`/teams/${team.id}/players`"
      />
      <v-list-item
        prepend-icon="mdi-trophy"
        title="Competitions"
        :to="`/teams/${team.id}/competitions`"
      />
      <v-list-item
        prepend-icon="mdi-calendar"
        title="Current Season"
        :to="`/teams/${team.id}/seasons/${currentSeason}`"
      />
      <v-list-item
        prepend-icon="mdi-soccer-field"
        title="Matches"
        :to="`/teams/${team.id}/matches`"
      />
      <v-list-item
        prepend-icon="mdi-clipboard-text"
        title="Squads"
        :to="`/teams/${team.id}/squads`"
      />
      <v-list-group>
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-google-analytics"
            title="Analytics"
          />
        </template>

        <v-list-item
          prepend-icon="mdi-trending-up"
          title="Development"
          :to="`/teams/${team.id}/analytics/development`"
        />
        <v-list-item
          prepend-icon="mdi-numeric"
          title="Statistics"
          :to="`/teams/${team.id}/analytics/statistics`"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
