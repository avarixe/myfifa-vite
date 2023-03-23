<script setup>
  const props = defineProps({
    headers: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    options: { type: Object, default: () => ({}) },
    itemKey: { type: String, default: props => props.options.itemKey ?? 'id' },
    loading: { type: Boolean, default: false },
    // Pagination
    itemsPerPage: {
      type: Number,
      default: props => props.options.itemsPerPage ?? 10
    },
    itemsPerPageOptions: {
      type: Array,
      default: props => props.options.itemsPerPageOptions ?? [10, 20, 50, -1]
    },
    // Sorting
    sortBy: { type: String, default: props => props.options.sortBy },
    sortDesc: {
      type: Boolean,
      default: props => props.options.sortDesc ?? false
    },
    mustSort: {
      type: Boolean,
      default: props => props.options.mustSort ?? false
    },
    // Server Side processing
    serverItemsLength: { type: Number, default: null },
    showPaginationOptions: { type: Boolean, default: true }
  })

  // Sorting
  const sortBy = ref(props.sortBy)
  const sortDesc = ref(props.sortDesc)
  const sortIndex = computed(() =>
    props.headers.findIndex(h => h.value === sortBy.value)
  )
  function changeSortColumn(header) {
    if (header.sortable === false) {
      return
    }

    if (sortBy.value === header.value) {
      if (sortDesc.value && !props.mustSort) {
        sortBy.value = null
      } else {
        sortDesc.value = !sortDesc.value
      }
    } else {
      sortBy.value = header.value
      sortDesc.value = false
    }
  }
  function defaultSort(a, b) {
    const sortHeader = props.headers[sortIndex.value]
    const attr = sortHeader.sortBy || sortBy.value
    if (sortDesc.value) {
      return (b[attr] > a[attr]) - (a[attr] > b[attr])
    } else {
      return (a[attr] > b[attr]) - (b[attr] > a[attr])
    }
  }
  const sortedItems = computed(() => {
    const sortHeader = props.headers[sortIndex.value]
    if (sortHeader) {
      return [...props.items].sort(defaultSort)
    } else {
      return props.items
    }
  })

  // Pagination
  const page = ref(0)
  const itemsPerPage = ref(props.itemsPerPage)
  const showAll = computed(() => itemsPerPage.value <= 0)
  const total = computed(() => props.serverItemsLength ?? props.items.length)
  const pageCount = computed(() =>
    showAll.value ? 1 : Math.ceil(total.value / itemsPerPage.value)
  )
  const pageStart = computed(() =>
    showAll.value ? 1 : page.value * itemsPerPage.value + 1
  )
  const pageStop = computed(() => {
    if (showAll.value) {
      return total.value
    } else {
      const index = pageStart.value + itemsPerPage.value - 1
      return index > total.value ? total.value : index
    }
  })
  const pageItems = computed(() => {
    if (props.serverItemsLength) {
      return props.items
    } else {
      return sortedItems.value.slice(pageStart.value - 1, pageStop.value)
    }
  })

  // Server Side Processing
  const options = computed(() => ({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    sortDesc: sortDesc.value
  }))
  const emit = defineEmits('update:options')
  watch(
    options,
    () => {
      emit('update:options', { ...props.options, ...options.value })
    },
    { deep: true }
  )
</script>

<template>
  <v-table class="rounded">
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
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-btn
                  v-bind="hoverProps"
                  variant="plain"
                  size="small"
                  class="px-0"
                  :style="{ textTransform: 'inherit' }"
                  @click="changeSortColumn(header)"
                >
                  {{ header.text }}
                  <v-icon v-if="sortBy === header.value" end>
                    mdi-chevron-{{ sortDesc ? 'down' : 'up' }}
                  </v-icon>
                  <v-icon
                    v-else-if="header.sortable !== false"
                    class="text-medium-emphasis"
                    end
                    :style="{ visibility: isHovering ? 'inherit' : 'hidden' }"
                  >
                    mdi-chevron-up
                  </v-icon>
                </v-btn>
              </v-hover>
            </slot>
          </th>
        </slot>
      </tr>
      <tr v-if="loading">
        <td :colspan="headers.length" :style="{ height: 'auto', padding: 0 }">
          <v-progress-linear indeterminate color="primary" />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in pageItems" :key="item[itemKey]">
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
      <tr v-if="pageItems.length === 0">
        <td
          :colspan="headers.length"
          class="text-center text-caption text-disabled"
          v-text="'No Records Found'"
        />
      </tr>
    </tbody>
    <slot name="tfoot" />
    <template v-if="showPaginationOptions" #bottom>
      <div class="d-flex align-center px-4">
        <v-btn
          round
          variant="text"
          append-icon="mdi-menu-down"
          class="border-b"
        >
          {{ showAll ? 'All' : itemsPerPage }}
          <v-menu activator="parent">
            <v-list density="compact">
              <v-list-item
                v-for="option in itemsPerPageOptions"
                :key="option"
                :title="option > 0 ? option : 'All'"
                @click="itemsPerPage = option"
              />
            </v-list>
          </v-menu>
        </v-btn>
        <span class="text-caption pl-2">
          {{ pageStart }} - {{ pageStop }} of {{ total }}
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
          :disabled="page === pageCount - 1"
          @click="page++"
        />
        <v-btn
          icon="mdi-page-last"
          variant="text"
          :disabled="page === pageCount - 1"
          @click="page = pageCount - 1"
        />
      </div>
    </template>
  </v-table>
</template>
