<script setup lang="ts">
  defineProps<{ teamId: string }>()

  const { teamId } = await useTeamQuery({
    query: gql`
      query fetchTeam($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          competitions {
            ...CompetitionData
            stages {
              ...BaseStageData
            }
          }
        }
      }
      ${teamFragment}
      ${competitionFragment}
      ${baseStageFragment}
    `
  })
</script>

<template>
  <div class="text-h4 mb-2">New Match</div>

  <match-form :team-id="teamId" />
</template>
