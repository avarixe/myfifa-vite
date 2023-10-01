<script setup lang="ts">
  import { Cap } from '~/models'

  const props = defineProps<{
    cap: Cap
    readonly?: boolean
  }>()

  const rating = ref(props.cap.rating ?? undefined)
  const hoverRating = ref(props.cap.rating)

  const color: Record<number, string> = {
    1: 'red',
    2: 'orange',
    3: 'lime',
    4: 'light-green',
    5: 'green'
  }

  watchEffect(() => {
    rating.value = props.cap.rating ?? undefined
    hoverRating.value = props.cap.rating
  })

  const { submitForm } = useForm({
    mutation: gql`
      mutation ($id: ID!, $attributes: CapAttributes!) {
        updateCap(id: $id, attributes: $attributes) {
          cap {
            ...CapData
          }
        }
      }
      ${capFragment}
    `,
    variables: () => ({
      id: props.cap.id,
      attributes: { rating: rating.value }
    })
  })

  function setRating(value: number | null) {
    rating.value = value ?? undefined
    submitForm()
  }
</script>

<template>
  <v-btn
    class="text-caption"
    size="x-small"
    variant="outlined"
    :color="rating ? color[rating] : 'grey'"
  >
    <v-icon size="x-small">mdi-star-four-points</v-icon>
    {{ cap.rating || 'N/A' }}

    <v-menu
      v-if="!props.readonly"
      open-on-hover
      location="center"
      activator="parent"
    >
      <v-card
        class="d-flex align-center px-2 py-1"
        :style="{ overflowX: 'hidden' }"
      >
        <v-rating
          :model-value="rating"
          hover
          :color="rating ? color[rating] : 'grey'"
          @update:model-value="v => setRating(v as number)"
        >
          <template #item="{ index, props: ratingProps }">
            <v-icon
              :color="hoverRating ? color[hoverRating] : 'grey'"
              :icon="`mdi-star-four-points${
                hoverRating && hoverRating > index ? '' : '-outline'
              }`"
              @mouseenter.prevent="hoverRating = index + 1"
              @click="ratingProps.onClick"
            />
          </template>
        </v-rating>
        <v-btn
          icon="mdi-star-off-outline"
          variant="plain"
          size="small"
          :disabled="!rating"
          @click="setRating(null)"
        />
      </v-card>
    </v-menu>
  </v-btn>
</template>
