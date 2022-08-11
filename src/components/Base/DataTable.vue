<script setup>
  const props = defineProps({
    headers: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageOptions: { type: Array, default: () => [10, 20, 50, -1] }
  })

  const page = ref(0)
  const itemsPerPage = ref(props.itemsPerPage)
  const showAll = computed(() => itemsPerPage.value <= 0)
  const lastPage = computed(() =>
    showAll.value ? 0 : Math.ceil(props.items.length / itemsPerPage.value) - 1
  )
  const firstItemIndex = computed(() =>
    showAll.value ? 1 : (page.value * itemsPerPage.value) + 1
  )
  const lastItemIndex = computed(() => {
    if (showAll.value) {
      return props.items.length
    } else {
      const index = firstItemIndex.value + itemsPerPage.value - 1
      return index > props.items.length ? props.items.length : index
    }
  })
  const pageItems = computed(() =>
    props.items.slice(firstItemIndex.value - 1, lastItemIndex.value)
  )
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <slot name="headers">
          <th
            v-for="header in headers"
            :key="header.value"
            :class="header.class"
            :style="header.style"
          >
            <slot :name="`header-${header.value}`" :header="header">
              {{ header.text }}
            </slot>
          </th>
        </slot>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, i) in pageItems" :key="i">
        <slot name="item" :item="item">
          <td
            v-for="(header, j) in headers"
            :key="j"
            :class="header.cellClass"
            :style="header.cellStyle"
          >
            <slot :name="`item-${header.value}`" :item="item">
              {{ item[header.value] }}
            </slot>
          </td>
        </slot>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="py-1" :colspan="headers.length">
          <div class="d-flex align-center">
            <v-btn
              round
              variant="text"
              append-icon="mdi-menu-down"
              class="border-b"
            >
              {{ showAll ? 'All' : itemsPerPage }}
              <v-menu activator="parent">
                <v-list dense>
                  <v-list-item
                    v-for="option in itemsPerPageOptions"
                    :key="option"
                    :title="option > 0 ? option : 'All'"
                    @click="itemsPerPage = option"
                  />
                </v-list>
              </v-menu>
            </v-btn>
            <span class="text-caption">
              {{ firstItemIndex }} - {{ lastItemIndex }} of {{ props.items.length}}
            </span>

            <v-spacer />

            <v-btn
              icon="mdi-page-first"
              variant="text"
              :disabled="page === 0"
              @click="page = 0"
            />
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              :disabled="page === 0"
              @click="page--"
            />
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              :disabled="page === lastPage"
              @click="page++"
            />
            <v-btn
              icon="mdi-page-last"
              variant="text"
              :disabled="page === lastPage"
              @click="page = lastPage"
            />
          </div>
        </td>
      </tr>
    </tfoot>
  </v-table>
</template>
