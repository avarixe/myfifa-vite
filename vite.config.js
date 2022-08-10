import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vuetify from 'vite-plugin-vuetify'
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
          'date-fns': [
            'format',
            'parseISO'
          ]
        }
      ]
    }),
    Components({}),
    vuetify()
  ]
})
