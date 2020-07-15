
import { mount } from '@vue/test-utils'
import Button from '../../packages/button/index'

describe('Button', () => {
  test('Button/slots', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '按钮'
      }
    })
    expect(wrapper.text()).toContain('按钮')
    expect(wrapper.html()).toBe('<button class="btn-default">按钮</button>')
  })
})
