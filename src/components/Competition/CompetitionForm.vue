<script setup>
  import { useTeam } from '~/composables'
  import { competitionFragment } from '~/fragments'

  const { team, currentSeason } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    season: props.record?.season || currentSeason.value,
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

  const router = useRouter()
  async function onSubmit () {
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
  }

  const presetFormats = [
    'League',
    'Knockout',
    'Group + Knockout'
  ]
</script>

<template>
  <v-text-field
    v-model="attributes.season"
    label="Season"
    type="number"
    disabled
  />
  <v-text-field
    v-model="attributes.name"
    label="Name"
  />
  <v-text-field
    v-model="attributes.champion"
    label="Champion"
  />
  <v-select
    v-if="!record"
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
    @click="onSubmit"
    v-text="props.record ? 'Update' : 'Create'"
  />
</template>
