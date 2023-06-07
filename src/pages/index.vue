<script setup lang="ts">
  import { differenceInYears } from 'date-fns'
  import { Team } from '~/models'

  const teamRepo = useRepo(Team)
  const topTeam = ref(null)
  const { ready } = usePageQuery({
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
    `,
    onQuery(data) {
      teamRepo.save(data.teams)
      topTeam.value = data.teams[0]
    }
  })

  const teams = computed(() => teamRepo.orderBy('createdAt', 'desc').get())
  const teamsById = computed(() => _keyBy(teams.value, 'id'))
  const teamFiles = computed(() =>
    teams.value.reduce((files, team) => {
      if (team.previousId) {
        const file = files.find(f => f.includes(team.previousId))
        if (file) {
          file.push(team.id)
        } else {
          files.push([team.previousId, team.id])
        }
      } else {
        if (!files.some(file => file.includes(team.id))) {
          files.push([team.id])
        }
      }
      return files
    }, [])
  )

  const lastMatch = computed(() => topTeam.value?.lastMatch)
  const currentSeason = computed(() =>
    differenceInYears(
      parseISO(topTeam.value?.currentlyOn),
      parseISO(topTeam.value?.startedOn)
    )
  )

  function teamLinks(team) {
    return [
      {
        to: `/teams/${team.id}/seasons/${currentSeason.value}`,
        icon: 'mdi-calendar',
        text: 'Current Season'
      },
      {
        to: `/teams/${team.id}/players`,
        icon: 'mdi-run',
        text: 'Players'
      },
      {
        to: `/teams/${team.id}/matches`,
        icon: 'mdi-soccer-field',
        text: 'Matches'
      },
      {
        to: `/teams/${team.id}/squads`,
        icon: 'mdi-clipboard-text',
        text: 'Squads'
      }
    ]
  }

  function badgeUrl(team) {
    return team.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${team.badgePath}`
      : null
  }
</script>

<template>
  <v-container>
    <v-row v-if="ready">
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
      <v-col cols="12">
        <v-card v-if="topTeam" class="rounded-xl">
          <div class="d-sm-flex flex-no-wrap align-center text-center">
            <v-avatar class="ma-3" size="250" rounded="0">
              <v-img
                v-if="topTeam.badgePath"
                :src="badgeUrl(topTeam)"
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
                <div class="text-h5">{{ topTeam.name }}</div>
                <v-spacer />
                <v-hover v-slot="{ isHovering, props }">
                  <v-btn
                    :to="`/teams/${topTeam.id}`"
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
                    <div v-show="topTeam.game">
                      <span class="text-grey">Game: </span>
                      <b>{{ topTeam.game }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Manager Name: </span>
                      <b>{{ topTeam.managerName }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Started Date: </span>
                      <b>{{ formatDate(topTeam.startedOn) }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Current Date: </span>
                      <b>{{ formatDate(topTeam.currentlyOn) }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Currency: </span>
                      <b>{{ topTeam.currency }}</b>
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
                    <div class="d-inline-block text-center px-4 w-100">
                      <b>{{ lastMatch.home }} v {{ lastMatch.away }}</b>
                      <div>{{ lastMatch.competition }}</div>
                      <div>
                        <i>{{ formatDate(lastMatch.playedOn) }}</i>
                      </div>
                      <v-hover v-slot="{ isHovering, props }">
                        <v-btn
                          :to="`/teams/${topTeam.id}/matches/${lastMatch.id}`"
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
                  v-for="(link, i) in teamLinks(topTeam)"
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
      <v-col v-for="(teamIds, i) in teamFiles" :key="i" cols="12">
        <div class="font-weight-bold">
          {{ teamsById[teamIds[0]].managerName }}
        </div>
        <small>
          <template v-if="teamsById[teamIds[0]].game">
            {{ teamsById[teamIds[0]].game }} ·
          </template>
          {{ formatDate(teamsById[teamIds[0]].createdAt) }}
        </small>
        <v-divider class="mb-2" />
        <v-slide-group show-arrows>
          <v-slide-group-item
            v-for="team in teamIds.map(id => teamsById[id])"
            :key="team.id"
          >
            <v-card width="350" class="mr-4 rounded-xl">
              <div class="d-flex flex-no-wrap align-center">
                <v-avatar class="ma-3" size="75" rounded="0">
                  <v-img v-if="team.badgePath" :src="badgeUrl(team)" />
                  <v-icon v-else>mdi-shield-off-outline</v-icon>
                </v-avatar>
                <div>
                  <v-card-title>
                    <v-btn
                      :to="`/teams/${team.id}`"
                      :text="team.name"
                      variant="text"
                      color="primary"
                      class="text-capitalize"
                    />
                  </v-card-title>
                  <v-card-text class="pl-8">
                    {{ formatDate(team.startedOn, 'yyyy') }} -
                    {{ formatDate(team.currentlyOn, 'yyyy') }}
                  </v-card-text>
                  <v-card-actions class="justify-space-around">
                    <v-btn
                      v-for="(link, j) in teamLinks(team)"
                      :key="j"
                      :to="link.to"
                      size="small"
                    >
                      <v-icon>
                        {{ link.icon }}
                        <v-tooltip location="bottom" activator="parent">
                          {{ link.text }}
                        </v-tooltip>
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </div>
              </div>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </v-container>
</template>
