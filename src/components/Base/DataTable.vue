<script setup lang="ts">
  interface Header {
    text: string
    value: string
    sortBy?: string
    width?: number
    class?: string
    style?: string
    sortable?: boolean
    cellClass?: string
    cellStyle?: string
  }

  interface TableOptions {
    itemKey?: string
    itemsPerPage?: number
    itemsPerPageOptions?: number[]
    sortBy?: string
    sortDesc?: boolean
    mustSort?: boolean
  }

  interface Props {
    headers: Header[]
    items: object[]
    options?: TableOptions
    itemKey?: string
    loading?: boolean
    // Pagination
    itemsPerPage?: number
    itemsPerPageOptions?: number[]
    // Sorting
    sortBy?: string
    sortDesc?: boolean
    mustSort?: boolean
    // Server Side processing
    serverItemsLength?: number
    showPaginationOptions?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    headers: () => [],
    items: () => [],
    options: () => ({}),
    itemKey: props => props.options.itemKey ?? 'id',
    loading: false,
    itemsPerPage: props => props.options.itemsPerPage ?? 10,
    itemsPerPageOptions: props =>
      props.options.itemsPerPageOptions ?? [10, 20, 50, -1],
    sortBy: props => props.options.sortBy,
    sortDesc: props => props.options.sortDesc ?? false,
    mustSort: props => props.options.mustSort ?? false,
    serverItemsLength: null,
    showPaginationOptions: true
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
      return +(b[attr] > a[attr]) - +(a[attr] > b[attr])
    } else {
      return +(a[attr] > b[attr]) - +(b[attr] > a[attr])
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageItems: Ref<any[]> = computed(() => {
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
  const emit = defineEmits(['update:options'])
  watch(
    options,
    () => {
      emit('update:options', { ...props.options, ...options.value })
    },
    { deep: true }
  )

  const { currentUser } = useSession()
  const rowHoverColor = computed(
    () => `bg-grey-${currentUser.value.darkMode ? 'darken' : 'lighten'}-3`
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
            <v-sheet class="mx-n4 px-4">
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-btn
                  v-bind="hoverProps"
                  variant="plain"
                  size="small"
                  class="px-0"
                  :style="{ textTransform: 'inherit' }"
                  @click="changeSortColumn(header)"
                >
                  <slot :name="`header-${header.value}`" :header="header">
                    {{ header.text }}
                  </slot>
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
            </v-sheet>
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
      <v-hover v-for="item in pageItems" :key="item[itemKey]">
        <template #default="{ isHovering, props: hoverProps }">
          <tr v-bind="hoverProps" :class="isHovering ? rowHoverColor : ''">
            <slot
              name="item"
              :item="item"
              :row-color="isHovering ? rowHoverColor : ''"
            >
              <td
                v-for="(header, j) in headers"
                :key="j"
                :class="header.cellClass"
                :style="header.cellStyle"
              >
                <v-sheet
                  :class="`mx-n4 px-4 ${isHovering ? rowHoverColor : ''}`"
                >
                  <slot :name="`item-${header.value}`" :item="item">
                    {{ item[header.value] }}
                  </slot>
                </v-sheet>
              </td>
            </slot>
          </tr>
        </template>
      </v-hover>
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
        <v-btn variant="text" append-icon="mdi-menu-down" class="border-b">
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
