<script setup>
  import { addYears } from 'date-fns'
  import { Player } from '~/models'

  function sortPos (posA, posB) {
    return positions.indexOf(posA) - positions.indexOf(posB)
  }

  const props = defineProps({
    transferActivity: { type: Object, required: true },
    season: { type: Number, required: true }
  })

  const headers = [
    { text: 'Player', value: 'name', class: 'stick-left', width: 200 },
    { text: 'Pos', value: 'pos', class: 'text-center', sort: sortPos, width: 100 },
    { text: 'Date', value: 'date', class: 'text-center', width: 120 },
    { text: '', value: 'icon', class: 'text-center', sortable: false, width: 40 },
    { text: 'From/To', value: 'fromTo', width: 170 },
    { text: 'Fee', value: 'fee', class: 'text-right', class: 'text-right', width: 150 }
  ]

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
        fromTo: player.youth ? 'Youth Academy' : 'Free Agent'
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
        fromTo: `(${player.conclusion || 'Expired'})`
      }
    })
  )

  const transfers = computed(() =>
    props.transferActivity.transfers.map((transfer, i) => {
      const player = playerRepo.find(parseInt(transfer.playerId))
      const transferOut = team.value.name === transfer.origin

      return {
        ...pick(player, ['name', 'pos']),
        ...pick(transfer, ['playerId', 'fee', 'addonClause']),
        id: `transfer-${i}`,
        date: transfer.movedOn,
        icon: `mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`,
        iconColor: transferOut ? 'red' : 'green',
        fromTo: transferOut ? transfer.destination : transfer.origin,
        feeColor: transferOut ? 'green' : 'red',
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

  const total = computed(() =>
    props.transferActivity.transfers.reduce((total, transfer) => {
      if (transfer.origin === team.value.name) {
        return total + transfer.fee
      } else {
        return total - transfer.fee
      }
    }, 0)
  )

  const numYouthPlayers = computed(() =>
    arrivals.value.filter(arrival => arrival.fromTo === 'Youth Academy').length
  )
  const numTransfersIn = computed(() =>
    transfers.value.filter(transfer => transfer.iconColor === 'green').length
  )
</script>

<template>
  <data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    :items-per-page="-1"
    sort-by="date"
    class="mt-2"
  >
    <template #item="{ item }">
      <td class="stick-left">
        <v-btn
          :to="`/teams/${team.id}/players/${item.playerId}`"
          size="small"
          variant="text"
          color="primary"
          class="text-capitalize"
          v-text="item.name"
        />
      </td>
      <td class="text-center">{{ item.pos }}</td>
      <td class="text-center">{{ formatDate(item.date) }}</td>
      <td class="text-center">
        <v-icon :color="item.iconColor" :icon="item.icon" />
      </td>
      <td>{{ item.fromTo }}</td>
      <td class="text-right">
        <span v-if="item.fee" :class="`text-${item.feeColor}`">
          {{ item.feeColor === 'green' ? '+' : '-' }}
          {{ formatMoney(item.fee, team.currency, ' ') }}
          <span v-if="item.addonClause">(+{{ item.addonClause }}%)</span>
        </span>
      </td>
    </template>
    <template #foot>
      <tfoot class="font-weight-bold">
        <tr v-if="rows.length">
          <td class="stick-left">
            <span class="pl-3">Summary</span>
          </td>
          <td colspan="3" />
          <td class="py-2">
            <div>
              {{ numYouthPlayers }}
              <v-icon size="small" color="cyan">mdi-school</v-icon>
              Youth Academy
            </div>
            <div>
              {{ arrivals.length - numYouthPlayers }}
              <v-icon size="small" color="blue">mdi-human-greeting</v-icon>
              Free Arrivals
            </div>
            <div>
              {{ numTransfersIn }}
              <v-icon size="small" color="green">mdi-airplane-landing</v-icon>
              Transfers (In)
            </div>
            <div>
              {{ transfers.length - numTransfersIn }}
              <v-icon size="small" color="red">mdi-airplane-takeoff</v-icon>
              Transfers (Out)
            </div>
            <div>
              {{ departures.length }}
              <v-icon size="small" color="purple">mdi-exit-run</v-icon>
              Departures
            </div>
          </td>
          <td :class="`text-right text-${total > 0 ? 'green' : 'red'}`">
            {{ total > 0 ? '+' : '-' }}
            {{ formatMoney(Math.abs(total), team.currency, ' ') }}
          </td>
        </tr>
      </tfoot>
    </template>
  </data-table>
</template>
