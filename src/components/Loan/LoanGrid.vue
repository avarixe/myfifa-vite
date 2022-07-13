<script setup>
  const props = defineProps({
    player: { type: Object, required: true }
  })

  const newLoans = ref([])
  let i = 0
  function startNewLoan () {
    newLoans.value.push(++i)
  }
</script>

<template>
  <button @click="startNewLoan">New</button>

  <table>
    <thead>
      <th>Signed Date</th>
      <th>Start Date</th>
      <th>Return Date</th>
      <th>Origin</th>
      <th>Destination</th>
      <th>Wage Percentage (%)</th>
      <th>Transfer Fee</th>
      <th>Add-On Clause (%)</th>
      <th></th>
    </thead>
    <tbody>
      <loan-row
        v-for="(newLoanCount, i) in newLoans"
        :key="`new-${newLoanCount}`"
        :player-id="player.id"
        @click:remove="newLoans.splice(i, 1)"
        @created="newLoans.splice(i, 1)"
      />
      <loan-row
        v-for="loan in player.loans"
        :key="loan.id"
        :record="loan"
      />
    </tbody>
  </table>
</template>
