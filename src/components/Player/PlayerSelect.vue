<script setup lang="ts">
  defineProps({
    players: { type: Array, default: () => [] }
  })
</script>

<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="players"
    item-title="name"
    item-value="id"
  >
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #prepend>
          <small class="text-disabled font-weight-bold mr-4">{{
            item.raw.pos
          }}</small>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
