<script setup>
  import { Competition } from '~/models'

  const { team, currentSeason, seasonLabel } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    season: props.record ? props.record.season : currentSeason.value,
    name: props.record?.name,
    champion: props.record?.champion,
    presetFormat: null,
    numTeams: null,
    numTeamsPerGroup: null,
    numAdvancesFromGroup: null
  })

  const { executeMutation: createCompetition } = useMutation(gql`
    mutation createCompetition($teamId: ID!, $attributes: CompetitionAttributes!) {
      addCompetition(teamId: $teamId, attributes: $attributes) {
        competition { ...CompetitionData }
        errors { fullMessages }
      }
    }
    ${competitionFragment}
  `)

  const { executeMutation: updateCompetition } = useMutation(gql`
    mutation ($id: ID!, $attributes: CompetitionAttributes!) {
      updateCompetition(id: $id, attributes: $attributes) {
        competition { ...CompetitionData }
        errors { fullMessages }
      }
    }
    ${competitionFragment}
  `)

  const loading = ref(false)
  const router = useRouter()
  async function onSubmit () {
    loading.value = true
    if (props.record) {
      const { data: { updateCompetition: { errors, competition} } } =
        await updateCompetition({ id: props.record.id, attributes })
      if (competition) {
        router.push(`/teams/${team.value.id}/competitiones/${competition.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addCompetition: { errors, competition } } } =
        await createCompetition({ teamId: props.teamId, attributes })
      if (competition) {
        router.push(`/teams/${team.value.id}/competitiones/${competition.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    }
    loading.value = false
  }

  const competitionRepo = useRepo(Competition)
  const competitionOptions = computed(() => {
    const names = competitionRepo
      .where('teamId', team.value.id)
      .orderBy('name')
      .get()
      .map(comp => comp.name)
    return [...new Set(names)]
  })

  const { championOptions } = useCompetition(props.record?.id)

  const presetFormats = [
    'League',
    'Knockout',
    'Group + Knockout'
  ]
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      :model-value="seasonLabel(attributes.season)"
      label="Season"
      disabled
    />
    <v-autocomplete
      v-model="attributes.name"
      label="Name"
      :items="competitionOptions"
    />
    <v-autocomplete
      v-if="record"
      v-model="attributes.champion"
      label="Champion"
      :items="championOptions"
    />
    <v-select
      v-else
      v-model="attributes.presetFormat"
      label="Preset Format"
      :items="presetFormats"
    />
    <v-text-field
      v-if="attributes.presetFormat"
      v-model="attributes.numTeams"
      label="Number of Teams"
      type="number"
    />
    <template v-if="attributes.presetFormat === 'Group + Knockout'">
      <v-text-field
        v-model="attributes.numTeamsPerGroup"
        label="Teams per Group"
        type="number"
      />
      <v-text-field
        v-model="attributes.numAdvancesFromGroup"
        label="Teams Advance per Group"
        type="number"
      />
    </template>
    <v-btn
      type="submit"
      :loading="loading"
      v-text="props.record ? 'Update' : 'Create'"
    />
  </v-form>
</template>
