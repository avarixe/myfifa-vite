<script setup>
  import { User } from '~/models'

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
</script>

<template>
  <div class="row">
    <div class="col pa-2">
      <user-profile :user="user" />
    </div>
    <div class="col pa-2">
      <user-password-manager :user="user" />
    </div>
  </div>
</template>
