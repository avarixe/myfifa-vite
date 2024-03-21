<script setup lang="ts">
  import { Match } from '~/models'

  const props = defineProps<{
    match: Match
    readonly: boolean
  }>()

  const attributes = reactive({
    homeXg: props.match.homeXg,
    awayXg: props.match.awayXg,
    homePossession: props.match.homePossession,
    awayPossession: props.match.awayPossession
  })

  watchEffect(() => {
    attributes.awayPossession = 100 - attributes.homePossession
    if (!attributes.homeXg) {
      attributes.homeXg = null
    }
    if (!attributes.awayXg) {
      attributes.awayXg = null
    }
  })

  const mutation = gql`
    mutation ($id: ID!, $attributes: MatchAttributes!) {
      updateMatch(id: $id, attributes: $attributes) {
        match {
          ...MatchData
        }
      }
    }
    ${matchFragment}
  `

  const { formIsLoading, submitForm } = useForm({
    mutation,
    variables() {
      return { id: props.match.id, attributes }
    }
  })

  const timeout = ref(null as ReturnType<typeof setTimeout> | null)
  function updateMatch() {
    timeout.value && clearTimeout(timeout.value)
    timeout.value = setTimeout(submitForm, 1_000)
  }

  watch(attributes, updateMatch, { deep: true })
</script>

<template>
  <v-table class="rounded-lg">
    <thead>
      <tr>
        <th class="font-weight-light text-h6 text-sm-h4 text-teal">
          {{ match.home }}
        </th>
        <th class="text-center">Team</th>
        <th class="font-weight-light text-h6 text-sm-h4 text-blue-grey">
          {{ match.away }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td :class="`font-weight-bold text-h4 text-${match.resultColor}`">
          {{ match.homeScore }}
          <span v-if="match.penaltyShootout">
            ({{ match.penaltyShootout.homeScore }})
          </span>
        </td>
        <td class="text-center">
          Goals
          <div v-if="match.extraTime" :class="`text-${match.resultColor}`">
            AET
          </div>
        </td>
        <td :class="`font-weight-bold text-h4 text-${match.resultColor}`">
          {{ match.awayScore }}
          <span v-if="match.penaltyShootout">
            ({{ match.penaltyShootout.awayScore }})
          </span>
        </td>
      </tr>
      <tr
        v-if="
          !(
            props.readonly &&
            attributes.homeXg === undefined &&
            attributes.awayXg === undefined
          )
        "
      >
        <td class="font-weight-light text-h4">
          <div v-if="props.readonly" class="font-weight-bold text-h4">
            {{ Number(match.homeXg).toFixed(1) }}
          </div>
          <v-text-field
            v-else
            v-model.number="attributes.homeXg"
            type="number"
            variant="outlined"
            density="compact"
            :loading="formIsLoading"
            hide-details
          />
        </td>
        <td class="text-center">Expected Goals</td>
        <td class="font-weight-light text-h4">
          <div v-if="props.readonly" class="font-weight-bold text-h4">
            {{ Number(match.awayXg).toFixed(1) }}
          </div>
          <v-text-field
            v-else
            v-model.number="attributes.awayXg"
            type="number"
            variant="outlined"
            density="compact"
            :loading="formIsLoading"
            hide-details
          />
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div class="text-center">Possession</div>
          <v-slider
            v-model="attributes.homePossession"
            color="teal"
            track-color="blue-grey"
            :readonly="readonly"
            step="1"
          >
            <template #prepend>
              <span class="text-h4 text-teal"
                >{{ attributes.homePossession }}%</span
              >
            </template>
            <template #append>
              <span class="text-h4 text-blue-grey"
                >{{ attributes.awayPossession }}%</span
              >
            </template>
          </v-slider>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss">
  .v-table {
    background-color: rgba(0, 0, 0, 0.3);

    td,
    th {
      border: 0 !important;
      &:first-child {
        text-align: end;
        width: 40%;

        :deep(input) {
          text-align: end;
        }
      }
      &:last-child {
        text-align: start;
        width: 40%;
      }
    }
  }
</style>
