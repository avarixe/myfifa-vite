<script setup>
  import { useNavigationStore } from '~/store/navigation'
  import { useTeamQuery } from '~/composables'
  import { teamFragment, playerFragment, squadFragment } from '~/fragments'
  import { Squad } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true }
  })

  const { team } = await useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players { ...PlayerData }
          squads { ...SquadData }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${squadFragment}
    `
  })

  const squadRepo = useRepo(Squad)
  const squads = computed(() =>
    squadRepo
      .with('squadPlayers', query => query.with('player'))
      .where('teamId', team.value.id)
      .get()
  )

  const navigationStore = useNavigationStore()
  navigationStore.setBreadcrumbs([
    { icon: 'mdi-home', to: '/' },
    { label: 'Teams', to: '/teams' },
    { label: team.value.name, to: `/teams/${props.teamId}` },
    { label: 'Squads', to: `/teams/${props.teamId}/squads` }
  ])
</script>

<template>
  <div class="row items-start q-col-gutter-md">
    <div
      v-for="squad in squads"
      :key="squad.id"
      class="col-12 col-md-6 col-lg-4"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ squad.name }}</div>
        </q-card-section>
        <q-card-section>
          <q-markup-table
            separator="none"
            flat
          >
            <tbody>
              <tr
                v-for="squadPlayer in squad.squadPlayers"
                :key="squadPlayer.id"
              >
                <td>{{ squadPlayer.pos }}</td>
                <td>{{ squadPlayer.player.name }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
