<script setup lang="ts">
  import { addYears } from 'date-fns'
  import { Player, Contract, Transfer, Loan } from '~/models'

  const props = defineProps<{
    transferActivity: {
      arrivals: Contract[]
      departures: Contract[]
      transfers: Transfer[]
      loans: Loan[]
    }
    playerValues: { [key: number]: number[] }
    season: number
  }>()

  const { team } = useTeam()

  const playerRepo = useRepo(Player)

  interface TransferTableRow {
    id: string
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
        const player = playerRepo.find(Number(arrival.playerId)) as Player

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
      const player = playerRepo.find(Number(departure.playerId)) as Player

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
      const player = playerRepo.find(Number(transfer.playerId)) as Player
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
        fee: (transferOut ? 1 : -1) * (transfer.fee ?? 0),
        value: transferOut ? -playerValues[1] : playerValues[0],
        netValue: transferOut
          ? (transfer.fee ?? 0) - playerValues[1]
          : playerValues[0] - (transfer.fee ?? 0)
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
  const loans = computed(() =>
    props.transferActivity.loans.reduce((rows: TransferTableRow[], loan) => {
      const player = playerRepo.find(Number(loan.playerId)) as Player
      const loanOut = team.value.name === loan.origin
      const row: TransferTableRow = {
        ..._pick(player, ['name', 'pos']),
        posIdx: player.posIdx,
        playerId: loan.playerId,
        fromTo: loanOut ? loan.destination : loan.origin
      }
      if (loan.startedOn >= seasonStart.value) {
        rows.push({
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
        rows.push({
          ...row,
          id: `loan-end-${loan.id}`,
          date: loan.endedOn,
          icon: `mdi-account-arrow-${loanOut ? 'left' : 'right'}`,
          iconColor: `${loanOut ? 'light-green' : 'orange'}`
        })
      }
      return rows
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

  interface TotalStats {
    value: number
    fee: number
    netValue: number
  }

  const totals = computed(
    () =>
      rows.value.reduce(
        (totals, row) => {
          ;['value', 'fee', 'netValue'].forEach(attr => {
            const key = attr as keyof TotalStats
            if (row[key]) {
              totals[key] += row[key]
            }
          })
          return totals
        },
        { value: 0, fee: 0, netValue: 0 }
      ) as TotalStats
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

  const headers: TableHeader[] = [
    { title: 'Player', key: 'name', fixed: true },
    { title: 'Pos', key: 'pos', align: 'center' },
    { title: 'Date', key: 'date', align: 'center', width: 140 },
    { title: '', key: 'icon', align: 'center', sortable: false, width: 40 },
    { title: 'From/To', key: 'fromTo', width: 170 },
    { title: 'Value', key: 'value', align: 'end', width: 150 },
    { title: 'Fee', key: 'fee', align: 'end', width: 150 },
    { title: 'Net Value', key: 'netValue', align: 'end', width: 150 }
  ]
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="rows"
    :custom-key-sort="{ pos: sortByPosition }"
    :sort-by="[{ key: 'date', order: 'asc' }]"
    :items-per-page="-1"
    density="compact"
    class="rounded mt-2"
  >
    <template #[`item.name`]="{ item }">
      <v-btn
        :to="`/teams/${team.id}/players/${item.raw.playerId}`"
        :text="item.raw.name"
        size="small"
        variant="text"
        color="primary"
        class="text-capitalize"
      />
    </template>
    <template #[`item.date`]="{ item }">
      {{ formatDate(item.raw.date) }}
    </template>
    <template #[`item.icon`]="{ item }">
      <v-icon :color="item.raw.iconColor" :icon="item.raw.icon" />
    </template>
    <template #[`item.value`]="{ item }">
      <div :class="`text-${item.raw.value > 0 ? 'green' : 'red'}`">
        <span v-if="item.raw.value">{{ item.raw.value > 0 ? '+' : '-' }}</span>
        {{ formatMoney(Math.abs(item.raw.value), team.currency, ' ') }}
      </div>
    </template>
    <template #[`item.fee`]="{ item }">
      <div
        v-if="item.raw.fee"
        :class="`text-${item.raw.fee > 0 ? 'green' : 'red'}`"
      >
        {{ item.raw.fee > 0 ? '+' : '-' }}
        {{ formatMoney(Math.abs(item.raw.fee), team.currency, ' ') }}
        <span v-if="item.raw.addonClause">(+{{ item.raw.addonClause }}%)</span>
      </div>
    </template>
    <template #[`item.netValue`]="{ item }">
      <div :class="`text-${item.raw.netValue > 0 ? 'green' : 'red'}`">
        <span v-if="item.raw.netValue">{{
          item.raw.netValue > 0 ? '+' : '-'
        }}</span>
        {{ formatMoney(Math.abs(item.raw.netValue), team.currency, ' ') }}
      </div>
    </template>
    <template #tfoot>
      <tfoot class="font-weight-bold">
        <tr v-if="rows.length">
          <td
            class="v-data-table-column--fixed v-data-table-column--last-fixed"
            :style="{ background: 'rgb(var(--v-theme-surface))' }"
          >
            <span class="pl-3">Summary</span>
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
            v-for="attr in (['value', 'fee', 'netValue'] as (keyof TotalStats)[])"
            :key="attr"
            :class="`text-right text-${totals[attr] > 0 ? 'green' : 'red'}`"
          >
            {{ totals[attr] > 0 ? '+' : '-' }}
            {{ formatMoney(Math.abs(totals[attr]), team.currency, ' ') }}
          </td>
        </tr>
      </tfoot>
    </template>
    <template #bottom />
  </v-data-table>
</template>
