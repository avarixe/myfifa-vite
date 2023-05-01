<script setup lang="ts">
  import _mapKeys from 'lodash.mapkeys'
  import _camelCase from 'lodash.camelcase'
  import * as models from '../../models'

  const props = defineProps<{
    team: TeamRecord
  }>()

  const cableURL = `${import.meta.env.VITE_API_URL.replace('http', 'ws')}/cable`

  const connectionState = ref('Connecting')
  const connectionMessage = computed(() => {
    switch (connectionState.value) {
      case 'Connecting':
        return `Connecting to ${cableURL}...`
      case 'Connected':
        return `Connected to ${cableURL}!`
      case 'Disconnected':
        return 'Connection has been terminated.'
      default:
        return 'Invalid State: Please refresh the page.'
    }
  })
  const connectionColor = computed(() => {
    switch (connectionState.value) {
      case 'Connecting':
        return 'warning'
      case 'Connected':
        return 'success'
      case 'Disconnected':
        return 'error'
      default:
        return null
    }
  })

  const insertBuffer = reactive({})
  const deleteBuffer = reactive({})
  const timeout = ref(null)

  function addToBuffer({ type, data, destroyed }) {
    const buffer = destroyed ? deleteBuffer : insertBuffer

    if (type in buffer) {
      buffer[type].push(data)
    } else {
      buffer[type] = [data]
    }

    if (timeout.value) {
      clearTimeout(timeout.value)
    }

    timeout.value = setTimeout(updateStore, 300)
  }

  function updateStore() {
    Object.keys(deleteBuffer).forEach(async type => {
      const ids = deleteBuffer[type].map(data => data.id)
      await useRepo(models[type]).destroy(ids)
      delete deleteBuffer[type]
    })

    Object.keys(insertBuffer).forEach(async type => {
      const data = insertBuffer[type].map(record =>
        _mapKeys(record, (_v, k) => _camelCase(k))
      )
      await useRepo(models[type]).save(data)
      delete insertBuffer[type]
    })
  }

  const { token } = useSession()
  const socket = ref(null)

  function connectToWebSocket() {
    if (token.value) {
      connectionState.value = 'Connecting'

      socket.value = new WebSocket(`${cableURL}?access_token=${token.value}`)

      socket.value.onmessage = event => {
        const { message } = JSON.parse(event.data)
        const { type, data, destroyed } = message || {}
        if (type) {
          // console.log(type, data, destroyed)
          addToBuffer({ type, data, destroyed })
        }
      }

      socket.value.onopen = () => {
        socket.value.send(
          JSON.stringify({
            command: 'subscribe',
            identifier: JSON.stringify({
              channel: 'TeamChannel',
              id: props.team.id
            })
          })
        )

        connectionState.value = 'Connected'
      }

      socket.value.onclose = () => {
        connectionState.value = 'Disconnected'
      }
    }
  }

  onMounted(() => {
    connectToWebSocket()
  })

  onUnmounted(() => {
    socket.value.close()
  })

  const snackbar = ref(false)
  watch(connectionState, () => {
    snackbar.value = true
  })
</script>

<template>
  <v-snackbar
    v-model="snackbar"
    location="top"
    :timeout="connectionState === 'Connected' ? 5000 : -1"
    :color="connectionColor"
  >
    {{ connectionMessage }}

    <template #actions>
      <v-btn
        v-if="connectionState === 'Disconnected'"
        text="Reconnect"
        color="error"
        variant="text"
        @click="connectToWebSocket"
      />
    </template>
  </v-snackbar>
</template>
