<script setup lang="ts">
  import { Stage } from '~/models'

  const props = withDefaults(
    defineProps<{
      stage: Stage
      readonly?: boolean
      isNamed?: boolean
    }>(),
    { isNamed: true }
  )

  const attributes: GroupStageAttributes = reactive({ tableRowsAttributes: [] })
  function resetAttributes() {
    attributes.name = props.stage.name
    attributes.tableRowsAttributes = props.stage.tableRows.map(row => ({
      ..._pick(row, [
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
  function toggleEditing() {
    editing.value = !editing.value
    resetAttributes()
  }

  function addRow() {
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
  function removeRow() {
    for (let i = attributes.tableRowsAttributes.length - 1; i >= 0; i--) {
      if (!attributes.tableRowsAttributes[i]._destroy) {
        attributes.tableRowsAttributes[i]._destroy = true
        break
      }
    }
  }

  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: StageAttributes!) {
        updateStage(id: $id, attributes: $attributes) {
          stage {
            ...StageData
          }
        }
      }
      ${stageFragment}
    `,
    variables: () => ({ id: props.stage.id, attributes }),
    onSuccess() {
      editing.value = false
    }
  })

  const route = useRoute<'/teams/[teamId]/competitions/[competitionId]/'>()
  const { teamColor } = useCompetition(Number(route.params.competitionId))

  const statColumns: (keyof TableRowAttributes)[] = [
    'wins',
    'draws',
    'losses',
    'goalsFor',
    'goalsAgainst'
  ]
</script>

<template>
  <div class="d-flex">
    <v-text-field
      v-if="isNamed"
      v-model="attributes.name"
      :variant="editing ? 'outlined' : undefined"
      density="compact"
      hide-details
      :readonly="!editing"
    />
    <v-spacer v-else />

    <template v-if="!props.readonly">
      <v-btn
        :icon="`mdi-${editing ? 'close' : 'pencil'}`"
        variant="text"
        size="small"
        @click="toggleEditing"
      />
      <v-btn
        v-if="editing"
        icon="mdi-content-save"
        variant="text"
        size="small"
        @click="submitForm"
      />
      <remove-button
        v-else
        :record="stage"
        store="Stage"
        :label="stage.name"
        icon="mdi-delete"
      />
    </template>
  </div>
  <v-table id="rows" density="compact">
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
        :class="{ 'd-none': row._destroy, [teamColor(row.name)]: true }"
      >
        <td class="text-center" :style="{ width: '40px' }">
          <small class="text-disabled">{{ i + 1 }}</small>
        </td>
        <td class="text-left">
          <team-combobox
            v-if="editing"
            v-model="row.name"
            density="compact"
            single-line
            hide-details
            :style="{ minWidth: '12em' }"
          />
          <template v-else>{{ row.name }}</template>
        </td>
        <td v-for="stat in statColumns" :key="stat" class="text-right">
          <v-hover v-if="editing" v-slot="{ isHovering, props: hoverProps }">
            <v-text-field
              v-model.number="row[stat]"
              :class="`elevation-${isHovering ? 3 : 1} rounded`"
              type="number"
              density="compact"
              single-line
              hide-details
              v-bind="hoverProps"
            />
          </v-hover>
          <template v-else>{{ row[stat] }}</template>
        </td>
        <td v-if="!editing" class="text-right">
          {{ stage.tableRows[i]?.goalDifference }}
        </td>
        <td v-if="!editing" class="text-right">
          {{ stage.tableRows[i]?.points }}
        </td>
      </tr>
    </tbody>
    <tfoot v-if="editing">
      <tr>
        <td colspan="7">
          <v-btn size="x-small" @click="addRow">Add Row</v-btn>
          <v-btn size="x-small" @click="removeRow">Remove Row</v-btn>
        </td>
      </tr>
    </tfoot>
  </v-table>
</template>

<style scoped lang="scss">
  .v-table#rows {
    :deep(.v-field input) {
      min-height: auto;
    }

    th,
    td {
      padding: 0 8px;

      :deep(input[type='number']) {
        width: 3em;
      }
    }
  }
</style>
