<script setup>
  const { team } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) { ...TeamData }
      }
      ${teamFragment}
    `
  })

  const router = useRouter()
</script>

<template>
  <h1>{{ team.name }}</h1>

  <div>
    <v-btn :to="`/teams/${team.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="team"
      store="Team"
      label="Team"
      @removed="router.push('/teams')"
    />
  </div>

  <div class="mt-2">
    <div><b>Start Date:</b> {{ formatDate(team.startedOn) }}</div>
    <div><b>Current Date:</b> {{ formatDate(team.currentlyOn) }}</div>
    <div><b>Currency:</b> {{ team.currency }}</div>
  </div>
</template>
