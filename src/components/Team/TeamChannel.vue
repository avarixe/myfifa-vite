<script setup lang="ts">
  import * as models from '~/models'

  const props = defineProps<{
    team: models.Team
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
        return undefined
    }
  })

  type modelKey = keyof typeof models
  type modelType = typeof models.Team

  const insertBuffer: Record<string, object[]> = reactive({})
  const deleteBuffer: Record<string, { id: number }[]> = reactive({})
  let timeout: ReturnType<typeof setTimeout>

  function addToBuffer({
    type,
    data,
    destroyed
  }: {
    type: modelKey
    data: object
    destroyed?: boolean
  }) {
    const buffer = destroyed ? deleteBuffer : insertBuffer

    if (type in buffer) {
      buffer[type].push(data)
    } else {
      buffer[type] = [data]
    }

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(updateStore, 300)
  }

  function camelize(str: string) {
    return str
      .toLowerCase()
      .replace(/([-_][a-z])/g, group => group.slice(-1).toUpperCase())
  }

  function updateStore() {
    Object.keys(deleteBuffer).forEach(async type => {
      const ids = deleteBuffer[type].map(data => data.id)
      useRepo(models[type as modelKey] as modelType).destroy(ids)
      delete deleteBuffer[type]
    })

    Object.keys(insertBuffer).forEach(async type => {
      const data = insertBuffer[type].map(record =>
        Object.entries(record).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [camelize(key)]: value
          }),
          {}
        )
      )
      useRepo(models[type as modelKey] as modelType).save(data)
      delete insertBuffer[type]
    })
  }

  const { token } = useSession()
  let socket: WebSocket

  function connectToWebSocket() {
    if (token.value) {
      connectionState.value = 'Connecting'

      socket = new WebSocket(`${cableURL}?access_token=${token.value}`)

      socket.onmessage = event => {
        const { message } = JSON.parse(event.data)
        const { type, data, destroyed } = message || {}
        if (type) {
          // console.log(type, data, destroyed)
          addToBuffer({ type, data, destroyed })
        }
      }

      socket.onopen = () => {
        socket.send(
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

      socket.onclose = () => {
        connectionState.value = 'Disconnected'
      }
    }
  }

  onMounted(() => {
    connectToWebSocket()
  })

  onUnmounted(() => {
    socket.close()
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
