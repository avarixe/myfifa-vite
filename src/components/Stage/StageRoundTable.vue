<script setup>
  const props = defineProps({
    stage: { type: Object, required: true },
    isNamed: { type: Boolean, default: true }
  })

  const attributes = reactive({})
  function resetAttributes () {
    attributes.name = props.stage.name
    attributes.fixturesAttributes = props.stage.fixtures.map(fixture => ({
      ...pick(fixture, ['id', 'homeTeam', 'awayTeam']),
      legsAttributes: fixture.legs.map(leg => ({
        ...pick(leg, ['id', 'homeScore', 'awayScore']),
        _destroy: false
      })),
      _destroy: false
    }))
  }
  resetAttributes()

  const editing = ref(false)
  function toggleEditing () {
    editing.value = !editing.value
    resetAttributes()
  }

  const { previousRoundTeams } = useCompetition(parseInt(props.stage.competitionId))
  const teamOptions = computed(() => previousRoundTeams(props.stage))

  function addFixture () {
    attributes.fixturesAttributes.push({
      homeTeam: '',
      awayTeam: '',
      legsAttributes: [{
        homeScore: '',
        awayScore: '',
        _destroy: false
      }],
      _destroy: false
    })
  }
  function removeFixture () {
    for (let i = attributes.fixturesAttributes.length - 1; i >= 0; i--) {
      if (!attributes.fixturesAttributes[i]._destroy) {
        attributes.fixturesAttributes[i]._destroy = true
        break
      }
    }
  }

  function addLeg (fixtureIndex) {
    attributes.fixturesAttributes[fixtureIndex].legsAttributes.push({
      homeScore: '',
      awayScore: '',
      _destroy: false
    })
  }
  function removeLeg (fixtureIndex) {
    const fixtureAttr = attributes.fixturesAttributes[fixtureIndex]
    for (let i = fixtureAttr.legsAttributes.length - 1; i >= 0; i--) {
      if (!fixtureAttr.legsAttributes[i]._destroy) {
        fixtureAttr.legsAttributes[i]._destroy = true
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

  <q-markup-table id="fixtures">
    <thead>
      <tr>
        <th class="text-right">Home Team</th>
        <th class="text-center">Score</th>
        <th class="text-left">Away Team</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(fixture, i) in attributes.fixturesAttributes"
        :key="`fixture-${i}`"
        :class="{ 'hidden': fixture._destroy }"
      >
        <td class="text-right">
          <team-combobox
            v-if="editing"
            v-model="fixture.homeTeam"
            :default-items="teamOptions"
            dense
            outline
          />
          <template v-else>{{ fixture.homeTeam }}</template>
        </td>
        <td class="text-center">
          <div
            v-for="(leg, j) in fixture.legsAttributes"
            :key="`leg-${j}`"
            :class="{ 'text-center': true, 'hidden': leg._destroy }"
            :style="{ minWidth: '10em' }"
          >
            <template v-if="editing">
              <input
                v-model="leg.homeScore"
                class="elevation-1 rounded"
              />
              -
              <input
                v-model="leg.awayScore"
                class="elevation-1 rounded"
              />
            </template>
            <template v-else>{{ leg.homeScore }} - {{ leg.awayScore }}</template>
          </div>
          <template v-if="editing">
            <q-btn
              size="x-small"
              icon="mdi-plus-circle"
              class="my-1"
              @click="addLeg(i)"
            />
            &nbsp;
            <q-btn
              size="x-small"
              icon="mdi-minus-circle"
              class="my-1"
              @click="removeLeg(i)"
            />
          </template>
        </td>
        <td class="text-left">
          <team-combobox
            v-if="editing"
            v-model="fixture.awayTeam"
            :default-items="teamOptions"
            dense
            outline
          />
          <template v-else>{{ fixture.awayTeam }}</template>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="editing">
      <tr>
        <td colspan="3">
          <q-btn size="x-small" @click="addFixture">Add Fixture</q-btn>
          <q-btn size="x-small" @click="removeFixture">Remove Fixture</q-btn>
        </td>
      </tr>
    </tfoot>
  </q-markup-table>
</template>

<style scoped lang="scss">
  #fixtures {
    th, td {
      padding: 0 8px;

      :deep(.v-field input) {
        padding: 0 8px;
        min-height: auto;
        min-width: 15em;
      }

      input {
        width: 3em;
        text-align: center;
      }
    }
  }
</style>
