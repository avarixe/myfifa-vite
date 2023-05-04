<script setup lang="ts">
  import { Cap, Player } from '~/models'

  const props = withDefaults(
    defineProps<{
      caps: Cap[]
      reverseOrder?: boolean
    }>(),
    {
      caps: () => []
    }
  )

  const playerPositions = computed(() =>
    props.caps.reduce(
      (obj: object, cap) => ({
        ...obj,
        [cap.playerId]: cap.pos
      }),
      {}
    )
  )

  const playerRepo = useRepo(Player)
  const matchPositionList = Object.keys(matchPositions)
  const players = computed(() =>
    _orderBy(
      playerRepo
        .where(
          'id',
          props.caps.map(cap => cap.playerId)
        )
        .get(),
      player =>
        matchPositionList.indexOf(playerPositions.value[player.id]) *
        (props.reverseOrder ? -1 : 1)
    )
  )
</script>

<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="players"
    item-title="name"
    item-value="id"
  >
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <small class="text-disabled font-weight-bold mr-4">{{
            playerPositions[item.value]
          }}</small>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
