import Vue from 'vue'
import VueMatomo from 'vue-matomo'

export default ({ app }) => {
  Vue.use(VueMatomo, {
    router: app.router,
    host: 'https://analytics.picmind.org//',
    siteId: 1,
    trackInitialView: true,
    requireConsent: false,
    requireCookieConsent: false,
    debug: false
  })
}