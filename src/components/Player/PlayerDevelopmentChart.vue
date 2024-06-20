<script setup lang="ts">
  import { Contract, Player } from '~/models'

  const props = defineProps<{
    player: Player
  }>()

  const contractRepo = useRepo(Contract)
  const lastContract = computed(() =>
    contractRepo
      .orderBy('endedOn', 'desc')
      .where('playerId', props.player.id)
      .first()
  )

  const { team } = useTeam()
  const lastDate = computed(() => {
    const contractEnd = lastContract.value?.endedOn
    return contractEnd && team.value.currentlyOn >= contractEnd
      ? contractEnd
      : team.value.currentlyOn
  })

  function attributeData(attribute: 'ovr' | 'value') {
    return props.player.histories.reduce(
      (data, history) => {
        data.splice(-1, 0, {
          x: parseISO(history.recordedOn),
          y: history[attribute]
        })
        return data
      },
      [
        {
          x: parseISO(lastDate.value),
          y: props.player[attribute]
        }
      ]
    )
  }

  const series = computed(() => [
    {
      name: 'Overall Rating',
      data: attributeData('ovr')
    },
    {
      name: 'Value',
      data: attributeData('value')
    }
  ])

  const options = computed(() => ({
    chart: { type: 'area' },
    theme: { mode: 'dark' },
    xaxis: {
      type: 'datetime'
    },
    yaxis: [
      {
        title: { text: 'Overall Rating' },
        min: 40,
        max: 100
      },
      {
        opposite: true,
        title: { text: 'Value' },
        min: 0,
        labels: {
          formatter: (v: number) => formatMoney(v, team.value.currency)
        }
      }
    ],
    title: {
      text: props.player.name
    },
    subtitle: {
      text: `${formatDate(props.player.histories[0].recordedOn)} - ${formatDate(
        lastDate.value
      )}`
    },
    dataLabels: { enabled: false },
    tooltip: {
      x: { format: 'MMM d, yyyy' }
    }
  }))

  const container = ref<HTMLDivElement | null>(null)
  const chart = ref<typeof window.ApexCharts | null>(null)
  onMounted(() => {
    chart.value = new window.ApexCharts(container.value, {
      ...options.value,
      series: series.value
    })
    chart.value.render()
  })

  watch(
    series,
    () => {
      chart.value.updateSeries(series.value)
    },
    { deep: true }
  )

  watch(
    options,
    () => {
      chart.value.updateOptions(options.value)
    },
    { deep: true }
  )
</script>

<template>
  <div ref="container" />
</template>
