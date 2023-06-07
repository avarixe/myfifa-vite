<script setup lang="ts">
  import { read, utils } from 'xlsx'

  defineProps<{ teamId: string }>()

  useTeamQuery({
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

  const numPlayers = ref(0)
  const submitted = ref(0)
  const cleared = ref(0)
  const players = ref([])

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

  function removePlayer(row) {
    players.value = players.value.filter(player => player.rowId !== row.rowId)
  }

  const uploader = ref(null)
  function upload(event) {
    const reader = new FileReader()
    reader.onload = e => {
      // Parse data
      const bstr = e.target.result
      const wb = read(bstr, { type: 'binary', cellDates: true })
      // Get first worksheet
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      // Convert array of arrays
      const data = utils.sheet_to_json(ws)
      // Update state
      data.forEach(player => importPlayer(player))
    }

    const files = event.target.files

    if (files?.length > 0) {
      reader.readAsBinaryString(files[0])
    }

    uploader.value.value = null
  }

  function importPlayer(player) {
    players.value.push({
      rowId: numPlayers.value++,
      name: player['Name'],
      pos: player['Position'],
      nationality: player['Nationality'],
      secPos: player['Secondary Position(s)']?.split(','),
      ovr: player['OVR'],
      value: player['Value'],
      kitNo: player['Kit Number'],
      age: player['Age'],
      contractsAttributes: [
        {
          signedOn: team.value.currentlyOn,
          startedOn: team.value.currentlyOn,
          endedOn: player['Contract Ends']
            ? format(player['Contract Ends'], 'yyyy-MM-dd')
            : null,
          wage: player['Wage'],
          releaseClause: player['Release Clause'],
          signingBonus: player['Signing Bonus'],
          performanceBonus: player['Performance Bonus'],
          bonusReq: player['Bonus Req'],
          bonusReqType: player['Bonus Req. Type']
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
        <v-btn class="ma-1" @click="uploader.click()">Upload File</v-btn>
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
