<script setup>
  import { formatDate } from '~/filters'
  import { useNavigationStore } from '~/store/navigation'
  import { teamFragment } from '~/fragments'

  const navigationStore = useNavigationStore()
  onMounted(() => {
    navigationStore.$reset()
  })

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

  const teams = computed(() => data.value.teams)
  const latestTeams = computed(() => teams.value.slice(0, 5))
  const teamIndex = ref(0)

  const currentTeam = computed(() => latestTeams.value[teamIndex.value])
  const lastMatch = computed(() => currentTeam.value?.lastMatch)

  function badgeUrl (team) {
    return team.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${team.badgePath}`
      : null
  }

  function setTeamIndex (i) {
    setTimeout(() => { teamIndex.value = i }, 200)
  }
</script>

<template>
  <div class="row items-center justify-center full-width">
    <div class="row q-pa-lg q-col-gutter-md">
      <div
        v-if="currentTeam"
        class="col-12"
      >
        <q-card>
          <q-card-section horizontal>
            <div class="col-3 q-pa-md">
              <q-img
                :src="badgeUrl(currentTeam)"
                height="250px"
                fit="contain"
              />
            </div>
            <div class="col-9 q-pa-md">
              <q-card flat>
                <q-card-section class="text-h4">
                  {{ currentTeam.name }}
                  <q-btn
                    :to="`/teams/${currentTeam.id}`"
                    flat
                    icon="mdi-arrow-right"
                    class="float-right"
                  />
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="col-12 col-md-6">
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
                    <div class="col-12 col-md-6">
                      <div class="row">
                        <div class="text-grey">Last Match:</div>
                        <div class="col text-center">
                          <b>{{ lastMatch.home }} v {{ lastMatch.away }}</b>
                          <div>{{ lastMatch.competition }}</div>
                          <div><i>{{ formatDate(lastMatch.playedOn) }}</i></div>
                          <q-btn
                            :to="`/teams/${currentTeam.id}/matches/${lastMatch.id}`"
                            label="Go to Match"
                            icon="mdi-play"
                            outline
                            color="primary"
                            class="q-mt-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions align="around">
                  <q-btn
                    :to="`/teams/${currentTeam.id}/competitions`"
                    flat
                    label="Competitions"
                    icon="mdi-trophy"
                  />
                  <q-btn
                    :to="`/teams/${currentTeam.id}/players`"
                    flat
                    label="Players"
                    icon="mdi-run"
                  />
                  <q-btn
                    :to="`/teams/${currentTeam.id}/matches`"
                    flat
                    label="Matches"
                    icon="mdi-soccer-field"
                  />
                  <q-btn
                    :to="`/teams/${currentTeam.id}/squads`"
                    flat
                    label="Squads"
                    icon="mdi-clipboard-text"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div
        v-for="(team, i) in latestTeams"
        v-show="i !== teamIndex"
        :key="i"
        class="col-6 col-sm-3"
      >
        <q-card
          v-ripple.early
          class="cursor-pointer"
          @click="setTeamIndex(i)"
        >
          <q-card-section>
            <q-img
              :src="badgeUrl(team)"
              height="48px"
              fit="contain"
            />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <q-btn
          label="+ Team"
        />
        <q-btn
          to="/teams"
          label="View All Teams"
          class="q-ml-md"
        />
      </div>
    </div>
  </div>
</template>
