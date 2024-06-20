<script setup lang="ts">
  import { Player, Squad } from '~/models'

  const props = defineProps<{
    teamId?: number
    record?: Squad
  }>()

  const inEditMode = ref(!props.record)

  interface SquadPlayerAttributes {
    id?: number
    playerId: number | null
    pos: string | null
  }

  interface SquadAttributes {
    name?: string
    squadPlayersAttributes: SquadPlayerAttributes[]
  }

  const attributes = reactive<SquadAttributes>({
    name: props.record?.name,
    squadPlayersAttributes:
      props.record?.squadPlayers?.map(squadPlayer =>
        _pick(squadPlayer, ['id', 'playerId', 'pos'])
      ) || new Array(11).fill(0).map(() => ({ playerId: null, pos: null }))
  })

  const formationCells = computed<Record<string, { playerId: number }>>(() =>
    matchPositions.reduce((map, pos) => {
      return {
        ...map,
        [pos]: attributes.squadPlayersAttributes.find(attr => attr.pos === pos)
      }
    }, {})
  )

  function resetCard() {
    attributes.squadPlayersAttributes =
      props.record?.squadPlayers?.map(squadPlayer =>
        _pick(squadPlayer, ['id', 'playerId', 'pos'])
      ) || []
    selectedPlayerId.value = null
    inEditMode.value = false
  }

  const mutation = props.record
    ? gql`
        mutation ($id: ID!, $attributes: SquadAttributes!) {
          updateSquad(id: $id, attributes: $attributes) {
            squad {
              ...SquadData
            }
          }
        }
        ${squadFragment}
      `
    : gql`
        mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
          addSquad(teamId: $teamId, attributes: $attributes) {
            squad {
              ...SquadData
            }
          }
        }
        ${squadFragment}
      `
  function variables() {
    return props.record
      ? { id: props.record.id, attributes }
      : { teamId: props.teamId, attributes }
  }

  const emit = defineEmits(['created', 'click:remove'])
  const { submitForm } = useForm({
    mutation,
    variables,
    onSuccess(data: { squad: object }[]) {
      if (props.record) {
        selectedPlayerId.value = null
        inEditMode.value = false
      } else {
        const squad = Object.values(data)[0].squad
        useRepo(Squad).save(squad)
        emit('created')
      }
    }
  })

  const playerRepo = useRepo(Player)
  const players = computed<Player[]>(() =>
    _orderBy(
      playerRepo.where('status', (status: string | null) => !!status).get(),
      ['posIdx', 'ovr'],
      ['asc', 'desc']
    )
  )
  const unselectedPlayers = computed<Player[]>(() =>
    players.value.filter(player =>
      attributes.squadPlayersAttributes.every(
        attr => attr.playerId !== player.id
      )
    )
  )
  const inactivePlayerIds = computed(() =>
    players.value
      .filter(player => player.status !== 'Active')
      .map(player => player.id)
  )

  const selectedPlayerId = ref<number | null>(null)
  const selectedPlayer = computed(() =>
    playerRepo.find(Number(selectedPlayerId.value))
  )
  function selectPlayer(playerId: number) {
    if (inEditMode.value) {
      selectedPlayerId.value =
        selectedPlayerId.value === playerId ? null : playerId
    }
  }
  function selectPosition(pos: string) {
    if (inEditMode.value) {
      if (selectedPlayerId.value) {
        const cell = attributes.squadPlayersAttributes.find(
          attr => attr.pos === pos
        )
        const blankCell = attributes.squadPlayersAttributes.find(
          attr => attr.pos === null
        )
        const prevCell = attributes.squadPlayersAttributes.find(
          attr => attr.playerId === selectedPlayerId.value
        )

        if (cell) {
          cell.pos = pos
          if (prevCell) {
            prevCell.playerId = cell.playerId
          }
          cell.playerId = selectedPlayerId.value
          selectedPlayerId.value = null
        } else if (prevCell) {
          prevCell.pos = pos
          selectedPlayerId.value = null
        } else if (blankCell) {
          blankCell.pos = pos
          blankCell.playerId = selectedPlayerId.value
          selectedPlayerId.value = null
        }
      } else {
        const cell = attributes.squadPlayersAttributes.find(
          attr => attr.pos === pos
        )
        selectedPlayerId.value = cell?.playerId ?? null
      }
    }
  }

  const ovrData = computed(() =>
    attributes.squadPlayersAttributes.map(attr =>
      attr.pos && attr.playerId
        ? {
            type: matchPositionTypes[attr.pos],
            value: playerRepo.find(Number(attr.playerId))?.ovr || 0,
            weight: 1
          }
        : null
    )
  )

  const drawer = ref(false)
  watchEffect(() => {
    drawer.value = inEditMode.value
  })
