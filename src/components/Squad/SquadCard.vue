<script setup>
  import { Player, Squad } from '~/models'

  const { team } = useTeam()

  const props = defineProps({
    teamId: { type: Number, default: null },
    record: { type: Object, default: null }
  })

  const inEditMode = ref(!props.record)

  const attributes = reactive({
    name: props.record?.name,
    squadPlayersAttributes: props.record?.squadPlayers?.map(squadPlayer =>
      pick(squadPlayer, ['id', 'playerId', 'pos'])
    ) || new Array(11).fill().map(() => ({ playerId: null, pos: null }))
  })

  const formationCells = computed(() =>
    Object.keys(matchPositions).reduce((map, pos) => {
      return {
        ...map,
        [pos]: attributes.squadPlayersAttributes.find(attr => attr.pos === pos)
      }
    }, {})
  )

  function resetCard () {
    attributes.squadPlayersAttributes = props.record?.squadPlayers?.map(
      squadPlayer => pick(squadPlayer, ['id', 'playerId', 'pos'])
    )
    selectedPlayerId.value = null
    inEditMode.value = false
  }

  const { executeMutation: createSquad } = useMutation(gql`
    mutation createSquad($teamId: ID!, $attributes: SquadAttributes!) {
      addSquad(teamId: $teamId, attributes: $attributes) {
        squad { ...SquadData }
        errors { fullMessages }
      }
    }
    ${squadFragment}
  `)

  const { executeMutation: updateSquad } = useMutation(gql`
    mutation ($id: ID!, $attributes: SquadAttributes!) {
      updateSquad(id: $id, attributes: $attributes) {
        squad { ...SquadData }
        errors { fullMessages }
      }
    }
    ${squadFragment}
  `)

  const emit = defineEmits(['created', 'click:remove'])
  async function onSubmit () {
    if (props.record) {
      const { data: { updateSquad: { errors, squad} } } =
        await updateSquad({ id: props.record.id, attributes })
      if (squad) {
        selectedPlayerId.value = null
        inEditMode.value = false
      } else {
        alert(errors.fullMessages[0])
      }
    } else {
      const { data: { addSquad: { errors, squad } } } =
        await createSquad({ teamId: props.teamId, attributes })
      if (squad) {
        useRepo(Squad).save(squad)
        emit('created')
      } else {
        alert(errors.fullMessages[0])
      }
    }
  }

  const playerRepo = useRepo(Player)
  const players = computed(() =>
    orderBy(
      playerRepo.where('status', status => !!status).get(),
      ['posIdx', 'ovr'],
      ['asc', 'desc']
    )
  )
  const unselectedPlayers = computed(() =>
    players.value.filter(player =>
      attributes.squadPlayersAttributes.every(attr => attr.playerId !== player.id)
    )
  )
  const inactivePlayerIds = computed(() =>
    players.value.filter(player => player.status !== 'Active').map(player => player.id)
  )

  const selectedPlayerId = ref(null)
  function selectPlayer (playerId) {
    if (inEditMode.value) {
      selectedPlayerId.value = selectedPlayerId.value === playerId
        ? null
        : playerId
    }
  }
  function selectPosition (pos) {
    if (inEditMode.value) {
      if (selectedPlayerId.value) {
        const cell = attributes.squadPlayersAttributes.find(attr => attr.pos === pos)
        const blankCell = attributes.squadPlayersAttributes.find(attr => attr.pos === null)
        const prevCell = attributes.squadPlayersAttributes.find(attr =>
          attr.playerId === selectedPlayerId.value
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
        const cell = attributes.squadPlayersAttributes.find(attr => attr.pos === pos)
        selectedPlayerId.value = cell?.playerId
      }
    }
  }
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
      <v-row dense>
        <v-layout>
          <v-navigation-drawer
            v-if="inEditMode"
            permanent
          >
            <v-list density="compact">
              <v-list-item
                v-for="player in unselectedPlayers"
                :key="player.id"
                :subtitle="player.pos"
                :title="player.name"
                :disabled="inactivePlayerIds.includes(player.id)"
                :class="{ 'bg-yellow-lighten-4': selectedPlayerId && selectedPlayerId === player.id }"
                @click="selectPlayer(player.id)"
              />
            </v-list>
          </v-navigation-drawer>
          <v-main :class="{ editing: inEditMode, selecting: !!selectedPlayerId }">
            <formation-grid
              :cells="formationCells"
              :hide-empty-cells="!inEditMode"
            >
              <template #filled-pos="{ pos, cell }">
                <div
                  v-ripple
                  class="my-2 w-100 rounded pos-cell filled-pos"
                  :class="{
                    'bg-yellow-lighten-4': selectedPlayerId && selectedPlayerId === cell.playerId,
                    'red--text': inactivePlayerIds.includes(cell.playerId)
                  }"
                  @click="selectPosition(pos)"
                >
                  <div class="font-weight-bold">{{ pos }}</div>
                  <div class="font-weight-light">
                    {{ players.find(player => player.id === cell.playerId)?.name }}
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
        <v-btn
          icon="mdi-content-save"
          variant="text"
          @click="onSubmit"
        />
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
        <v-btn
          icon="mdi-pencil"
          variant="text"
          @click="inEditMode = true"
        />
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
      box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
                  0px 1px 1px 0px rgb(0 0 0 / 14%),
                  0px 1px 3px 0px rgb(0 0 0 / 12%);
    }
  }
</style>
