<script setup>
  const props = defineProps({
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
          {{ item.pos }}
        </template>

        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
