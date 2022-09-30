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
  <v-row>
    <v-col>
      <user-profile :record="user" />
    </v-col>
    <v-col>
      <user-password-manager />
    </v-col>
  </v-row>
</template>
