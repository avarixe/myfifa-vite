<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const newSubstitutions = ref([])
  let i = 0
  function startNewSubstitution () {
    newSubstitutions.value.push(++i)
  }
</script>

<template>
  <button @click="startNewSubstitution">New</button>

  <table>
    <thead>
      <th>Minute</th>
      <th>Player</th>
      <th>Replaced By</th>
      <th>Injury</th>
      <th></th>
    </thead>
    <tbody>
      <substitution-row
        v-for="(newSubstitutionCount, i) in newSubstitutions"
        :key="`new-${newSubstitutionCount}`"
        :match="match"
        @click:remove="newSubstitutions.splice(i, 1)"
        @created="newSubstitutions.splice(i, 1)"
      />
      <substitution-row
        v-for="substitution in match.substitutions"
        :key="substitution.id"
        :match="match"
        :record="substitution"
      />
    </tbody>
  </table>
</template>
