import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import vuetify from 'vite-plugin-vuetify'
import eslint from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const file = fileURLToPath(new URL('package.json', import.meta.url))
const json = readFileSync(file, 'utf8')
const pkg = JSON.parse(json)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4000
  },
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    VueRouter({
      // options
    }),
    Vue(),
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
        VueRouterAutoImports,
        '@vueuse/core',
        '@vueuse/head',
        'pinia',
        {
          '@urql/vue': ['useQuery', 'useMutation', 'gql'],
          'pinia-orm': ['useRepo'],
          'lodash.get': [['default', '_get']],
          'lodash.groupby': [['default', '_groupBy']],
          'lodash.keyby': [['default', '_keyBy']],
          'lodash.omit': [['default', '_omit']],
          'lodash.orderby': [['default', '_orderBy']],
          'lodash.pick': [['default', '_pick']],
          'date-fns': ['format', 'parseISO'],
          vuetify: ['useDisplay'],
          axios: [['default', 'axios']]
        },
        {
          from: './src/types',
          imports: [
            'TableHeader',
            'CapAttributes',
            'StageAttributes',
            'MatchFilters'
          ],
          type: true
        }
      ],
      dts: true,
      vueTemplate: true
    }),
    Components(),
    vuetify(),
    eslint(),
    visualizer()
  ],
  optimizeDeps: {
    exclude: ['vuetify', 'vue-currency-input'],
    include: [
      'lodash.get',
      'lodash.groupby',
      'lodash.keyby',
      'lodash.omit',
      'lodash.orderby',
      'lodash.pick',
      'cal-heatmap'
    ]
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_TITLE__: JSON.stringify(pkg.title)
  }
})
