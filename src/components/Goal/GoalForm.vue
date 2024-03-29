<script setup lang="ts">
  import { Goal, Match } from '~/models'

  const props = defineProps<{
    match: Match
    record?: Goal
  }>()

  const { minute, capsAtMinute } = useMatchState(toRef(() => props.match))

  const attributes: GoalAttributes = reactive({})
  function onOpen() {
    attributes.home = props.record?.home ?? true
    attributes.capId = props.record?.capId
    attributes.playerName = props.record?.playerName
    attributes.assistCapId = props.record?.assistCapId
    attributes.assistedBy = props.record?.assistedBy
    attributes.ownGoal = props.record?.ownGoal ?? false
    attributes.setPiece = props.record?.setPiece
    minute.value = props.record?.minute || null
  }

  const title = computed(() => `${props.record ? 'Edit' : 'Record'} Goal`)

  const scorerOptions = computed(() =>
    capsAtMinute.value.filter(cap => cap.id !== attributes.assistCapId)
  )

  const assistOptions = computed(() =>
    capsAtMinute.value.filter(cap => cap.id !== attributes.capId)
  )

  const setPieceOptions = Object.entries(setPieces).map(([value, title]) => ({
    value,
    title
  }))

  const { team } = useTeam()
  const teamGoal = computed(
    () => !attributes.home !== (props.match.home === team.value?.name)
  )

  watchEffect(() => {
    if (!attributes.assistCapId && teamGoal.value) {
      attributes.assistedBy = ''
    }

    if (attributes.setPiece === 'PK') {
      attributes.ownGoal = false
      clearAssistedBy()
    } else if (attributes.ownGoal) {
      clearAssistedBy()
    }
  })

  watch(minute, () => {
    if (
      attributes.capId &&
      scorerOptions.value.every(cap => cap.id !== attributes.capId)
    ) {
      attributes.capId = null
    }
    if (
      attributes.assistCapId &&
      assistOptions.value.every(cap => cap.id !== attributes.assistCapId)
    ) {
      attributes.assistCapId = null
    }
  })

  function clearAssistedBy() {
    attributes.assistCapId = null
    attributes.assistedBy = null
  }

  function clearPlayers() {
    attributes.capId = null
    attributes.playerName = null
    clearAssistedBy()
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
    <v-col cols="12">
      <v-radio-group
        v-model="attributes.home"
        inline
        hide-details
        @change="clearPlayers"
      >
        <v-radio :label="match.home" :value="true" color="teal" />
        <v-radio :label="match.away" :value="false" color="pink" />
      </v-radio-group>
    </v-col>
    <v-col cols="12">
      <minute-field v-model="minute" :match="match" />
    </v-col>
    <v-col cols="12">
      <cap-select
        v-if="teamGoal"
        v-model="attributes.capId"
        label="Goal Scorer"
        prepend-icon="mdi-account"
        :caps="scorerOptions"
      />
      <v-text-field
        v-else
        v-model="attributes.playerName"
        label="Goal Scorer"
        prepend-icon="mdi-account"
        :rules="[isRequired('Goal Scorer')]"
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </v-col>
    <v-col cols="12">
      <cap-select
        v-if="teamGoal"
        v-model="attributes.assistCapId"
        :caps="assistOptions"
        label="Assisted By"
        prepend-icon="mdi-human-greeting"
        :disabled="attributes.setPiece === 'PK' || attributes.ownGoal"
        clearable
      />
      <v-text-field
        v-else
        v-model="attributes.assistedBy"
        label="Assisted By"
        prepend-icon="mdi-human-greeting"
        :disabled="
          attributes.setPiece === 'PK' || attributes.ownGoal || undefined
        "
        spellcheck="false"
        autocapitalize="words"
        autocomplete="off"
        autocorrect="off"
      />
    </v-col>
    <v-col cols="12">
      <v-select
        v-model="attributes.setPiece"
        :items="setPieceOptions"
        label="Set Piece"
        prepend-icon="mdi-strategy"
        clearable
        hide-details
      />
    </v-col>
    <v-col cols="12">
      <v-checkbox
        v-model="attributes.ownGoal"
        label="Own Goal"
        :disabled="attributes.setPiece === 'PK'"
        hide-details
      />
    </v-col>
  </dialog-form>
</template>
