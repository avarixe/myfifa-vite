<script setup>
  const props = defineProps({
    text: { type: String, default: '' },
    speed: { type: Number, default: 6 }
  })

  const textClass = ref('truncated')
  const resizeListener = ref(null)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeListener.value)
  })

  function onEnter () {
    toggleScroll()
    resizeListener.value = window.addEventListener('resize', toggleScroll)
  }

  function onLeave () {
    window.removeEventListener('resize', resizeListener.value)
    textClass.value = 'truncated'
  }

  const overflowWidth = ref(null)
  const duration = ref(null)
  async function toggleScroll () {
    textClass.value = null
    await nextTick()
    if (getOverflowWidth() > 0) {
      textClass.value = 'scrolling'
      overflowWidth.value = `-${getOverflowWidth() + 4}px`
      duration.value = `${computeScrollDuration()}s`
    } else {
      textClass.value = 'truncated'
    }
  }

  const textContainer = ref(null)
  const scroller = ref(null)
  function getOverflowWidth () {
    return textContainer.value
      ? textContainer.value.clientWidth - scroller.value.clientWidth
      : 0
  }

  function computeScrollDuration () {
    // distance in pixels divided by desired scroll speed
    // pad with 2 if overflow is small
    return getOverflowWidth() / props.speed + 2
  }
</script>

<template>
  <div
    id="scroller"
    ref="scroller"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <div
      ref="textContainer"
      :class="textClass"
      v-text="text"
    />
  </div>
</template>

<style scoped lang="scss">
  #scroller {
    overflow: hidden;
    div {
      width: max-content;
      &.scrolling {
        animation: text-scroll v-bind(duration) linear infinite;
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
    0% { transform: translateX(0) }
    40% { transform: translateX(v-bind(overflowWidth)) }
    50% { transform: translateX(v-bind(overflowWidth)) }
    80% { transform: translateX(0) }
  }
</style>
