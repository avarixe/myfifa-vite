<script setup lang="ts">
  import { Match } from '~/models'

  const props = withDefaults(defineProps<{ filters?: MatchFilters }>(), {
    filters: () => ({
      season: null,
      competition: null,
      stage: null,
      team: null,
      result: ['win', 'draw', 'loss']
    })
  })

  const { team } = useTeam()

  const headers = [
    { value: 'name', text: 'Match', align: 'center', sortable: false },
    { value: 'competition', text: 'Competition' },
    { value: 'playedOn', text: 'Date Played' },
    { value: 'link', text: 'Link', align: 'center', sortable: false }
  ]

  const options = ref({
    page: 0,
    itemsPerPage: 10,
    sortBy: 'playedOn',
    sortDesc: true
  })

  const { data, executeQuery } = useQuery({
    query: gql`
      query (
        $teamId: ID!
        $pagination: PaginationAttributes
        $filters: MatchFilterAttributes
      ) {
        team(id: $teamId) {
          matchSet(pagination: $pagination, filters: $filters) {
            matches {
              ...MatchData
            }
            total
          }
        }
      }
      ${matchFragment}
    `,
    variables: {
      teamId: team.value.id,
      pagination: options,
      filters: props.filters
    },
    pause: true
  })

  const matchRepo = useRepo(Match)
  const matches = ref([])
  const serverItemsLength = ref(0)
  const loading = ref(false)
  async function fetchPage() {
    try {
      loading.value = true
      await executeQuery()
      const {
        team: { matchSet }
      } = data.value
      matchRepo.save(matchSet.matches)
      const matchIds = matchSet.matches.map(match => parseInt(match.id))
      matches.value = matchRepo
        .with('team')
        .where('id', matchIds)
        .orderBy(match => matchIds.indexOf(match.id))
        .get()
      serverItemsLength.value = matchSet.total
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  onMounted(fetchPage)

  const fetchTimeout = ref(null)
  function onTableUpdate() {
    console.log('triggered table update')
    clearTimeout(fetchTimeout.value)
    fetchTimeout.value = setTimeout(fetchPage, 300)
  }

  watch(options, onTableUpdate, { deep: true })
  watch(() => props.filters, onTableUpdate, { deep: true })
</script>

<template>
  <data-table
    v-model:options="options"
    :headers="headers"
    :items="matches"
    :loading="loading"
    :server-items-length="serverItemsLength"
  >
    <template #item="{ item: match }">
      <td :style="{ textAlign: 'center' }">
        <div>{{ match.home }} v {{ match.away }}</div>
        <div :class="`text-${match.resultColor}`">
          {{ match.score }}
          <span v-if="match.extraTime" class="text-caption">aet.</span>
        </div>
      </td>
      <td>
        <div>{{ match.competition }}</div>
        <i v-if="match.stage">{{ match.stage }}</i>
      </td>
      <td>{{ formatDate(match.playedOn) }}</td>
      <td>
        <v-btn
          color="primary"
          block
          :to="`/teams/${team.id}/matches/${match.id}`"
        >
          <v-icon>mdi-play</v-icon>
        </v-btn>
      </td>
    </template>
  </data-table>
</template>
