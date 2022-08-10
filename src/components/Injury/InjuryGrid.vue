<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const newInjuries = ref([])
  let i = 0
  function startNewInjury () {
    newInjuries.value.push(++i)
  }
</script>

<template>
  <v-card>
    <v-card-title>
      Injuries
      <v-btn
        icon="mdi-plus"
        @click="startNewInjury"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Injury Date</th>
          <th>Recovery Date</th>
          <th>Description</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <injury-row
          v-for="(newInjuryCount, i) in newInjuries"
          :key="`new-${newInjuryCount}`"
          :player-id="player.id"
          @click:remove="newInjuries.splice(i, 1)"
          @created="newInjuries.splice(i, 1)"
        />
        <injury-row
          v-for="injury in player.injuries"
          :key="injury.id"
          :record="injury"
        />
      </tbody>
    </v-table>
  </v-card>
</template>

<style scoped>
  th {
    min-width: 15em;
  }
</style>
