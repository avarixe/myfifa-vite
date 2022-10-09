<script setup>
  import { Match } from '~/models'

  const props = defineProps({
    teamId: { type: String, required: true },
    matchId: { type: String, required: true }
  })

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
    variables: {
      teamId: props.teamId,
      matchId: props.matchId
    }
  })
  const matchRepo = useRepo(Match)
  matchRepo.save(data.value?.match)
  const match = computed(() =>
    matchRepo
      .withAll()
      .with('caps', query => query.with('player'))
      .find(parseInt(props.matchId))
  )

  const router = useRouter()
</script>

<template>
  <h1>{{ match.home }} v {{ match.away }}</h1>

  <div>
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

  <section id="timeline">
    <div class="text-h4 my-3 text-primary font-weight-light">
      <v-icon start large>mdi-timeline</v-icon>
      Timeline
    </div>

    <v-btn>
      + Goal
      <goal-form :match="match" />
    </v-btn>
    <v-btn>
      + Booking
      <booking-form :match="match" />
    </v-btn>
    <v-btn>
      + Substitution
      <substitution-form :match="match" />
    </v-btn>
    <v-btn v-if="!match.penaltyShootout">
      + Penalty Shootout
      <penalty-shootout-form :match="match" />
    </v-btn>

    <match-timeline :match="match" />
  </section>

  <cap-grid
    :match="match"
    class="mt-4"
  />
</template>
