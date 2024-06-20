<script setup lang="ts">
  import { VFileInput } from 'vuetify/components'

  import { Team } from '~/models'

  const props = defineProps<{ team: Team }>()

  const mutation = gql`
    mutation uploadBadge($teamId: ID!, $badge: Upload!) {
      uploadBadge(teamId: $teamId, badge: $badge) {
        team {
          badgePath
        }
      }
    }
  `

  const input = ref<VFileInput | null>(null)
  const preview = ref<string | null>(null)
  const badge = ref<File[] | undefined>()
  const variables = () => ({
    teamId: props.team.id,
    badge: badge.value?.[0]
  })

  const dragging = ref(false)
  function onDragOver() {
    dragging.value = true
  }
  function onDragLeave() {
    dragging.value = false
  }
  function onDrop(e: DragEvent) {
    badge.value = [...(e.dataTransfer?.files ?? [])]
    dragging.value = false
  }

  watch(badge, () => {
    if (badge.value?.[0]) {
      preview.value = URL.createObjectURL(badge.value[0])
    }
  })

  const teamRepo = useRepo(Team)
  function onSuccess(data: { uploadBadge: { team: object } }) {
    teamRepo.save({ ...data.uploadBadge.team, id: props.team.id })
  }
</script>

<template>
  <dialog-form
    :title="`${team.badgePath ? 'Change' : 'Upload'} Badge`"
    :mutation="mutation"
    :variables="variables"
    @success="onSuccess"
  >
    <v-row dense class="align-center">
      <v-col cols="5" class="text-center">
        <v-sheet
          color="grey-darken-3"
          :height="150"
          class="rounded-xl d-flex align-center justify-center"
        >
          <v-img
            v-if="team.badgePath"
            :src="team.badgeUrl"
            height="100px"
            contain
            class="text-center"
          />
          <v-icon v-else size="100">mdi-shield-off-outline</v-icon>
        </v-sheet>
      </v-col>
      <v-col cols="2" class="text-center">
        <v-icon>mdi-arrow-right</v-icon>
      </v-col>
      <v-col cols="5">
        <v-file-input
          ref="input"
          v-model="badge"
          label="Badge"
          :rules="[isRequired('Badge')]"
          accept="image/*"
          class="d-none"
        />
        <v-sheet
          v-ripple
          :color="dragging ? 'grey-darken-2' : 'grey-darken-3'"
          :height="150"
          class="rounded-xl d-flex align-center justify-center"
          :style="{ cursor: 'pointer' }"
          @click="input?.click()"
          @drop.prevent="onDrop"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
        >
          <v-img
            v-if="preview"
            :src="preview"
            height="100px"
            contain
            class="text-center"
          />
          <v-icon v-else size="100">mdi-upload</v-icon>
          <v-tooltip location="bottom" activator="parent">
            Click to upload File
          </v-tooltip>
        </v-sheet>
      </v-col>
    </v-row>
  </dialog-form>
</template>
