<script setup>
  const props = defineProps({
    team: { type: Object, default: null }
  })

  const name = ref(props.team?.name || '')
  const startedOn = ref(props.team?.startedOn || format(new Date(), 'yyyy-MM-dd'))
  const currentlyOn = ref(props.team?.currentlyOn || format(new Date(), 'yyyy-MM-dd'))
  const currency = ref(props.team?.currency || '$')
</script>

<template>
  <div>
    <label>Name:</label>
    <input v-model="name" />
  </div>
  <div>
    <label>Start Date:</label>
    <input
      v-model="startedOn"
      type="date"
    />
  </div>
  <div>
    <label>Current Date:</label>
    <input
      v-model="currentlyOn"
      type="date"
    />
  </div>
  <div>
    <label>Currency:</label>
    <input v-model="currency" />
  </div>
</template>
