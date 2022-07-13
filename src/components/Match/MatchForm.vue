<script setup>
  import { useTeam } from '~/composables'
  import { matchFragment } from '~/fragments'

  const { team } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    playedOn: props.record?.playedOn,
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

  const router = useRouter()
  async function onSubmit () {
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
  }
</script>

<template>
  <div>
    <label>Date Played:</label>
    <input
      v-model="attributes.playedOn"
      type="date"
    />
  </div>
  <div>
    <label>Competition:</label>
    <input v-model="attributes.competition" />
  </div>
  <div>
    <label>Stage:</label>
    <input v-model="attributes.stage" />
  </div>
  <div>
    <label>Home Team</label>
    <input v-model="attributes.home" />
  </div>
  <div>
    <label>Away Team</label>
    <input v-model="attributes.away" />
  </div>
  <div>
    <label>Extra Time Required</label>
    <input
      v-model="attributes.extraTime"
      type="checkbox"
    />
  </div>
  <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
</template>
