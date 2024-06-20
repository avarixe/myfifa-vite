<script setup lang="ts">
  import { Cap } from '~/models'

  const props = defineProps<{ caps: Cap[] }>()
  const caps = computed<Cap[]>(() => _orderBy(props.caps, 'posIdx'))
</script>

<template>
  <v-select :items="caps" item-title="player.name" item-value="id">
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <small class="text-disabled font-weight-bold mr-4">
            {{ item.raw.pos }}
          </small>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
