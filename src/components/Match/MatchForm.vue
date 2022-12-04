<script setup>
  import { Competition, Stage } from '~/models'

  const { team, seasonOn } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    playedOn: props.record?.playedOn || team.value.currentlyOn,
    competition: props.record?.competition,
    stage: props.record?.stage,
    home: props.record?.home,
    away: props.record?.away,
    extraTime: props.record?.extraTime || false
  })

  const { executeMutation: createMatch } = useMutation(gql`
    mutation createMatch($teamId: ID!, $attributes: MatchAttributes!) {
      addMatch(teamId: $teamId, attributes: $attributes) {
        match { ...MatchData }
        errors { fullMessages }
      }
    }
    ${matchFragment}
  `)

  const { executeMutation: updateMatch } = useMutation(gql`
    mutation ($id: ID!, $attributes: MatchAttributes!) {
      updateMatch(id: $id, attributes: $attributes) {
        match { ...MatchData }
        errors { fullMessages }
      }
    }
    ${matchFragment}
  `)

  const loading = ref(false)
  const router = useRouter()
  async function onSubmit () {
    loading.value = true
    if (props.record) {
      const { data: { updateMatch: { errors, match} } } =
        await updateMatch({ id: props.record.id, attributes })
      if (match) {
        router.push(`/teams/${team.value.id}/matches/${match.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addMatch: { errors, match } } } =
        await createMatch({ teamId: props.teamId, attributes })
      if (match) {
        router.push(`/teams/${team.value.id}/matches/${match.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    }
    loading.value = false
  }

  const competitionRepo = useRepo(Competition)
  const competitionOptions = computed(() => {
    if (attributes.playedOn) {
      const names = competitionRepo
        .where('teamId', team.value.id)
        .where('season', seasonOn(attributes.playedOn))
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
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="attributes.playedOn"
      label="Date Played"
      type="date"
    />
    <v-combobox
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
    <team-combobox
      v-model="attributes.home"
      label="Home Team"
    />
    <team-combobox
      v-model="attributes.away"
      label="Away Team"
    />
    <v-checkbox
      v-model="attributes.extraTime"
      label="Extra Time Required"
    />
    <v-btn
      type="submit"
      :loading="loading"
      v-text="props.record ? 'Update' : 'Create'"
    />
  </v-form>
</template>
