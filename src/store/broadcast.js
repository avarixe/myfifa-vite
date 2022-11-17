export const useBroadcastStore = defineStore('broadcast', {
  state: () => ({
    text: '',
    color: ''
  }),
  actions: {
    info (text) {
      this.text = text
      this.color = 'info'
    },
    error (text) {
      this.text = text
      this.color = 'error'
    },
    clear () {
      this.text = ''
      this.color = ''
    }
  }
})
