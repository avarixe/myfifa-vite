<script setup>
  import { differenceInYears } from 'date-fns'

  const { data } = await useQuery({
    query: gql`
      query fetchTeams {
        teams {
          ...TeamData
          lastMatch {
            id
            home
            away
            competition
            playedOn
          }
        }
      }
      ${teamFragment}
    `
  })

  const latestTeams = data.value.teams.slice(0, 5)

  const teamIndex = ref(0)
  const currentTeam = computed(() => latestTeams[teamIndex.value])
  const lastMatch = computed(() => currentTeam.value?.lastMatch)

  const currentSeason = computed(() =>
    differenceInYears(
      parseISO(currentTeam.value.currentlyOn),
      parseISO(currentTeam.value.startedOn)
    )
  )

  const teamLinks = computed(() => [
    {
      to: `/teams/${currentTeam.value.id}/seasons/${currentSeason.value}`,
      icon: 'mdi-calendar',
      text: 'Current Season'
    },
    {
      to: `/teams/${currentTeam.value.id}/players`,
      icon: 'mdi-run',
      text: 'Players'
    },
    {
      to: `/teams/${currentTeam.value.id}/matches`,
      icon: 'mdi-soccer-field',
      text: 'Matches'
    },
    {
      to: `/teams/${currentTeam.value.id}/squads`,
      icon: 'mdi-clipboard-text',
      text: 'Squads'
    }
  ])

  function badgeUrl (team) {
    return team.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${team.badgePath}`
      : null
  }
</script>

<template>
    <div class="row items-center justify-center">
      <div class="col col-12 pa-4">
        <q-card v-if="currentTeam">
          <div class="sm:flex text-center">
            <q-avatar
              class="ma-3"
              size="250px"
              square
            >
              <q-img
                v-if="currentTeam.badgePath"
                :src="badgeUrl(currentTeam)"
                fit="contain"
              />
              <q-icon v-else size="100" name="mdi-shield-off-outline">
                <q-tooltip>
                  Edit Team to upload Badge
                </q-tooltip>
              </q-icon>
            </q-avatar>
            <div class="w-full">
              <q-card-section class="flex align-center">
                <div class="text-h5">{{ currentTeam.name }}</div>
                <q-space />
                <q-btn
                  :to="`/teams/${currentTeam.id}`"
                  flat
                  icon="mdi-arrow-right"
                  class="my-2"
                />
              </q-card-section>
              <q-separator class="mx-4" />
              <q-card-section>
                <div class="row">
                  <div class="col col-12 col-lg-6 text-left">
                    <div>
                      <span class="text-grey">Started Date: </span>
                      <b>{{ formatDate(currentTeam.startedOn) }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Current Date: </span>
                      <b>{{ formatDate(currentTeam.currentlyOn) }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Currency: </span>
                      <b>{{ currentTeam.currency }}</b>
                    </div>
                  </div>
                  <div
                    v-if="lastMatch"
                    class="col col-12 col-lg-6 flex align-top"
                  >
                    <div
                      class="text-grey"
                      :style="{ minWidth: '6em' }"
                    >
                      Last Match:
                    </div>
                    <div
                      class="d-inline-block text-center px-4"
                      :style="{ width: '100%' }"
                    >
                      <b>{{ lastMatch.home }} v {{ lastMatch.away }}</b>
                      <div>{{ lastMatch.competition }}</div>
                      <div><i>{{ formatDate(lastMatch.playedOn) }}</i></div>
                      <q-btn
                        :to="`/teams/${currentTeam.id}/matches/${lastMatch.id}`"
                        outline
                        color="info"
                        icon="mdi-play"
                        class="my-2"
                      />
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions class="flex justify-around">
                <q-btn
                  v-for="(link, i) in teamLinks"
                  :key="i"
                  :to="link.to"
                  flat
                  :icon="link.icon"
                />
              </q-card-actions>
            </div>
          </div>
        </q-card>
      </div>
      <div
        v-for="(team, i) in latestTeams"
        v-show="i !== teamIndex"
        :key="i"
        class="col col-3 pa-4"
      >
        <q-card
          class="text-center cursor-pointer hover:bg-gray-100"
          @click="teamIndex = i"
        >
          <q-avatar class="ma-3" square>
            <q-img
              v-if="team.badgePath"
              :src="badgeUrl(team)"
              fit="contain"
            />
            <div v-else>{{ team.name }}</div>
          </q-avatar>
        </q-card>
      </div>
      <div class="col col-12 pa-4">
        <q-btn to="/teams">
          <v-icon name="mdi-shield-search" />
          View All Teams
        </q-btn>
        &nbsp;
        <q-btn to="/teams/new">
          <q-icon name="mdi-plus" />
          Create New Team
        </q-btn>
      </div>
    </div>
</template>
