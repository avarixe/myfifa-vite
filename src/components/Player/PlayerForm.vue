<script setup>
  import { useTeam } from '~/composables'
  import { positions, nationalities } from '~/constants'
  import { playerFragment } from '~/fragments'

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

  const router = useRouter()
  async function onSubmit () {
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
  }
</script>

<template>
  <div>
    <label>Name:</label>
    <input v-model="attributes.name" />
  </div>
  <div>
    <label>Position:</label>
    <select v-model="attributes.pos">
      <option v-for="pos in positions" :key="pos">{{ pos }}</option>
    </select>
  </div>
  <div>
    <label>Nationality</label>
    <select v-model="attributes.nationality">
      <option v-for="nation in Object.keys(nationalities)" :key="nation">
        {{ nation }}
      </option>
    </select>
  </div>
  <div>
    <label>Secondary Position(s)</label>
    <select v-model="attributes.secPos" multiple>
      <option v-for="pos in positions" :key="pos">{{ pos }}</option>
    </select>
  </div>
  <div>
    <label>OVR Rating</label>
    <input
      v-model="attributes.ovr"
      type="number"
      min="1"
      max="99"
    />
  </div>
  <div>
    <label>Value</label>
    <input
      v-model="attributes.value"
      type="number"
    />
  </div>
  <div>
    <label>Kit Number</label>
    <input
      v-model="attributes.kitNo"
      type="number"
      min="1"
      max="99"
    />
  </div>
  <div>
    <label>Age</label>
    <input
      v-model="attributes.age"
      type="number"
      min="16"
      max="50"
    />
  </div>
  <div>
    <label>Youth Player</label>
    <input
      v-model="attributes.youth"
      type="checkbox"
    />
  </div>
  <button @click="onSubmit">{{ props.record ? 'Update' : 'Create' }}</button>
</template>
