<script setup>
  const { team } = useTeam()
</script>

<template>
  <v-bottom-navigation v-bind="$attrs">
    <v-btn :to="`/teams/${team.id}/players`">
      <span>Players</span>
      <v-icon>mdi-run</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}/competitions`">
      <span>Competitions</span>
      <v-icon>mdi-trophy</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}/matches`">
      <span>Matches</span>
      <v-icon>mdi-soccer-field</v-icon>
    </v-btn>
    <v-btn :to="`/teams/${team.id}/squads`">
      <span>Squads</span>
      <v-icon>mdi-clipboard-text</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
