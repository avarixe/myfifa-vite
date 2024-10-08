<script setup lang="ts">
  import { Competition, Match, Stage } from '~/models'

  const { team, seasonOn } = useTeam()

  const props = defineProps<{
    teamId?: number
    record?: Match
  }>()

  const attributes = reactive({
    playedOn: props.record?.playedOn || team.value.currentlyOn,
    competition: props.record?.competition,
    stage: props.record?.stage,
    home: props.record?.home ?? null,
    away: props.record?.away ?? null,
    extraTime: props.record?.extraTime || false
  })

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: MatchAttributes!) {
          updateMatch(id: $id, attributes: $attributes) {
            match {
              ...MatchData
            }
          }
        }
        ${matchFragment}
      `
    : gql`
        mutation createMatch($teamId: ID!, $attributes: MatchAttributes!) {
          addMatch(teamId: $teamId, attributes: $attributes) {
            match {
              ...MatchData
            }
          }
        }
        ${matchFragment}
      `
  function variables() {
    return props.record
      ? { id: props.record.id, attributes }
      : { teamId: props.teamId, attributes }
  }

  const router = useRouter()
  const { form, formIsLoading, submitForm } = useForm({
    mutation,
    variables,
    onSuccess(data: { match: { id: number } }[]) {
      const match = Object.values(data)[0].match
      router.push(`/teams/${team.value.id}/matches/${match.id}`)
    }
  })

  const competitionRepo = useRepo(Competition)
  const competitionOptions = computed(() => {
    if (attributes.playedOn) {
      const names = competitionRepo
        .where('teamId', team.value.id)
        .where('season', seasonOn(attributes.playedOn))
        .where('champion', null)
        .orderBy('name')
        .get()
        .map(comp => comp.name)
      return [...new Set(names)]
    } else {
      return []
    }
  })

  const stageRepo = useRepo(Stage)
  const stageOptions = computed(() => {
    if (attributes.competition && attributes.playedOn) {
      return stageRepo
        .where('table', false)
        .whereHas('competition', query => {
          query
            .where('name', attributes.competition)
            .where('season', seasonOn(attributes.playedOn))
            .get()
        })
        .get()
        .map(stage => stage.name)
    } else {
      return []
    }
  })

  function setTeamAs(side: 'home' | 'away') {
    const otherSide = side === 'home' ? 'away' : 'home'
    attributes[side] = team.value.name
    if (attributes[otherSide] === team.value.name) {
      attributes[otherSide] = null
    }
  }
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <date-field v-model="attributes.playedOn" label="Date Played" />
    <v-autocomplete
      v-model="attributes.competition"
      label="Competition"
      :items="competitionOptions"
    />
    <v-combobox
      v-if="!!attributes.competition"
      v-model="attributes.stage"
      label="Stage"
      :items="stageOptions"
    />
    <v-row dense>
      <v-col cols="12" sm="6">
        <team-combobox
          v-model="attributes.home"
          label="Home Team"
          :prepend-inner-icon="`mdi-shield-${
            attributes.home === team.name ? 'star' : 'outline'
          }`"
          @click:prepend-inner="setTeamAs('home')"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <team-combobox
          v-model="attributes.away"
          label="Away Team"
          :prepend-inner-icon="`mdi-shield-${
            attributes.away === team.name ? 'star' : 'outline'
          }`"
          @click:prepend-inner="setTeamAs('away')"
        />
      </v-col>
    </v-row>
    <v-btn type="submit" :loading="formIsLoading">
      {{ props.record ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>
