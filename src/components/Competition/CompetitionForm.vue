<script setup>
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

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: CompetitionAttributes!) {
          updateCompetition(id: $id, attributes: $attributes) {
            competition {
              ...CompetitionData
            }
          }
        }
        ${competitionFragment}
      `
    : gql`
        mutation createCompetition(
          $teamId: ID!
          $attributes: CompetitionAttributes!
        ) {
          addCompetition(teamId: $teamId, attributes: $attributes) {
            competition {
              ...CompetitionData
            }
          }
        }
        ${competitionFragment}
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
    onSuccess(data) {
      const competition = Object.values(data)[0].competition
      router.push(`/teams/${team.value.id}/competitions/${competition.id}`)
    }
  })

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

  const presetFormats = ['League', 'Knockout', 'Group + Knockout']
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-text-field
      :model-value="seasonLabel(attributes.season)"
      label="Season"
      disabled
    />
    <v-combobox
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
      v-model.number="attributes.numTeams"
      label="Number of Teams"
      type="number"
    />
    <template v-if="attributes.presetFormat === 'Group + Knockout'">
      <v-text-field
        v-model.number="attributes.numTeamsPerGroup"
        label="Teams per Group"
        type="number"
      />
      <v-text-field
        v-model.number="attributes.numAdvancesFromGroup"
        label="Teams Advance per Group"
        type="number"
      />
    </template>
    <v-btn type="submit" :loading="formIsLoading">
      {{ props.record ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>
