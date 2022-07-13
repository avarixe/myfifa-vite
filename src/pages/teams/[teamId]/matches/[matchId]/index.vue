<script setup>
  import { useTeamQuery } from '~/composables'
  import { formatDate } from '~/filters'
  import { Match } from '~/models'
  import {
    matchFragment,
    capFragment,
    goalFragment,
    substitutionFragment,
    bookingFragment,
    penaltyShootoutFragment,
    teamFragment,
    playerFragment,
    baseSquadFragment
  } from '~/fragments'

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
    matchRepo.withAll().find(parseInt(props.matchId))
  )

  const router = useRouter()
</script>

<template>
  <div>
    <router-link :to="`/teams/${team.id}/matches`">Back</router-link>
    &nbsp;
    <router-link :to="`/teams/${team.id}/matches/${match.id}/edit`">Edit</router-link>
    &nbsp;
    <remove-button
      :record="match"
      store="Match"
      label="Match"
      @removed="router.push(`/teams/${team.id}/matches`)"
    />
  </div>

  <h1>{{ match.home }} v {{ match.away }}</h1>

  <div><b>Competition:</b> {{ match.competition }}</div>
  <div><b>Stage:</b> {{ match.stage }}</div>
  <div><b>Score:</b> {{ match.score }}</div>
  <div><b>Date Played:</b> {{ formatDate(match.playedOn) }}</div>

  <h3><u>Caps</u></h3>
  <cap-grid :match="match" />

  <h3><u>Goals</u></h3>
  <p>Coming Soon!</p>
  <!-- <transfer-grid :player="player" /> -->

  <h3><u>Bookings</u></h3>
  <p>Coming Soon!</p>
  <!-- <loan-grid :player="player" /> -->

  <h3><u>Substitutions</u></h3>
  <p>Coming Soon!</p>
  <!-- <injury-grid :player="player" /> -->
</template>
