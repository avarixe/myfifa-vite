<script setup lang="ts">
  import { User } from '~/models'

  const { data } = await useQuery({
    query: gql`
      query fetchUser {
        user {
          ...UserData
        }
      }
      ${userFragment}
    `
  })

  const userRepo = useRepo(User)
  userRepo.save(data.value.user)
  const user = computed(() => userRepo.find(Number(data.value.user.id)) as User)
</script>

<template>
  <v-row>
    <v-col>
      <user-profile :user="user" />
    </v-col>
    <v-col>
      <user-password-manager :user="user" />
    </v-col>
  </v-row>
</template>
