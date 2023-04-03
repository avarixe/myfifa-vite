<script setup lang="ts">
  const { team, data } = await useTeamQuery({
    query: gql`
      query fetchPlayersPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
          players {
            ...PlayerData
            currentContract {
              ...ContractData
            }
          }
        }
      }
      ${teamFragment}
      ${playerFragment}
      ${contractFragment}
    `
  })

  const contractRepo = useRepo(Contract)
  const contracts = data.value.team.players
    .map(player => player.currentContract)
    .filter(contract => contract)
  contractRepo.save(contracts)

  const filter = ref('Active')
  const filterOptions = [
    { text: 'All', color: 'blue', icon: 'earth' },
    { text: 'Youth', color: 'cyan', icon: 'school' },
    { text: 'Active', color: 'light-green', icon: 'account-check' },
    { text: 'Injured', color: 'pink', icon: 'ambulance' },
    { text: 'Loaned', color: 'deep-orange', icon: 'transit-transfer' },
    { text: 'Pending', color: 'orange', icon: 'lock-clock' }
  ]
  // const search = ref('')

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    playerRepo
      .where('teamId', team.value.id)
      .where('status', status => {
        switch (filter.value) {
          case 'Active':
            return status !== null && status !== 'Pending'
          case 'Injured':
          case 'Loaned':
          case 'Pending':
            return status === filter.value
          default:
            return true
        }
      })
      .where('youth', youth => filter.value !== 'Youth' || youth)
      .get()
  )

  const currentContractsByPlayerId = computed(() => {
    const playerIds = players.value.map(player => player.id)
    return _keyBy(
      contractRepo
        .where('playerId', id => playerIds.includes(id))
        .where('startedOn', date => date <= team.value.currentlyOn)
        .where('endedOn', date => team.value.currentlyOn < date)
        .get(),
      contract => contract.playerId
    )
  })

  const rows = computed(() => {
    return players.value.map(player => {
      return {
        ...player,
        flag: player.flag,
        statusColor: player.statusColor,
        statusIcon: player.statusIcon,
        posIdx: player.posIdx,
        wage: currentContractsByPlayerId.value[player.id]?.wage,
        endDate: currentContractsByPlayerId.value[player.id]?.endedOn
      }
    })
  })

  const headers = [
    {
      value: 'name',
      text: 'Name',
      class: 'sticky',
      cellClass: 'sticky'
    },
    {
      value: 'nationality',
      text: 'Nationality',
      class: 'text-center',
      cellClass: 'text-center'
    },
    {
      value: 'status',
      text: 'Status',
      class: 'text-center',
      cellClass: 'text-center'
    },
    {
      value: 'age',
      text: 'Age',
      class: 'text-center',
      cellClass: 'text-center'
    },
    {
      value: 'pos',
      text: 'Pos',
      sortBy: 'posIdx',
      class: 'text-center',
      cellClass: 'text-center'
    },
    { value: 'secPos', text: '2nd Pos' },
    {
      value: 'kitNo',
      text: 'Kit No',
      class: 'text-center',
      cellClass: 'text-center'
    },
    {
      value: 'ovr',
      text: 'OVR',
      class: 'text-center',
      cellClass: 'text-center'
    },
    {
      value: 'value',
      text: 'Value',
      class: 'text-right',
      cellClass: 'text-right'
    },
    {
      value: 'wage',
      text: 'Wage',
      class: 'text-right',
      cellClass: 'text-right'
    },
    {
      value: 'endDate',
      text: 'Contract Ends',
      class: 'text-right',
      cellClass: 'text-right'
    }
  ]
</script>

<template>
  <div class="text-h4">Players</div>

  <div class="my-2">
    <v-btn :to="`/teams/${team.id}/players/new`">
      <v-icon start>mdi-plus</v-icon>
      Player
    </v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/players/development`">Development</v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/players/statistics`">Statistics</v-btn>
  </div>

  <div class="my-2">
    <v-btn-toggle v-model="filter" variant="outlined">
      <v-btn
        v-for="option in filterOptions"
        :key="option.text"
        icon
        :color="option.color"
        :value="option.text"
      >
        <v-icon>mdi-{{ option.icon }}</v-icon>
        <v-tooltip
          activator="parent"
          :text="`${option.text} Players`"
          location="bottom"
        />
      </v-btn>
    </v-btn-toggle>
  </div>

  <data-table :headers="headers" :items="rows" sort-by="pos">
    <template #header-nationality>
      <v-icon>mdi-flag</v-icon>
    </template>
    <template #item-name="{ item: player }">
      <v-btn
        variant="text"
        color="primary"
        class="text-capitalize"
        :to="`/teams/${team.id}/players/${player.id}`"
      >
        {{ player.name }}
      </v-btn>
    </template>
    <template #item-nationality="{ item: player }">
      <flag :iso="player.flag" :title="player.nationality" class="mr-2" />
    </template>
    <template #item-status="{ item: player }">
      <v-icon :color="player.statusColor"> mdi-{{ player.statusIcon }} </v-icon>
    </template>
    <template #item-secPos="{ item: player }">
      {{ player.secPos.join(', ') }}
    </template>
    <template #item-kitNo="{ item: player }">
      <player-attribute :player="player" attribute="kitNo" label="Kit No" />
    </template>
    <template #item-ovr="{ item: player }">
      <player-attribute :player="player" attribute="ovr" label="OVR" />
    </template>
    <template #item-value="{ item: player }">
      <player-attribute :player="player" attribute="value" label="Value">
        <template #display>
          {{ formatMoney(player.value, team.currency) }}
        </template>
        <template #form="{ modelValue, updateModelValue, closeMenu }">
          <money-field
            label="Value"
            hide-details
            variant="solo"
            density="compact"
            clearable
            autofocus
            :style="{ width: '10em' }"
            :model-value="modelValue"
            @update:model-value="updateModelValue"
            @keydown.enter="closeMenu"
          />
        </template>
      </player-attribute>
    </template>
    <template #item-wage="{ item: player }">
      <span v-if="player.wage">
        {{ formatMoney(player.wage, team.currency) }}
      </span>
    </template>
    <template #item-endDate="{ item: player }">
      {{ formatDate(player.endDate) }}
    </template>
  </data-table>
</template>
