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
  <div>
    <label>Season:</label>
    <input
      v-model="attributes.season"
      type="number"
      disabled
    />
  </div>
  <div>
    <label>Name:</label>
    <input v-model="attributes.name" />
  </div>
  <div>
    <label>Champion</label>
    <input v-model="attributes.champion" />
  </div>
  <div v-if="!record">
    <label>Preset Format</label>
    <select v-model="attributes.presetFormat">
      <option
        v-for="format in presetFormats"
        :key="format"
      >{{ format }}</option>
    </select>
  </div>
  <div v-if="attributes.presetFormat">
    <label>Number of Teams</label>
    <input
      v-model="attributes.numTeams"
      type="number"
    />
  </div>
  <template v-if="attributes.presetFormat === 'Group + Knockout'">
    <div>
      <label>Teams per Group</label>
      <input
        v-model="attributes.numTeamsPerGroup"
        type="number"
      />
    </div>
    <div>
      <label>Teams Advance per Group</label>
      <input
        v-model="attributes.numAdvancesFromGroup"
        type="number"
      />
    </div>
  </template>
  <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
</template>
