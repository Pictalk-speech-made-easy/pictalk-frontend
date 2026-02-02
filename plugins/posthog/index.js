import posthog from 'posthog-js'
import Vue from 'vue'

export default function ({ app: { router } }, inject) {
  posthog.init('phc_Gkr5wH64rthp5PtyF2ZvO3OCmwmV7hFrjTfI4rQfeVa', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2025-11-30',
    capture_pageview: false,
    autocapture: false,
    capture_performance: false
  })

  inject('posthog', posthog)

  router.afterEach(to => {
    Vue.nextTick(() => {
      posthog.capture('$pageview', {
        $current_url: to.fullPath
      })
    })
  })
}