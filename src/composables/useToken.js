import { createGlobalState, useStorage } from '@vueuse/core'

const useGlobalState = createGlobalState(() => useStorage('token', null))

export default () => useGlobalState()

