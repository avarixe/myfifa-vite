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
  <v-card>
    <v-card-title>
      Transfers
      <v-btn
        icon="mdi-plus"
        @click="startNewTransfer"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Signed Date</th>
          <th>Effective Date</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Fee</th>
          <th>Add-On Clause (%)</th>
          <th></th>
        </tr>
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
    </v-table>
  </v-card>
</template>

<style scoped>
  th {
    min-width: 15em;
  }
</style>
