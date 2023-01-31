<script setup>
  const props = defineProps({
    competitionStats: { type: Array, required: true },
    teamDevelopmentStats: { type: Object, required: true }
  })

  const { team } = useTeam()

  const statTotal = key => props.competitionStats.reduce(
    (total, stats) => total + stats[key],
    0
  )
</script>

<template>
  <div class="row text-center justify-around">
    <div class="col col-12 col-sm-6 pa-1">
      <div class="text-h4">
        <season-stat-change
          :formatter="parseInt"
          :start-value="teamDevelopmentStats.startOvr"
          :end-value="teamDevelopmentStats.endOvr"
        />
      </div>
      <div class="subheading">Team OVR</div>
    </div>
    <div class="col col-12 col-sm-6 pa-1">
      <div class="text-h4">
        <season-stat-change
          :formatter="x => formatMoney(x, team.currency)"
          :start-value="parseInt(teamDevelopmentStats.startValue)"
          :end-value="parseInt(teamDevelopmentStats.endValue)"
        />
      </div>
      <div class="subheading">Team Value</div>
    </div>
    <div class="col col-6 col-sm-2 pa-1">
      <div class="text-h4">{{ statTotal('wins') }}</div>
      <div class="subheading">Wins</div>
    </div>
    <div class="col col-6 col-sm-2 pa-1">
      <div class="text-h4">{{ statTotal('draws') }}</div>
      <div class="subheading">Draws</div>
    </div>
    <div class="col col-6 col-sm-2 pa-1">
      <div class="text-h4">{{ statTotal('losses') }}</div>
      <div class="subheading">Losses</div>
    </div>
    <div class="col col-6 col-sm-2 pa-1">
      <div class="text-h4">{{ statTotal('goalsFor') }}</div>
      <div class="subheading">Goals For</div>
    </div>
    <div class="col col-6 col-sm-2 pa-1">
      <div class="text-h4">{{ statTotal('goalsAgainst') }}</div>
      <div class="subheading">Goals Against</div>
    </div>
  </div>
</template>
