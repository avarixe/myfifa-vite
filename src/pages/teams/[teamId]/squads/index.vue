<script setup>
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, squadFragment } from '~/fragments'
  import { Squad } from '~/models'

  const { team, data } = await useTeamQuery({
    query: gql`
      query fetchSquadsPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          squads { ...SquadData }
          players { ...PlayerData }
        }
      }
      ${teamFragment}
      ${squadFragment}
      ${playerFragment}
    `
  })

  const squadRepo = useRepo(Squad)
  const squads = computed(() =>
    squadRepo.withAll().where('teamId', team.value.id).get()
  )

  const newSquads = ref([])
  let i = 0
  function startNewSquad () {
    newSquads.value.push(++i)
  }
</script>

<template>
  <div>
    <router-link :to="`/teams/${team.id}`">Back</router-link>
    &nbsp;
    <button @click="startNewSquad">New</button>
  </div>

  <h1>Squads</h1>

  <table>
    <thead>
      <th>Name</th>
      <th>Players</th>
    </thead>
    <tbody>
      <squad-row
        v-for="(newSquadCount, i) in newSquads"
        :key="`new-${newSquadCount}`"
        :team-id="team.id"
        @click:remove="newSquads.splice(i, 1)"
        @created="newSquads.splice(i, 1)"
      />
      <squad-row
        v-for="squad in squads"
        :key="squad.id"
        :record="squad"
      />
    </tbody>
  </table>
</template>
