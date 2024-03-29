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

  const attributes: RoundStageAttributes = reactive({ fixturesAttributes: [] })
  function resetAttributes() {
    attributes.name = props.stage.name
    attributes.fixturesAttributes = props.stage.fixtures.map(fixture => ({
      ..._pick(fixture, ['id', 'homeTeam', 'awayTeam']),
      legsAttributes: fixture.legs.map(leg => ({
        ..._pick(leg, ['id', 'homeScore', 'awayScore']),
        _destroy: false
      })),
      _destroy: false
    }))
  }
  resetAttributes()

  const editing = ref(false)
  function toggleEditing() {
    editing.value = !editing.value
    resetAttributes()
  }

  const { previousRoundTeams } = useCompetition(props.stage.competitionId)
  const teamOptions = computed(() => previousRoundTeams(props.stage))

  function addFixture() {
    attributes.fixturesAttributes.push({
      homeTeam: '',
      awayTeam: '',
      legsAttributes: [
        {
          homeScore: '',
          awayScore: '',
          _destroy: false
        }
      ],
      _destroy: false
    })
  }
  function removeFixture() {
    for (let i = attributes.fixturesAttributes.length - 1; i >= 0; i--) {
      if (!attributes.fixturesAttributes[i]._destroy) {
        attributes.fixturesAttributes[i]._destroy = true
        break
      }
    }
  }

  async function addLeg(fixtureIndex: number) {
    attributes.fixturesAttributes[fixtureIndex].legsAttributes.push({
      homeScore: '',
      awayScore: '',
      _destroy: false
    })
    await nextTick()
    document.activeElement?.previousElementSibling
      ?.querySelector('input')
      ?.focus()
  }

  function removeLeg(fixtureIndex: number) {
    const fixtureAttr = attributes.fixturesAttributes[fixtureIndex]
    for (let i = fixtureAttr.legsAttributes.length - 1; i >= 0; i--) {
      if (!fixtureAttr.legsAttributes[i]._destroy) {
        fixtureAttr.legsAttributes[i]._destroy = true
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

  function scoreDiff(fixture: FixtureAttributes) {
    let homeScore = 0
    let awayScore = 0

    const scoreRegex = /^(\d+)(?: \((\d+)\))?$/
    fixture.legsAttributes.forEach((leg: FixtureLegAttributes) => {
      if (!leg.homeScore || !leg.awayScore) {
        return
      }

      const [, homeLegScore, homePenScore] =
        scoreRegex.exec(leg.homeScore) || []
      const [, awayLegScore, awayPenScore] =
        scoreRegex.exec(leg.awayScore) || []

      if (homePenScore && awayPenScore) {
        homeScore = parseInt(homePenScore)
        awayScore = parseInt(awayPenScore)
      } else {
        homeScore += parseInt(homeLegScore)
        awayScore += parseInt(awayLegScore)
      }
    })

    return homeScore - awayScore
  }
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

  <v-table id="fixtures" density="compact">
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
        :class="{ 'd-none': fixture._destroy }"
      >
        <td
          :class="{
            'text-right': true,
            'font-weight-black': scoreDiff(fixture) > 0,
            [teamColor(fixture.homeTeam)]: true
          }"
        >
          <team-combobox
            v-if="editing"
            v-model="fixture.homeTeam"
            :default-items="teamOptions"
            density="compact"
            single-line
            hide-details
            :style="{ minWidth: '12em' }"
          />
          <template v-else>{{ fixture.homeTeam }}</template>
        </td>
        <td class="text-center">
          <div
            v-for="(leg, j) in fixture.legsAttributes"
            :key="`leg-${j}`"
            :class="{ 'text-center': true, 'd-none': leg._destroy }"
            :style="{ minWidth: '10em' }"
          >
            <template v-if="editing">
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <input
                  v-model="leg.homeScore"
                  :class="`elevation-${isHovering ? 3 : 1} rounded mt-1`"
                  v-bind="hoverProps"
                />
              </v-hover>
              -
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <input
                  v-model="leg.awayScore"
                  :class="`elevation-${isHovering ? 3 : 1} rounded mt-1`"
                  v-bind="hoverProps"
                />
              </v-hover>
            </template>
            <template v-else>
              <span
                :class="{
                  'font-weight-black': scoreDiff(fixture) > 0,
                  [teamColor(fixture.homeTeam)]: true
                }"
                v-text="leg.homeScore"
              />
              -
              <span
                :class="{
                  'font-weight-black': scoreDiff(fixture) < 0,
                  [teamColor(fixture.awayTeam)]: true
                }"
                v-text="leg.awayScore"
              />
            </template>
          </div>
          <template v-if="editing">
            <v-btn size="x-small" class="my-1" @click="addLeg(i)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
            &nbsp;
            <v-btn size="x-small" class="my-1" @click="removeLeg(i)">
              <v-icon>mdi-minus-circle</v-icon>
            </v-btn>
          </template>
        </td>
        <td
          :class="{
            'text-left': true,
            'font-weight-black': scoreDiff(fixture) < 0,
            [teamColor(fixture.awayTeam)]: true
          }"
        >
          <team-combobox
            v-if="editing"
            v-model="fixture.awayTeam"
            :default-items="teamOptions"
            density="compact"
            single-line
            hide-details
            :style="{ minWidth: '12em' }"
          />
          <template v-else>{{ fixture.awayTeam }}</template>
        </td>
      </tr>
    </tbody>
    <tfoot v-if="editing">
      <tr>
        <td colspan="3">
          <v-btn size="x-small" @click="addFixture">Add Fixture</v-btn>
          &nbsp;
          <v-btn size="x-small" @click="removeFixture">Remove Fixture</v-btn>
        </td>
      </tr>
    </tfoot>
  </v-table>
</template>

<style scoped lang="scss">
  .v-table#fixtures {
    th,
    td {
      padding: 0 8px;

      :deep(.v-field input) {
        padding: 0 8px;
        min-height: auto;
      }

      input {
        width: 3em;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
</style>
