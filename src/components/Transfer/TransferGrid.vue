<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const newTransfers = ref([])
  let i = 0
  function startNewTransfer () {
    newTransfers.value.push(++i)
  }
</script>

<template>
  <button @click="startNewTransfer">New</button>

  <table>
    <thead>
      <th>Signed Date</th>
      <th>Effective Date</th>
      <th>Origin</th>
      <th>Destination</th>
      <th>Fee</th>
      <th>Add-On Clause (%)</th>
      <th></th>
    </thead>
    <tbody>
      <transfer-row
        v-for="(newTransferCount, i) in newTransfers"
        :key="`new-${newTransferCount}`"
        :player-id="player.id"
        @click:remove="newTransfers.splice(i, 1)"
        @created="newTransfers.splice(i, 1)"
      />
      <transfer-row
        v-for="transfer in player.transfers"
        :key="transfer.id"
        :record="transfer"
      />
    </tbody>
  </table>
</template>
