<script setup>
  const props = defineProps({
    data: { type: Array, default: () => [] }
  })

  const stat = {
    total: 0,
    weight: 0,
    average: 0
  }

  const formationOvr = computed(() =>
    props.data.reduce(
      (ovrs, data) => {
        ovrs[data.type].total += data.value * data.weight
        ovrs[data.type].weight += data.weight
        ovrs[data.type].average = Math.round(
          ovrs[data.type].total / ovrs[data.type].weight
        )
        return ovrs
      },
      {
        DEF: { ...stat },
        MID: { ...stat },
        FWD: { ...stat }
      }
    )
  )
</script>

<template>
  <v-row dense>
    <v-col
      v-for="pos in ['DEF', 'MID', 'FWD']"
      :key="pos"
      class="text-center my-2"
    >
      <div class="text-h4 font-weight-black">
        {{ formationOvr[pos].average }}
      </div>
      <div class="text-caption">{{ pos }}</div>
    </v-col>
  </v-row>
</template>
