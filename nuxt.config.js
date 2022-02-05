export default {
  ssr: false,
  target: 'static',
  /*
   ** Headers of the page
   */
  publicRuntimeConfig: {
    baseURL: "http://apidev.pictalk.org"
  },
  generate: {
    fallback: true
  },
  head: {
    title: "Pictalk",
    meta: [{
      charset: "utf-8"
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    },
    {
      hid: "description",
      name: "description",
      content: "Pictalk aims to facilitate non-verbal people communications using AAC resources or pictograms"
    }
    ],
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "favicon.ico?v2"
    }]
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
  plugins: ["@/plugins/baseURL", "@/plugins/vuexpersistedstate.client.js", "@/plugins/longPress.js"],
  /*
   ** Nuxt.js dev-modules 
   */
  buildModules: [
    '@nuxt/image'
  ],
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
    seo: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
      alwaysRedirect: true
    },
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en-US.js'
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
    ["nuxt-buefy", { materialDesignIcons: true, materialDesignIconsHRef: "https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css" }],
    "@nuxtjs/pwa",
    "nuxt-clipboard2",
    'nuxt-responsive-loader',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/sentry',
    '@nuxtjs/i18n',
    [
      "nuxt-cookie-control",
      {
        barPosition: "bottom-right",
        colors: {
          barTextColor: "#fff",
          barBackground: "#448cce",
          barButtonColor: "#fff",
          barButtonBackground: "#ff5758",
          barButtonHoverColor: "#fff",
          barButtonHoverBackground: "#e85050",
          modalButtonBackground: "#ff5758",
          modalButtonHoverColor: "#fff",
          controlButtonBackground: "#ff5758",
          controlButtonHoverBackground: "#e85050",
          controlButtonIconHoverColor: "#fff",
          controlButtonIconColor: "#fff",
          modalButtonHoverBackground: "#e85050",
          checkboxActiveBackground: "#e85050",
          checkboxInactiveBackground: "#ede1e1",
          checkboxActiveCircleBackground: "#448cce",
          checkboxInactiveCircleBackground: "#f44336",
          checkboxDisabledBackground: "#ddd",
          checkboxDisabledCircleBackground: "#fff"
        }
      }
    ]
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
  sentry: {
    dsn: "https://6afdc113742e4c309b61a3bd6a64b06b@o1135783.ingest.sentry.io/6187341",
    config: {
      lazy: true
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },
  pwa: {
    workbox: {

      //dev: true,

      // config: {
      //   debug: true
      // },
      cachingExtensions: '@/plugins/workboxConfig.js',
      importScripts: [
        'background-fetch.js'
      ],
      /*
      runtimeCaching: [
        {
          urlPattern: (process.env.BASE_URL || "http://localhost:3001") + '/pictalk/image/.*',
          handler: 'CacheFirst',
          strategyOptions: {
            cacheName: 'pictos'
          }
        },
      ]
      */
    },
    manifest: {
      name: 'Pictalk',
      short_name: 'Pictalk',
      lang: 'en',
      description: 'Pictalk is an app which aims to make speech easier for non-verbal people',
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
  cookies: {
    necessary: [
      {
        name: {
          en: "Default cookies",
        },

        description: {
          en: "Used for cookie control.",
          fr: 'Utilisé pour le contrôle des cookies',
          es: 'Utilizado para contrôlar los cookies'
        },
        cookies: ["cookie_control_consent", "cookie_control_enabled_cookies"]
      },
      {
        name: {
          en: "Authentification cookies",
          fr: "Cookies d'authentification",
          es: 'Cookies de autenticación'
        },
        description: {
          en: "Used to automatically sign you in. With these, you don't neeed to login every minute.",
          es: 'Utilizado para automaticamente connectarte. Sin estos, tendras a cada vez que connectarte.',
          fr: "Utilisés pour ne pas avoir à se reconnecter systématiquement"
        },
        cookies: ["expirationDate", "jwt"]
      }
    ],
    optional: [
      {
        name: 'Google Analitycs',
        //if you don't set identifier, slugified name will be used
        identifier: 'ga',
        //if multilanguage
        description: {
          en: 'Google analytics help us improve the website experience.',
          fr: 'Google analytics aide à améliorer le contenu et les performances de Pictalk.',
          es: 'Google analytics nos ayduda a amejorar el contenido de Pictalk'
        },
        initialState: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-6RGKKTSXND',
        async: true,
        cookies: ['_ga', '_gat', '_gid'],
        accepted: () => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
        },
        declined: () => {
        }
      }
    ]

  },

};
