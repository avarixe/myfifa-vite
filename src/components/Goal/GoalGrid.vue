<script setup>
  const props = defineProps({
    match: { type: Object, required: true }
  })

  const newGoals = ref([])
  let i = 0
  function startNewGoal () {
    newGoals.value.push(++i)
  }
</script>

<template>
  <v-card>
    <v-card-title>
      Goals
      <v-btn
        icon="mdi-plus"
        @click="startNewGoal"
      />
    </v-card-title>
    <v-table>
      <thead>
        <tr>
          <th>Minute</th>
          <th>Home</th>
          <th>Goal Scorer</th>
          <th>Assisted By</th>
          <th>Penalty</th>
          <th>Own Goal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <goal-row
          v-for="(newGoalCount, i) in newGoals"
          :key="`new-${newGoalCount}`"
          :match="match"
          @click:remove="newGoals.splice(i, 1)"
          @created="newGoals.splice(i, 1)"
        />
        <goal-row
          v-for="goal in match.goals"
          :key="goal.id"
          :match="match"
          :record="goal"
        />
      </tbody>
    </v-table>
  </v-card>
</template>
