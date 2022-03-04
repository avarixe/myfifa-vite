import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      template: { transformAssetUrls }
    }),
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
            'useMutation'
          ],
          'graphql-tag': [
            ['default', 'gql']
          ],
          'pinia-orm': [
            'useRepo'
          ],
          'lodash.keyby': [
            ['default', 'keyBy']
          ]
        }
      ]
    }),
    Components({}),
    quasar()
  ]
})
