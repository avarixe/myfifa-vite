export const useNavigationStore = defineStore({
  id: 'navigation',
  state: () => ({
    breadcrumbs: []
  }),
  actions: {
    setBreadcrumbs (breadcrumbs) {
      this.breadcrumbs = breadcrumbs
    }
  }
})
