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
    { key: 'name', title: 'Match', align: 'center', sortable: false },
    { key: 'competition', title: 'Competition' },
    { key: 'playedOn', title: 'Date Played' },
    { key: 'link', title: 'Link', align: 'center', sortable: false }
  ]

  const sortBy = ref([{ key: 'playedOn', order: 'desc' }])
  const options = reactive({
    page: 0,
    itemsPerPage: 0,
    sortBy: 'playedOn',
    sortDesc: true
  })
  function onTableUpdate({ page, itemsPerPage, sortBy }) {
    options.page = page - 1
    options.itemsPerPage = itemsPerPage
    options.sortBy = sortBy[0]?.key
    options.sortDesc = sortBy[0]?.order === 'desc'
  }

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
  const items = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  async function loadItems() {
    try {
      loading.value = true
      await executeQuery()
      const {
        team: { matchSet }
      } = data.value
      matchRepo.save(matchSet.matches)
      const matchIds = matchSet.matches.map(match => parseInt(match.id))
      items.value = matchRepo
        .with('team')
        .where('id', matchIds)
        .orderBy(match => matchIds.indexOf(match.id))
        .get()
      totalItems.value = matchSet.total
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const loadTimeout = ref(null)
  function triggerLoad() {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = setTimeout(loadItems, 300)
  }

  watch(options, triggerLoad, { deep: true })
  watch(() => props.filters, triggerLoad, { deep: true })
</script>

<template>
  <v-data-table-server
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="items"
    :items-length="totalItems"
    :loading="loading"
    @update:options="onTableUpdate"
  >
    <template #[`item.name`]="{ item }">
      <div>{{ item.raw.home }} v {{ item.raw.away }}</div>
      <div :class="`text-${item.raw.resultColor}`">
        {{ item.raw.score }}
        <span v-if="item.raw.extraTime" class="text-caption">aet.</span>
      </div>
    </template>
    <template #[`item.competition`]="{ item }">
      <div>{{ item.raw.competition }}</div>
      <i v-if="item.raw.stage">{{ item.raw.stage }}</i>
    </template>
    <template #[`item.playedOn`]="{ item }">
      {{ formatDate(item.raw.playedOn) }}
    </template>
    <template #[`item.link`]="{ item }">
      <v-btn
        :to="`/teams/${team.id}/matches/${item.raw.id}`"
        color="primary"
        block
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>
    </template>
  </v-data-table-server>
</template>
