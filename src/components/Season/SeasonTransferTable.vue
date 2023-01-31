<script setup>
  import { addYears } from 'date-fns'
  import { Player } from '~/models'
import { formatDate } from '../../helpers/formatters';

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  const props = defineProps({
    transferActivity: { type: Object, required: true },
    playerValues: { type: Object, required: true },
    season: { type: Number, required: true }
  })

  const { team } = useTeam()

  const playerRepo = useRepo(Player)

  const arrivals = computed(() =>
    props.transferActivity.arrivals.filter(arrival => {
      return !transfers.value.some(transfer => {
        return transfer.playerId === arrival.playerId &&
          transfer.date === arrival.startedOn &&
          transfer.iconColor === 'green'
      }) && !loans.value.some(loan => {
        return loan.playerId === arrival.playerId &&
          loan.date === arrival.startedOn &&
          loan.iconColor === 'light-green'
      }) && arrival.startedOn !== team.value.startedOn
    }).map((arrival, i) => {
      const player = playerRepo.find(parseInt(arrival.playerId))

      return {
        ...pick(player, ['name', 'pos']),
        id: `arrival-${i}`,
        playerId: arrival.playerId,
        date: arrival.startedOn,
        icon: `mdi-${player.youth ? 'school' : 'human-greeting'}`,
        iconColor: player.youth ? 'cyan' : 'blue',
        posIdx: player.posIdx,
        fromTo: player.youth ? 'Youth Academy' : 'Free Agent',
        value: props.playerValues[arrival.playerId][0],
        netValue: props.playerValues[arrival.playerId][0]
      }
    })
  )

  const departures = computed(() =>
    props.transferActivity.departures.map((departure, i) => {
      const player = playerRepo.find(parseInt(departure.playerId))

      return {
        ...pick(player, ['name', 'pos']),
        id: `departure-${i}`,
        playerId: departure.playerId,
        date: departure.endedOn,
        icon: 'mdi-exit-run',
        iconColor: 'purple',
        posIdx: player.posIdx,
        fromTo: `(${player.conclusion || 'Expired'})`,
        value: -props.playerValues[departure.playerId][1],
        netValue: -props.playerValues[departure.playerId][1]
      }
    })
  )

  const transfers = computed(() =>
    props.transferActivity.transfers.map((transfer, i) => {
      const player = playerRepo.find(parseInt(transfer.playerId))
      const playerValues = props.playerValues[transfer.playerId] || Array(2).fill(player.value)
      const transferOut = team.value.name === transfer.origin

      return {
        ...pick(player, ['name', 'pos']),
        ...pick(transfer, ['playerId', 'addonClause']),
        id: `transfer-${i}`,
        date: transfer.movedOn,
        icon: `mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`,
        iconColor: transferOut ? 'red' : 'green',
        posIdx: player.posIdx,
        fromTo: transferOut ? transfer.destination : transfer.origin,
        fee: (transferOut ? 1 : -1) * transfer.fee,
        value: transferOut ? -playerValues[1] : playerValues[0],
        netValue: transferOut ? transfer.fee - playerValues[1] : playerValues[0] - transfer.fee
      }
    })
  )

  const seasonStart = computed(() => {
    const date = parseISO(team.value.startedOn)
    return format(addYears(date, props.season), 'yyyy-MM-dd')
  })
  const seasonEnd = computed(() => {
    const date = parseISO(seasonStart.value)
    return format(addYears(date, 1), 'yyyy-MM-dd')
  })
  const loans = computed(() =>
    props.transferActivity.loans.reduce((loans, loan) => {
      const player = playerRepo.find(parseInt(loan.playerId))
      const loanOut = team.value.name === loan.origin
      const row = {
        ...pick(player, ['name', 'pos']),
        posIdx: player.posIdx,
        playerId: loan.playerId,
        fromTo: loanOut ? loan.destination : loan.origin
      }
      if (loan.startedOn >= seasonStart.value) {
        loans.push({
          ...row,
          id: `loan-start-${loan.id}`,
          date: loan.startedOn,
          icon: `mdi-account-arrow-${loanOut ? 'right' : 'left'}`,
          iconColor: `${loanOut ? 'orange' : 'light-green'}`
        })
      }
      if (loan.endedOn <= seasonEnd.value && !transfers.value.some(transfer =>
        transfer.playerId === loan.playerId && transfer.date === loan.endedOn
      )) {
        loans.push({
          ...row,
          id: `loan-end-${loan.id}`,
          date: loan.endedOn,
          icon: `mdi-account-arrow-${loanOut ? 'left' : 'right'}`,
          iconColor: `${loanOut ? 'light-green' : 'orange'}`
        })
      }
      return loans
    }, [])
  )

  const rows = computed(() => [
    ...arrivals.value,
    ...departures.value,
    ...transfers.value,
    ...loans.value
  ].sort((a, b) => a.date - b.date))

  const totals = computed(() =>
    rows.value.reduce((totals, row) => {
      ['value', 'fee', 'netValue'].forEach(attr => {
        if (row[attr]) {
          totals[attr] += row[attr]
        }
      })
      return totals
    }, { value: 0, fee: 0, netValue: 0 })
  )

  const numYouthPlayers = computed(() =>
    arrivals.value.filter(arrival => arrival.fromTo === 'Youth Academy').length
  )
  const numTransfersIn = computed(() =>
    transfers.value.filter(transfer => transfer.iconColor === 'green').length
  )

  const columns = [
    { label: 'Player', name: 'name', field: 'name', class: 'stick-left', width: 200 },
    { label: 'Pos', name: 'pos', field: 'pos', align: 'center', sortBy: 'posIdx', width: 100 },
    { label: 'Date', name: 'date', field: 'date', align: 'center', width: 120, format: (value) => formatDate(value) },
    { label: '', name: 'icon', field: 'icon', align: 'center', width: 40 },
    { label: 'From/To', name: 'fromTo', field: 'fromTo', align: 'left', width: 170 },
    { label: 'Value', name: 'value', field: 'value', align: 'right', width: 150 },
    { label: 'Fee', name: 'fee', field: 'fee', align: 'right', width: 150 },
    { label: 'Net Value', name: 'netValue', field: 'netValue', align: 'right', width: 150 },
  ]
