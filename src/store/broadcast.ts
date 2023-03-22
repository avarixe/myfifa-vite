export const useBroadcastStore = defineStore('broadcast', {
  state: () => ({
    text: '',
    color: ''
  }),
  actions: {
    info(text): void {
      this.text = text
      this.color = 'info'
    },
    error(text): void {
      this.text = text
      this.color = 'error'
    },
    clear(): void {
      this.text = ''
      this.color = ''
    }
  }
})
