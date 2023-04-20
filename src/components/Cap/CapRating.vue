<script setup lang="ts">
  const props = defineProps({
    cap: { type: Object, required: true },
    readonly: { type: Boolean, default: false }
  })

  const rating = ref(props.cap.rating)
  const hoverRating = ref(props.cap.rating)

  const color = {
    1: 'red',
    2: 'orange',
    3: 'lime',
    4: 'light-green',
    5: 'green'
  }

  watchEffect(() => {
    rating.value = props.cap.rating
    hoverRating.value = props.cap.rating
  })

  const { submitForm: onInput } = useForm({
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

  function clearRating() {
    rating.value = null
    onInput()
  }
</script>

<template>
  <v-btn
    class="text-caption"
    size="x-small"
    variant="outlined"
    :color="color[rating] || 'grey'"
  >
    <v-icon size="x-small">mdi-star-four-points</v-icon>
    {{ cap.rating || 'N/A' }}

    <v-menu v-if="!readonly" open-on-hover location="center" activator="parent">
      <v-card
        class="d-flex align-center px-2 py-1"
        :style="{ overflowX: 'hidden' }"
      >
        <v-rating
          v-model="rating"
          hover
          :color="color[rating] || 'grey'"
          @input="onInput"
        >
          <template #item="{ index, props: itemProps }">
            <v-icon
              :color="color[hoverRating] || 'grey'"
              :icon="`mdi-star-four-points${
                hoverRating > index ? '' : '-outline'
              }`"
              @mouseenter.prevent="hoverRating = index + 1"
              @click="itemProps.onClick"
            />
          </template>
        </v-rating>
        <v-btn
          icon="mdi-star-off-outline"
          variant="plain"
          size="small"
          :disabled="!rating"
          @click="clearRating"
        />
      </v-card>
    </v-menu>
  </v-btn>
</template>
