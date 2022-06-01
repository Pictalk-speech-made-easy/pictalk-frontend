export default {
  ssr: false,
  target: 'static',
  /*
   ** Headers of the page
   */
  publicRuntimeConfig: {
    apiURL: process.env.API_URL || "http://localhost:3001"
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
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "favicon.ico?v2"
    }, {
      rel: 'canonical',
      href: 'https://www.pictalk.org'
    }],
    meta: [
      { hid: 'keywords', name: 'keywords', content: 'AAC,pictograms,speech,text-to-speech,communication,online,translate,sentences,free,open-source' },
      { hid: 'og:title', name: 'og:title', content: 'Pictalk AAC' },
      { hid: 'og:description', name: 'og:description', content: 'Pictalk is an app which aims to make speech easier for non-verbal people. Pictalk builds sentences with pictograms you uploaded and pronounces them out loud. You can build virtually any sentence and speak any language !' },
      { hid: 'og:url', name: 'og:url', content: 'https://www.pictalk.org' },
      { hid: 'og:image', name: 'og:image', content: 'https://www.pictalk.org/_nuxt/img/logo_compressed-240.webp' },
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
  css: ["~assets/styles/main.scss", "~assets/styles/main.css"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/baseURL", "@/plugins/longPress.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['nuxt-compress'],
  /* sentry: {
    dsn: "https://6afdc113742e4c309b61a3bd6a64b06b@o1135783.ingest.sentry.io/6187341",
    config: {
      lazy: true
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  }, */
  /*
   ** Nuxt.js modules
   */
  responsiveLoader: {
    adapter: require('responsive-loader/sharp'),
    name: 'img/[name]-[width].[ext]',
    sizes: [240, 320, 640, 768, 960, 1024, 1280, 1600, 1920],
    placeholder: false, // no placeholder will be generated
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
    ["nuxt-buefy", { materialDesignIcons: true, materialDesignIconsHRef: "/materialdesignicons.min.css" }],
    "@nuxtjs/pwa",
    "nuxt-clipboard2",
    'nuxt-responsive-loader',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-helmet',
    //'@nuxtjs/sentry',
    '@nuxtjs/i18n',
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
    workbox: {
      /*
      dev: true,

      config: {
        debug: true
      },*/
      cachingExtensions: '@/plugins/workboxConfig.js',
      importScripts: [
        'background-fetch.js'
      ],
    },
    manifest: {
      name: 'Pictalk',
      short_name: 'Pictalk',
      lang: 'en',
      description: 'Pictalk is an app which aims to make speech easier for non-verbal people. Pictalk builds sentences with pictograms you uploaded and pronounces them out loud. You can build virtually any sentence and speak any language ! ',
      theme_color: '#ff5758',
      display: 'standalone',
      useWebmanifestExtension: 'true'
    },
  },
  /*
   ** Build configuration
   */
  build: {
    minimize: true,
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  },
};
