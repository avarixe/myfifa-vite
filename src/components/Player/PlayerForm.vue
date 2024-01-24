<script setup lang="ts">
  import { Player } from '~/models'

  const { team } = useTeam()

  const props = defineProps<{
    teamId?: number
    record?: Player
  }>()

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

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: PlayerAttributes!) {
          updatePlayer(id: $id, attributes: $attributes) {
            player {
              ...PlayerData
            }
          }
        }
        ${playerFragment}
      `
    : gql`
        mutation createPlayer($teamId: ID!, $attributes: PlayerAttributes!) {
          addPlayer(teamId: $teamId, attributes: $attributes) {
            player {
              ...PlayerData
            }
          }
        }
        ${playerFragment}
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
    onSuccess(data: { player: { id: number } }[]) {
      const player = Object.values(data)[0].player
      router.push(`/teams/${team.value.id}/players/${player.id}`)
    }
  })
</script>

<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="attributes.name"
          label="Name"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="attributes.pos"
          label="Position"
          :items="positions"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="attributes.secPos"
          label="Secondary Position(s)"
          :items="positions"
          multiple
          chips
          closable-chips
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="attributes.age"
          label="Age"
          type="number"
          min="16"
          max="50"
        />
      </v-col>
      <v-col cols="12" md="6">
        <nationality-field
          v-model="attributes.nationality"
          label="Nationality"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="attributes.ovr"
          label="OVR Rating"
          type="number"
          min="1"
          max="99"
        />
      </v-col>
      <v-col cols="12" md="6">
        <money-field v-model="attributes.value" label="Value" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="attributes.kitNo"
          label="Kit Number"
          type="number"
          min="1"
          max="99"
        />
      </v-col>
    </v-row>
    <v-checkbox v-model="attributes.youth" label="Youth Player" />
    <v-btn type="submit" :loading="formIsLoading">
      {{ props.record ? 'Update' : 'Create' }}
    </v-btn>
  </v-form>
</template>
