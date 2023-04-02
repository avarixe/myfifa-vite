<script setup lang="ts">
  import { addYears } from 'date-fns'

  const props = defineProps({
    transferActivity: { type: Object, required: true },
    playerValues: { type: Object, required: true },
    season: { type: Number, required: true }
  })

  const { team } = useTeam()

  const playerRepo = useRepo(Player)

  interface TransferTableRow {
    playerId: number
    name: string
    pos: string
    date: string
    iconColor: string
    icon: string
    fromTo: string
    value: number
    fee: number
    netValue: number
    addonClause: number
  }

  const arrivals: Ref<TransferTableRow[]> = computed(() =>
    props.transferActivity.arrivals
      .filter(arrival => {
        return (
          !transfers.value.some(transfer => {
            return (
              transfer.playerId === arrival.playerId &&
              transfer.date === arrival.startedOn &&
              transfer.iconColor === 'green'
            )
          }) &&
          !loans.value.some(loan => {
            return (
              loan.playerId === arrival.playerId &&
              loan.date === arrival.startedOn &&
              loan.iconColor === 'light-green'
            )
          }) &&
          arrival.startedOn !== team.value.startedOn
        )
      })
      .map((arrival, i) => {
        const player = playerRepo.find(parseInt(arrival.playerId))

        return {
          ..._pick(player, ['name', 'pos']),
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

  const departures: Ref<TransferTableRow[]> = computed(() =>
    props.transferActivity.departures.map((departure, i) => {
      const player = playerRepo.find(parseInt(departure.playerId))

      return {
        ..._pick(player, ['name', 'pos']),
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

  const transfers: Ref<TransferTableRow[]> = computed(() =>
    props.transferActivity.transfers.map((transfer, i) => {
      const player = playerRepo.find(parseInt(transfer.playerId))
      const playerValues =
        props.playerValues[transfer.playerId] || Array(2).fill(player.value)
      const transferOut = team.value.name === transfer.origin

      return {
        ..._pick(player, ['name', 'pos']),
        ..._pick(transfer, ['playerId', 'addonClause']),
        id: `transfer-${i}`,
        date: transfer.movedOn,
        icon: `mdi-airplane-${transferOut ? 'takeoff' : 'landing'}`,
        iconColor: transferOut ? 'red' : 'green',
        posIdx: player.posIdx,
        fromTo: transferOut ? transfer.destination : transfer.origin,
        fee: (transferOut ? 1 : -1) * transfer.fee,
        value: transferOut ? -playerValues[1] : playerValues[0],
        netValue: transferOut
          ? transfer.fee - playerValues[1]
          : playerValues[0] - transfer.fee
      }
    })
  )

  const seasonStart: Ref<string> = computed(() => {
    const date = parseISO(team.value.startedOn)
    return format(addYears(date, props.season), 'yyyy-MM-dd')
  })
  const seasonEnd: Ref<string> = computed(() => {
    const date = parseISO(seasonStart.value)
    return format(addYears(date, 1), 'yyyy-MM-dd')
  })
  const loans: Ref<TransferTableRow[]> = computed(() =>
    props.transferActivity.loans.reduce((loans, loan) => {
      const player = playerRepo.find(parseInt(loan.playerId))
      const loanOut = team.value.name === loan.origin
      const row = {
        ..._pick(player, ['name', 'pos']),
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
      if (
        loan.endedOn <= seasonEnd.value &&
        !transfers.value.some(
          transfer =>
            transfer.playerId === loan.playerId &&
            transfer.date === loan.endedOn
        )
      ) {
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

  const rows: Ref<TransferTableRow[]> = computed(() =>
    [
      ...arrivals.value,
      ...departures.value,
      ...transfers.value,
      ...loans.value
    ].sort(
      (a, b) =>
        parseInt(a.date.replace(/-/g, '')) - parseInt(b.date.replace(/-/g, ''))
    )
  )

  const totals = computed(() =>
    rows.value.reduce(
      (totals, row) => {
        ;['value', 'fee', 'netValue'].forEach(attr => {
          if (row[attr]) {
            totals[attr] += row[attr]
          }
        })
        return totals
      },
      { value: 0, fee: 0, netValue: 0 }
    )
  )

  const numYouthPlayers: Ref<number> = computed(
    () =>
      arrivals.value.filter(arrival => arrival.fromTo === 'Youth Academy')
        .length
  )
  const numTransfersIn: Ref<number> = computed(
    () =>
      transfers.value.filter(transfer => transfer.iconColor === 'green').length
  )

  const headers = [
    { text: 'Player', value: 'name', class: 'sticky', width: 200 },
    {
      text: 'Pos',
      value: 'pos',
      class: 'text-center',
      sortBy: 'posIdx',
      width: 100
    },
    { text: 'Date', value: 'date', class: 'text-center', width: 120 },
    {
      text: '',
      value: 'icon',
      class: 'text-center',
      sortable: false,
      width: 40
    },
    { text: 'From/To', value: 'fromTo', width: 170 },
    { text: 'Value', value: 'value', class: 'text-right', width: 150 },
    { text: 'Fee', value: 'fee', class: 'text-right', width: 150 },
    { text: 'Net Value', value: 'netValue', class: 'text-right', width: 150 }
  ]
</script>

<template>
  <data-table
    :headers="headers"
    :items="rows"
    item-key="id"
    :items-per-page="-1"
    :show-pagination-options="false"
    sort-by="date"
    class="mt-2"
  >
    <template #item="{ item }: { item: TransferTableRow }">
      <td class="sticky">
        <v-sheet class="mx-n4 px-4 my-n2 py-2">
          <v-btn
            :to="`/teams/${team.id}/players/${item.playerId}`"
            size="small"
            variant="text"
            color="primary"
            class="text-capitalize"
          >
            {{ item.name }}
          </v-btn>
        </v-sheet>
      </td>
      <td class="text-center">{{ item.pos }}</td>
      <td class="text-center">{{ formatDate(item.date) }}</td>
      <td class="text-center">
        <v-icon :color="item.iconColor" :icon="item.icon" />
      </td>
      <td>{{ item.fromTo }}</td>
      <td
        class="text-right"
        :class="`text-${item.value > 0 ? 'green' : 'red'}`"
      >
        <span v-if="item.value">{{ item.value > 0 ? '+' : '-' }}</span>
        {{ formatMoney(Math.abs(item.value), team.currency, ' ') }}
      </td>
      <td class="text-right">
        <span v-if="item.fee" :class="`text-${item.fee > 0 ? 'green' : 'red'}`">
          {{ item.fee > 0 ? '+' : '-' }}
          {{ formatMoney(Math.abs(item.fee), team.currency, ' ') }}
          <span v-if="item.addonClause">(+{{ item.addonClause }}%)</span>
        </span>
      </td>
      <td
        class="text-right"
        :class="`text-${item.netValue > 0 ? 'green' : 'red'}`"
      >
        <span v-if="item.netValue">{{ item.netValue > 0 ? '+' : '-' }}</span>
        {{ formatMoney(Math.abs(item.netValue), team.currency, ' ') }}
      </td>
    </template>
    <template #tfoot>
      <tfoot class="font-weight-bold">
        <tr v-if="rows.length">
          <td class="sticky">
            <v-sheet class="mx-n4 px-4 my-n2 py-2">
              <span class="pl-3">Summary</span>
            </v-sheet>
          </td>
          <td colspan="2" />
          <td colspan="2" class="py-2">
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
          <td
            v-for="attr in ['value', 'fee', 'netValue']"
            :key="attr"
            :class="`text-right text-${totals[attr] > 0 ? 'green' : 'red'}`"
          >
            {{ totals[attr] > 0 ? '+' : '-' }}
            {{ formatMoney(Math.abs(totals[attr]), team.currency, ' ') }}
          </td>
        </tr>
      </tfoot>
    </template>
  </data-table>
</template>
