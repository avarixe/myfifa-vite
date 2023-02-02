import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
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
    AutoImport({
      dirs: [
        './src/composables',
        './src/constants',
        './src/fragments',
        './src/helpers',
        './src/store'
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
          'lodash.groupby': [
            ['default', 'groupBy']
          ],
          'lodash.orderby': [
            ['default', 'orderBy']
          ],
          'lodash.pick': [
            ['default', 'pick']
          ],
          'date-fns': [
            'format',
            'parseISO'
          ],
          'vuetify': [
            'useDisplay',
            'useTheme'
          ],
          'axios': [
            ['default', 'axios']
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
