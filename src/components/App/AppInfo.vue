<script setup>
  import logo from '~/assets/logo.png'
</script>

<template>
  <v-dialog
    activator="parent"
    max-width="300px"
  >
    <v-card>
      <v-card-title class="text-center">
        <v-img :src="logo" height="64px" />
        MyFIFA Manager
      </v-card-title>
      <v-table>
        <tbody>
          <tr>
            <td>Version:</td>
            <td class="text-info">3.0.0-alpha.2</td>
          </tr>
          <tr>
            <td>Built with:</td>
            <td>
              <span>
                <v-icon>mdi-vuejs</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  Vue.js
                </v-tooltip>
              </span>
              <span>
                <v-icon>mdi-vuetify</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  Vuetify
                </v-tooltip>
              </span>
              <span>
                <v-icon>mdi-language-ruby-on-rails</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  Ruby on Rails
                </v-tooltip>
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-dialog>
</template>
