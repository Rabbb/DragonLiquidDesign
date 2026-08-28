import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlSiteShell from './DlSiteShell.vue'

describe('site layout components', () => {
  it('renders a master-page content slot with host environment and grouped navigation', async () => {
    const wrapper = mount(DlSiteShell, {
      props: {
        environment: { siteName: 'Host site', siteCaption: 'Preview', variables: { username: 'guest' } },
        activePath: '/guide',
        navigationMode: 'hybrid',
        navigation: [{ id: 'docs', label: 'Docs', items: [{ id: 'guide', label: 'Guide', href: '/guide' }] }],
      },
      slots: { default: '<article>Page slot</article>' },
    })
    expect(wrapper.get('[data-slot="site-header"]').text()).toContain('Host site')
    expect(wrapper.get('[data-slot="site-shell-content"]').text()).toContain('Page slot')
    expect(wrapper.get('[data-slot="site-navigation"] a').attributes('aria-current')).toBe('page')
    await wrapper.get('[data-slot="site-navigation"] a').trigger('click')
    expect(wrapper.emitted('navigate')).toHaveLength(1)
  })

  it('keeps custom brand and action slots beside top navigation', () => {
    const wrapper = mount(DlSiteShell, {
      props: {
        navigationMode: 'top',
        navigation: [{ id: 'main', label: 'Main', items: [{ id: 'home', label: 'Home', href: '/' }] }],
      },
      slots: {
        brand: '<strong data-test="custom-brand">Guest Living Lab</strong>',
        actions: '<button data-test="site-action">TodoMoe</button>',
        default: '<article>Page</article>',
      },
    })

    expect(wrapper.get('[data-test="custom-brand"]').text()).toBe('Guest Living Lab')
    expect(wrapper.get('[data-test="site-action"]').text()).toBe('TodoMoe')
    expect(wrapper.get('[data-slot="site-header-navigation"]').text()).toContain('Home')
  })
})
