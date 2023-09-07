import pkg from './package.json'
export default {
  ssr: true,
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
    title: 'Pictalk AAC: Communication pour autisme et plus',
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
      { hid: 'keywords', name: 'keywords', content: 'AAC,autism,pictograms,speech,text-to-speech,communication,online,translate,sentences,free,open-source' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'url', name: 'url', content: 'https://www.pictalk.org' },
      { hid: 'image', name: 'image', content: 'https://www.pictalk.org/icon.png' },
      { hid: 'og-type', property: 'og:type', content: 'website' },
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
  plugins: ["@/plugins/baseURL", { src: '@/plugins/vuex-persistedstate', mode: 'client' }, { src: '@/plugins/matomo', mode: 'client' }],
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
    i18n: true,
    trailingSlash: true,
    i18n: {
      locales: ['en', 'es', 'fr', 'it', 'de', 'ro', 'pt', 'el', 'ar', 'sk'],
      routesNameSeparator: '___'
    },
    exclude: [
      '/changePassword',
      '/account',
      '/resetPassword/**',
      '/_nuxt/**',
      '/administration'
    ],
  },
  i18n: {
    baseURL: 'https://www.pictalk.org',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      redirectOn: 'root',
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
      },
      {
        code: 'sk',
        iso: 'sk-SK',
        name: 'Slovenský',
        file: 'sk-SK.js'
      }
    ],
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    vueI18n: {
      fallbackLocale: 'en',
    },
    vueI18nLoader: true,
  },
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    ["nuxt-buefy", { materialDesignIcons: true, materialDesignIconsHRef: "/materialdesignicons3.min.css", css: false }],
    "@nuxtjs/pwa",
    "nuxt-clipboard2",
    'nuxt-responsive-loader',
    '@nuxtjs/robots',
    '@nuxtjs/sentry',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],
  robots: {
    Disallow: [
      '/pictalk',
      '/changepassword',
      '/account',
      '/resetPassword/**',
      '/_nuxt/**',
      '/administration'
    ],
    Sitemap: 'https://www.pictalk.org/sitemap.xml'
  },
  pwa: {
    icon: {
      src: "https://www.pictalk.org/icon.png",
      sizes: [48, 72, 96, 120, 144, 152, 192, 384, 512],
      type: "image/png",
      purpose: ['maskable'],
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
      name: 'Pictalk AAC: Communication pour autismes et plus',
      short_name: "Pictalk AAC",
      orientation: "any",
      lang: 'en',
      description: 'Parlez avec a des pictogrames, pour les personnes autistes et autres handicaps',
      theme_color: "#ff5757",
      background_color: "#ffffff",
      display: 'standalone',
      icons: [{
        src: "https://www.pictalk.org/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
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
    extend(config, ctx) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
      config.resolve.symlinks = false;
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    },
    transpile: ['merge-images-horizontally-with-text'],
  },
};
