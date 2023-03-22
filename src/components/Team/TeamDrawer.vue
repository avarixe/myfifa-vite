<script setup lang="ts">
  const { team, currentSeason, seasonLabel } = useTeam()

  const currentlyOn = ref(team.value.currentlyOn)
  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: TeamAttributes!) {
        updateTeam(id: $id, attributes: $attributes) {
          team {
            ...TeamData
          }
        }
      }
      ${teamFragment}
    `,
    variables: () => ({
      id: team.value.id,
      attributes: { currentlyOn: currentlyOn.value }
    })
  })
  function onDateChange(date) {
    currentlyOn.value = date
    submitForm()
  }

  const items = [
    { to: '', icon: 'mdi-view-dashboard', title: 'Dashboard', cols: 12 },
    { to: 'players', icon: 'mdi-run', title: 'Players' },
    { to: 'players/new', icon: 'mdi-account-plus', title: 'New Player' },
    { to: 'matches', icon: 'mdi-soccer-field', title: 'Matches' },
    { to: 'matches/new', icon: 'mdi-soccer', title: 'New Match' },
    { to: 'competitions', icon: 'mdi-trophy', title: 'Competitions' },
    {
      to: 'competitions/new',
      icon: 'mdi-tournament',
      title: 'New Competition'
    },
    {
      to: `seasons/${currentSeason.value}`,
      icon: 'mdi-calendar',
      title: 'Current Season'
    },
    { to: 'squads', icon: 'mdi-clipboard-text', title: 'Squads' },
    {
      to: 'players/development',
      icon: 'mdi-trending-up',
      title: 'Development'
    },
    {
      to: 'players/statistics',
      icon: 'mdi-google-analytics',
      title: 'Statistics'
    }
  ]
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
    </v-list>

    <v-row dense class="align-stretch pa-2">
      <v-col cols="12">
        <date-field
          :model-value="team.currentlyOn"
          label="Current Date"
          density="compact"
          hide-details
          @update:model-value="onDateChange"
        />
      </v-col>
      <v-col
        v-for="item in items"
        :key="item.title"
        :cols="item.cols || 6"
        class="d-flex"
      >
        <v-card
          :to="`/teams/${team.id}/${item.to}`"
          density="compact"
          flat
          class="text-center w-100"
        >
          <v-card-text class="pa-3">
            <v-icon>{{ item.icon }}</v-icon>
            <div class="text-caption mt-1">{{ item.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>
