export default {
  ssr: false,
  /*
   ** Headers of the page
   */
  publicRuntimeConfig: {
    baseURL: process.env.BASE_URL || "http://localhost:3001"
  },
  head: {
    title: process.env.npm_package_name || "",
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
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico"
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
  css: ["~assets/styles/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/baseURL"],
  /*
   ** Nuxt.js dev-modules 
   */
  buildModules: ["@nuxtjs/fontawesome"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    "nuxt-buefy",
    "@nuxtjs/pwa"
  ],
  pwa: {
    manifest: {
      name: 'Pictalk',
      lang: 'en',
      short_name: 'Pictalk',
      description: 'Pictalk is an app which aims to make speech easier for non-verbal people',
      theme_color: '#ff5758',
    }
  },
  /*
   ** Build configuration
   */
  build: {
    analyze: true,
    extend(config) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  }
};
