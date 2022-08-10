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
  <v-card>
    <v-card-title>
      Loans
      <v-btn
        icon="mdi-plus"
        @click="startNewLoan"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Signed Date</th>
          <th>Start Date</th>
          <th>Return Date</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Wage Percentage (%)</th>
          <th>Transfer Fee</th>
          <th>Add-On Clause (%)</th>
          <th></th>
        </tr>
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
    </v-table>
  </v-card>
</template>

<style scoped>
  th {
    min-width: 15em;
  }
</style>
