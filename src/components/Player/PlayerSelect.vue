<script setup lang="ts">
  interface PlayerItem {
    pos: string
  }

  withDefaults(defineProps<{ players: PlayerItem[] }>(), {
    players: () => []
  })
</script>

<template>
  <v-select v-bind="$attrs" :items="players" item-title="name" item-value="id">
    <template #item="{ item, props }: { item: { raw: PlayerItem }; props: {} }">
      <v-list-item v-bind="props">
        <template #prepend>
          <small class="text-disabled font-weight-bold mr-4">
            {{ item.raw.pos }}
          </small>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
