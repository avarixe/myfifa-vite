<script setup>
  const props = defineProps({
    stage: { type: Object, required: true },
    isNamed: { type: Boolean, default: true }
  })

  const attributes = reactive({})
  function resetAttributes () {
    attributes.name = props.stage.name,
    attributes.tableRowsAttributes = props.stage.tableRows.map(row => ({
      ...pick(row, [
        'id',
        'name',
        'wins',
        'draws',
        'losses',
        'goalsFor',
        'goalsAgainst'
      ]),
      _destroy: false
    }))
  }
  resetAttributes()

  const editing = ref(false)
  function toggleEditing () {
    editing.value = !editing.value
    resetAttributes()
  }

  function addRow () {
    attributes.tableRowsAttributes.push({
      name: '',
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      _destroy: false
    })
  }
  function removeRow () {
    for (let i = attributes.tableRowsAttributes.length - 1; i >= 0; i--) {
      if (!attributes.tableRowsAttributes[i]._destroy) {
        attributes.tableRowsAttributes[i]._destroy = true
        break
      }
    }
  }

  const { executeMutation: updateStage } = useMutation(gql`
    mutation ($id: ID!, $attributes: StageAttributes!) {
      updateStage(id: $id, attributes: $attributes) {
        stage { ...StageData }
        errors { fullMessages }
      }
    }
    ${stageFragment}
  `)
  async function onSubmit () {
    const { data: { updateStage: { errors, stage } } } =
      await updateStage({ id: props.stage.id, attributes })
    if (stage) {
      editing.value = false
    } else {
      alert(errors.fullMessages[0])
    }
  }
</script>

<template>
  <div class="flex">
    <q-input
      v-if="isNamed"
      v-model="attributes.name"
      :outline="editing"
      dense
      :readonly="!editing"
    />
    <q-space />

    <q-btn
      :icon="`mdi-${editing ? 'close' : 'pencil'}`"
      flat
      size="small"
      @click="toggleEditing"
    />
    <q-btn
      v-if="editing"
      icon="mdi-content-save"
      flat
      size="small"
      @click="onSubmit"
    />
    <remove-button
      v-else
      :record="stage"
      store="Stage"
      :label="stage.name"
      icon="mdi-delete"
    />
  </div>
  <q-markup-table id="rows" class="w-full">
    <thead>
      <tr>
        <th />
        <th class="text-left">Team</th>
        <th class="text-right">W</th>
        <th class="text-right">D</th>
        <th class="text-right">L</th>
        <th class="text-right">GF</th>
        <th class="text-right">GA</th>
        <th v-if="!editing" class="text-right">GD</th>
        <th v-if="!editing" class="text-right">PTS</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, i) in attributes.tableRowsAttributes"
        :key="`row-${i}`"
        :class="{ 'hidden': row._destroy }"
      >
        <td class="text-center" :style="{ width: '40px' }">
          <small class="text-disabled">{{ i + 1 }}</small>
        </td>
        <td class="text-left">
          <team-combobox
            v-if="editing"
            v-model="row.name"
            dense
            outlined
          />
          <template v-else>{{ row.name }}</template>
        </td>
        <td
          v-for="stat in ['wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst']"
          :key="stat"
          class="text-right"
        >
          <input
            v-if="editing"
            v-model="row[stat]"
            class="elevation-1 rounded"
            type="number"
          />
          <template v-else>{{ row[stat] }}</template>
        </td>
        <td v-if="!editing" class="text-right">{{ stage.tableRows[i]?.goalDifference }}</td>
        <td v-if="!editing" class="text-right">{{ stage.tableRows[i]?.points }}</td>
      </tr>
    </tbody>
    <tfoot v-if="editing">
      <tr>
        <td colspan="6">
          <q-btn size="x-small" @click="addRow">Add Row</q-btn>
          <q-btn size="x-small" @click="removeRow">Remove Row</q-btn>
        </td>
      </tr>
    </tfoot>
  </q-markup-table>
</template>

<style scoped lang="scss">
  #rows {
    :deep(.v-field input) {
      padding: 0 8px;
      min-height: auto;
      min-width: 15em;
    }

    th, td {
      padding: 0 8px;

      input[type="number"] {
        width: 3em;
        text-align: right;
      }
    }
  }
</style>
