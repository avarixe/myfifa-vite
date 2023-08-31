export const useBroadcastStore = defineStore('broadcast', {
  state: () => ({
    text: '',
    color: ''
  }),
  actions: {
    info(text: string): void {
      this.text = text
      this.color = 'info'
    },
    error(text: string): void {
      this.text = text
      this.color = 'error'
    },
    clear(): void {
      this.text = ''
      this.color = ''
    }
  }
})
