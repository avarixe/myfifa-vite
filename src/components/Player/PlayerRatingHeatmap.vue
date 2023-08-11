<script setup lang="ts">
  import { Player } from '~/models'
  import { differenceInMonths } from 'date-fns'

  const props = defineProps<{ player: Player }>()

  const { data } = useQuery({
    query: gql`
      query (
        $playerId: ID!
        $pagination: PaginationAttributes
        $filters: MatchFilterAttributes
      ) {
        player(id: $playerId) {
          capSet(pagination: $pagination, filters: $filters) {
            caps {
              rating
              match {
                playedOn
              }
            }
          }
        }
      }
    `,
    variables: {
      playerId: props.player.id,
      pagination: {
        page: 0,
        itemsPerPage: 365,
        sortBy: 'playedOn',
        sortDesc: true
      },
      filters: {}
    }
  })

  const calendarData = computed(() => {
    if (data.value) {
      return data.value.player.capSet.caps
        .filter(cap => !!cap.rating)
        .map(cap => ({
          date: cap.match.playedOn,
          value: cap.rating
        }))
    } else {
      return []
    }
  })

  const { team } = useTeam()

  const startDate = computed(() =>
    props.player.contracts.reduce((date: string, contract) => {
      return date < contract.startedOn ? date : contract.startedOn
    }, team.value.currentlyOn)
  )
  const numMonths = computed(
    () =>
      differenceInMonths(
        parseISO(team.value.currentlyOn),
        parseISO(startDate.value)
      ) + 1
  )

  const cal = new window.CalHeatmap()
  watch(data, () => {
    if (data.value) {
      cal.paint({
        theme: 'dark',
        domain: {
          type: 'month'
        },
        subDomain: {
          type: 'day'
        },
        range: numMonths.value,
        date: {
          start: startDate.value
        },
        data: {
          source: calendarData.value,
          x: 'date',
          y: 'value'
        },
        scale: {
          color: {
            scheme: 'RdYlGn',
            type: 'linear',
            domain: [0, 5]
          }
        }
      })
    }
  })
</script>

<template>
  <span>
    <div id="cal-heatmap" />
  </span>
</template>

<style scoped lang="scss">
  #cal-heatmap {
    overflow-x: auto;
    :deep(svg) {
      margin: auto;
    }
  }
</style>
