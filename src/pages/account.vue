<script setup>
  import { useNavigationStore } from '~/store/navigation'
  import { User } from '~/models'
  import { userFragment } from '~/fragments'

  const { data } = await useQuery({
    query: gql`
      query fetchUser {
        user { ...UserData }
      }
      ${userFragment}
    `
  })

  const userRepo = useRepo(User)
  userRepo.save(data.value.user)
  const user = computed(() => userRepo.find(parseInt(data.value.user.id)))

  const navigationStore = useNavigationStore()
  onMounted(() => {
    navigationStore.setBreadcrumbs([
      { icon: 'mdi-home', to: '/' },
      { label: 'Account', to: '/account' }
    ])
  })
</script>

<template>
  <user-profile :user="user" />
  <user-password-manager :user="user" />
</template>
