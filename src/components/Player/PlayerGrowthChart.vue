<script setup>
  import { Contract } from '~/models'

  const props = defineProps({
    player: { type: Object, required: true },
    attribute: { type: String, required: true },
    label: { type: String, required: true },
    formatter: { type: Function, default: v => v }
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

  const series = computed(() => [{
    name: props.label,
    data: props.player.histories.reduce((data, history) => {
      data.splice(-1, 0, {
        x: parseISO(history.recordedOn),
        y: history[props.attribute]
      })
      return data
    }, [
      {
        x: parseISO(lastDate.value),
        y: props.player[props.attribute]
      }
    ])
  }])
  const options = reactive({
    chart: { type: 'area' },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: props.formatter
      }
    },
    title: {
      text: props.label,
    },
    subtitle: {
      text: props.player.name
    },
    dataLabels: {
      formatter: props.formatter
    },
    tooltip: {
      x: {
        format: 'MMM d, yyyy'
      },
      y: {
        formatter: props.formatter
      }
    }
  })
</script>

<template>
  <apexchart
    :series="series"
    :options="options"
  />
</template>
