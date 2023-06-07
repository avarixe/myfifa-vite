<script setup lang="ts">
  import { Team } from '~/models'

  // load all Teams for previous Team dropdown
  const teamRepo = useRepo(Team)
  usePageQuery({
    query: gql`
      query fetchTeams {
        teams {
          ...TeamData
        }
      }
      ${teamFragment}
    `,
    onQuery(data) {
      teamRepo.save(data.teams)
    }
  })
</script>

<template>
  <div class="text-h4 mb-2">New Team</div>

  <team-form />
</template>
