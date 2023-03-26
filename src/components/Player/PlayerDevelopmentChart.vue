<script setup lang="ts">
  import ApexChart from 'vue3-apexcharts'

  const props = defineProps({
    player: { type: Object, required: true }
  })

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

  function attributeData(attribute) {
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

  const theme = useTheme()
  const options = computed(() => ({
    chart: { type: 'area' },
    theme: { mode: theme.global.current.value.dark ? 'dark' : 'light' },
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
        labels: {
          formatter: v => formatMoney(v, team.value.currency)
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
</script>

<template>
  <apex-chart :series="series" :options="options" />
</template>
