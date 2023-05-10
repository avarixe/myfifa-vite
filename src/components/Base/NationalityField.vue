<template>
  <v-autocomplete v-bind="$attrs" :items="Object.keys(nationalities)">
    <template #selection="{ item }">
      <flag :iso="nationalities[item.raw]" class="mt-1 mr-2" />
      <span class="text-body-1">{{ item.raw }}</span>
    </template>
    <template #item="{ item, props: itemProps }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <flag :iso="nationalities[item.raw]" class="mr-2" />
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>
