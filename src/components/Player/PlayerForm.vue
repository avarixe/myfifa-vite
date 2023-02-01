<script setup>
  const { team } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const attributes = reactive({
    name: props.record?.name,
    pos: props.record?.pos,
    nationality: props.record?.nationality,
    secPos: props.record?.secPos || [],
    ovr: props.record?.ovr,
    value: props.record?.value,
    kitNo: props.record?.kitNo,
    age: props.record?.age,
    youth: props.record?.youth || false
  })

  const { executeMutation: createPlayer } = useMutation(gql`
    mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
      addPlayer(teamId: $teamId, attributes: $attributes) {
        player { ...PlayerData }
        errors { fullMessages }
      }
    }
    ${playerFragment}
  `)

  const { executeMutation: updatePlayer } = useMutation(gql`
    mutation ($id: ID!, $attributes: PlayerAttributes!) {
      updatePlayer(id: $id, attributes: $attributes) {
        player { ...PlayerData }
        errors { fullMessages }
      }
    }
    ${playerFragment}
  `)

  const loading = ref(false)
  const router = useRouter()
  async function onSubmit () {
    loading.value = true
    if (props.record) {
      const { data: { updatePlayer: { errors, player} } } =
        await updatePlayer({ id: props.record.id, attributes })
      if (player) {
        router.push(`/teams/${team.value.id}/players/${player.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addPlayer: { errors, player } } } =
        await createPlayer({ teamId: props.teamId, attributes })
      if (player) {
        router.push(`/teams/${team.value.id}/players/${player.id}`)
      } else {
        alert(errors.fullMessages[0])
      }
    }
    loading.value = false
  }
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="attributes.name"
      label="Name"
    />
    <v-autocomplete
      v-model="attributes.pos"
      label="Position"
      :items="positions"
    />
    <v-autocomplete
      v-model="attributes.nationality"
      label="Nationality"
      :items="Object.keys(nationalities)"
    />
    <v-autocomplete
      v-model="attributes.secPos"
      label="Secondary Position(s)"
      :items="positions"
      multiple
      chips
      closable-chips
    />
    <v-text-field
      v-model="attributes.ovr"
      label="OVR Rating"
      type="number"
      min="1"
      max="99"
    />
    <money-field
      v-model="attributes.value"
      label="Value"
    />
    <v-text-field
      v-model="attributes.kitNo"
      label="Kit Number"
      type="number"
      min="1"
      max="99"
    />
    <v-text-field
      v-model="attributes.age"
      label="Age"
      type="number"
      min="16"
      max="50"
    />
    <v-checkbox
      v-model="attributes.youth"
      label="Youth Player"
    />
    <v-btn
      type="submit"
      :loading="loading"
      v-text="props.record ? 'Update' : 'Create'"
    />
  </v-form>
</template>
