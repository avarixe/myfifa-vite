import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import ConfirmDialog from '../../src/components/Base/ConfirmDialog.vue'

test('mount component', async () => {
  expect(ConfirmDialog).toBeTruthy()

  const vuetify = createVuetify()

  const wrapper = mount(ConfirmDialog, {
    props: {
      confirmText: 'Confirm Test?',
      confirmColor: 'error'
    },
    global: {
      plugins: [vuetify]
    }
  })

  // expect(wrapper.text()).toContain('Confirm Test?')
})
