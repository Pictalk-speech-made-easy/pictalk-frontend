import pkg from './package.json'
export default {
  ssr: false,
  target: 'static',
  server: {
    host: '0.0.0.0', // default: localhost,
  },
  /*
   ** Headers of the page
   */
  publicRuntimeConfig: {
    apiURL: process.env.API_URL || "http://localhost:3001",
    clientVersion: pkg.version,
  },
  generate: {
    fallback: true
  },
  meta: {
    ogTitle: false,
    ogDescription: false,
    charset: "utf-8",
    viewport: "width=device-width, initial-scale=1",
    name: "Pictalk",
    author: "Alexandros & Adrianos SIDIRAS GALANTE",
    theme_color: "#ff5757",

  },
  head: {
    title: 'Pictalk AAC',
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "https://www.pictalk.org/favicon.ico"
    }, {
      rel: 'canonical',
      href: 'https://www.pictalk.org'
    }],
    meta: [
      { hid: 'keywords', name: 'keywords', content: 'AAC,pictograms,speech,text-to-speech,communication,online,translate,sentences,free,open-source' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Pictalk is an app which aims to make speech easier for non-verbal people. Pictalk builds sentences with pictograms you uploaded and pronounces them out loud. You can build virtually any sentence and speak any language !' },
      { hid: 'url', name: 'url', content: 'https://www.pictalk.org' },
      { hid: 'image', name: 'image', content: 'https://www.pictalk.org/icon.png' },
      { hid: 'og-type', property: 'og:type', content: 'website' },
      { hid: 'og-title', property: 'og:title', content: 'Pictalk AAC' },
      { hid: 'og-desc', property: 'og:description', content: 'Pictalk is an app which aims to make speech easier for non-verbal people.' },
      { hid: 'og-url', property: 'og:url', content: 'https://www.pictalk.org' },
      { hid: 'og-image', property: 'og:image', content: 'https://www.pictalk.org/icon.png' },
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#ff5757"
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/styles/main.scss", "@/assets/styles/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/baseURL"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['nuxt-compress'],
  sentry: {
    dsn: "https://6afdc113742e4c309b61a3bd6a64b06b@o1135783.ingest.sentry.io/6187341",
    config: {
      environment: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
      lazy: true
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },
  /*
   ** Nuxt.js modules
   */
  responsiveLoader: {
    adapter: require('responsive-loader/sharp'),
    name: 'img/[name]-[width].[ext]',
    sizes: [240, 320, 640, 768, 960, 1024, 1280, 1600, 1920],
    placeholder: true, // no placeholder will be generated
    quality: 65, // images are compressed with medium quality
    format: 'webp',
  },
  sitemap: {
    hostname: 'https://www.pictalk.org',
    gzip: false,
    exclude: [
      '/changePassword',
      '/account',
      '/resetPassword/**',
      '/_nuxt/**'
    ],
  },
  i18n: {
    baseURL: 'https://www.pictalk.org',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true
    },
    locales: [
      {
        code: 'en',
        iso: 'en-GB',
        name: 'English',
        file: 'en-GB.js'
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr-FR.js'
      },
      {
        code: 'es',
        iso: 'es-ES',
        name: 'Español',
        file: 'es-ES.js'
      },
      {
        code: 'it',
        iso: 'it-IT',
        name: 'Italiano',
        file: 'it-IT.js'
      },
      {
        code: 'de',
        iso: 'de-DE',
        name: 'Deutsch',
        file: 'de-DE.js'
      },
      {
        code: 'ro',
        iso: 'ro-RO',
        name: 'Român',
        file: 'ro-RO.js'
      },
      {
        code: 'pt',
        iso: 'pt-PT',
        name: 'Português',
        file: 'pt-PT.js'
      },
      {
        code: 'el',
        iso: 'el-GR',
        name: 'Eλληνικά',
        file: 'el-EL.js'
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        name: 'اللغة العربية',
        file: 'ar-SA.js'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en',
    },
    vueI18nLoader: true,
  },
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    ["nuxt-buefy", { materialDesignIcons: true, materialDesignIconsHRef: "/materialdesignicons1.min.css", css: false }],
    "@nuxtjs/pwa",
    "nuxt-clipboard2",
    'nuxt-responsive-loader',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/sentry',
    '@nuxtjs/i18n',
    ['nuxt-matomo', { matomoUrl: '//matomo.home.asidiras.dev/', siteId: 1, cookies: false }]
  ],
  robots: {
    Disallow: [
      '/pictalk',
      '/changepassword',
      '/account',
      '/resetPassword/**',
      '/_nuxt/**'
    ],
    Sitemap: 'https://www.pictalk.org/sitemap.xml'
  },
  pwa: {
    icon: {
      src: "https://www.pictalk.org/icon.png",
      sizes: [512],
      type: "image/png",
    },
    workbox: {
      /*
      dev: true,

      config: {
        debug: true
      },*/
      cachingExtensions: '@/plugins/workboxConfig.js',
      importScripts: [
        'background-fetch2.js'
      ],
    },
    manifest: {
      useWebmanifestExtension: 'true',
      name: 'Pictalk',
      short_name: "Pictalk",
      orientation: "any",
      lang: 'en',
      description: 'Pictalk is an app which aims to make speech easier for non-verbal people.',
      theme_color: "#ff5757",
      background_color: "#ffffff",
      display: 'standalone',
      icons: [{
        src: "https://www.pictalk.org/icon.png",
        sizes: "512x512",
        type: "image/png",
      }],
      screenshots: [
        {
          src: "https://www.pictalk.org/screenshots/sentence.webp",
          sizes: "488x1055",
          type: "image/webp"
        },
        {
          src: "https://www.pictalk.org/screenshots/speak.webp",
          sizes: "488x1055",
          type: "image/webp"
        },
        {
          src: "https://www.pictalk.org/screenshots/search.webp",
          sizes: "488x1055",
          type: "image/webp"
        },
        {
          src: "https://www.pictalk.org/screenshots/edition.webp",
          sizes: "488x1055",
          type: "image/webp"
        },
        {
          src: "https://www.pictalk.org/screenshots/tutorial.webp",
          sizes: "488x1055",
          type: "image/webp"
        },
        {
          src: "https://www.pictalk.org/_nuxt/img/whatsapp-320.webp",
          sizes: "320x698",
          type: "image/webp"
        },
      ]
    },
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  },
};
