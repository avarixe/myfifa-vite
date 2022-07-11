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
  <a href="#" @click="startNewInjury">New</a>

  <table>
    <thead>
      <th>Injury Date</th>
      <th>Recovery Date</th>
      <th>Description</th>
      <th></th>
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
  </table>
</template>
