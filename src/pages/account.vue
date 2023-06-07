<script setup lang="ts">
  import { User } from '~/models'

  const userRepo = useRepo(User)
  const userId = ref(null)
  const { ready } = usePageQuery({
    query: gql`
      query fetchUser {
        user {
          ...UserData
        }
      }
      ${userFragment}
    `,
    onQuery(data) {
      userRepo.save(data.user)
      userId.value = parseInt(data.user.id)
    }
  })

  const user = computed(() => userRepo.find(userId.value))
</script>

<template>
  <v-row v-if="ready">
    <v-col>
      <user-profile :user="user" />
    </v-col>
    <v-col>
      <user-password-manager :user="user" />
    </v-col>
  </v-row>
</template>
