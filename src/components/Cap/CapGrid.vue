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
  <v-card>
    <v-card-title>
      Caps
      <v-btn
        icon="mdi-plus"
        @click="startNewCap"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Player</th>
          <th>Rating</th>
          <th></th>
        </tr>
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
    </v-table>
  </v-card>
</template>
