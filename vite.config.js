import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4000
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    Pages(),
    Layouts(),
    AutoImport({
      dirs: [
        './src/composables',
        './src/constants',
        './src/filters',
        './src/fragments',
        './src/rules'
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          '@urql/vue': [
            'useQuery',
            'useMutation',
            'gql'
          ],
          'pinia-orm': [
            'useRepo'
          ],
          'lodash.keyby': [
            ['default', 'keyBy']
          ],
          'lodash.orderby': [
            ['default', 'orderBy']
          ],
          'date-fns': [
            'format',
            'parseISO'
          ],
          'uuid': [
            ['v4', 'uuidv4']
          ],
          'vuetify': [
            'useDisplay',
            'useTheme'
          ]
        }
      ],
      vueTemplate: true
    }),
    Components({
      resolvers: [
        Vuetify3Resolver()
      ]
    })
  ]
})
