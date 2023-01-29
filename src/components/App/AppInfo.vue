<script setup>
  import logo from '~/assets/logo.png'

  defineProps({
    modelValue: { type: Boolean, default: false }
  })
</script>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card>
      <q-card-section class="text-center">
        <q-img :src="logo" />
        MyFIFA Manager
      </q-card-section>
      <table>
        <tbody>
          <tr>
            <td>Version:</td>
            <td class="text-info">3.0.0-alpha.7</td>
          </tr>
          <tr>
            <td>Built with:</td>
            <td>
              <span>
                <q-icon name="mdi-vuejs">
                  <q-tooltip>Vue.js</q-tooltip>
                </q-icon>
              </span>
              <span>
                <q-icon name="mdi-vuetify">
                  <q-tooltip>Vuetify</q-tooltip>
                </q-icon>
              </span>
              <span>
                <q-icon name="mdi-language-ruby-on-rails">
                  <q-tooltip>Ruby on Rails</q-tooltip>
                </q-icon>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </q-card>
  </q-dialog>
</template>
