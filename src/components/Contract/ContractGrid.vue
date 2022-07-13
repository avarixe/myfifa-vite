<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const newContracts = ref([])
  let i = 0
  function startNewContract () {
    newContracts.value.push(++i)
  }
</script>

<template>
  <button @click="startNewContract">New</button>

  <table>
    <thead>
      <th>Signed Date</th>
      <th>Effective Date</th>
      <th>End Date</th>
      <th>Wage</th>
      <th>Signing Bonus</th>
      <th>Release Clause</th>
      <th>Performance Bonus</th>
      <th>Bonus Req.</th>
      <th>Bonus Req. Type</th>
      <th></th>
    </thead>
    <tbody>
      <contract-row
        v-for="(newContractCount, i) in newContracts"
        :key="`new-${newContractCount}`"
        :player-id="player.id"
        @click:remove="newContracts.splice(i, 1)"
        @created="newContracts.splice(i, 1)"
      />
      <contract-row
        v-for="contract in player.contracts"
        :key="contract.id"
        :record="contract"
      />
    </tbody>
  </table>
</template>