</script>

<template>
  <q-table
    :columns="columns"
    :rows="rows"
    :pagination="{ rowsPerPage: 0, sortBy: 'date' }"
    :rows-per-page-options="[0]"
    virtual-scroll
    hide-bottom
    class="mt-2"
  >
    <template #body-cell-name="props">
      <q-td :props="props">
        <q-btn
          :to="`/teams/${team.id}/players/${props.row.playerId}`"
          size="small"
          flat
          color="primary"
          class="text-capitalize"
          :label="props.value"
        />
      </q-td>
    </template>
    <template #body-cell-icon="props">
      <q-td :props="props">
        <q-icon :color="props.row.iconColor" :name="props.row.icon" />
      </q-td>
    </template>
    <template #body-cell-value="props">
      <q-td :props="props">
        <span :class="`text-${props.value > 0 ? 'positive' : 'negative'}`">
          <span v-if="props.value">{{ props.value > 0 ? '+' : '-' }}</span>
          {{ formatMoney(Math.abs(props.value), team.currency, ' ') }}
        </span>
      </q-td>
    </template>
    <template #body-cell-fee="props">
      <q-td :props="props">
        <span v-if="props.value" :class="`text-${props.value > 0 ? 'positive' : 'negative'}`">
          {{ props.value > 0 ? '+' : '-' }}
          {{ formatMoney(Math.abs(props.value), team.currency, ' ') }}
          <span v-if="props.row.addonClause">(+{{ props.row.addonClause }}%)</span>
        </span>
      </q-td>
    </template>
    <template #body-cell-netValue="props">
      <q-td :props="props">
        <span :class="`text-${props.value > 0 ? 'positive' : 'negative'}`">
          <span v-if="props.value">{{ props.value > 0 ? '+' : '-' }}</span>
          {{ formatMoney(Math.abs(props.value), team.currency, ' ') }}
        </span>
      </q-td>
    </template>
    <template #bottom-row>
      <tr v-if="rows.length" class="text-bold">
        <td class="stick-left text-right">
          <span class="pr-4">Summary</span>
        </td>
        <td colspan="2" />
        <td colspan="2" class="py-2">
          <div>
            {{ numYouthPlayers }}
            <q-icon color="cyan" name="mdi-school" />
            Youth Academy
          </div>
          <div>
            {{ arrivals.length - numYouthPlayers }}
            <q-icon color="blue" name="mdi-human-greeting" />
            Free Arrivals
          </div>
          <div>
            {{ numTransfersIn }}
            <q-icon color="green" name="mdi-airplane-landing" />
            Transfers (In)
          </div>
          <div>
            {{ transfers.length - numTransfersIn }}
            <q-icon color="red" name="mdi-airplane-takeoff" />
            Transfers (Out)
          </div>
          <div>
            {{ departures.length }}
            <q-icon color="purple" name="mdi-exit-run" />
            Departures
          </div>
        </td>
        <td
          v-for="attr in ['value', 'fee', 'netValue']"
          :key="attr"
          :class="`text-right text-${totals[attr] > 0 ? 'positive' : 'negative'}`"
        >
          {{ totals[attr] > 0 ? '+' : '-' }}
          {{ formatMoney(Math.abs(totals[attr]), team.currency, ' ') }}
        </td>
      </tr>
    </template>
  </q-table>
</template>
