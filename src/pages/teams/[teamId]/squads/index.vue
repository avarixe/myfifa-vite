<script setup lang="ts">
  import { Squad } from '~/models'

  defineProps<{ teamId: string }>()

  const { team, ready } = useTeamQuery({
    query: gql`
      query fetchSquadsPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          squads {
            ...SquadData
          }
          players {
            ...PlayerData
          }
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
  let index = 0
  function startNewSquad() {
    newSquads.value.push(++index)
  }
</script>

<template>
  <div class="text-h4">Squads</div>

  <v-row v-if="ready" class="mt-2">
    <v-col cols="12">
      <v-btn @click="startNewSquad">
        <v-icon start>mdi-plus</v-icon>
        Squad
      </v-btn>
    </v-col>
    <v-col
      v-for="(newSquadCount, i) in newSquads"
      :key="`new-${newSquadCount}`"
      cols="12"
    >
      <squad-card
        :team-id="team.id"
        @click:remove="newSquads.splice(i, 1)"
        @created="newSquads.splice(i, 1)"
      />
    </v-col>
    <v-col v-for="squad in squads" :key="squad.id" cols="12">
      <squad-card :record="squad" />
    </v-col>
  </v-row>
</template>
