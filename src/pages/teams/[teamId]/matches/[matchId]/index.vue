<script setup>
  import { Match } from '~/models'

  const route = useRoute()
  const teamId = computed(() => parseInt(route.params.teamId))
  const matchId = computed(() => parseInt(route.params.matchId))

  const { data, team } = await useTeamQuery({
    query: gql`
      query fetchMatchPage($matchId: ID!, $teamId: ID!) {
        match(id: $matchId) {
          ...MatchData
          caps { ...CapData }
          goals { ...GoalData }
          substitutions { ...SubstitutionData }
          bookings { ...BookingData }
          penaltyShootout { ...PenaltyShootoutData }
          previousMatch { id }
          nextMatch { id }
        }
        team(id: $teamId) {
          ...TeamData
          players { ...PlayerData }
          squads { ...BaseSquadData }
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
  watchEffect(() => {
    matchRepo.save(data.value.match)
  })

  const match = computed(() =>
    matchRepo
      .withAll()
      .with('caps', query => query.with('player'))
      .find(parseInt(matchId.value))
  )

  const nextMatch = computed(() => data.value.match.nextMatch)
  const previousMatch = computed(() => data.value.match.previousMatch)

  const { mobile } = useDisplay()
  const showFormation = ref(!mobile.value)
  watchEffect(() => {
    showFormation.value = !mobile.value
  })

  const router = useRouter()
</script>

<template>
  <h1>{{ match.home }} v {{ match.away }}</h1>

  <div>
    <v-btn
      :to="`/teams/${team.id}/matches/${previousMatch?.id}`"
      :disabled="!previousMatch"
      v-text="'Previous'"
    />
    &nbsp;
    <v-btn
      :to="`/teams/${team.id}/matches/${nextMatch?.id}`"
      :disabled="!nextMatch"
      v-text="'Next'"
    />
    &nbsp;
    <v-btn :to="`/teams/${team.id}/matches/${match.id}/edit`">Edit</v-btn>
    &nbsp;
    <remove-button
      :record="match"
      store="Match"
      label="Match"
      @removed="router.push(`/teams/${team.id}/matches`)"
    />
  </div>

  <div class="mt-2">
    <div><b>Competition:</b> {{ match.competition }}</div>
    <div><b>Stage:</b> {{ match.stage }}</div>
    <div><b>Score:</b> {{ match.score }}</div>
    <div><b>Date Played:</b> {{ formatDate(match.playedOn) }}</div>
  </div>

  <section id="lineup" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start large>mdi-account-multiple</v-icon>
      Lineup
    </div>

    <v-btn-toggle
      v-model="showFormation"
      variant="outlined"
      color="primary"
    >
      <v-btn icon="mdi-vector-polygon-variant" :value="true" />
      <v-btn icon="mdi-format-list-bulleted" :value="false" />
    </v-btn-toggle>

    <div class="my-2">
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

    <match-formation v-if="showFormation" :match="match" />
    <match-lineup v-else :match="match" />
  </section>

  <section id="timeline" class="mt-4">
    <div class="text-h4 mb-2 text-primary font-weight-light">
      <v-icon start large>mdi-timeline</v-icon>
      Timeline
    </div>

    <match-timeline :match="match" />
  </section>
</template>