</script>

<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="attributes.name"
        label="Name"
        density="compact"
        single-line
        hide-details
        :disabled="!inEditMode"
      />
    </v-card-title>
    <v-card-text>
      <formation-ovr :data="ovrData" />

      <v-row dense>
        <v-layout>
          <v-navigation-drawer v-if="inEditMode" v-model="drawer">
            <v-list density="compact">
              <v-list-item
                v-for="player in unselectedPlayers"
                :key="player.id"
                :subtitle="player.pos"
                :title="player.name"
                :disabled="inactivePlayerIds.includes(player.id)"
                :class="{
                  'bg-yellow-lighten-4':
                    selectedPlayerId && selectedPlayerId === player.id
                }"
                @click="selectPlayer(player.id)"
              />
            </v-list>
          </v-navigation-drawer>
          <v-main
            :class="{ editing: inEditMode, selecting: !!selectedPlayerId }"
          >
            <div class="d-flex d-lg-none justify-space-between mb-2">
              <v-btn v-if="inEditMode" variant="text" @click="drawer = true">
                <v-icon start>mdi-menu</v-icon>
                Available Players
              </v-btn>
              <div v-if="selectedPlayer" class="text-button text-disabled">
                Currently Selected: {{ selectedPlayer.name }}
              </div>
            </div>
            <formation-grid
              :cells="formationCells"
              :hide-empty-cells="!inEditMode"
            >
              <template #filled-pos="{ pos, cell }">
                <div
                  v-ripple
                  class="my-2 w-100 rounded pos-cell filled-pos"
                  :class="{
                    'bg-yellow-lighten-4':
                      selectedPlayerId && selectedPlayerId === cell.playerId,
                    'red--text': inactivePlayerIds.includes(cell.playerId)
                  }"
                  @click="selectPosition(pos)"
                >
                  <div class="font-weight-bold">{{ pos }}</div>
                  <div class="font-weight-light">
                    {{
                      players.find(player => player.id === cell.playerId)?.name
                    }}
                  </div>
                </div>
              </template>
              <template #empty-pos="{ pos }">
                <div
                  v-ripple
                  class="my-2 w-100 rounded pos-cell"
                  @click="selectPosition(pos)"
                >
                  <div class="font-weight-bold">{{ pos }}</div>
                  <div class="font-weight-light">-</div>
                </div>
              </template>
            </formation-grid>
          </v-main>
        </v-layout>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <template v-if="inEditMode">
        <v-btn icon="mdi-content-save" variant="text" @click="submitForm" />
        &nbsp;
        <v-btn
          v-if="!!props.record"
          icon="mdi-close"
          variant="text"
          @click="resetCard"
        />
        <v-btn
          v-else
          icon="mdi-delete"
          variant="text"
          @click="emit('click:remove')"
        />
      </template>
      <template v-else>
        <v-btn icon="mdi-pencil" variant="text" @click="inEditMode = true" />
        &nbsp;
        <remove-button
          v-if="!!props.record"
          :record="props.record"
          store="Squad"
          label="Squad"
          icon="mdi-delete"
        />
      </template>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
  .editing .filled-pos,
  .selecting .pos-cell {
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      box-shadow:
        0px 2px 1px -1px rgb(0 0 0 / 20%),
        0px 1px 1px 0px rgb(0 0 0 / 14%),
        0px 1px 3px 0px rgb(0 0 0 / 12%);
    }
  }
</style>
