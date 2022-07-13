<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const newCaps = ref([])
  let i = 0
  function startNewCap () {
    newCaps.value.push(++i)
  }
</script>

<template>
  <button @click="startNewCap">New</button>

  <table>
    <thead>
      <th>Position</th>
      <th>Player</th>
      <th>Rating</th>
      <th></th>
    </thead>
    <tbody>
      <cap-row
        v-for="(newCapCount, i) in newCaps"
        :key="`new-${newCapCount}`"
        :match-id="match.id"
        @click:remove="newCaps.splice(i, 1)"
        @created="newCaps.splice(i, 1)"
      />
      <cap-row
        v-for="cap in match.caps"
        :key="cap.id"
        :record="cap"
      />
    </tbody>
  </table>
</template>
