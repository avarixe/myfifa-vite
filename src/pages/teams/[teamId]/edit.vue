<script setup lang="ts">
  import { Team } from '~/models'

  defineProps<{ teamId: string }>()

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

  const teamRepo = useRepo(Team)
  teamRepo.save(data.value.teams)

  const { team } = useTeam()
</script>

<template>
  <div class="text-h4 mb-2">Edit Team</div>

  <team-form :record="team" />
</template>
