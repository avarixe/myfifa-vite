<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      text: string
      speed?: number
    }>(),
    { text: '', speed: 6 }
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', toggleScroll)
  })

  function onEnter() {
    toggleScroll()
    window.addEventListener('resize', toggleScroll)
  }

  function onLeave() {
    window.removeEventListener('resize', toggleScroll)
    textClass.value = 'truncated'
  }

  const overflowWidth = ref(0)
  const hasOverflow = computed(() => overflowWidth.value > 0)
  const cssOverflowWidth = computed(() =>
    hasOverflow.value ? `-${overflowWidth.value + 4}px` : null
  )
  const textContainer: Ref<HTMLDivElement | null> = ref(null)
  const scroller: Ref<HTMLDivElement | null> = ref(null)
  function setOverflowWidth() {
    overflowWidth.value =
      textContainer.value && scroller.value
        ? textContainer.value.clientWidth - scroller.value.clientWidth
        : 0
  }

  const textClass = ref('truncated')
  async function toggleScroll() {
    textClass.value = ''
    await nextTick()
    setOverflowWidth()
    textClass.value = hasOverflow.value ? 'scrolling' : 'truncated'
  }

  // distance in pixels divided by desired scroll speed
  // pad with 2 if overflow is small
  const scrollDuration = computed(() => overflowWidth.value / props.speed + 2)
  const cssDuration = computed(() =>
    hasOverflow.value ? `${scrollDuration.value}s` : null
  )
</script>

<template>
  <div id="scroller" ref="scroller" @mouseenter="onEnter" @mouseleave="onLeave">
    <div ref="textContainer" :class="textClass" v-text="text" />
  </div>
</template>

<style scoped lang="scss">
  #scroller {
    overflow: hidden;
    div {
      width: max-content;
      &.scrolling {
        animation: text-scroll v-bind(cssDuration) linear infinite;
      }
      &.truncated {
        text-overflow: ellipsis;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  @keyframes text-scroll {
    0% {
      transform: translateX(0);
    }
    40% {
      transform: translateX(v-bind(cssOverflowWidth));
    }
    50% {
      transform: translateX(v-bind(cssOverflowWidth));
    }
    80% {
      transform: translateX(0);
    }
  }
</style>
