<script setup lang="ts">
  defineProps<{ teamId: string }>()

  const { team } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })
</script>

<template>
  <div class="text-h4 mb-2">Edit Team</div>

  <team-form :record="team" />
</template>
