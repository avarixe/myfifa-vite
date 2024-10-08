<script setup lang="ts">
  import { differenceInYears } from 'date-fns'

  import { Team } from '~/models'

  useHead({
    title: __APP_TITLE__
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

  const teamRepo = useRepo(Team)
  teamRepo.save(data.value.teams)

  interface TeamData {
    id: number
    previousId: number
    badgePath: string | null
    lastMatch: {
      id: string
      home: string
      away: string
      competition: string
      playedOn: string
    }
  }

  const lastMatchByTeam = data.value.teams.reduce(
    (dict: Record<number, object>, team: TeamData) => {
      dict[team.id] = team.lastMatch
      return dict
    },
    {}
  )

  const teamId = ref(data.value.teams[0]?.id)
  const lastMatch = computed(() => lastMatchByTeam[teamId.value])

  const teams = computed(() => teamRepo.orderBy('createdAt', 'desc').get())
  const teamsById = computed(() => _keyBy(teams.value, 'id'))
  const currentTeam = computed(() => teamsById.value[teamId.value])
  const teamFiles = computed(() =>
    teams.value.reduce((files: number[][], team) => {
      if (team.previousId) {
        const file = files.find(f => f.includes(Number(team.previousId)))
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

  const currentSeason = computed(() =>
    differenceInYears(
      parseISO(currentTeam.value.currentlyOn),
      parseISO(currentTeam.value.startedOn)
    )
  )

  function teamLinks(team: TeamData | Team) {
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
        to: `/teams/${team.id}/players/squads`,
        icon: 'mdi-clipboard-text',
        text: 'Squads'
      }
    ]
  }

  function badgeUrl(team: TeamData | Team) {
    return team.badgePath
      ? `${import.meta.env.VITE_API_URL.replace(/\/api/, '')}${team.badgePath}`
      : undefined
  }
</script>

<template>
  <v-container>
    <v-row>
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
        <v-card v-if="currentTeam" class="rounded-xl">
          <div class="d-sm-flex flex-no-wrap align-center text-center">
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
                    <v-icon :start="isHovering ?? undefined"
                      >mdi-arrow-right</v-icon
                    >
                    <span v-show="isHovering">Go To Team</span>
                  </v-btn>
                </v-hover>
              </v-card-title>
              <v-divider class="mx-4" />
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" lg="6" class="text-left">
                    <div v-show="currentTeam.game">
                      <span class="text-grey">Game: </span>
                      <b>{{ currentTeam.game }}</b>
                    </div>
                    <div>
                      <span class="text-grey">Manager Name: </span>
                      <b>{{ currentTeam.managerName }}</b>
                    </div>
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
                    <div class="d-inline-block text-center px-4 w-100">
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
                          <v-icon :start="isHovering ?? undefined"
                            >mdi-play</v-icon
                          >
                          <span v-show="isHovering">Go To Match</span>
                        </v-btn>
                      </v-hover>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="justify-space-around">
                <v-hover
                  v-for="(link, i) in teamLinks(currentTeam)"
                  :key="i"
                  v-slot="{ isHovering, props }"
                >
                  <v-btn :to="link.to" variant="text" v-bind="props">
                    <v-icon :start="isHovering ?? undefined">{{
                      link.icon
                    }}</v-icon>
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
