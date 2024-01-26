<script setup lang="ts">
  const { team, currentSeason } = useTeam()
</script>

<template>
  <v-bottom-navigation grow>
    <v-btn :to="`/teams/${team.id}/players`">
      <span>Players</span>
      <v-icon>mdi-run</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}/seasons/${currentSeason}`">
      <span>Season</span>
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}`" exact class="elevation-20">
      <span :class="{ 'pt-1': !!team.badgePath }">{{ team.name }}</span>
      <v-avatar v-if="team.badgePath" class="py-1">
        <v-img :src="team.badgeUrl" />
      </v-avatar>
      <v-icon v-else>mdi-shield-half-full</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}/matches`">
      <span>Matches</span>
      <v-icon>mdi-soccer-field</v-icon>
    </v-btn>
    <v-btn>
      <span>Create</span>
      <v-icon>mdi-plus</v-icon>

      <v-menu activator="parent">
        <v-list>
          <v-list-item
            :to="`/teams/${team.id}/players/new`"
            title="New Player"
            prepend-icon="mdi-account"
          />
          <v-list-item
            :to="`/teams/${team.id}/matches/new`"
            title="New Match"
            prepend-icon="mdi-soccer"
          />
          <v-list-item
            :to="`/teams/${team.id}/competitions/new`"
            title="New Competition"
            prepend-icon="mdi-tournament"
          />
        </v-list>
      </v-menu>
    </v-btn>
  </v-bottom-navigation>
</template>
