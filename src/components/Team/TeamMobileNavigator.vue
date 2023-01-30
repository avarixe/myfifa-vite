<script setup>
  const { team, currentSeason } = useTeam()
</script>

<template>
  <q-footer elevated>
    <q-toolbar>
      <q-tabs dense align="justify" mobile-arrows outside-arrows class="w-full">
        <q-route-tab
          :to="`/teams/${team.id}/players`"
          label="Players"
          icon="mdi-run"
          class="text-capitalize"
        />
        <q-route-tab
          :to="`/teams/${team.id}/seasons/${currentSeason}`"
          label="Season"
          icon="mdi-calendar"
          class="text-capitalize"
        />
        <q-route-tab
          :to="`/teams/${team.id}/competitions`"
          label="Competitions"
          icon="mdi-trophy"
          class="text-capitalize"
        />
        <q-route-tab
          :to="`/teams/${team.id}/matches`"
          label="Matches"
          icon="mdi-soccer-field"
          class="text-capitalize"
        />
        <q-route-tab
          :to="`/teams/${team.id}/squads`"
          label="Squads"
          icon="mdi-clipboard-text"
          class="text-capitalize"
        />
      </q-tabs>
    </q-toolbar>
  </q-footer>
</template>
