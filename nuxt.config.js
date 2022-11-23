import AutoImport from 'unplugin-auto-import/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'
        }
      ]
    }
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore']
    }],
    '@pinia-orm/nuxt'
  ],
  vite: {
    plugins: [
      AutoImport({
        dirs: [
          './constants',
          './fragments',
          './store'
        ],
        imports: [{
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
          'uuid': [
            ['v4', 'uuidv4']
          ],
          'vuetify': [
            'useDisplay',
            'useTheme'
          ]
        }],
        vueTemplate: true
      })
    ]
  }
})
