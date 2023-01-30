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
        router.push(`/teams/${team.value.id}/competitions/${competition.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addCompetition: { errors, competition } } } =
        await createCompetition({ teamId: props.teamId, attributes })
      if (competition) {
        router.push(`/teams/${team.value.id}/competitions/${competition.id}`)
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

  const selectSettings = reactive({
    name: {
      options: competitionOptions.value,
      filter: (val, update, _abort) => {
        update(() => {
          const search = val.toLowerCase()
          selectSettings.name.options =
            competitionOptions.value.filter(v => v.toLowerCase().includes(search))
        })
      }
    },
    champion: {
      options: championOptions.value,
      filter: (val, update, _abort) => {
        update(() => {
          const search = val.toLowerCase()
          selectSettings.champion.options =
            championOptions.value.filter(v => v.toLowerCase().includes(search))
        })
      }
    }
  })

  const presetFormats = [
    'League',
    'Knockout',
    'Group + Knockout'
  ]
</script>

<template>
  <q-form @submit.prevent="onSubmit">
    <q-input
      :model-value="seasonLabel(attributes.season)"
      label="Season"
      disable
    />
    <q-select
      v-model="attributes.name"
      label="Name"
      use-input
      :options="selectSettings.name.options"
      input-debounce="100"
      @filter="selectSettings.name.filter"
    />
    <q-select
      v-if="record"
      v-model="attributes.champion"
      label="Champion"
      use-input
      :options="selectSettings.champion.options"
      input-debounce="100"
      @filter="selectSettings.champion.filter"
    />
    <q-select
      v-else
      v-model="attributes.presetFormat"
      label="Preset Format"
      :options="presetFormats"
    />
    <q-input
      v-if="attributes.presetFormat"
      v-model="attributes.numTeams"
      label="Number of Teams"
      type="number"
    />
    <template v-if="attributes.presetFormat === 'Group + Knockout'">
      <q-input
        v-model="attributes.numTeamsPerGroup"
        label="Teams per Group"
        type="number"
      />
      <q-input
        v-model="attributes.numAdvancesFromGroup"
        label="Teams Advance per Group"
        type="number"
      />
    </template>
    <q-btn
      type="submit"
      :loading="loading"
      :label="props.record ? 'Update' : 'Create'"
      class="mt-4"
    />
  </q-form>
</template>
