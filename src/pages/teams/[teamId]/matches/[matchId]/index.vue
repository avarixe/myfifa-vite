<script setup lang="ts">
  import { Match } from '~/models'

  defineProps<{ teamId: string; matchId: string }>()

  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId.toString()))

  const matchId = ref(parseInt(route.params.matchId.toString()))
  watch(route, () => {
    if (route.params.matchId) {
      matchId.value = parseInt(route.params.matchId.toString())
    }
  })

  const { data, team } = await useTeamQuery({
    query: gql`
      query fetchMatchPage($matchId: ID!, $teamId: ID!) {
        match(id: $matchId) {
          ...MatchData
          caps {
            ...CapData
          }
          goals {
            ...GoalData
          }
          substitutions {
            ...SubstitutionData
          }
          bookings {
            ...BookingData
          }
          penaltyShootout {
            ...PenaltyShootoutData
          }
          previousMatch {
            id
          }
          nextMatch {
            id
          }
        }
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
          }
          squads {
            ...BaseSquadData
          }
        }
      }
      ${matchFragment}
      ${capFragment}
      ${goalFragment}
      ${substitutionFragment}
      ${bookingFragment}
      ${penaltyShootoutFragment}
      ${teamFragment}
      ${playerFragment}
      ${baseSquadFragment}
    `,
    variables: { teamId, matchId }
  })

  const matchRepo = useRepo(Match)
  const match: Ref<Match> = computed(() =>
    matchRepo
      .withAll()
      .with('caps', query => query.with('player'))
      .find(matchId.value)
  )
  const readonly = ref(false)

  watch(
    data,
    () => {
      if (data.value) {
        matchRepo.save(data.value.match)
      }
      readonly.value = match.value.playedOn < team.value?.currentlyOn
    },
    { immediate: true }
  )

  const nextMatch = computed(() => data.value?.match?.nextMatch)
  const previousMatch = computed(() => data.value?.match?.previousMatch)

  const { mobile } = useDisplay()
  const showFormation = ref(!mobile.value)
  watchEffect(() => {
    showFormation.value = !mobile.value
  })

  const ovrData = computed(() =>
    match.value.caps.map(cap => ({
      type: matchPositions[cap.pos],
      value: cap.ovr,
      weight: cap.stop - cap.start
    }))
  )

  const router = useRouter()
</script>

<template>
  <div class="text-caption">{{ formatDate(match.playedOn) }}</div>
  <div class="text-h6 font-weight-bold">
    {{ match.competition }} {{ match.stage }}
  </div>
  <div class="text-h4">{{ match.home }} v {{ match.away }}</div>

  <div class="my-2">
    <div>
      <v-switch
        v-model="readonly"
        label="Readonly Mode"
        color="primary"
        hide-details
        class="d-inline-block"
      />
    </div>
    <v-btn
      :to="`/teams/${team?.id}/matches/${previousMatch?.id}`"
      text="Previous"
      :disabled="!previousMatch"
    />
    &nbsp;
    <v-btn v-if="nextMatch" :to="`/teams/${team?.id}/matches/${nextMatch?.id}`">
      Next
    </v-btn>
    <v-btn v-else :to="`/teams/${team?.id}/matches/new`">New</v-btn>
    &nbsp;
    <template v-if="!readonly">
      <v-btn :to="`/teams/${team?.id}/matches/${match.id}/edit`">Edit</v-btn>
      &nbsp;
      <remove-button
        :record="match"
        store="Match"
        label="Match"
        @removed="router.push(`/teams/${team?.id}/matches`)"
      />
    </template>
  </div>

  <div class="mt-4 text-center">
    <v-row dense justify="space-between" align="center">
      <v-col cols="6">
        <div class="font-weight-light text-h6 text-sm-h4">{{ match.home }}</div>
        <div :class="`font-weight-bold text-h4 text-${match.resultColor}`">
          {{ match.homeScore }}
          <span v-if="match.penaltyShootout">
            ({{ match.penaltyShootout.homeScore }})
          </span>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="font-weight-light text-h6 text-sm-h4">{{ match.away }}</div>
        <div :class="`font-weight-bold text-h4 text-${match.resultColor}`">
          {{ match.awayScore }}
          <span v-if="match.penaltyShootout">
            ({{ match.penaltyShootout.awayScore }})
          </span>
        </div>
      </v-col>
      <v-col
        v-if="match.extraTime"
        cols="12"
        :class="`text-center text-${match.resultColor}`"
      >
        AET
      </v-col>
    </v-row>
  </div>

  <section id="lineup" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start>mdi-account-multiple</v-icon>
      Lineup
    </div>

    <v-btn-toggle v-model="showFormation" variant="outlined" color="primary">
      <v-btn icon="mdi-vector-polygon-variant" :value="true" />
      <v-btn icon="mdi-format-list-bulleted" :value="false" />
    </v-btn-toggle>

    <div v-if="!readonly" class="my-2">
      <template v-if="match.caps.length < 11">
        <v-btn>
          <v-icon start>mdi-account-plus</v-icon>
          Add Cap

          <cap-form :match="match" />
        </v-btn>
        &nbsp;
      </template>
      <v-btn>
        <v-icon start>mdi-download</v-icon>
        Apply Squad

        <match-squad-applier :match="match" />
      </v-btn>
      &nbsp;
      <v-btn>
        <v-icon start>mdi-upload</v-icon>
        Save Lineup

        <match-squad-saver :match="match" />
      </v-btn>
    </div>

    <formation-ovr :data="ovrData" />
    <match-formation v-if="showFormation" :match="match" :readonly="readonly" />
    <match-lineup v-else :match="match" :readonly="readonly" />
  </section>

  <section id="timeline" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start>mdi-timeline</v-icon>
      Timeline
    </div>

    <match-timeline :match="match" :readonly="readonly" />
  </section>
</template>
