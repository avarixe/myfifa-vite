<script setup lang="ts">
  import { isDate } from 'date-fns'

  useHead({
    script: [
      {
        src: 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js'
      }
    ]
  })

  await useTeamQuery({
    query: gql`
      query fetchPlayersImportPage($teamId: ID!) {
        team(id: $teamId) {
          ...TeamData
        }
      }
      ${teamFragment}
    `
  })
  const { team, endOfCurrentSeason } = useTeam()

  interface PlayerAttributes {
    name: string | null
    nationality: string | null
    pos: string | null
    secPos: string[]
    age: number | null
    ovr: number | null
    value: number | null
    kitNo: number | null
  }

  interface ContractAttributes {
    signedOn: string | null
    startedOn: string | null
    endedOn: string | null
    wage: number | null
    signingBonus: number | null
    releaseClause: number | null
    performanceBonus: number | null
    bonusReq: number | null
    bonusReqType: string | null
  }

  interface PlayerRow extends PlayerAttributes {
    rowId: number
    contractsAttributes: ContractAttributes[]
  }

  const numPlayers = ref(0)
  const submitted = ref(0)
  const cleared = ref(0)
  const players = ref([] as PlayerRow[])

  function addPlayer() {
    players.value.push({
      rowId: numPlayers.value++,
      name: '',
      pos: '',
      nationality: null,
      secPos: [],
      ovr: null,
      value: 0,
      kitNo: null,
      age: null,
      contractsAttributes: [
        {
          signedOn: team.value.currentlyOn,
          startedOn: team.value.currentlyOn,
          endedOn: endOfCurrentSeason.value,
          wage: null,
          releaseClause: null,
          signingBonus: null,
          performanceBonus: null,
          bonusReq: null,
          bonusReqType: null
        }
      ]
    })
  }

  function removePlayer(row: PlayerRow) {
    players.value = players.value.filter(player => player.rowId !== row.rowId)
  }

  const uploader = ref(null as HTMLInputElement | null)
  function upload(event: Event) {
    const reader = new FileReader()
    reader.onload = e => {
      // Parse data
      const bstr = e.target?.result
      const wb = window.XLSX.read(bstr, { type: 'binary', cellDates: true })
      // Get first worksheet
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      // Convert array of arrays
      const data = window.XLSX.utils.sheet_to_json(ws)
      // Update state
      data.forEach((player: { [key: string]: string | number | Date | null }) =>
        importPlayer(player)
      )
    }

    if (event.target) {
      const files = (event.target as HTMLInputElement).files

      if (files && files.length > 0) {
        reader.readAsBinaryString(files[0])
      }
    }

    if (uploader.value) {
      uploader.value.value = ''
    }
  }

  function importPlayer(player: {
    [key: string]: string | number | Date | null
  }) {
    players.value.push({
      rowId: numPlayers.value++,
      name: player['Name'] ? String(player['Name']) : null,
      pos: player['Position'] ? String(player['Position']) : null,
      nationality: player['Nationality'] ? String(player['Nationality']) : null,
      secPos: player['Secondary Position(s)']
        ? String(player['Secondary Position(s)']).split(',')
        : [],
      ovr: player['OVR'] ? Number(player['OVR']) : null,
      value: player['Value'] ? Number(player['Value']) : null,
      kitNo: player['Kit Number'] ? Number(player['Kit Number']) : null,
      age: player['Age'] ? Number(player['Age']) : null,
      contractsAttributes: [
        {
          signedOn: team.value.currentlyOn,
          startedOn: team.value.currentlyOn,
          endedOn: isDate(player['Contract Ends'])
            ? format(player['Contract Ends'] as Date, 'yyyy-MM-dd')
            : null,
          wage: player['Wage'] ? Number(player['Wage']) : null,
          releaseClause: player['Release Clause']
            ? Number(player['Release Clause'])
            : null,
          signingBonus: player['Signing Bonus']
            ? Number(player['Signing Bonus'])
            : null,
          performanceBonus: player['Performance Bonus']
            ? Number(player['Performance Bonus'])
            : null,
          bonusReq: player['Bonus Req'] ? Number(player['Bonus Req']) : null,
          bonusReqType: player['Bonus Req. Type']
            ? String(player['Bonus Req. Type'])
            : null
        }
      ]
    })
  }
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn class="ma-1" @click="addPlayer">
          <v-icon start>mdi-plus</v-icon>
          Row
        </v-btn>
        <input
          ref="uploader"
          type="file"
          accept=".xlsx"
          class="d-none"
          @input="upload"
        />
        <v-btn
          class="ma-1"
          href="/import_players_template.xlsx"
          target="_blank"
        >
          Download Template
        </v-btn>
        <v-btn class="ma-1" @click="uploader?.click()">Upload File</v-btn>
      </v-col>
      <v-col cols="12">
        <v-form ref="form" @submit.prevent="submitted++">
          <v-card>
            <v-card-text>
              <v-table fixed-header height="50vh">
                <thead>
                  <tr>
                    <th class="sticky text-center" :style="{ zIndex: 2 }">
                      <v-sheet class="mx-n4 px-4">
                        <v-icon>mdi-list-status</v-icon>
                      </v-sheet>
                    </th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Position</th>
                    <th>Secondary Position(s)</th>
                    <th>Age</th>
                    <th>OVR</th>
                    <th>Value</th>
                    <th>Kit Number</th>
                    <th>Contract Ends</th>
                    <th>Wage</th>
                    <th>Signing Bonus</th>
                    <th>Release Clause</th>
                    <th colspan="3">Performance Bonus</th>
                  </tr>
                </thead>
                <tbody>
                  <player-import-row
                    v-for="player in players"
                    :key="player.rowId"
                    :player="player"
                    :submitted="submitted"
                    :cleared="cleared"
                    @remove="removePlayer(player)"
                  />
                </tbody>
              </v-table>
            </v-card-text>
            <v-card-actions>
              <v-btn
                type="submit"
                :disabled="players.length === 0"
                color="primary"
              >
                Submit
              </v-btn>
              <v-btn :disabled="cleared >= submitted" @click="cleared++">
                Clear Saved Players
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
