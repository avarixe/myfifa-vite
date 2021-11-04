<script setup>
  import { computed } from 'vue'
  import { useQuery } from '@urql/vue'
  import gql from 'graphql-tag'
  import TeamGrid from '~/components/Team/TeamGrid.vue'
  import { teamFragment } from '~/fragments'

  const { data } = useQuery({
    query: gql`
      query fetchTeams {
        teams { ...TeamData }
      }
      ${teamFragment}
    `
  })

  const teams = computed(() => data.value?.teams || [])
</script>

<template>
  <team-grid :teams="teams" />
</template>
