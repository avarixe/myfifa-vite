<script setup lang="ts">
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
    <v-text-field v-model="attributes.name" label="Name" />
    <v-row dense>
      <v-col cols="12" md="6" class="py-0">
        <v-autocomplete
          v-model="attributes.pos"
          label="Position"
          :items="positions"
        />
      </v-col>
      <v-col cols="12" md="6" class="py-0">
        <v-autocomplete
          v-model="attributes.secPos"
          label="Secondary Position(s)"
          :items="positions"
          multiple
          chips
          closable-chips
        />
      </v-col>
      <v-col cols="12" md="6" class="py-0">
        <v-text-field
          v-model.number="attributes.age"
          label="Age"
          type="number"
          min="16"
          max="50"
        />
      </v-col>
      <v-col cols="12" md="6" class="py-0">
        <v-autocomplete
          v-model="attributes.nationality"
          label="Nationality"
          :items="Object.keys(nationalities)"
        >
          <template #selection="{ item }">
            <flag :iso="nationalities[item.raw]" class="mt-1 mr-2" />
            <span class="text-body-1">{{ item.raw }}</span>
          </template>
          <template #item="{ item, props: itemProps }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <flag :iso="nationalities[item.raw]" class="mr-2" />
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="6" class="py-0">
        <v-text-field
          v-model.number="attributes.ovr"
          label="OVR Rating"
          type="number"
          min="1"
          max="99"
        />
      </v-col>
      <v-col cols="12" md="6" class="py-0">
        <money-field v-model="attributes.value" label="Value" />
      </v-col>
      <v-col cols="12" md="6" class="py-0">
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
