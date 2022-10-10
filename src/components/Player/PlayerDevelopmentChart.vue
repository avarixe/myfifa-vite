<script setup>
  import { Contract } from '~/models'

  const props = defineProps({
    player: { type: Object, required: true },
    attribute: { type: String, required: true }
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

  function attributeData (attribute) {
    return props.player.histories.reduce((data, history) => {
      data.splice(-1, 0, {
        x: parseISO(history.recordedOn),
        y: history[attribute]
      })
      return data
    }, [
      {
        x: parseISO(lastDate.value),
        y: props.player[attribute]
      }
    ])
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


  const options = reactive({
    chart: { type: 'area' },
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
      text: props.player.name,
    },
    subtitle: {
      text: `${formatDate(props.player.histories[0].recordedOn)} - ${formatDate(lastDate.value)}`
    },
    dataLabels: { enabled: false },
    tooltip: {
      x: { format: 'MMM d, yyyy' }
    }
  })
</script>

<template>
  <apexchart :series="series" :options="options" />
</template>
