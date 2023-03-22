<script setup>
  const libs = [
    { icon: 'mdi-vuejs', name: 'Vue.js' },
    { icon: 'mdi-vuetify', name: 'Vuetify' },
    { icon: 'mdi-language-ruby-on-rails', name: 'Ruby on Rails' }
  ]

  const repos = [
    { name: 'Web App', url: 'myfifa-vite' },
    { name: 'API', url: 'myfifa-api' }
  ]
</script>

<template>
  <v-dialog activator="parent" max-width="400px">
    <v-card>
      <v-card-title class="text-center">
        <app-entry-header />
      </v-card-title>
      <v-table>
        <tbody>
          <tr>
            <td>Built With:</td>
            <td>
              <span v-for="lib in libs" :key="lib.name">
                <v-icon>{{ lib.icon }}</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  {{ lib.name }}
                </v-tooltip>
              </span>
            </td>
          </tr>
          <tr v-for="repo in repos" :key="repo.name">
            <td>{{ repo.name }}:</td>
            <td>
              <v-btn
                :href="`https://github.com/avarixe/${repo.url}`"
                target="_blank"
                rel="noopener"
                variant="flat"
                size="small"
              >
                <v-icon start>mdi-github</v-icon>
                View on GitHub
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-dialog>
</template>
