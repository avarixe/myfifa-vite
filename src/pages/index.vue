<script setup lang="ts">
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

  function badgeUrl(team) {
    return team.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${team.badgePath}`
      : null
  }
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-card v-if="currentTeam">
          <div class="d-sm-flex flex-no-wrap text-center">
            <v-avatar class="ma-3" size="250" rounded="0">
              <v-img
                v-if="currentTeam.badgePath"
                :src="badgeUrl(currentTeam)"
              />
              <v-icon v-else size="100">
                mdi-shield-off-outline
                <v-tooltip location="bottom" activator="parent">
                  Edit Team to upload Badge
                </v-tooltip>
              </v-icon>
            </v-avatar>
            <div class="w-100">
              <v-card-title class="d-flex align-center">
                <div class="text-h5">{{ currentTeam.name }}</div>
                <v-spacer />
                <v-hover v-slot="{ isHovering, props }">
                  <v-btn
                    :to="`/teams/${currentTeam.id}`"
                    variant="text"
                    class="my-2"
                    v-bind="props"
                  >
                    <v-icon :start="isHovering">mdi-arrow-right</v-icon>
                    <span v-show="isHovering">Go To Team</span>
                  </v-btn>
                </v-hover>
              </v-card-title>
              <v-divider class="mx-4" />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" lg="6" class="text-left">
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
                  </v-col>
                  <v-col
                    v-if="lastMatch"
                    cols="12"
                    lg="6"
                    class="d-flex align-top"
                  >
                    <div class="text-grey" :style="{ minWidth: '6em' }">
                      Last Match:
                    </div>
                    <div
                      class="d-inline-block text-center px-4"
                      :style="{ width: '100%' }"
                    >
                      <b>{{ lastMatch.home }} v {{ lastMatch.away }}</b>
                      <div>{{ lastMatch.competition }}</div>
                      <div>
                        <i>{{ formatDate(lastMatch.playedOn) }}</i>
                      </div>
                      <v-hover v-slot="{ isHovering, props }">
                        <v-btn
                          :to="`/teams/${currentTeam.id}/matches/${lastMatch.id}`"
                          variant="outlined"
                          color="info"
                          class="my-2"
                          v-bind="props"
                        >
                          <v-icon :start="isHovering">mdi-play</v-icon>
                          <span v-show="isHovering">Go To Match</span>
                        </v-btn>
                      </v-hover>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-space-around">
                <v-hover
                  v-for="(link, i) in teamLinks"
                  :key="i"
                  v-slot="{ isHovering, props }"
                >
                  <v-btn :to="link.to" variant="text" v-bind="props">
                    <v-icon :start="isHovering">{{ link.icon }}</v-icon>
                    <span v-show="isHovering">{{ link.text }}</span>
                  </v-btn>
                </v-hover>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col
        v-for="(team, i) in latestTeams"
        v-show="i !== teamIndex"
        :key="i"
        cols="3"
        sm="3"
      >
        <v-card class="text-center" @click="teamIndex = i">
          <v-avatar class="ma-3" rounded="0">
            <v-img v-if="team.badgePath" :src="badgeUrl(team)" />
            <div v-else>{{ team.name }}</div>
          </v-avatar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-btn to="/teams">
          <v-icon start>mdi-shield-search</v-icon>
          View All Teams
        </v-btn>
        &nbsp;
        <v-btn to="/teams/new">
          <v-icon start>mdi-plus</v-icon>
          Create New Team
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
