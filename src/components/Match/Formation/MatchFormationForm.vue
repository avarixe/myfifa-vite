<script setup lang="ts">
  import { Match, Player } from '~/models'

  const props = defineProps<{
    match: Match
  }>()

  interface MatchFormationCell {
    id: number | null
    playerId: number | null
    pos: string | null
  }

  const { minute, activeCaps } = useMatchState(toRef(() => props.match))

  const attributes = ref([] as MatchFormationCell[])
  watch(
    minute,
    () => {
      attributes.value = activeCaps.value.map(cap => ({
        id: cap.id,
        playerId: cap.playerId,
        pos: cap.pos
      }))
    },
    { immediate: true }
  )

  const formationCells = computed(
    () =>
      matchPositions.reduce((map, pos) => {
        return {
          ...map,
          [pos]: attributes.value.find(attr => attr.pos === pos)
        }
      }, {}) as Record<string, MatchFormationCell | undefined>
  )

  const mutation = gql`
    mutation ($id: ID!, $minute: Int!, $formation: [SquadPlayerAttributes!]!) {
      updateMatchFormation(id: $id, minute: $minute, formation: $formation) {
        match {
          caps {
            ...CapData
          }
        }
      }
    }
    ${capFragment}
  `
  function variables() {
    return {
      id: props.match.id,
      minute: minute.value,
      formation: attributes.value
    }
  }

  const playerRepo = useRepo(Player)
  const players = computed(
    () =>
      _orderBy(
        playerRepo.where('status', (status: string | null) => !!status).get(),
        ['posIdx', 'ovr'],
        ['asc', 'desc']
      ) as Player[]
  )
  const unselectedPlayers = computed(
    () =>
      players.value.filter(player =>
        attributes.value.every(attr => attr.playerId !== player.id)
      ) as Player[]
  )
  const inactivePlayerIds = computed(() =>
    players.value
      .filter(player => player.status !== 'Active')
      .map(player => player.id)
  )

  const selectedPlayerId = ref(null as number | null)
  const selectedPlayer = computed(() =>
    playerRepo.find(Number(selectedPlayerId.value))
  )
  function selectPlayer(playerId: number) {
    selectedPlayerId.value =
      selectedPlayerId.value === playerId ? null : playerId
  }
  function selectPosition(pos: string) {
    if (selectedPlayerId.value) {
      const cell = attributes.value.find(attr => attr.pos === pos)
      const blankCell = attributes.value.find(attr => attr.pos === null)
      const prevCell = attributes.value.find(
        attr => attr.playerId === selectedPlayerId.value
      )

      if (cell) {
        if (prevCell) {
          const prevPos = prevCell.pos
          prevCell.pos = cell.pos
          cell.pos = prevPos
        } else {
          cell.playerId = selectedPlayerId.value
        }
      } else if (prevCell) {
        prevCell.pos = pos
      } else if (blankCell) {
        blankCell.pos = pos
        blankCell.playerId = selectedPlayerId.value
      }
      selectedPlayerId.value = null
    } else {
      const cell = attributes.value.find(attr => attr.pos === pos)
      selectedPlayerId.value = cell?.playerId ?? null
    }
  }

  function getPlayer(playerId: number) {
    return playerRepo.find(playerId)
  }

  const drawer = ref(true)
  const dialog = ref(false)
  function onOpen() {
    dialog.value = false
    minute.value = null
  }
</script>

<template>
  <dialog-form
    title="Formation Change"
    :mutation="mutation"
    :variables="variables"
    max-width="100%"
    @open="onOpen"
  >
    <v-col cols="12">
      <minute-field v-model="minute" :match="match" />
    </v-col>
    <v-layout>
      <v-navigation-drawer v-model="drawer">
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
      <v-main :class="{ editing: true, selecting: !!selectedPlayerId }">
        <div class="d-flex d-lg-none justify-space-between mb-2">
          <v-btn variant="text" @click="drawer = true">
            <v-icon start>mdi-menu</v-icon>
            Available Players
          </v-btn>
          <div v-if="selectedPlayer" class="text-button text-disabled">
            Currently Selected: {{ selectedPlayer.name }}
          </div>
        </div>
        <formation-grid :cells="formationCells">
          <template #filled-pos="{ pos, cell }">
            <div
              v-ripple
              class="my-2 w-100 rounded pos-cell filled-pos"
              :class="{
                'bg-yellow-lighten-4':
                  selectedPlayerId && selectedPlayerId === cell?.playerId,
                'red--text': inactivePlayerIds.includes(cell?.playerId || 0)
              }"
              @click="selectPosition(pos)"
            >
              <div class="font-weight-bold">{{ pos }}</div>
              <div class="font-weight-light">
                {{ players.find(player => player.id === cell?.playerId)?.name }}
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
    <template #submit-action="{ disabled, loading, submitForm }">
      <v-btn :disabled="disabled" color="primary" size="large">
        Confirm and Save
        <v-dialog v-model="dialog" activator="parent" max-width="500px">
          <v-card>
            <v-card-title>Confirm Formation Change?</v-card-title>
            <v-card-text class="text-center">
              <div class="text-h4">{{ minute }}'</div>

              <div v-for="(cell, i) in attributes" :key="i">
                <div v-if="activeCaps[i].playerId !== cell.playerId">
                  <v-icon
                    color="red"
                    size="small"
                    start
                    icon="mdi-subdirectory-arrow-left"
                  />
                  {{ getPlayer(activeCaps[i].playerId)?.name }}
                  <b class="ml-2">{{ activeCaps[i].pos }}</b>
                  <v-icon
                    color="green"
                    size="small"
                    end
                    icon="mdi-subdirectory-arrow-right"
                  />
                  {{ getPlayer(Number(cell.playerId))?.name }}
                  <b class="ml-2">{{ cell.pos }}</b>
                </div>
                <div v-else-if="activeCaps[i].pos !== cell.pos">
                  <v-icon
                    color="orange"
                    size="small"
                    start
                    icon="mdi-vector-polyline"
                  />
                  {{ getPlayer(Number(cell.playerId))?.name }}
                  <b class="ml-2">{{ activeCaps[i].pos }}</b>
                  <v-icon size="small" icon="mdi-arrow-right-thin" />
                  <b>{{ cell.pos }}</b>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text="No" size="large" @click="dialog = false" />
              <v-btn
                text="Yes"
                :loading="loading"
                color="primary"
                size="large"
                @click="submitForm"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
    </template>
  </dialog-form>
</template>

<style scoped lang="scss">
  .pos-cell {
    font-size: 12px;
  }

  .filled-pos,
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
