<script setup lang="ts">
  import { Team } from '~/models'

  // load all Teams for previous Team dropdown
  const { data } = await useQuery({
    query: gql`
      query fetchTeams {
        teams {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })

  const teamRepo = useRepo(Team)
  teamRepo.save(data.value.teams)

  const { team } = useTeam()
</script>

<template>
  <div class="text-h4 mb-2">Edit Team</div>

  <team-form :record="team" />
</template>
