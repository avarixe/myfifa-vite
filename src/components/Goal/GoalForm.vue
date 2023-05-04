<script setup lang="ts">
  import { Goal, Match } from '~/models'

  const props = defineProps<{
    match: Match
    record?: Goal
  }>()

  const { minute, unsubbedPlayers } = useMatch(props.match)

  interface GoalAttributes {
    home?: boolean
    playerId?: number
    playerName?: string
    assistId?: number
    assistedBy?: string
    ownGoal?: boolean
    penalty?: boolean
  }

  const attributes: GoalAttributes = reactive({})
  function onOpen() {
    attributes.home = props.record?.home ?? true
    attributes.playerId = props.record?.playerId
    attributes.playerName = props.record?.playerName
    attributes.assistId = props.record?.assistId
    attributes.assistedBy = props.record?.assistedBy
    attributes.ownGoal = props.record?.ownGoal ?? false
    attributes.penalty = props.record?.penalty ?? false
    minute.value = props.record?.minute
  }

  const rulesFor = {
    playerName: [isRequired('Goal Scorer')]
  }

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Goal`)

  const scorerOptions = computed(() =>
    unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.assistId)
  )

  const assistOptions = computed(() =>
    unsubbedPlayers.value.filter(cap => cap.playerId !== attributes.playerId)
  )

  const { team } = useTeam()
  const teamGoal = computed(
    () => !attributes.home !== (props.match.home === team.value?.name)
  )

  watchEffect(() => {
    if (!attributes.assistId && teamGoal.value) {
      attributes.assistedBy = ''
    }

    if (attributes.penalty || attributes.ownGoal) {
      attributes.assistId = null
      attributes.assistedBy = null
    }
  })

  watch(minute, () => {
    if (
      attributes.playerId &&
      scorerOptions.value.every(cap => cap.playerId !== attributes.playerId)
    ) {
      attributes.playerId = null
    }
    if (
      attributes.assistId &&
      assistOptions.value.every(cap => cap.playerId !== attributes.assistId)
    ) {
      attributes.assistId = null
    }
  })

  function clearNames() {
    attributes.playerId = null
    attributes.playerName = null
    attributes.assistId = null
    attributes.assistedBy = null
  }

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: GoalAttributes!) {
          updateGoal(id: $id, attributes: $attributes) {
            goal {
              ...GoalData
            }
          }
        }
        ${goalFragment}
      `
    : gql`
        mutation ($matchId: ID!, $attributes: GoalAttributes!) {
          addGoal(matchId: $matchId, attributes: $attributes) {
            goal {
              ...GoalData
            }
          }
        }
        ${goalFragment}
      `
  function variables() {
    if (props.record) {
      return {
        id: props.record.id,
        attributes: { ...attributes, minute: minute.value }
      }
    } else {
      return {
        matchId: props.match.id,
        attributes: { ...attributes, minute: minute.value }
      }
    }
  }
</script>

<template>
  <dialog-form
    title-icon="mdi-soccer"
    :title="title"
    :validate-on-open="!!record"
    :mutation="mutation"
    :variables="variables"
    @open="onOpen"
  >
    <template #form>
      <v-col cols="12">
        <v-radio-group
          v-model="attributes.home"
          inline
          hide-details
          @change="clearNames"
        >
          <v-radio :label="match.home" :value="true" color="teal" />
          <v-radio :label="match.away" :value="false" color="pink" />
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model.number="minute" label="Minute" type="number" />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.playerId"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :caps="scorerOptions"
          reverse-order
        />
        <v-text-field
          v-else
          v-model="attributes.playerName"
          label="Goal Scorer"
          prepend-icon="mdi-account"
          :rules="rulesFor.playerName"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <cap-select
          v-if="teamGoal"
          v-model="attributes.assistId"
          :caps="assistOptions"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          :disabled="attributes.penalty || attributes.ownGoal"
          clearable
          hide-details
        />
        <v-text-field
          v-else
          v-model="attributes.assistedBy"
          label="Assisted By"
          prepend-icon="mdi-human-greeting"
          hide-details
          :disabled="attributes.penalty || attributes.ownGoal"
          spellcheck="false"
          autocapitalize="words"
          autocomplete="off"
          autocorrect="off"
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.penalty"
          label="Penalty"
          :disabled="attributes.ownGoal"
          hide-details
        />
      </v-col>
      <v-col cols="12">
        <v-checkbox
          v-model="attributes.ownGoal"
          label="Own Goal"
          :disabled="attributes.penalty"
          hide-details
        />
      </v-col>
    </template>
  </dialog-form>
</template>
