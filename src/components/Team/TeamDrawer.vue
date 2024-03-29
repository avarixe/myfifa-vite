<script setup lang="ts">
  const { team, currentSeason } = useTeam()

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
  function onDateChange(date: string) {
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
    { to: 'players/squads', icon: 'mdi-clipboard-text', title: 'Squads' },
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

  const subtitle = computed(() =>
    team.value.game
      ? `${team.value.managerName} · ${team.value.game}`
      : team.value.managerName
  )
</script>

<template>
  <v-navigation-drawer>
    <template #image>
      <v-img
        src="/background.jpg"
        gradient="to top right, rgba(19,84,122,.7), rgba(128,208,199,.9)"
        height="100%"
      />
    </template>

    <v-list nav density="compact">
      <v-list-item
        :prepend-avatar="team.badgeUrl"
        :title="team.name"
        :subtitle="subtitle"
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
          color="rgba(0, 0, 0, 0.3)"
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
