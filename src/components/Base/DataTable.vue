<script setup>
  const props = defineProps({
    headers: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    itemKey: { type: String, required: true },
    itemsPerPage: { type: Number, default: 10 },
    itemsPerPageOptions: { type: Array, default: () => [10, 20, 50, -1] },
    sortBy: { type: String, default: null },
    sortDesc: { type: Boolean, default: false },
    mustSort: { type: Boolean, default: false }
  })

  // Sorting
  const sortBy = ref(props.sortBy)
  const sortDesc = ref(props.sortDesc)
  const sortIndex = computed(() =>
    props.headers.findIndex(h => h.value === sortBy.value)
  )
  function changeSortColumn (value) {
    if (sortBy.value === value) {
      if (sortDesc.value && !props.mustSort) {
        sortBy.value = null
      } else {
        sortDesc.value = !sortDesc.value
      }
    } else {
      sortBy.value = value
      sortDesc.value = false
    }
  }
  function defaultSort (a, b) {
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
  const pageCount = computed(() =>
    showAll.value ? 1 : Math.ceil(props.items.length / itemsPerPage.value)
  )
  const pageStart = computed(() =>
    showAll.value ? 1 : (page.value * itemsPerPage.value) + 1
  )
  const pageStop = computed(() => {
    if (showAll.value) {
      return props.items.length
    } else {
      const index = pageStart.value + itemsPerPage.value - 1
      return index > props.items.length ? props.items.length : index
    }
  })
  const pageItems = computed(() =>
    sortedItems.value.slice(pageStart.value - 1, pageStop.value)
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
            @click="header.sortable !== false ? changeSortColumn(header.value) : null"
          >
            <slot :name="`header-${header.value}`" :header="header">
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <span
                  :style="{ cursor: 'pointer' }"
                  v-bind="hoverProps"
                >
                  {{ header.text }}
                  <v-icon v-if="sortBy === header.value">
                    mdi-chevron-{{ sortDesc ? 'down' : 'up' }}
                  </v-icon>
                  <v-icon
                    v-else-if="header.sortable !== false"
                    class="text-disabled"
                    :style="{ visibility: isHovering ? 'inherit' : 'hidden' }"
                  >
                    mdi-chevron-up
                  </v-icon>
                </span>
              </v-hover>
            </slot>
          </th>
        </slot>
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
    </tbody>
    <slot name="foot">
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
                {{ pageStart }} - {{ pageStop }} of {{ props.items.length}}
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
          </td>
        </tr>
      </tfoot>
    </slot>
  </v-table>
</template>
