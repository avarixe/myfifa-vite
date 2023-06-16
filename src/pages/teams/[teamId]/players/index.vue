<script setup lang="ts">
  import { Contract, Player } from '~/models'

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
        player,
        contract: currentContractsByPlayerId.value[player.id]
      }
    })
  })

  const headers = [
    { key: 'player.name', title: 'Name', fixed: true },
    {
      key: 'player.nationality',
      title: 'Nationality',
      align: 'center',
      width: 80
    },
    { key: 'player.status', title: 'Status', align: 'center' },
    { key: 'player.age', title: 'Age', align: 'center' },
    { key: 'player.pos', title: 'Pos', align: 'center' },
    { key: 'player.secPos', title: '2nd Pos', width: 120 },
    { key: 'player.kitNo', title: 'Kit No', align: 'center', width: 100 },
    { key: 'player.ovr', title: 'OVR', align: 'center' },
    { key: 'player.value', title: 'Value', align: 'end' },
    { key: 'contract.wage', title: 'Wage', align: 'end' },
    {
      key: 'contract.endedOn',
      title: 'Contract Ends',
      align: 'end',
      width: 180
    }
  ]

  const sortBy = ref([{ key: 'player.pos', order: 'asc' }])
</script>

<template>
  <div class="text-h4">Players</div>

  <div class="my-2">
    <v-btn :to="`/teams/${team.id}/players/new`">
      <v-icon start>mdi-plus</v-icon>
      Player
    </v-btn>
    &nbsp;
    <v-btn :to="`/teams/${team.id}/players/import`">Import</v-btn>
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

  <v-data-table
    v-model:sort-by="sortBy"
    :headers="headers"
    :items="rows"
    :custom-key-sort="{ 'player.pos': sortByPosition }"
    class="rounded"
  >
    <template #[`column.player.nationality`]="{ column, getSortIcon }">
      <span>
        <v-icon>mdi-flag</v-icon>
      </span>
      <v-icon
        class="v-data-table-header__sort-icon"
        :icon="getSortIcon(column)"
      />
    </template>
    <template #[`item.player.name`]="{ item }">
      <v-btn
        :to="`/teams/${team.id}/players/${item.raw.player.id}`"
        :text="item.raw.player.name"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.player.nationality`]="{ item }">
      <flag
        :iso="item.raw.player.flag"
        :title="item.raw.player.nationality"
        class="mr-2"
      />
    </template>
    <template #[`item.player.status`]="{ item }">
      <v-icon :color="item.raw.player.statusColor">
        mdi-{{ item.raw.player.statusIcon }}
      </v-icon>
    </template>
    <template #[`item.player.secPos`]="{ item }">
      {{ item.raw.player.secPos.join(', ') }}
    </template>
    <template #[`item.player.kitNo`]="{ item }">
      <player-attribute
        :player="item.raw.player"
        attribute="kitNo"
        label="Kit No"
      />
    </template>
    <template #[`item.player.ovr`]="{ item }">
      <player-attribute :player="item.raw.player" attribute="ovr" label="OVR" />
    </template>
    <template #[`item.player.value`]="{ item }">
      <player-attribute
        :player="item.raw.player"
        attribute="value"
        label="Value"
      >
        <template #display>
          {{ formatMoney(item.raw.player.value, team.currency) }}
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
    <template #[`item.contract.wage`]="{ item }">
      <span v-if="item.raw.contract?.wage">
        {{ formatMoney(item.raw.contract.wage, team.currency) }}
      </span>
    </template>
    <template #[`item.contract.endedOn`]="{ item }">
      {{ formatDate(item.raw.contract?.endedOn) }}
    </template>
  </v-data-table>
</template>
