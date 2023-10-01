<script setup lang="ts">
  import { Cap } from '~/models'

  const props = defineProps<{ caps: Cap[] }>()
  const caps = computed(() => _orderBy(props.caps, 'posIdx') as Cap[])
</script>

<template>
  <v-autocomplete
    v-bind="$attrs"
    :items="caps"
    item-title="player.name"
    item-value="id"
  >
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <small class="text-disabled font-weight-bold mr-4">
            {{ item.raw.pos }}
          </small>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
